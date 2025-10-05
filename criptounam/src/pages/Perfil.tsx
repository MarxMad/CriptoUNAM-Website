import React, { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faCoins } from '@fortawesome/free-solid-svg-icons'
import { formatEther } from 'viem'
import ProfilePicture from '../components/ProfilePicture'
import ProfileNavigation from '../components/ProfileNavigation'
import ProfileCursos from '../components/ProfileCursos'
import ProfileCertificaciones from '../components/ProfileCertificaciones'
import ProfileDashboard from '../components/ProfileDashboard'
import ProfileConfiguracion from '../components/ProfileConfiguracion'
import '../styles/global.css'

// Datos de ejemplo para el perfil
const mockCursos = [
  {
    id: '1',
    titulo: 'Blockchain Fundamentals',
    descripcion: 'Aprende los conceptos básicos de blockchain y criptomonedas',
    progreso: 75,
    duracion: '8 horas',
    nivel: 'Principiante',
    imagen: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
    completado: false,
    fechaInicio: '2024-01-15'
  },
  {
    id: '2',
    titulo: 'Smart Contracts Development',
    descripcion: 'Desarrollo de contratos inteligentes con Solidity',
    progreso: 100,
    duracion: '12 horas',
    nivel: 'Intermedio',
    imagen: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
    completado: true,
    fechaInicio: '2024-01-01',
    fechaFin: '2024-01-20'
  }
]

const mockCertificaciones = [
  {
    id: '1',
    titulo: 'Certificado Blockchain Developer',
    descripcion: 'Certificación oficial en desarrollo blockchain',
    curso: 'Smart Contracts Development',
    fechaObtencion: '2024-01-20',
    imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    url: '#',
    valido: true,
    nivel: 'Intermedio'
  }
]

const mockDashboardStats = {
  cursosCompletados: 1,
  certificacionesObtenidas: 1,
  horasEstudiadas: 20,
  diasActivos: 15,
  nivelActual: 'Principiante',
  proximoNivel: 'Intermedio',
  progresoNivel: 65,
  rachaActual: 5,
  mejorRacha: 10,
  puntosTotales: 1250,
  ranking: 42,
  totalUsuarios: 1000
}

const mockLogros = [
  {
    id: '1',
    titulo: 'Primer Curso Completado',
    descripcion: 'Completa tu primer curso',
    icono: 'faTrophy',
    obtenido: true,
    fecha: '2024-01-20',
    puntos: 100
  },
  {
    id: '2',
    titulo: 'Estudiante Dedicado',
    descripcion: 'Estudia 5 días consecutivos',
    icono: 'faFire',
    obtenido: false,
    puntos: 200
  }
]

const mockActividadReciente = [
  {
    descripcion: 'Completaste el curso "Smart Contracts Development"',
    fecha: 'Hace 2 días'
  },
  {
    descripcion: 'Obtuviste el certificado "Blockchain Developer"',
    fecha: 'Hace 3 días'
  },
  {
    descripcion: 'Iniciaste el curso "Blockchain Fundamentals"',
    fecha: 'Hace 1 semana'
  }
]

const Perfil = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  
  const [activeTab, setActiveTab] = useState('cursos')
  const [userData, setUserData] = useState({
    nombre: 'Usuario CriptoUNAM',
    email: 'usuario@criptounam.xyz',
    telefono: '+52 55 1234 5678',
    bio: 'Estudiante apasionado por la tecnología blockchain y las criptomonedas.',
    avatar: ''
  })

  const handleImageChange = (file: File) => {
    console.log('Nueva imagen de perfil:', file)
    // Aquí integrarías con Supabase para subir la imagen
  }

  const handleUpdateUser = (data: any) => {
    setUserData(data)
    console.log('Datos de usuario actualizados:', data)
    // Aquí integrarías con Supabase para actualizar los datos
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'cursos':
        return <ProfileCursos cursos={mockCursos} />
      case 'certificaciones':
        return <ProfileCertificaciones certificaciones={mockCertificaciones} />
      case 'dashboard':
        return (
          <ProfileDashboard 
            stats={mockDashboardStats}
            logros={mockLogros}
            actividadReciente={mockActividadReciente}
          />
        )
      case 'configuracion':
    return (
          <ProfileConfiguracion 
            userData={userData}
            onUpdateUser={handleUpdateUser}
          />
        )
      default:
        return <ProfileCursos cursos={mockCursos} />
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faWallet} className="text-6xl text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Conecta tu Wallet</h2>
          <p className="text-gray-400">Necesitas conectar tu wallet para acceder a tu perfil</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)',
      padding: '32px 16px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header del Perfil */}
        <div style={{
          backgroundColor: '#1F2937',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #374151'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            {/* Foto de Perfil */}
            <ProfilePicture
              currentImage={userData.avatar}
              onImageChange={handleImageChange}
              size="xl"
            />
            
            {/* Información del Usuario */}
            <div style={{
              textAlign: 'center',
              maxWidth: '600px'
            }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
                margin: '0 0 8px 0'
              }}>{userData.nombre}</h1>
              <p style={{
                color: '#9CA3AF',
                margin: '0 0 16px 0'
              }}>{userData.email}</p>
              <p style={{
                color: '#D1D5DB',
                margin: '0 0 24px 0',
                lineHeight: '1.5'
              }}>{userData.bio}</p>
              
              {/* Información de Wallet */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#374151',
                  padding: '8px 16px',
                  borderRadius: '8px'
                }}>
                  <FontAwesomeIcon icon={faWallet} style={{ color: '#D4AF37' }} />
                  <span style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
          </div>
          
                {balance && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#374151',
                    padding: '8px 16px',
                    borderRadius: '8px'
                  }}>
                    <FontAwesomeIcon icon={faCoins} style={{ color: '#D4AF37' }} />
                    <span style={{
                      color: '#fff',
                      fontSize: '14px'
                    }}>
                      {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
                    </span>
            </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navegación y Contenido */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {/* Navegación Lateral */}
          <div>
            <ProfileNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
      </div>

          {/* Contenido Principal */}
          <div style={{
            gridColumn: 'span 2'
          }}>
            {renderActiveTab()}
          </div>
      </div>
      </div>
    </div>
  )
}

export default Perfil 