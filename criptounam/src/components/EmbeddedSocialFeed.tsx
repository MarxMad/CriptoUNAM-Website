import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt, faRefresh } from '@fortawesome/free-solid-svg-icons';

// Declaraciones de tipo para scripts externos
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

interface EmbeddedSocialFeedProps {
  title: string;
  description?: string;
}

const EmbeddedSocialFeed: React.FC<EmbeddedSocialFeedProps> = ({ title, description }) => {
  const [activeTab, setActiveTab] = useState<'instagram' | 'twitter'>('instagram');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar scripts de Instagram y Twitter
  useEffect(() => {
    const loadScripts = () => {
      // Cargar Instagram embed script
      if (!window.instgrm) {
        const instagramScript = document.createElement('script');
        instagramScript.src = 'https://www.instagram.com/embed.js';
        instagramScript.async = true;
        instagramScript.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        };
        document.head.appendChild(instagramScript);
      }

      // Cargar Twitter widget script
      if (!window.twttr) {
        const twitterScript = document.createElement('script');
        twitterScript.src = 'https://platform.twitter.com/widgets.js';
        twitterScript.async = true;
        twitterScript.onload = () => {
          if (window.twttr) {
            window.twttr.widgets.load();
          }
        };
        document.head.appendChild(twitterScript);
      }

      setIsLoading(false);
    };

    loadScripts();
  }, []);

  // Recargar widgets cuando cambie la pestaña
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (activeTab === 'instagram' && window.instgrm) {
          window.instgrm.Embeds.process();
        } else if (activeTab === 'twitter' && window.twttr) {
          window.twttr.widgets.load();
        }
      }, 100);
    }
  }, [activeTab, isLoading]);

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

      {/* Tabs de filtro */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'instagram', label: 'Instagram', icon: faInstagram, username: '@cripto_unam' },
          { key: 'twitter', label: 'Twitter', icon: faTwitter, username: '@Cripto_UNAM' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background: activeTab === tab.key ? '#D4AF37' : 'rgba(26, 26, 26, 0.8)',
              color: activeTab === tab.key ? '#000' : '#E0E0E0',
              border: `1px solid ${activeTab === tab.key ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}`,
              borderRadius: '25px',
              padding: '12px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              }
            }}
          >
            <FontAwesomeIcon icon={tab.icon} />
            {tab.label}
          </button>
        ))}
        
        {/* Botón de refresh */}
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              if (activeTab === 'instagram' && window.instgrm) {
                window.instgrm.Embeds.process();
              } else if (activeTab === 'twitter' && window.twttr) {
                window.twttr.widgets.load();
              }
              setIsLoading(false);
            }, 500);
          }}
          style={{
            background: 'rgba(37, 99, 235, 0.8)',
            color: 'white',
            border: '1px solid #2563EB',
            borderRadius: '25px',
            padding: '12px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          <FontAwesomeIcon 
            icon={faRefresh} 
            style={{
              animation: isLoading ? 'spin 1s linear infinite' : 'none'
            }}
          />
          Actualizar
        </button>
      </div>

      {/* Contenido de redes sociales */}
      <div style={{
        background: 'rgba(26, 26, 26, 0.8)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        backdropFilter: 'blur(10px)',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(212, 175, 55, 0.3)',
              borderTop: '3px solid #D4AF37',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span style={{
              color: '#E0E0E0',
              fontSize: '1.1rem'
            }}>
              Cargando contenido de {activeTab === 'instagram' ? '@cripto_unam' : '@Cripto_UNAM'}...
            </span>
          </div>
        ) : (
          <>
            {activeTab === 'instagram' ? (
              <div style={{ width: '100%', maxWidth: '600px' }}>
                {/* Instagram Profile Embed */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    color: '#333',
                    marginBottom: '16px',
                    fontSize: '1.2rem'
                  }}>
                    @cripto_unam en Instagram
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '20px'
                  }}>
                    Para ver el contenido completo, visita nuestro perfil de Instagram
                  </p>
                  <a
                    href="https://instagram.com/cripto_unam"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 24px',
                      borderRadius: '25px',
                      fontWeight: '600',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                    Ver en Instagram
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                </div>

                {/* Instagram Posts Grid - Simulado pero con enlaces reales */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      style={{
                        aspectRatio: '1',
                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onClick={() => window.open('https://instagram.com/cripto_unam', '_blank')}
                    >
                      <FontAwesomeIcon 
                        icon={faInstagram} 
                        style={{
                          color: 'white',
                          fontSize: '2rem'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        right: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        textAlign: 'center'
                      }}>
                        Post #{i}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ width: '100%', maxWidth: '600px' }}>
                {/* Twitter Profile Embed */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    color: '#333',
                    marginBottom: '16px',
                    fontSize: '1.2rem'
                  }}>
                    @Cripto_UNAM en Twitter
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '20px'
                  }}>
                    Para ver los tweets más recientes, visita nuestro perfil de Twitter
                  </p>
                  <a
                    href="https://twitter.com/Cripto_UNAM"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#1DA1F2',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '12px 24px',
                      borderRadius: '25px',
                      fontWeight: '600',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                    Ver en Twitter
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                </div>

                {/* Twitter Timeline Simulado */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#333'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #eee'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#1DA1F2',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      <FontAwesomeIcon icon={faTwitter} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>CriptoUNAM</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>@Cripto_UNAM</div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 12px 0', lineHeight: '1.5' }}>
                      🚀 ¡Últimas noticias de CriptoUNAM! Nuevos cursos, eventos y proyectos blockchain. 
                      ¡Síguenos para estar al día con la revolución Web3! #CriptoUNAM #Blockchain #Web3
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '24px',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      <span>❤️ 45</span>
                      <span>🔄 12</span>
                      <span>💬 8</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enlaces a redes sociales */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        padding: '2rem',
        background: 'rgba(26, 26, 26, 0.5)',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <h3 style={{
          color: '#D4AF37',
          fontSize: '1.5rem',
          marginBottom: '1rem',
          fontFamily: 'Orbitron'
        }}>
          ¡Síguenos en nuestras redes!
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <a
            href="https://instagram.com/cripto_unam"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#E4405F',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '25px',
              background: 'rgba(228, 64, 95, 0.1)',
              border: '1px solid rgba(228, 64, 95, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(228, 64, 95, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(228, 64, 95, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faInstagram} />
            @cripto_unam
          </a>
          <a
            href="https://twitter.com/Cripto_UNAM"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1DA1F2',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '25px',
              background: 'rgba(29, 161, 242, 0.1)',
              border: '1px solid rgba(29, 161, 242, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(29, 161, 242, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faTwitter} />
            @Cripto_UNAM
          </a>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default EmbeddedSocialFeed;
