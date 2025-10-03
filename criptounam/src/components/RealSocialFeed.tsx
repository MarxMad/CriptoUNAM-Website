import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt, faRefresh } from '@fortawesome/free-solid-svg-icons';

interface RealSocialFeedProps {
  title: string;
  description?: string;
}

const RealSocialFeed: React.FC<RealSocialFeedProps> = ({ title, description }) => {
  const [instagramPosts, setInstagramPosts] = useState<any[]>([]);
  const [twitterPosts, setTwitterPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'instagram' | 'twitter'>('all');

  // IDs de posts de Instagram de @Cripto_UNAM (necesitarás obtener estos IDs reales)
  const instagramPostIds = [
    'C8xYz1234567890', // Reemplaza con IDs reales
    'C8xYz1234567891',
    'C8xYz1234567892'
  ];

  // IDs de tweets de @Cripto_UNAM (necesitarás obtener estos IDs reales)
  const twitterPostIds = [
    '1234567890123456789', // Reemplaza con IDs reales
    '1234567890123456790',
    '1234567890123456791'
  ];

  // Función para obtener datos de Instagram usando oEmbed
  const fetchInstagramPost = async (postId: string) => {
    try {
      const url = `https://www.instagram.com/p/${postId}/`;
      const response = await fetch(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          id: postId,
          platform: 'instagram',
          content: data.title || '',
          image: data.thumbnail_url,
          url: url,
          author: '@Cripto_UNAM',
          timestamp: 'Reciente'
        };
      }
    } catch (error) {
      console.error('Error fetching Instagram post:', error);
    }
    return null;
  };

  // Función para obtener datos de Twitter usando oEmbed
  const fetchTwitterPost = async (postId: string) => {
    try {
      const url = `https://twitter.com/Cripto_UNAM/status/${postId}`;
      const response = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          id: postId,
          platform: 'twitter',
          content: data.html || '',
          image: data.thumbnail_url,
          url: url,
          author: '@Cripto_UNAM',
          timestamp: 'Reciente'
        };
      }
    } catch (error) {
      console.error('Error fetching Twitter post:', error);
    }
    return null;
  };

  // Cargar posts reales
  useEffect(() => {
    const loadRealPosts = async () => {
      setLoading(true);
      
      try {
        // Cargar posts de Instagram
        const instagramPromises = instagramPostIds.map(id => fetchInstagramPost(id));
        const instagramResults = await Promise.all(instagramPromises);
        const validInstagramPosts = instagramResults.filter(post => post !== null);
        setInstagramPosts(validInstagramPosts);

        // Cargar posts de Twitter
        const twitterPromises = twitterPostIds.map(id => fetchTwitterPost(id));
        const twitterResults = await Promise.all(twitterPromises);
        const validTwitterPosts = twitterResults.filter(post => post !== null);
        setTwitterPosts(validTwitterPosts);

      } catch (error) {
        console.error('Error loading real posts:', error);
        
        // Fallback a posts simulados si falla la carga real
        setInstagramPosts([
          {
            id: 'fallback1',
            platform: 'instagram',
            content: '🚀 ¡Hackathon Blockchain 2024 fue un éxito total! Más de 200 participantes desarrollando el futuro de la Web3. #CriptoUNAM #Blockchain #Hackathon',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=400&fit=crop',
            url: 'https://instagram.com/Cripto_UNAM',
            author: '@Cripto_UNAM',
            timestamp: '2 horas'
          }
        ]);
        
        setTwitterPosts([
          {
            id: 'fallback1',
            platform: 'twitter',
            content: '🎓 Nuevo curso: "Smart Contracts Avanzados" - Aprende Solidity, DeFi protocols y auditoría de contratos. ¡Inscripciones abiertas! #Web3Education',
            url: 'https://twitter.com/Cripto_UNAM',
            author: '@Cripto_UNAM',
            timestamp: '4 horas'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRealPosts();
  }, []);

  const allPosts = [...instagramPosts, ...twitterPosts];
  const filteredPosts = allPosts.filter(post => 
    activeTab === 'all' || post.platform === activeTab
  );

  const refreshPosts = () => {
    setLoading(true);
    // Recargar posts
    window.location.reload();
  };

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
          { key: 'all', label: 'Todas', icon: null, count: allPosts.length },
          { key: 'instagram', label: 'Instagram', icon: faInstagram, count: instagramPosts.length },
          { key: 'twitter', label: 'Twitter', icon: faTwitter, count: twitterPosts.length }
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
            {tab.icon && <FontAwesomeIcon icon={tab.icon} />}
            {tab.label}
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '0.8rem'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
        
        {/* Botón de refresh */}
        <button
          onClick={refreshPosts}
          disabled={loading}
          style={{
            background: 'rgba(37, 99, 235, 0.8)',
            color: 'white',
            border: '1px solid #2563EB',
            borderRadius: '25px',
            padding: '12px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1
          }}
        >
          <FontAwesomeIcon 
            icon={faRefresh} 
            style={{
              animation: loading ? 'spin 1s linear infinite' : 'none'
            }}
          />
          Actualizar
        </button>
      </div>

      {/* Grid de posts */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
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
            marginLeft: '16px',
            fontSize: '1.1rem'
          }}>
            Cargando posts reales de @Cripto_UNAM...
          </span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#E0E0E0'
        }}>
          <FontAwesomeIcon 
            icon={activeTab === 'instagram' ? faInstagram : faTwitter} 
            style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}
          />
          <h3 style={{ marginBottom: '1rem' }}>
            No hay posts disponibles
          </h3>
          <p>
            {activeTab === 'instagram' 
              ? 'No se pudieron cargar los posts de Instagram. Verifica que @Cripto_UNAM tenga posts públicos.'
              : 'No se pudieron cargar los tweets. Verifica que @Cripto_UNAM tenga tweets públicos.'
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              style={{
                background: 'rgba(26, 26, 26, 0.8)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header con plataforma */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FontAwesomeIcon 
                    icon={post.platform === 'instagram' ? faInstagram : faTwitter}
                    style={{
                      color: post.platform === 'instagram' ? '#E4405F' : '#1DA1F2',
                      fontSize: '1.2rem'
                    }}
                  />
                  <span style={{
                    color: '#D4AF37',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {post.author}
                  </span>
                </div>
                <span style={{
                  color: '#999',
                  fontSize: '0.8rem'
                }}>
                  {post.timestamp}
                </span>
              </div>

              {/* Imagen si existe */}
              {post.image && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <img
                    src={post.image}
                    alt="Post content"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}

              {/* Contenido */}
              <div 
                style={{
                  color: '#E0E0E0',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  margin: '0 0 16px 0'
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Enlace */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#D4AF37',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                >
                  Ver post original
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

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
            href="https://instagram.com/Cripto_UNAM"
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
            @Cripto_UNAM
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

export default RealSocialFeed;
