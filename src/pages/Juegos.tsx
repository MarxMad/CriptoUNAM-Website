import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPuzzlePiece, faQuestion, faBrain, faChartLine, faCheck, faExchangeAlt, faCubes, faKey, faLink } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';

const juegos = [
  {
    id: 'quiz',
    nombre: 'Quiz de Blockchain',
    icon: faQuestion,
    descripcion: 'Pon a prueba tus conocimientos sobre blockchain y criptomonedas.',
    imagen: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'memorama',
    nombre: 'Memorama Cripto',
    icon: faPuzzlePiece,
    descripcion: 'Encuentra los pares de conceptos clave en blockchain.',
    imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'ahorcado',
    nombre: 'Ahorcado Blockchain',
    icon: faBrain,
    descripcion: 'Adivina los términos más usados en el mundo cripto.',
    imagen: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sopa',
    nombre: 'Sopa de Letras',
    icon: faCubes,
    descripcion: 'Busca palabras sobre finanzas y tecnología.',
    imagen: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'historia',
    nombre: 'Ordena la Historia',
    icon: faBitcoin,
    descripcion: 'Pon en orden los hitos de Bitcoin y blockchain.',
    imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'verdadero',
    nombre: 'Verdadero o Falso DeFi',
    icon: faCheck,
    descripcion: '¿Cuánto sabes sobre finanzas descentralizadas?',
    imagen: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'rompecabezas',
    nombre: 'Rompecabezas de Logos',
    icon: faPuzzlePiece,
    descripcion: 'Arma los logos de proyectos cripto.',
    imagen: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'trading',
    nombre: 'Simulador de Trading',
    icon: faChartLine,
    descripcion: 'Simula operaciones y aprende sobre mercados.',
    imagen: 'https://images.unsplash.com/photo-1461344577544-4e5dc9487184?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'crucigrama',
    nombre: 'Crucigrama Web3',
    icon: faKey,
    descripcion: 'Resuelve el crucigrama sobre la nueva web.',
    imagen: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'emparejar',
    nombre: 'Empareja Token y Red',
    icon: faLink,
    descripcion: 'Relaciona tokens con su blockchain correspondiente.',
    imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
  },
];

const Juegos = () => {
  const navigate = useNavigate();
  return (
    <div className="juegos-page" style={{minHeight:'100vh', background:'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #D4AF37 100%)', padding:'3rem 0'}}>
      <h1 style={{textAlign:'center', color:'#D4AF37', fontFamily:'Orbitron', fontSize:'2.7rem', marginBottom:'2.5rem', textShadow:'0 2px 12px #1E3A8A88'}}>Juegos Interactivos</h1>
      <div className="juegos-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'2.5rem', maxWidth:1200, margin:'0 auto'}}>
        {juegos.map(juego => (
          <div key={juego.id} className="juego-card" style={{background:'rgba(26,26,26,0.85)', borderRadius:20, boxShadow:'0 4px 24px #1E3A8A33', padding:'2.2rem 1.5rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', minHeight:320, border:'2px solid #D4AF37', transition:'transform 0.2s', position:'relative'}}>
            <img src={juego.imagen} alt={juego.nombre} style={{width:'100%', maxWidth:180, height:100, objectFit:'cover', borderRadius:12, marginBottom:16, boxShadow:'0 2px 12px #2563EB33'}} />
            <FontAwesomeIcon icon={juego.icon} style={{fontSize:'2.2rem', color:'#2563EB', marginBottom:12, filter:'drop-shadow(0 2px 8px #D4AF37)'}} />
            <h2 style={{color:'#D4AF37', fontFamily:'Orbitron', fontSize:'1.5rem', marginBottom:10, textAlign:'center'}}>{juego.nombre}</h2>
            <p style={{color:'#E0E0E0', fontSize:'1.1rem', marginBottom:18, textAlign:'center'}}>{juego.descripcion}</p>
            <button className="primary-button" style={{fontSize:'1.1rem', borderRadius:14, padding:'0.7rem 2rem', fontWeight:700, background:'linear-gradient(90deg,#2563EB 60%,#D4AF37 100%)', color:'#fff', boxShadow:'0 0 16px 4px #2563EB55, 0 0 32px 8px #D4AF3755', border:'none', cursor:'pointer', transition:'box-shadow 0.3s'}} onClick={()=>navigate(`/juegos/${juego.id}`)}>
              Jugar
            </button>
          </div>
        ))}
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