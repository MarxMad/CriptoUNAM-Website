import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';

const juegosInfo = {
  quiz: { nombre: 'Quiz de Blockchain' },
  memorama: { nombre: 'Memorama Cripto' },
  ahorcado: { nombre: 'Ahorcado Blockchain' },
  sopa: { nombre: 'Sopa de Letras' },
  historia: { nombre: 'Ordena la Historia' },
  verdadero: { nombre: 'Verdadero o Falso DeFi' },
  rompecabezas: { nombre: 'Rompecabezas de Logos' },
  trading: { nombre: 'Simulador de Trading' },
  crucigrama: { nombre: 'Crucigrama Web3' },
  emparejar: { nombre: 'Empareja Token y Red' },
};

// Placeholder de ranking global
const fakeRanking = [
  { wallet: '0x123...abcd', puntos: 120 },
  { wallet: '0x456...efgh', puntos: 100 },
  { wallet: '0x789...ijkl', puntos: 80 },
];

// --- Juegos interactivos ---

// 1. Quiz de Blockchain
const quizPreguntas = [
  { pregunta: '¿Qué es un bloque en blockchain?', opciones: ['Un archivo de texto', 'Un conjunto de transacciones', 'Un contrato legal'], correcta: 1 },
  { pregunta: '¿Quién fue el creador de Bitcoin?', opciones: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Elon Musk'], correcta: 1 },
  { pregunta: '¿Qué es una wallet?', opciones: ['Un banco', 'Un monedero digital', 'Un contrato inteligente'], correcta: 1 },
  { pregunta: '¿Qué red es famosa por los contratos inteligentes?', opciones: ['Ethereum', 'Litecoin', 'Dogecoin'], correcta: 0 },
];

function QuizGame({ onScore }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const handleAnswer = (i) => {
    if (i === quizPreguntas[idx].correcta) setScore(s => s + 10);
    if (idx + 1 < quizPreguntas.length) setIdx(idx + 1);
    else setFinished(true);
  };
  useEffect(() => { if (finished) onScore(score); }, [finished]);
  if (finished) return <div style={{color:'#D4AF37', fontSize:'1.3rem'}}>¡Terminaste! Puntaje: <b>{score}</b></div>;
  return (
    <div>
      <h3 style={{color:'#D4AF37'}}>{quizPreguntas[idx].pregunta}</h3>
      <div style={{display:'flex', flexDirection:'column', gap:12, marginTop:18}}>
        {quizPreguntas[idx].opciones.map((op, i) => (
          <button key={i} onClick={()=>handleAnswer(i)} style={{padding:'0.7rem 1.2rem', borderRadius:10, background:'#2563EB', color:'#fff', border:'none', fontWeight:600, fontSize:'1.1rem', marginBottom:6}}>{op}</button>
        ))}
      </div>
    </div>
  );
}

// 2. Memorama Cripto
const paresMemorama = [
  { id: 1, palabra: 'Bitcoin', par: 'BTC' },
  { id: 2, palabra: 'Ethereum', par: 'ETH' },
  { id: 3, palabra: 'Wallet', par: 'Monedero' },
  { id: 4, palabra: 'Smart Contract', par: 'Contrato Inteligente' },
];
function shuffle(arr) { return arr.map(v => [Math.random(), v]).sort().map(a => a[1]); }
function MemoramaGame({ onScore }) {
  const [cartas, setCartas] = useState(() => shuffle([...paresMemorama, ...paresMemorama].map((p, i) => ({...p, key: i+Math.random()}))));
  const [volteadas, setVolteadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [score, setScore] = useState(0);
  useEffect(() => { if (encontradas.length === paresMemorama.length*2) onScore(score); }, [encontradas]);
  const handleClick = idx => {
    if (volteadas.length === 2 || volteadas.includes(idx) || encontradas.includes(idx)) return;
    setVolteadas(v => [...v, idx]);
    if (volteadas.length === 1) {
      const i1 = volteadas[0], i2 = idx;
      if (cartas[i1].id === cartas[i2].id && i1 !== i2) {
        setTimeout(() => {
          setEncontradas(e => [...e, i1, i2]);
          setScore(s => s + 15);
          setVolteadas([]);
        }, 700);
      } else {
        setTimeout(() => setVolteadas([]), 900);
      }
    }
  };
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, maxWidth:400, margin:'0 auto'}}>
      {cartas.map((c, idx) => (
        <button key={c.key} onClick={()=>handleClick(idx)} style={{height:60, borderRadius:10, background:encontradas.includes(idx)?'#34d399':volteadas.includes(idx)?'#2563EB':'#18181b', color:'#fff', fontWeight:700, fontSize:'1.1rem', border:'2px solid #D4AF37', cursor:encontradas.includes(idx)?'default':'pointer'}} disabled={encontradas.includes(idx)}>
          {encontradas.includes(idx)||volteadas.includes(idx)? (volteadas.includes(idx)?c.palabra:c.par) : '?'}
        </button>
      ))}
      {encontradas.length === paresMemorama.length*2 && <div style={{gridColumn:'span 4', color:'#D4AF37', fontSize:'1.2rem', marginTop:18}}>¡Completado! Puntaje: <b>{score}</b></div>}
    </div>
  );
}

