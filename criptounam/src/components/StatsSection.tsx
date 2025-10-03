import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faGraduationCap, 
  faTrophy, 
  faCode,
  faCalendarAlt,
  faGlobe,
  faRocket,
  faStar
} from '@fortawesome/free-solid-svg-icons';

interface StatItem {
  icon: any;
  value: string;
  label: string;
  description?: string;
  color: string;
}

interface StatsSectionProps {
  title: string;
  description?: string;
  stats: StatItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ title, description, stats }) => {
  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto 3rem auto',
      padding: '0 20px'
    }}>
      {/* Título y descripción */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'Orbitron',
          color: '#D4AF37',
          fontSize: '2.5rem',
          marginBottom: '1rem'
        }}>
          {title}
        </h2>
        {description && (
          <p style={{
            color: '#E0E0E0',
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Grid de estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '16px',
              padding: '32px 24px',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Icono */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${stat.color}, ${stat.color}40)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '2rem',
              color: 'white'
            }}>
              <FontAwesomeIcon icon={stat.icon} />
            </div>

            {/* Valor */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: stat.color,
              marginBottom: '8px',
              fontFamily: 'Orbitron'
            }}>
              {stat.value}
            </div>

            {/* Etiqueta */}
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#D4AF37',
              margin: '0 0 8px 0',
              fontFamily: 'Orbitron'
            }}>
              {stat.label}
            </h3>

            {/* Descripción */}
            {stat.description && (
              <p style={{
                color: '#E0E0E0',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                margin: '0'
              }}>
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
