// Configuración de dominio de correo con Resend
import { Resend } from 'resend'
import { ENV_CONFIG } from './env'

const resend = new Resend(ENV_CONFIG.RESEND_API_KEY)

export interface EmailDomainConfig {
  domain: string
  dkimRecords: {
    name: string
    value: string
    type: string
  }[]
  spfRecord: {
    name: string
    value: string
    type: string
  }
  dmarcRecord: {
    name: string
    value: string
    type: string
  }
  mxRecords: {
    name: string
    value: string
    priority: number
    type: string
  }[]
}

export class EmailDomainManager {
  // Configurar dominio personalizado
  static async setupCustomDomain(domain: string): Promise<EmailDomainConfig | null> {
    try {
      console.log(`Configurando dominio personalizado: ${domain}`)
      
      // 1. Agregar dominio a Resend
      const { data: domainData, error: domainError } = await resend.domains.create({
        name: domain
      })

      if (domainError) {
        console.error('Error agregando dominio:', domainError)
        return null
      }

      console.log('✅ Dominio agregado a Resend:', domainData)

      // 2. Obtener registros DNS necesarios
      const dnsRecords = await this.getDNSRecords(domain)
      
      return {
        domain,
        dkimRecords: dnsRecords.dkim,
        spfRecord: dnsRecords.spf,
        dmarcRecord: dnsRecords.dmarc,
        mxRecords: dnsRecords.mx
      }
    } catch (error) {
      console.error('Error configurando dominio:', error)
      return null
    }
  }

  // Obtener registros DNS necesarios
  static async getDNSRecords(domain: string): Promise<any> {
    try {
      const { data: records, error } = await resend.domains.get(domain)
      
      if (error) {
        console.error('Error obteniendo registros DNS:', error)
        return null
      }

      return {
        dkim: [
          {
            name: `resend._domainkey.${domain}`,
            value: records.records?.find((r: any) => r.type === 'TXT' && r.name.includes('dkim'))?.value || '',
            type: 'TXT'
          }
        ],
        spf: {
          name: domain,
          value: 'v=spf1 include:resend.com ~all',
          type: 'TXT'
        },
        dmarc: {
          name: `_dmarc.${domain}`,
          value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@resend.com',
          type: 'TXT'
        },
        mx: [
          {
            name: domain,
            value: 'feedback-smtp.us-east-1.amazonses.com',
            priority: 10,
            type: 'MX'
          }
        ]
      }
    } catch (error) {
      console.error('Error obteniendo registros DNS:', error)
      return null
    }
  }

  // Verificar configuración del dominio
  static async verifyDomain(domain: string): Promise<boolean> {
    try {
      const { data, error } = await resend.domains.get(domain)
      
      if (error) {
        console.error('Error verificando dominio:', error)
        return false
      }

      return data.status === 'verified'
    } catch (error) {
      console.error('Error verificando dominio:', error)
      return false
    }
  }

  // Obtener estado del dominio
  static async getDomainStatus(domain: string): Promise<any> {
    try {
      const { data, error } = await resend.domains.get(domain)
      
      if (error) {
        console.error('Error obteniendo estado del dominio:', error)
        return null
      }

      return {
        domain: data.name,
        status: data.status,
        createdAt: data.created_at,
        region: data.region,
        records: data.records
      }
    } catch (error) {
      console.error('Error obteniendo estado del dominio:', error)
      return null
    }
  }

  // Listar dominios configurados
  static async listDomains(): Promise<any[]> {
    try {
      const { data, error } = await resend.domains.list()
      
      if (error) {
        console.error('Error listando dominios:', error)
        return []
      }

      return data.data || []
    } catch (error) {
      console.error('Error listando dominios:', error)
      return []
    }
  }

  // Eliminar dominio
  static async removeDomain(domain: string): Promise<boolean> {
    try {
      const { error } = await resend.domains.remove(domain)
      
      if (error) {
        console.error('Error eliminando dominio:', error)
        return false
      }

      console.log(`✅ Dominio ${domain} eliminado correctamente`)
      return true
    } catch (error) {
      console.error('Error eliminando dominio:', error)
      return false
    }
  }
}

// Configuración por defecto para CriptoUNAM
export const DEFAULT_EMAIL_CONFIG = {
  domain: 'criptounam.com',
  fromEmail: 'noreply@criptounam.com',
  supportEmail: 'support@criptounam.com',
  adminEmail: 'admin@criptounam.com',
  templates: {
    welcome: 'welcome-template',
    newsletter: 'newsletter-template',
    notification: 'notification-template',
    reward: 'reward-template'
  }
}

// Instrucciones para configurar DNS
export const DNS_SETUP_INSTRUCTIONS = {
  title: 'Configuración de DNS para CriptoUNAM',
  steps: [
    {
      step: 1,
      title: 'Configurar registros DKIM',
      description: 'Agregar el registro TXT para DKIM en tu proveedor DNS',
      example: 'resend._domainkey.criptounam.com TXT "v=DKIM1; k=rsa; p=..."'
    },
    {
      step: 2,
      title: 'Configurar registro SPF',
      description: 'Agregar el registro TXT para SPF',
      example: 'criptounam.com TXT "v=spf1 include:resend.com ~all"'
    },
    {
      step: 3,
      title: 'Configurar registro DMARC',
      description: 'Agregar el registro TXT para DMARC',
      example: '_dmarc.criptounam.com TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@resend.com"'
    },
    {
      step: 4,
      title: 'Configurar registros MX',
      description: 'Agregar el registro MX para el servidor de correo',
      example: 'criptounam.com MX 10 feedback-smtp.us-east-1.amazonses.com'
    }
  ],
  verification: {
    title: 'Verificación',
    description: 'Después de configurar los registros DNS, espera 24-48 horas para la propagación y verifica el dominio en Resend.',
    checkCommand: 'nslookup -type=TXT resend._domainkey.criptounam.com'
  }
}

export default EmailDomainManager