// 3. Ahorcado Blockchain
const palabrasAhorcado = ['BLOCKCHAIN','ETHEREUM','BITCOIN','WALLET','MINERIA','DEFI','DAO'];
function AhorcadoGame({ onScore }) {
  const [palabra] = useState(() => palabrasAhorcado[Math.floor(Math.random()*palabrasAhorcado.length)]);
  const [letras, setLetras] = useState([]);
  const [errores, setErrores] = useState(0);
  const [ganado, setGanado] = useState(false);
  const [perdido, setPerdido] = useState(false);
  useEffect(() => {
    if (palabra.split('').every(l => letras.includes(l))) { setGanado(true); onScore(20-errores*2); }
    if (errores >= 6) setPerdido(true);
  }, [letras, errores]);
  const handleLetra = l => {
    if (letras.includes(l) || ganado || perdido) return;
    if (!palabra.includes(l)) setErrores(e=>e+1);
    setLetras(ls=>[...ls,l]);
  };
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:'2rem', letterSpacing:8, marginBottom:18}}>
        {palabra.split('').map((l,i)=>(letras.includes(l)||ganado||perdido)?l:'_').join(' ')}
      </div>
      <div style={{display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:12}}>
        {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(l=>(
          <button key={l} onClick={()=>handleLetra(l)} style={{padding:'0.4rem 0.7rem', borderRadius:8, background:'#2563EB', color:'#fff', border:'none', fontWeight:600, fontSize:'1rem'}} disabled={letras.includes(l)||ganado||perdido}>{l}</button>
        ))}
      </div>
      <div style={{color:'#ff4444', fontWeight:700}}>Errores: {errores} / 6</div>
      {ganado && <div style={{color:'#34d399', fontSize:'1.2rem', marginTop:12}}>¡Ganaste! Puntaje: <b>{20-errores*2}</b></div>}
      {perdido && <div style={{color:'#ff4444', fontSize:'1.2rem', marginTop:12}}>Perdiste. La palabra era: <b>{palabra}</b></div>}
    </div>
  );
}

