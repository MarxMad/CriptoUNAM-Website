import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faUsers, 
  faGraduationCap, 
  faTrophy,
  faArrowRight,
  faPlay,
  faCode,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

interface InteractiveCTAProps {
  title: string;
  description: string;
}

const InteractiveCTA: React.FC<InteractiveCTAProps> = ({ title, description }) => {
  const [currentStat, setCurrentStat] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const stats = [
    { icon: faUsers, value: '500+', label: 'Miembros Activos', color: '#34D399' },
    { icon: faGraduationCap, value: '50+', label: 'Cursos Completados', color: '#3B82F6' },
    { icon: faTrophy, value: '15+', label: 'Premios Ganados', color: '#F59E0B' },
    { icon: faCode, value: '30+', label: 'Proyectos Desarrollados', color: '#8B5CF6' }
  ];

  // Rotar estadísticas cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStat((prev) => (prev + 1) % stats.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.length]);

  const handleJoinClick = () => {
    // Scroll suave a la sección de registro
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto 3rem auto',
      padding: '0 20px',
      position: 'relative'
    }}>
      {/* Fondo animado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(37, 99, 235, 0.1))',
        borderRadius: '24px',
        overflow: 'hidden'
      }}>
        {/* Partículas animadas */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#D4AF37',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        background: 'rgba(26, 26, 26, 0.9)',
        borderRadius: '24px',
        padding: '4rem 2rem',
        textAlign: 'center',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Título principal */}
        <h2 style={{
          fontFamily: 'Orbitron',
          color: '#D4AF37',
          fontSize: '3rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {title}
        </h2>

        {/* Descripción */}
        <p style={{
          color: '#E0E0E0',
          fontSize: '1.3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem auto',
          lineHeight: '1.6'
        }}>
          {description}
        </p>

        {/* Estadística destacada animada */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'rgba(26, 26, 26, 0.8)',
            borderRadius: '20px',
            padding: '2rem 3rem',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            transition: 'all 0.5s ease',
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${stats[currentStat].color}, ${stats[currentStat].color}40)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white'
            }}>
              <FontAwesomeIcon icon={stats[currentStat].icon} />
            </div>
            <div>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: stats[currentStat].color,
                fontFamily: 'Orbitron',
                marginBottom: '0.5rem',
                transition: 'all 0.5s ease'
              }}>
                {stats[currentStat].value}
              </div>
              <div style={{
                fontSize: '1.2rem',
                color: '#D4AF37',
                fontWeight: '600'
              }}>
                {stats[currentStat].label}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <button
            onClick={handleJoinClick}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              color: '#000',
              border: 'none',
              borderRadius: '25px',
              padding: '16px 32px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.3)';
            }}
          >
            <FontAwesomeIcon icon={faRocket} />
            Únete Ahora
            <FontAwesomeIcon icon={faArrowRight} />
          </button>

          <button
            onClick={() => window.open('/cursos', '_self')}
            style={{
              background: 'rgba(37, 99, 235, 0.8)',
              color: 'white',
              border: '1px solid #2563EB',
              borderRadius: '25px',
              padding: '16px 32px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(37, 99, 235, 1)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            Ver Cursos
          </button>
        </div>

        {/* Indicadores de progreso */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '2rem'
        }}>
          {stats.map((_, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: index === currentStat ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentStat(index)}
            />
          ))}
        </div>

        {/* Texto motivacional */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <p style={{
            color: '#E0E0E0',
            fontSize: '1.1rem',
            margin: '0',
            fontStyle: 'italic'
          }}>
            "El futuro de la tecnología blockchain está en las manos de la próxima generación. 
            Únete a CriptoUNAM y sé parte de la revolución digital."
          </p>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </section>
  );
};

export default InteractiveCTA;
