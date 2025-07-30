import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const juegos = [
  {
    id: 'trading',
    nombre: 'Simulador de Trading',
    icon: faChartLine,
    descripcion: 'Simula operaciones de trading con criptomonedas y aprende sobre análisis técnico, gestión de riesgo y estrategias de inversión en un entorno seguro.',
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80'
  },
];

const Juegos = () => {
  const navigate = useNavigate();
  return (
    <div className="juegos-page" style={{minHeight:'100vh', background:'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #D4AF37 100%)', padding:'3rem 0'}}>
      <div style={{maxWidth: 1200, margin: '0 auto', padding: '0 2rem'}}>
        <h1 style={{textAlign:'center', color:'#D4AF37', fontFamily:'Orbitron', fontSize:'2.7rem', marginBottom:'1rem', textShadow:'0 2px 12px #1E3A8A88'}}>Simulador de Trading</h1>
        <p style={{textAlign:'center', color:'#E0E0E0', fontSize:'1.2rem', marginBottom:'3rem', maxWidth: 600, margin: '0 auto 3rem auto'}}>
          Aprende a operar con criptomonedas en un entorno seguro y sin riesgos. Practica estrategias de trading y mejora tus habilidades de análisis técnico.
        </p>
        <div className="juegos-grid" style={{display:'flex', justifyContent:'center', gap:'2.5rem'}}>
          {juegos.map(juego => (
            <div key={juego.id} className="juego-card" style={{background:'rgba(26,26,26,0.85)', borderRadius:20, boxShadow:'0 4px 24px #1E3A8A33', padding:'3rem 2rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', minHeight:400, maxWidth: 400, border:'2px solid #D4AF37', transition:'transform 0.2s', position:'relative'}}>
              <img src={juego.imagen} alt={juego.nombre} style={{width:'100%', maxWidth:300, height:180, objectFit:'cover', borderRadius:12, marginBottom:24, boxShadow:'0 2px 12px #2563EB33'}} />
              <FontAwesomeIcon icon={juego.icon} style={{fontSize:'3rem', color:'#2563EB', marginBottom:16, filter:'drop-shadow(0 2px 8px #D4AF37)'}} />
              <h2 style={{color:'#D4AF37', fontFamily:'Orbitron', fontSize:'1.8rem', marginBottom:16, textAlign:'center'}}>{juego.nombre}</h2>
              <p style={{color:'#E0E0E0', fontSize:'1.1rem', marginBottom:24, textAlign:'center', lineHeight: 1.6}}>{juego.descripcion}</p>
              <button className="primary-button" style={{fontSize:'1.2rem', borderRadius:14, padding:'1rem 2.5rem', fontWeight:700, background:'linear-gradient(90deg,#2563EB 60%,#D4AF37 100%)', color:'#fff', boxShadow:'0 0 16px 4px #2563EB55, 0 0 32px 8px #D4AF3755', border:'none', cursor:'pointer', transition:'box-shadow 0.3s'}} onClick={()=>navigate(`/juegos/${juego.id}`)}>
                Comenzar Trading
              </button>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .juego-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 12px 30px #D4AF37cc;
          border-color: #2563EB;
        }
      `}</style>
    </div>
  )
}

export default Juegos; 