// 4. Sopa de Letras de Finanzas
const palabrasSopa = ['BLOCKCHAIN','FINANZAS','TOKEN','CRYPTO','DEFI','DAO','MINERIA'];
function SopaLetrasGame({ onScore }) {
  // Para simplificar, solo muestra las palabras a buscar y suma puntos al hacer clic en cada una
  const [encontradas, setEncontradas] = useState([]);
  const [score, setScore] = useState(0);
  const handleClick = (p) => {
    if (!encontradas.includes(p)) {
      setEncontradas(e=>[...e,p]);
      setScore(s=>s+8);
    }
  };
  useEffect(()=>{ if (encontradas.length===palabrasSopa.length) onScore(score); },[encontradas]);
  return (
    <div style={{textAlign:'center'}}>
      <div style={{marginBottom:18, color:'#D4AF37'}}>Haz clic en las palabras que encuentres:</div>
      <div style={{display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center'}}>
        {palabrasSopa.map(p=>(
          <button key={p} onClick={()=>handleClick(p)} style={{padding:'0.6rem 1.1rem', borderRadius:10, background:encontradas.includes(p)?'#34d399':'#2563EB', color:'#fff', border:'none', fontWeight:700, fontSize:'1.1rem'}} disabled={encontradas.includes(p)}>{p}</button>
        ))}
      </div>
      {encontradas.length===palabrasSopa.length && <div style={{color:'#D4AF37', fontSize:'1.2rem', marginTop:18}}>¡Completado! Puntaje: <b>{score}</b></div>}
    </div>
  );
}

const JuegoIndividual = () => {
  const { id } = useParams();
  const { address, isConnected } = useAccount();
  const [puntaje, setPuntaje] = useState(0);
  const [ranking, setRanking] = useState(fakeRanking);
  const [puntajeJuego, setPuntajeJuego] = useState(0);

  useEffect(() => {
    // Aquí deberías hacer fetch al backend para obtener el puntaje y ranking real
    // setPuntaje(...)
    // setRanking(...)
  }, [id, address]);

  const handleScore = (score) => {
    setPuntajeJuego(score);
    setPuntaje(p=>p+score);
    // Aquí deberías guardar el puntaje en el backend
  };

  if (!id || !juegosInfo[id as keyof typeof juegosInfo]) {
    return <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#ff4444'}}>Juego no encontrado</div>;
  }

  let juegoComponent = <div style={{color:'#D4AF37'}}>Próximamente...</div>;
  if (id==='quiz') juegoComponent = <QuizGame onScore={handleScore} />;
  if (id==='memorama') juegoComponent = <MemoramaGame onScore={handleScore} />;
  if (id==='ahorcado') juegoComponent = <AhorcadoGame onScore={handleScore} />;
  if (id==='sopa') juegoComponent = <SopaLetrasGame onScore={handleScore} />;

  return (
    <div className="juego-individual-page" style={{minHeight:'100vh', background:'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #D4AF37 100%)', padding:'2rem 0'}}>
      <div style={{maxWidth:900, margin:'0 auto', background:'rgba(26,26,26,0.85)', borderRadius:20, boxShadow:'0 4px 24px #1E3A8A33', padding:'2.5rem 2rem'}}>
        <h1 style={{color:'#D4AF37', fontFamily:'Orbitron', fontSize:'2.2rem', marginBottom:18}}>{juegosInfo[id as keyof typeof juegosInfo].nombre}</h1>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:16}}>
          <div style={{color:'#2563EB', fontWeight:700, fontSize:'1.2rem'}}>Tu puntaje: <span style={{color:'#D4AF37'}}>{puntaje}</span></div>
          <div style={{color:'#D4AF37', fontWeight:700, fontSize:'1.2rem'}}>Ranking global</div>
        </div>
        <div style={{marginBottom:32}}>
          <ol style={{background:'#101014', borderRadius:12, padding:'1rem 2rem', color:'#fff', fontSize:'1.1rem'}}>
            {ranking.map((r, i) => (
              <li key={r.wallet} style={{marginBottom:6, color: i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#fff'}}>
                {r.wallet} — <b>{r.puntos} pts</b>
              </li>
            ))}
          </ol>
        </div>
        {/* Aquí renderiza el juego correspondiente */}
        <div style={{background:'#18181b', borderRadius:16, padding:'2rem', minHeight:200, color:'#fff', textAlign:'center'}}>
          {juegoComponent}
        </div>
      </div>
    </div>
  );
};

export default JuegoIndividual; 