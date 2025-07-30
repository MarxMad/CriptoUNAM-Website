import React from 'react';
import { useAdmin } from '../hooks/useAdmin';

interface AdminStatusProps {
  showDetails?: boolean;
}

export const AdminStatus: React.FC<AdminStatusProps> = ({ showDetails = false }) => {
  const { isAdmin, walletAddress, isConnected } = useAdmin();

  if (!isConnected) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
      color: '#000',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
      border: '2px solid #B8860B'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px' }}>👑</span>
        <span>ADMIN</span>
      </div>
      {showDetails && walletAddress && (
        <div style={{
          marginTop: '4px',
          fontSize: '10px',
          opacity: 0.8,
          wordBreak: 'break-all'
        }}>
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      )}
    </div>
  );
}; 