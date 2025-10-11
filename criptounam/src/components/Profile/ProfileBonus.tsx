// Componente de sección bonus en perfil
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCoins, 
  faTrophy, 
  faGift, 
  faStar, 
  faMedal,
  faRocket,
  faFire,
  faCrown,
  faGem,
  faAward
} from '@fortawesome/free-solid-svg-icons'
import { usePuma } from '../../hooks/usePuma'

interface ProfileBonusProps {
  userId: string
}

const ProfileBonus: React.FC<ProfileBonusProps> = ({ userId }) => {
  const { balance, totalEarned, level, badges, experiencePoints, isLoading, error } = usePuma(userId)
  const [activeTab, setActiveTab] = useState<'balance' | 'missions' | 'achievements' | 'leaderboard'>('balance')
  const [missions, setMissions] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    // Cargar misiones disponibles
    loadMissions()
    // Cargar leaderboard
    loadLeaderboard()
  }, [])

  const loadMissions = async () => {
    try {
      // Simular carga de misiones
      const mockMissions = [
        {
          id: 'mission-1',
          title: 'Primer Like',
          description: 'Da tu primer like a una newsletter',
          reward: 50,
          progress: 0,
          maxProgress: 1,
          isCompleted: false,
          category: 'social'
        },
        {
          id: 'mission-2',
          title: 'Newsletter Reader',
          description: 'Suscríbete al newsletter',
          reward: 100,
          progress: 1,
          maxProgress: 1,
          isCompleted: true,
          category: 'newsletter'
        },
        {
          id: 'mission-3',
          title: 'Social Butterfly',
          description: 'Comparte 5 newsletters',
          reward: 200,
          progress: 2,
          maxProgress: 5,
          isCompleted: false,
          category: 'social'
        },
        {
          id: 'mission-4',
          title: 'Loyal Reader',
          description: 'Lee 10 newsletters',
          reward: 300,
          progress: 7,
          maxProgress: 10,
          isCompleted: false,
          category: 'reading'
        }
      ]
      setMissions(mockMissions)
    } catch (error) {
      console.error('Error cargando misiones:', error)
    }
  }

  const loadLeaderboard = async () => {
    try {
      // Simular carga de leaderboard
      const mockLeaderboard = [
        { rank: 1, username: 'CryptoMaster', totalEarned: 50000, level: 10, badges: ['Top Earner', 'Legend'] },
        { rank: 2, username: 'BlockchainPro', totalEarned: 45000, level: 9, badges: ['Active User'] },
        { rank: 3, username: 'Web3Enthusiast', totalEarned: 40000, level: 8, badges: ['Newsletter Reader'] },
        { rank: 4, username: 'DeFiExpert', totalEarned: 35000, level: 7, badges: ['Social Butterfly'] },
        { rank: 5, username: 'NFTCreator', totalEarned: 30000, level: 6, badges: ['Content Creator'] }
      ]
      setLeaderboard(mockLeaderboard)
    } catch (error) {
      console.error('Error cargando leaderboard:', error)
    }
  }

  const completeMission = async (missionId: string) => {
    try {
      // Simular completar misión
      console.log('Completando misión:', missionId)
      // Aquí se haría la llamada a la API
    } catch (error) {
      console.error('Error completando misión:', error)
    }
  }

  const getLevelProgress = () => {
    const currentLevelXP = (level - 1) * 1000
    const nextLevelXP = level * 1000
    const progress = ((experiencePoints - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  const getBadgeIcon = (badge: string) => {
    const badgeIcons: Record<string, any> = {
      'Top Earner': faCrown,
      'Legend': faGem,
      'Active User': faFire,
      'Newsletter Reader': faRocket,
      'Social Butterfly': faStar,
      'Content Creator': faAward,
      'Mission Master': faMedal
    }
    return badgeIcons[badge] || faTrophy
  }

  const getCategoryIcon = (category: string) => {
    const categoryIcons: Record<string, any> = {
      'social': faStar,
      'newsletter': faRocket,
      'reading': faGem,
      'mission': faMedal
    }
    return categoryIcons[category] || faGift
  }

  if (isLoading) {
    return (
      <div className="profile-bonus">
        <div className="loading">
          <FontAwesomeIcon icon={faCoins} spin />
          <span>Cargando sección bonus...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-bonus">
        <div className="error">
          <FontAwesomeIcon icon={faCoins} />
          <span>Error cargando datos: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-bonus">
      <div className="bonus-header">
        <h2>
          <FontAwesomeIcon icon={faCoins} />
          Sección Bonus $PUMA
        </h2>
        <p>Gana tokens PUMA participando en la comunidad</p>
      </div>

      <div className="bonus-tabs">
        <button 
          className={activeTab === 'balance' ? 'active' : ''}
          onClick={() => setActiveTab('balance')}
        >
          <FontAwesomeIcon icon={faCoins} />
          Balance
        </button>
        <button 
          className={activeTab === 'missions' ? 'active' : ''}
          onClick={() => setActiveTab('missions')}
        >
          <FontAwesomeIcon icon={faGift} />
          Misiones
        </button>
        <button 
          className={activeTab === 'achievements' ? 'active' : ''}
          onClick={() => setActiveTab('achievements')}
        >
          <FontAwesomeIcon icon={faTrophy} />
          Logros
        </button>
        <button 
          className={activeTab === 'leaderboard' ? 'active' : ''}
          onClick={() => setActiveTab('leaderboard')}
        >
          <FontAwesomeIcon icon={faCrown} />
          Ranking
        </button>
      </div>

      <div className="bonus-content">
        {activeTab === 'balance' && (
          <div className="balance-section">
            <div className="balance-cards">
              <div className="balance-card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faCoins} />
                  <h3>Balance Actual</h3>
                </div>
                <div className="card-value">
                  {balance?.toLocaleString() || 0} $PUMA
                </div>
              </div>

              <div className="balance-card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faTrophy} />
                  <h3>Total Ganado</h3>
                </div>
                <div className="card-value">
                  {totalEarned?.toLocaleString() || 0} $PUMA
                </div>
              </div>

              <div className="balance-card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faStar} />
                  <h3>Nivel</h3>
                </div>
                <div className="card-value">
                  {level || 1}
                </div>
                <div className="level-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getLevelProgress()}%` }}
                    ></div>
                  </div>
                  <span>{experiencePoints || 0} XP</span>
                </div>
              </div>
            </div>

            <div className="recent-transactions">
              <h3>Transacciones Recientes</h3>
              <div className="transactions-list">
                <div className="transaction">
                  <FontAwesomeIcon icon={faCoins} />
                  <div className="transaction-details">
                    <span>Misión completada</span>
                    <span>+100 $PUMA</span>
                  </div>
                </div>
                <div className="transaction">
                  <FontAwesomeIcon icon={faStar} />
                  <div className="transaction-details">
                    <span>Like dado</span>
                    <span>+10 $PUMA</span>
                  </div>
                </div>
                <div className="transaction">
                  <FontAwesomeIcon icon={faRocket} />
                  <div className="transaction-details">
                    <span>Newsletter leída</span>
                    <span>+25 $PUMA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="missions-section">
            <h3>Misiones Disponibles</h3>
            <div className="missions-grid">
              {missions.map((mission) => (
                <div key={mission.id} className="mission-card">
                  <div className="mission-header">
                    <FontAwesomeIcon icon={getCategoryIcon(mission.category)} />
                    <h4>{mission.title}</h4>
                    <span className="reward">+{mission.reward} $PUMA</span>
                  </div>
                  <p>{mission.description}</p>
                  <div className="mission-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                    <span>{mission.progress}/{mission.maxProgress}</span>
                  </div>
                  <button 
                    className={`mission-button ${mission.isCompleted ? 'completed' : ''}`}
                    onClick={() => completeMission(mission.id)}
                    disabled={mission.isCompleted}
                  >
                    {mission.isCompleted ? 'Completada' : 'Completar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-section">
            <h3>Insignias Obtenidas</h3>
            <div className="badges-grid">
              {badges?.map((badge, index) => (
                <div key={index} className="badge-card">
                  <FontAwesomeIcon icon={getBadgeIcon(badge)} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            <h3>Próximas Insignias</h3>
            <div className="upcoming-badges">
              <div className="badge-card upcoming">
                <FontAwesomeIcon icon={faCrown} />
                <span>Top Earner</span>
                <small>Gana 10,000 $PUMA</small>
              </div>
              <div className="badge-card upcoming">
                <FontAwesomeIcon icon={faGem} />
                <span>Legend</span>
                <small>Alcanza nivel 20</small>
              </div>
              <div className="badge-card upcoming">
                <FontAwesomeIcon icon={faMedal} />
                <span>Mission Master</span>
                <small>Completa 50 misiones</small>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-section">
            <h3>Ranking Semanal</h3>
            <div className="leaderboard-list">
              {leaderboard.map((user, index) => (
                <div key={index} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
                  <div className="rank">
                    {index < 3 ? (
                      <FontAwesomeIcon icon={index === 0 ? faCrown : index === 1 ? faMedal : faAward} />
                    ) : (
                      <span>#{user.rank}</span>
                    )}
                  </div>
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                    <span className="earnings">{user.totalEarned.toLocaleString()} $PUMA</span>
                  </div>
                  <div className="user-stats">
                    <span>Nivel {user.level}</span>
                    <div className="badges">
                      {user.badges.map((badge, badgeIndex) => (
                        <FontAwesomeIcon key={badgeIndex} icon={getBadgeIcon(badge)} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-bonus {
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(40, 40, 40, 0.9));
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem 0;
          color: #fff;
        }

        .bonus-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .bonus-header h2 {
          color: #D4AF37;
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .bonus-header p {
          color: #E0E0E0;
          margin: 0;
        }

        .bonus-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .bonus-tabs button {
          background: rgba(42, 42, 62, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #E0E0E0;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .bonus-tabs button:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.5);
        }

        .bonus-tabs button.active {
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          color: #000;
          border-color: #D4AF37;
        }

        .balance-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .balance-card {
          background: rgba(42, 42, 62, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #D4AF37;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .card-value {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .level-progress {
          margin-top: 1rem;
        }

        .progress-bar {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          height: 100%;
          transition: width 0.3s ease;
        }

        .missions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .mission-card {
          background: rgba(42, 42, 62, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .mission-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .mission-header h4 {
          margin: 0;
          flex: 1;
          color: #fff;
        }

        .reward {
          color: #D4AF37;
          font-weight: bold;
        }

        .mission-progress {
          margin: 1rem 0;
        }

        .mission-button {
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          color: #000;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          width: 100%;
          transition: all 0.3s ease;
        }

        .mission-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .mission-button:disabled {
          background: #666;
          color: #999;
          cursor: not-allowed;
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .badge-card {
          background: rgba(42, 42, 62, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .badge-card.upcoming {
          opacity: 0.6;
          border-style: dashed;
        }

        .badge-card svg {
          font-size: 2rem;
          color: #D4AF37;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .leaderboard-item {
          background: rgba(42, 42, 62, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .leaderboard-item.top-three {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
        }

        .rank {
          font-size: 1.5rem;
          color: #D4AF37;
          min-width: 3rem;
          text-align: center;
        }

        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .username {
          font-weight: bold;
          color: #fff;
        }

        .earnings {
          color: #D4AF37;
          font-size: 0.9rem;
        }

        .user-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .badges {
          display: flex;
          gap: 0.25rem;
        }

        .badges svg {
          color: #D4AF37;
          font-size: 0.8rem;
        }

        .loading, .error {
          text-align: center;
          padding: 2rem;
          color: #E0E0E0;
        }

        .loading svg {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #D4AF37;
        }

        .error {
          color: #ff6b6b;
        }

        @media (max-width: 768px) {
          .bonus-tabs {
            flex-direction: column;
          }
          
          .balance-cards {
            grid-template-columns: 1fr;
          }
          
          .missions-grid {
            grid-template-columns: 1fr;
          }
          
          .badges-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}

export default ProfileBonus
