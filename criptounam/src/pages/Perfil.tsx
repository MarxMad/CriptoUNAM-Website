import React, { useState, useEffect } from 'react'
import { useWallet } from '../context/WalletContext'
import { ethers } from 'ethers'

interface UserProfile {
  cursosCompletados: {
    id: number;
    titulo: string;
    fecha: string;
    progreso: number;
  }[];
  eventosAsistidos: {
    id: number;
    nombre: string;
    fecha: string;
    tipo: string;
  }[];
  certificaciones: {
    id: number;
    nombre: string;
    fecha: string;
    hash: string;
  }[];
  logros: {
    id: number;
    nombre: string;
    descripcion: string;
    icono: string;
    fecha: string;
    nivel: 'bronce' | 'plata' | 'oro';
  }[];
  nfts: {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    tokenId: string;
    openseaLink: string;
  }[];
  transacciones: {
    hash: string;
    tipo: string;
    descripcion: string;
    fecha: string;
    cantidad: string;
  }[];
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    showActivity: boolean;
  };
}

const Perfil = () => {
  const { address } = useWallet()

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src="/avatars/default.jpg" 
          alt="Profile" 
          className="profile-avatar"
        />
        <div className="profile-info">
          <h1 className="profile-name">Juan Pérez</h1>
          <p className="profile-role">Desarrollador Blockchain</p>
          <div className="profile-stats">
            <div className="stat-item">
              <i className="fas fa-award"></i>
              <span>5 Certificaciones</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-code-branch"></i>
              <span>8 Proyectos</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-users"></i>
              <span>120 Seguidores</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <aside className="profile-sidebar">
          <div className="profile-section">
            <h3><i className="fas fa-wallet"></i> Wallet</h3>
            <p>{address || 'No conectado'}</p>
          </div>

          <div className="profile-section">
            <h3><i className="fas fa-certificate"></i> Badges</h3>
            <div className="badge-list">
              <span className="profile-badge">
                <i className="fas fa-code"></i>
                Smart Contracts
              </span>
              <span className="profile-badge">
                <i className="fas fa-chart-line"></i>
                DeFi Expert
              </span>
              <span className="profile-badge">
                <i className="fas fa-network-wired"></i>
                Web3
              </span>
            </div>
          </div>

          <div className="profile-section">
            <h3><i className="fas fa-chart-bar"></i> Habilidades</h3>
            <div className="progress-section">
              <div className="progress-item">
                <div className="progress-header">
                  <span>Solidity</span>
                  <span>90%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span>Web3.js</span>
                  <span>85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span>DeFi</span>
                  <span>75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div className="profile-section">
            <h3><i className="fas fa-history"></i> Actividad Reciente</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="activity-content">
                  <h4>Completó el curso "DeFi Fundamentals"</h4>
                  <p>Hace 2 días</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="activity-content">
                  <h4>Ganó el badge "Smart Contract Developer"</h4>
                  <p>Hace 1 semana</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-code"></i>
                </div>
                <div className="activity-content">
                  <h4>Contribuyó al proyecto "DEX UNAM"</h4>
                  <p>Hace 2 semanas</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Perfil 