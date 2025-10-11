/**
 * Script de diagnóstico para verificar conexiones y configuración
 */

import { supabase } from '../config/supabase'
import { ENV_CONFIG } from '../config/env'

export const runDiagnostics = async () => {
  console.group('🔍 DIAGNÓSTICO DE CRIPTOUNAM')
  
  // 1. Verificar configuración de Supabase
  console.group('📊 1. Configuración de Supabase')
  console.log('URL:', ENV_CONFIG.SUPABASE_URL ? '✅ Configurada' : '❌ No configurada')
  console.log('ANON KEY:', ENV_CONFIG.SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada')
  console.log('Cliente Supabase:', supabase ? '✅ Inicializado' : '❌ No inicializado')
  console.groupEnd()
  
  // 2. Verificar conexión a Supabase
  if (supabase) {
    console.group('🔌 2. Conexión a Base de Datos')
    try {
      const { data, error } = await supabase.from('newsletters').select('count')
      if (error) {
        console.error('❌ Error al conectar:', error.message)
      } else {
        console.log('✅ Conexión exitosa')
        console.log('Newsletters en BD:', data)
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err)
    }
    console.groupEnd()
    
    // 3. Verificar tablas
    console.group('📋 3. Tablas en Base de Datos')
    const tables = ['newsletters', 'likes', 'email_subscriptions', 'puma_users', 'cursos', 'eventos']
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          console.log(`❌ ${table}:`, error.message)
        } else {
          console.log(`✅ ${table}: ${count} registros`)
        }
      } catch (err) {
        console.log(`❌ ${table}: Error al verificar`)
      }
    }
    console.groupEnd()
    
    // 4. Verificar newsletters específicamente
    console.group('📰 4. Newsletters Disponibles')
    try {
      const { data: newsletters, error } = await supabase
        .from('newsletters')
        .select('id, titulo, autor, created_at')
        .limit(5)
      
      if (error) {
        console.error('❌ Error:', error.message)
      } else if (newsletters && newsletters.length > 0) {
        console.log('✅ Newsletters encontradas:')
        newsletters.forEach(n => {
          console.log(`  - "${n.titulo}" por ${n.autor}`)
        })
      } else {
        console.log('⚠️ No hay newsletters en la base de datos')
      }
    } catch (err) {
      console.error('❌ Error:', err)
    }
    console.groupEnd()
  }
  
  // 5. Verificar configuración de PUMA
  console.group('💰 5. Configuración de PUMA Token')
  console.log('Chain ID:', ENV_CONFIG.CHAIN_ID || '❌ No configurado')
  console.log('RPC URL:', ENV_CONFIG.RPC_URL || '❌ No configurado')
  console.log('Contract Address:', ENV_CONFIG.PUMA_TOKEN_ADDRESS || '❌ No configurado')
  console.groupEnd()
  
  // 6. Verificar configuración de Resend
  console.group('📧 6. Configuración de Email (Resend)')
  console.log('API Key:', ENV_CONFIG.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada')
  console.log('From Email:', ENV_CONFIG.RESEND_FROM_EMAIL)
  console.groupEnd()
  
  console.groupEnd()
  
  return {
    supabaseConfigured: !!ENV_CONFIG.SUPABASE_URL && !!ENV_CONFIG.SUPABASE_ANON_KEY,
    supabaseConnected: !!supabase,
    pumaConfigured: !!ENV_CONFIG.PUMA_TOKEN_ADDRESS,
    resendConfigured: !!ENV_CONFIG.RESEND_API_KEY
  }
}

// Función para ejecutar en consola del navegador
if (typeof window !== 'undefined') {
  (window as any).runDiagnostics = runDiagnostics
  console.log('💡 Ejecuta runDiagnostics() en la consola para ver el diagnóstico completo')
}

