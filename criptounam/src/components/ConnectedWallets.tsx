import React from 'react'
import { useWallet } from '../context/WalletContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faClock } from '@fortawesome/free-solid-svg-icons'

const ConnectedWallets: React.FC = () => {
  const { connectedWallets } = useWallet()

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="section">
      <h2>Wallets Conectadas</h2>
      {connectedWallets.length === 0 ? (
        <p>No hay wallets conectadas</p>
      ) : (
        <div className="flex flex-center gap-2">
          {connectedWallets.map((wallet, index) => (
            <div key={index} className="card">
              <div className="flex gap-1">
                <FontAwesomeIcon icon={faWallet} className="text-primary-gold" />
                <div>
                  <h3>{formatAddress(wallet.address)}</h3>
                  <p>{wallet.provider}</p>
                </div>
              </div>
              <div className="flex gap-1 mt-1">
                <FontAwesomeIcon icon={faClock} className="text-primary-gold" />
                <span>{formatDate(wallet.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConnectedWallets 