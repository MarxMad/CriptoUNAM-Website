import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const juegosInfo = {
  trading: { nombre: 'Simulador de Trading' },
};

// Datos de criptomonedas para el simulador
const criptomonedasData = [
  { 
    symbol: 'BTC',
    name: 'Bitcoin',
    precio: 65000,
    cambio24h: 2.5,
    volatilidad: 0.03
  },
  { 
    symbol: 'ETH',
    name: 'Ethereum',
    precio: 3200,
    cambio24h: -1.2,
    volatilidad: 0.04
  },
  { 
    symbol: 'ADA',
    name: 'Cardano',
    precio: 0.45,
    cambio24h: 5.8,
    volatilidad: 0.06
  },
  { 
    symbol: 'SOL',
    name: 'Solana',
    precio: 140,
    cambio24h: 8.2,
    volatilidad: 0.08
  },
  { 
    symbol: 'DOT',
    name: 'Polkadot',
    precio: 6.5,
    cambio24h: -3.1,
    volatilidad: 0.05
  }
];

// Placeholder de ranking global
const fakeRanking = [
  { wallet: '0x123...abcd', ganancias: 15.5, trades: 45 },
  { wallet: '0x456...efgh', ganancias: 12.3, trades: 38 },
  { wallet: '0x789...ijkl', ganancias: 8.7, trades: 22 },
];

// Simulador de Trading
function TradingSimulator({ onScore }) {
  const [balance, setBalance] = useState(50000); // $50,000 USD inicial para facilitar las pruebas
  const [criptomonedas, setCriptomonedas] = useState(criptomonedasData);
  const [portfolio, setPortfolio] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [cantidad, setCantidad] = useState('');
  const [operacion, setOperacion] = useState('comprar');
  const [historialTrades, setHistorialTrades] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [rendimiento, setRendimiento] = useState(0);
  
  // Estados para órdenes avanzadas
  const [tipoOrden, setTipoOrden] = useState('market'); // market, limit
  const [precioLimite, setPrecioLimite] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [ordenesActivas, setOrdenesActivas] = useState([]);
  
  // Estados para el gráfico
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  
  // Estados para apalancamiento
  const [apalancamiento, setApalancamiento] = useState(1); // 1x, 2x, 5x, 10x, 20x
  const [posicionesAbiertas, setPosicionesAbiertas] = useState([]);
  const [pnlTotal, setPnlTotal] = useState(0);
  const [margenUsado, setMargenUsado] = useState(0);

  // Simular fluctuaciones de precio y actualizar gráfico
  useEffect(() => {
    if (!gameStarted || gameEnded) return;
    
    const interval = setInterval(() => {
      setCriptomonedas(prev => prev.map(crypto => {
        // Hacer variaciones más suaves y realistas
        const tendencia = Math.sin(tiempo * 0.1) * 0.3; // Tendencia suave
        const ruido = (Math.random() - 0.5) * 2 * crypto.volatilidad * 0.5; // Ruido reducido
        const cambio = (tendencia + ruido) * (crypto.volatilidad / 0.05); // Escalar por volatilidad
        const nuevoPrecio = crypto.precio * (1 + cambio);
        
        // Calcular cambio 24h acumulativo
        const cambio24hAnterior = crypto.cambio24h || 0;
        const nuevoCambio24h = cambio24hAnterior + (cambio * 100);
        
        return {
          ...crypto,
          precio: Math.max(nuevoPrecio, 0.01),
          cambio24h: Math.max(-95, Math.min(500, nuevoCambio24h)) // Limitar cambios extremos
        };
      }));
      
      // Actualizar datos del gráfico
      setDatosGrafico(prev => {
        const cryptoActual = criptomonedas.find(c => c.symbol === selectedCrypto);
        const nuevosDatos = [...prev, {
          tiempo: new Date().toLocaleTimeString(),
          precio: cryptoActual?.precio || 0,
          timestamp: Date.now()
        }];
        // Mantener solo los últimos 30 puntos
        return nuevosDatos.slice(-30);
      });
      
      setTiempo(prev => prev + 1);
      verificarOrdenes();
      calcularPnL();
    }, 1000); // Actualizar cada segundo para mayor fluidez

    return () => clearInterval(interval);
  }, [gameStarted, gameEnded, criptomonedas, selectedCrypto, ordenesActivas]);

  // Verificar órdenes pendientes (stop loss, take profit, límite)
  const verificarOrdenes = () => {
    setOrdenesActivas(prev => prev.filter(orden => {
      let ejecutada = false;
      const cryptoActual = criptomonedas.find(c => c.symbol === orden.crypto);
      if (!cryptoActual) return true;
      
      if (orden.tipo === 'limit') {
        if ((orden.operacion === 'comprar' && cryptoActual.precio <= orden.precio) ||
            (orden.operacion === 'vender' && cryptoActual.precio >= orden.precio)) {
          ejecutarOrdenAutomatica(orden);
          ejecutada = true;
        }
      } else if (orden.tipo === 'stop_loss') {
        // Evitar ejecución inmediata - esperar al menos 1 segundo después de crear la orden
        const tiempoEspera = 1000; // 1 segundo (más rápido para pruebas)
        const tiempoTranscurrido = Date.now() - (orden.fechaCreacion || 0);
        
        if (tiempoTranscurrido < tiempoEspera) {
          return true; // Mantener la orden sin ejecutar
        }
        
        // Tolerancia mínima para evitar ejecuciones por micro-fluctuaciones
        const tolerancia = cryptoActual.precio * 0.0001; // 0.01% de tolerancia (muy pequeña)
        
        // Para posiciones LONG: ejecutar cuando precio baje del stop loss
        // Para posiciones SHORT: ejecutar cuando precio suba del stop loss
        if (orden.tipoOperacion === 'long' && cryptoActual.precio <= (orden.precio - tolerancia)) {
          console.log(`Ejecutando SL LONG: precio actual ${cryptoActual.precio} <= SL ${orden.precio}`);
          ejecutarOrdenAutomatica({...orden, operacion: 'cerrar_posicion'});
          ejecutada = true;
        } else if (orden.tipoOperacion === 'short' && cryptoActual.precio >= (orden.precio + tolerancia)) {
          console.log(`Ejecutando SL SHORT: precio actual ${cryptoActual.precio} >= SL ${orden.precio}`);
          ejecutarOrdenAutomatica({...orden, operacion: 'cerrar_posicion'});
          ejecutada = true;
        }
      } else if (orden.tipo === 'take_profit') {
        // Evitar ejecución inmediata - esperar al menos 1 segundo después de crear la orden
        const tiempoEspera = 1000; // 1 segundo (más rápido para pruebas)
        const tiempoTranscurrido = Date.now() - (orden.fechaCreacion || 0);
        
        if (tiempoTranscurrido < tiempoEspera) {
          return true; // Mantener la orden sin ejecutar
        }
        
        // Tolerancia mínima para evitar ejecuciones por micro-fluctuaciones
        const tolerancia = cryptoActual.precio * 0.0001; // 0.01% de tolerancia (muy pequeña)
        
        // Para posiciones LONG: ejecutar cuando precio suba del take profit
        // Para posiciones SHORT: ejecutar cuando precio baje del take profit
        if (orden.tipoOperacion === 'long' && cryptoActual.precio >= (orden.precio + tolerancia)) {
          console.log(`Ejecutando TP LONG: precio actual ${cryptoActual.precio} >= TP ${orden.precio}`);
          ejecutarOrdenAutomatica({...orden, operacion: 'cerrar_posicion'});
          ejecutada = true;
        } else if (orden.tipoOperacion === 'short' && cryptoActual.precio <= (orden.precio - tolerancia)) {
          console.log(`Ejecutando TP SHORT: precio actual ${cryptoActual.precio} <= TP ${orden.precio}`);
          ejecutarOrdenAutomatica({...orden, operacion: 'cerrar_posicion'});
          ejecutada = true;
        }
      }
      
      return !ejecutada;
    }));
  };

  const ejecutarOrdenAutomatica = (orden) => {
    const crypto = criptomonedas.find(c => c.symbol === orden.crypto);
    
    // Si es una orden de cerrar posición (take profit o stop loss)
    if (orden.operacion === 'cerrar_posicion' && orden.posicionId) {
      const posicion = posicionesAbiertas.find(p => p.id === orden.posicionId);
      if (posicion) {
        const pnlFinal = posicion.pnl;
        setBalance(prev => prev + posicion.margen + pnlFinal);
        setPosicionesAbiertas(prev => prev.filter(p => p.id !== orden.posicionId));
        
        setHistorialTrades(prev => [...prev, {
          tipo: orden.tipo === 'take_profit' ? 'TAKE PROFIT' : 'STOP LOSS',
          crypto: orden.crypto,
          cantidad: orden.cantidad,
          precio: crypto.precio,
          timestamp: new Date().toLocaleTimeString(),
          pnl: pnlFinal,
          tipoOrden: orden.tipo
        }]);
        
        // Mostrar notificación de ejecución automática
        const tipoTexto = orden.tipo === 'take_profit' ? '✅ TAKE PROFIT EJECUTADO' : '🛑 STOP LOSS EJECUTADO';
        setTimeout(() => {
          alert(`${tipoTexto}!\n\n${orden.crypto}: $${crypto.precio.toFixed(2)}\nPnL: ${pnlFinal >= 0 ? '+' : ''}$${pnlFinal.toFixed(2)}`);
        }, 100);
      }
    } else if (orden.operacion === 'comprar') {
      const costo = crypto.precio * orden.cantidad;
      if (balance >= costo) {
        setBalance(prev => prev - costo);
        setPortfolio(prev => ({
          ...prev,
          [orden.crypto]: (prev[orden.crypto] || 0) + orden.cantidad
        }));
        
        setHistorialTrades(prev => [...prev, {
          tipo: 'COMPRA AUTOMÁTICA',
          crypto: orden.crypto,
          cantidad: orden.cantidad,
          precio: crypto.precio,
          timestamp: new Date().toLocaleTimeString(),
          tipoOrden: orden.tipo
        }]);
        
        // Notificación para órdenes límite
        if (orden.tipo === 'limit') {
          setTimeout(() => {
            alert(`📋 ORDEN LÍMITE EJECUTADA!\n\nCOMPRA ${orden.cantidad} ${orden.crypto} @ $${crypto.precio.toFixed(2)}`);
          }, 100);
        }
      }
    } else {
      const disponible = portfolio[orden.crypto] || 0;
      if (disponible >= orden.cantidad) {
        const ganancia = crypto.precio * orden.cantidad;
        setBalance(prev => prev + ganancia);
        setPortfolio(prev => ({
          ...prev,
          [orden.crypto]: disponible - orden.cantidad
        }));
        
        setHistorialTrades(prev => [...prev, {
          tipo: 'VENTA AUTOMÁTICA',
          crypto: orden.crypto,
          cantidad: orden.cantidad,
          precio: crypto.precio,
          timestamp: new Date().toLocaleTimeString(),
          tipoOrden: orden.tipo
        }]);
        
        // Notificación para órdenes límite de venta
        if (orden.tipo === 'limit') {
          setTimeout(() => {
            alert(`📋 ORDEN LÍMITE EJECUTADA!\n\nVENTA ${orden.cantidad} ${orden.crypto} @ $${crypto.precio.toFixed(2)}`);
          }, 100);
        }
      }
    }
  };

  // Finalizar juego después de 3 minutos
  useEffect(() => {
    if (tiempo >= 180) { // 180 segundos = 3 minutos
      setGameEnded(true);
      calcularRendimiento();
    }
  }, [tiempo]);

  const calcularRendimiento = () => {
    const valorPortfolio = Object.entries(portfolio).reduce((total, [symbol, cantidad]) => {
      const crypto = criptomonedas.find(c => c.symbol === symbol);
      return total + (crypto?.precio || 0) * (cantidad as number);
    }, 0);
    
    const valorTotal = balance + valorPortfolio + pnlTotal;
    const ganancia = valorTotal - 50000;
    const porcentaje = (ganancia / 50000) * 100;
    
    setRendimiento(porcentaje);
    onScore(Math.max(0, Math.round(porcentaje * 10)));
  };

  // Calcular PnL en tiempo real para posiciones apalancadas
  const calcularPnL = () => {
    let pnlTotalCalculado = 0;
    let margenUsadoCalculado = 0;
    
    const posicionesActualizadas = posicionesAbiertas.map(posicion => {
      const crypto = criptomonedas.find(c => c.symbol === posicion.symbol);
      const precioActual = crypto?.precio || 0;
      
      let pnlPosicion = 0;
      if (posicion.tipo === 'long') {
        pnlPosicion = (precioActual - posicion.precioEntrada) * posicion.cantidad;
      } else {
        pnlPosicion = (posicion.precioEntrada - precioActual) * posicion.cantidad;
      }
      
      pnlTotalCalculado += pnlPosicion;
      margenUsadoCalculado += posicion.margen;
      
      return { ...posicion, pnl: pnlPosicion, precioActual };
    });
    
    setPnlTotal(pnlTotalCalculado);
    setMargenUsado(margenUsadoCalculado);
    setPosicionesAbiertas(posicionesActualizadas);
    
    // Verificar liquidación
    posicionesActualizadas.forEach(posicion => {
      const precioLiquidacion = calcularPrecioLiquidacion(posicion);
      if (posicion.tipo === 'long' && posicion.precioActual <= precioLiquidacion) {
        liquidarPosicion(posicion.id);
      } else if (posicion.tipo === 'short' && posicion.precioActual >= precioLiquidacion) {
        liquidarPosicion(posicion.id);
      }
    });
  };

  // Calcular precio de liquidación
  const calcularPrecioLiquidacion = (posicion) => {
    // Margen de mantenimiento más permisivo para pruebas
    const margenMaintenance = 0.02; // 2% de margen de mantenimiento (antes era 5%)
    if (posicion.tipo === 'long') {
      return posicion.precioEntrada * (1 - (1 / posicion.apalancamiento) + margenMaintenance);
    } else {
      return posicion.precioEntrada * (1 + (1 / posicion.apalancamiento) - margenMaintenance);
    }
  };

  // Liquidar posición
  const liquidarPosicion = (posicionId) => {
    const posicion = posicionesAbiertas.find(p => p.id === posicionId);
    if (posicion) {
      setBalance(prev => prev - posicion.margen); // Pérdida del margen
      setPosicionesAbiertas(prev => prev.filter(p => p.id !== posicionId));
      
      setHistorialTrades(prev => [...prev, {
        id: Date.now(),
        tipo: 'LIQUIDACIÓN',
        crypto: posicion.symbol,
        cantidad: posicion.cantidad,
        precio: posicion.precioActual,
        timestamp: new Date().toLocaleTimeString(),
        pnl: -posicion.margen
      }]);
      
      // Notificación de liquidación
      setTimeout(() => {
        alert(`💥 LIQUIDACIÓN!\n\n${posicion.symbol} ${posicion.tipo.toUpperCase()} ${posicion.apalancamiento}x\nPrecio: $${posicion.precioActual.toFixed(2)}\nPérdida: -$${posicion.margen.toFixed(2)}`);
      }, 100);
    }
  };

  // Cerrar posición manualmente
  const cerrarPosicion = (posicionId) => {
    const posicion = posicionesAbiertas.find(p => p.id === posicionId);
    if (posicion) {
      // Devolver margen + PnL al balance
      setBalance(prev => prev + posicion.margen + posicion.pnl);
      setPosicionesAbiertas(prev => prev.filter(p => p.id !== posicionId));
      
      setHistorialTrades(prev => [...prev, {
        id: Date.now(),
        tipo: 'CIERRE MANUAL',
        crypto: posicion.symbol,
        cantidad: posicion.cantidad,
        precio: posicion.precioActual,
        timestamp: new Date().toLocaleTimeString(),
        pnl: posicion.pnl
      }]);
    }
  };

  const ejecutarTrade = () => {
    if (!cantidad || parseFloat(cantidad) <= 0) return;
    
    const crypto = criptomonedas.find(c => c.symbol === selectedCrypto);
    const cantidadNum = parseFloat(cantidad);
    
    if (tipoOrden === 'market') {
      // Si el apalancamiento es > 1, abrir posición apalancada
      if (apalancamiento > 1) {
        const margenRequerido = (crypto.precio * cantidadNum) / apalancamiento;
        
        if (balance >= margenRequerido) {
          const nuevaPosicion = {
            id: Date.now() + Math.random(),
            symbol: selectedCrypto,
            tipo: operacion === 'comprar' ? 'long' : 'short',
            cantidad: cantidadNum,
            precioEntrada: crypto.precio,
            apalancamiento: apalancamiento,
            margen: margenRequerido,
            pnl: 0,
            precioActual: crypto.precio,
            timestamp: new Date().toLocaleTimeString()
          };
          
          setBalance(prev => prev - margenRequerido);
          setPosicionesAbiertas(prev => [...prev, nuevaPosicion]);
          
          setHistorialTrades(prev => [...prev, {
            tipo: `${operacion.toUpperCase()} APALANCADA ${apalancamiento}x`,
            crypto: selectedCrypto,
            cantidad: cantidadNum,
            precio: crypto.precio,
            timestamp: new Date().toLocaleTimeString(),
            margen: margenRequerido
          }]);
          
          // Crear órdenes de take profit y stop loss si se especificaron (y no son 0)
          if (takeProfit && parseFloat(takeProfit) > 0) {
            const takeProfitPrice = parseFloat(takeProfit);
            
            // Validación básica: solo verificar que el TP tenga sentido para la dirección
            const esValidoTP = (operacion === 'comprar' && takeProfitPrice > crypto.precio) ||
                               (operacion === 'vender' && takeProfitPrice < crypto.precio);
            
            if (esValidoTP) {
              console.log(`Creando TP: ${operacion} - Precio actual: ${crypto.precio}, TP: ${takeProfitPrice}`);
              setOrdenesActivas(prev => [...prev, {
                id: Date.now() + Math.random(),
                tipo: 'take_profit',
                crypto: selectedCrypto,
                cantidad: cantidadNum,
                precio: takeProfitPrice,
                operacion: 'cerrar_posicion',
                posicionId: nuevaPosicion.id,
                tipoOperacion: operacion === 'comprar' ? 'long' : 'short',
                fechaCreacion: Date.now()
              }]);
            } else {
              alert(`❌ Take Profit inválido!\n\nPara operación ${operacion.toUpperCase()}:\n• TP debe ser ${operacion === 'comprar' ? 'MAYOR' : 'MENOR'} al precio actual\n• Precio actual: $${crypto.precio.toFixed(2)}\n• Tu TP: $${takeProfitPrice.toFixed(2)}`);
            }
          }
          
          if (stopLoss && parseFloat(stopLoss) > 0) {
            const stopLossPrice = parseFloat(stopLoss);
            
            // Validación básica: solo verificar que el SL tenga sentido para la dirección
            const esValidoSL = (operacion === 'comprar' && stopLossPrice < crypto.precio) ||
                               (operacion === 'vender' && stopLossPrice > crypto.precio);
            
            if (esValidoSL) {
              console.log(`Creando SL: ${operacion} - Precio actual: ${crypto.precio}, SL: ${stopLossPrice}`);
              setOrdenesActivas(prev => [...prev, {
                id: Date.now() + Math.random() + 1,
                tipo: 'stop_loss',
                crypto: selectedCrypto,
                cantidad: cantidadNum,
                precio: stopLossPrice,
                operacion: 'cerrar_posicion',
                posicionId: nuevaPosicion.id,
                tipoOperacion: operacion === 'comprar' ? 'long' : 'short',
                fechaCreacion: Date.now()
              }]);
            } else {
              alert(`❌ Stop Loss inválido!\n\nPara operación ${operacion.toUpperCase()}:\n• SL debe ser ${operacion === 'comprar' ? 'MENOR' : 'MAYOR'} al precio actual\n• Precio actual: $${crypto.precio.toFixed(2)}\n• Tu SL: $${stopLossPrice.toFixed(2)}`);
            }
          }
        } else {
          alert(`❌ Margen insuficiente!\n\nNecesitas: $${margenRequerido.toFixed(2)}\nTienes: $${balance.toFixed(2)}`);
        }
      } else {
        // Trading normal sin apalancamiento
        if (operacion === 'comprar') {
          const costo = crypto.precio * cantidadNum;
          if (balance >= costo) {
            setBalance(prev => prev - costo);
            setPortfolio(prev => ({
              ...prev,
              [selectedCrypto]: (prev[selectedCrypto] || 0) + cantidadNum
            }));
            
            setHistorialTrades(prev => [...prev, {
              tipo: 'COMPRA',
              crypto: selectedCrypto,
              cantidad: cantidadNum,
              precio: crypto.precio,
              timestamp: new Date().toLocaleTimeString(),
              pnl: 0, // Inicial, se actualizará al vender
              valorInicial: crypto.precio * cantidadNum
            }]);
          } else {
            alert(`❌ Balance insuficiente!\n\nNecesitas: $${costo.toFixed(2)}\nTienes: $${balance.toFixed(2)}`);
          }
        } else {
          const disponible = portfolio[selectedCrypto] || 0;
          if (disponible >= cantidadNum) {
            const ganancia = crypto.precio * cantidadNum;
            setBalance(prev => prev + ganancia);
            setPortfolio(prev => ({
              ...prev,
              [selectedCrypto]: disponible - cantidadNum
            }));
            
            // Calcular PnL basado en el precio promedio de compra
            const comprasAnteriores = historialTrades.filter(t => 
              t.tipo === 'COMPRA' && t.crypto === selectedCrypto
            );
            let precioPromedioCompra = 0;
            if (comprasAnteriores.length > 0) {
              const totalInvertido = comprasAnteriores.reduce((sum, t) => sum + (t.valorInicial || t.precio * t.cantidad), 0);
              const totalCantidad = comprasAnteriores.reduce((sum, t) => sum + t.cantidad, 0);
              precioPromedioCompra = totalInvertido / totalCantidad;
            }
            
            const pnlVenta = (crypto.precio - precioPromedioCompra) * cantidadNum;
            
            setHistorialTrades(prev => [...prev, {
              tipo: 'VENTA',
              crypto: selectedCrypto,
              cantidad: cantidadNum,
              precio: crypto.precio,
              timestamp: new Date().toLocaleTimeString(),
              pnl: pnlVenta,
              precioCompra: precioPromedioCompra
            }]);
          } else {
            alert(`❌ Cantidad insuficiente!\n\nQuieres vender: ${cantidadNum}\nTienes: ${disponible.toFixed(6)} ${selectedCrypto}`);
          }
        }
      }
    } else if (tipoOrden === 'limit') {
      // Orden límite (se ejecuta cuando el precio alcance el límite)
      if (!precioLimite || parseFloat(precioLimite) <= 0) return;
      
      setOrdenesActivas(prev => [...prev, {
        id: Date.now() + Math.random(),
        tipo: 'limit',
        crypto: selectedCrypto,
        cantidad: cantidadNum,
        precio: parseFloat(precioLimite),
        operacion: operacion
      }]);
    }
    
    // Limpiar formulario solo si la operación fue exitosa
    const limpiarCampos = () => {
      setCantidad('');
      setPrecioLimite('');
      setTakeProfit('');
      setStopLoss('');
      setShowOrderPanel(false);
    };
    
    // Determinar si limpiar campos basado en el éxito de la operación
    if (tipoOrden === 'market') {
      if (apalancamiento > 1) {
        const margenRequerido = (crypto.precio * cantidadNum) / apalancamiento;
        if (balance >= margenRequerido) {
          limpiarCampos();
          alert(`✅ Posición abierta exitosamente!\n\n${operacion.toUpperCase()} ${cantidadNum} ${selectedCrypto} con ${apalancamiento}x apalancamiento\nMargen usado: $${margenRequerido.toFixed(2)}`);
        }
      } else {
        if (operacion === 'comprar') {
          const costo = crypto.precio * cantidadNum;
          if (balance >= costo) {
            limpiarCampos();
            alert(`✅ Compra exitosa!\n\n${cantidadNum} ${selectedCrypto} @ $${crypto.precio.toFixed(2)}\nTotal: $${costo.toFixed(2)}`);
          }
        } else {
          const disponible = portfolio[selectedCrypto] || 0;
          if (disponible >= cantidadNum) {
            limpiarCampos();
            const pnlVenta = (crypto.precio - (historialTrades.filter(t => t.tipo === 'COMPRA' && t.crypto === selectedCrypto).reduce((sum, t) => sum + (t.valorInicial || t.precio * t.cantidad), 0) / historialTrades.filter(t => t.tipo === 'COMPRA' && t.crypto === selectedCrypto).reduce((sum, t) => sum + t.cantidad, 0) || crypto.precio)) * cantidadNum;
            alert(`✅ Venta exitosa!\n\n${cantidadNum} ${selectedCrypto} @ $${crypto.precio.toFixed(2)}\nPnL: ${pnlVenta >= 0 ? '+' : ''}$${pnlVenta.toFixed(2)}`);
          }
        }
      }
    } else if (tipoOrden === 'limit') {
      // Para órdenes límite, siempre limpiar ya que se agregan a la lista
      limpiarCampos();
      alert(`✅ Orden límite creada!\n\n${operacion.toUpperCase()} ${cantidadNum} ${selectedCrypto} @ $${parseFloat(precioLimite).toFixed(2)}\nSe ejecutará cuando el precio alcance este nivel.`);
    }
  };

  const cancelarOrden = (ordenId) => {
    setOrdenesActivas(prev => prev.filter(orden => orden.id !== ordenId));
  };

  // Actualizar datos del gráfico cuando cambie la criptomoneda seleccionada
  useEffect(() => {
    if (gameStarted) {
      const cryptoActual = criptomonedas.find(c => c.symbol === selectedCrypto);
      setDatosGrafico([{
        tiempo: new Date().toLocaleTimeString(),
        precio: cryptoActual?.precio || 0,
        timestamp: Date.now()
      }]);
    }
  }, [selectedCrypto, gameStarted]);

  if (gameEnded) {
    return (
      <div style={{textAlign: 'center', color: '#D4AF37'}}>
        <h2 style={{color: '#D4AF37', marginBottom: '1rem'}}>¡Juego Terminado!</h2>
        <div style={{background: '#18181b', padding: '2rem', borderRadius: '12px', marginBottom: '2rem'}}>
          <h3 style={{color: rendimiento >= 0 ? '#10B981' : '#EF4444', fontSize: '2rem', marginBottom: '1rem'}}>
            {rendimiento >= 0 ? '+' : ''}{rendimiento.toFixed(2)}%
          </h3>
          <p style={{color: '#E0E0E0', fontSize: '1.2rem'}}>
            {rendimiento >= 0 ? 'Excelente trabajo!' : 'Sigue practicando!'}
          </p>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '1rem'}}>
            <div>
              <p style={{color: '#D4AF37', fontWeight: 'bold'}}>Balance Final</p>
              <p style={{color: '#E0E0E0'}}>${balance.toFixed(2)}</p>
            </div>
            <div>
              <p style={{color: '#D4AF37', fontWeight: 'bold'}}>Trades Realizados</p>
              <p style={{color: '#E0E0E0'}}>{historialTrades.length}</p>
            </div>
            <div>
              <p style={{color: '#D4AF37', fontWeight: 'bold'}}>Órdenes Ejecutadas</p>
              <p style={{color: '#E0E0E0'}}>{historialTrades.filter(t => t.tipoOrden).length}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '0.8rem 2rem',
            background: 'linear-gradient(45deg, #D4AF37, #2563EB)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Jugar de Nuevo
        </button>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div style={{textAlign: 'center', color: '#D4AF37'}}>
        <h2 style={{color: '#D4AF37', marginBottom: '1rem'}}>Simulador de Trading Avanzado</h2>
        <p style={{color: '#E0E0E0', marginBottom: '2rem', fontSize: '1.1rem'}}>
          Tienes $10,000 USD para invertir. Usa gráficos, órdenes límite, take profit y stop loss para maximizar tus ganancias.
        </p>
        <div style={{background: '#18181b', padding: '2rem', borderRadius: '12px', marginBottom: '2rem'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1rem'}}>Nuevas Funcionalidades:</h3>
          <ul style={{color: '#E0E0E0', textAlign: 'left', fontSize: '1rem'}}>
            <li>📈 Gráfico de precios en tiempo real</li>
            <li>🎯 Órdenes límite, Take Profit y Stop Loss</li>
            <li>⚡ Ejecución automática de órdenes</li>
            <li>📊 Panel de órdenes activas</li>
            <li>🕐 Duración: 3 minutos</li>
            <li>💰 Capital inicial: $10,000 USD</li>
          </ul>
        </div>
        <button 
          onClick={() => setGameStarted(true)} 
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(45deg, #D4AF37, #2563EB)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Comenzar Trading
        </button>
      </div>
    );
  }

  const cryptoActual = criptomonedas.find(c => c.symbol === selectedCrypto);

  return (
    <div style={{color: '#E0E0E0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <h2 style={{color: '#D4AF37'}}>Trading Simulator Pro</h2>
        <div style={{color: '#2563EB', fontWeight: 'bold', fontSize: '1.2rem'}}>
          Tiempo: {Math.floor((180 - tiempo) / 60)}:{String((180 - tiempo) % 60).padStart(2, '0')}
        </div>
      </div>
      
      {/* Gráfico de Precios */}
      <div style={{background: '#18181b', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3 style={{color: '#D4AF37'}}>
            {cryptoActual?.name} ({cryptoActual?.symbol}) - ${cryptoActual?.precio.toFixed(2)}
          </h3>
          <div style={{color: cryptoActual?.cambio24h >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold'}}>
            {cryptoActual?.cambio24h >= 0 ? '+' : ''}{cryptoActual?.cambio24h.toFixed(2)}%
          </div>
        </div>
        
        {/* Leyenda del gráfico */}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#D4AF37'}}></div>
            <span>Precio</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#10B981', borderTop: '2px dashed #10B981'}}></div>
            <span>Entrada LONG</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#EF4444', borderTop: '2px dashed #EF4444'}}></div>
            <span>Entrada SHORT</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#00FF00', borderTop: '1px dashed #00FF00'}}></div>
            <span>Take Profit</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#FF0000', borderTop: '1px dashed #FF0000'}}></div>
            <span>Stop Loss</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#FF4444', borderTop: '1px dotted #FF4444'}}></div>
            <span>Liquidación</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#2563EB', borderTop: '1px dashed #2563EB'}}></div>
            <span>Orden Límite</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            <div style={{width: '16px', height: '2px', background: '#FFFFFF', borderTop: '1px dashed #FFFFFF'}}></div>
            <span>Precio Actual</span>
          </div>
        </div>
        <div style={{height: '300px', width: '100%'}}>
          <ResponsiveContainer>
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="tiempo" 
                stroke="#888"
                tick={{fontSize: 12}}
              />
              <YAxis 
                stroke="#888"
                tick={{fontSize: 12}}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #D4AF37',
                  borderRadius: '6px',
                  color: '#E0E0E0'
                }}
                formatter={(value) => [`$${(value as number).toFixed(2)}`, 'Precio']}
              />
              <Line 
                type="monotone" 
                dataKey="precio" 
                stroke="#D4AF37" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#D4AF37' }}
              />
              
              {/* Líneas de precio de entrada para posiciones abiertas */}
              {posicionesAbiertas.filter(p => p.symbol === selectedCrypto).map(posicion => (
                <ReferenceLine
                  key={`entrada-${posicion.id}`}
                  y={posicion.precioEntrada}
                  stroke={posicion.tipo === 'long' ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  label={{
                    value: `${posicion.tipo.toUpperCase()} ${posicion.apalancamiento}x`,
                    position: 'insideTopRight',
                    style: {
                      fill: posicion.tipo === 'long' ? '#10B981' : '#EF4444',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }
                  }}
                />
              ))}
              
              {/* Líneas de Take Profit para órdenes activas */}
              {ordenesActivas.filter(orden => orden.crypto === selectedCrypto && orden.tipo === 'take_profit').map(orden => (
                <ReferenceLine
                  key={`tp-${orden.id}`}
                  y={orden.precio}
                  stroke="#00FF00"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                  label={{
                    value: `TP $${orden.precio.toFixed(2)}`,
                    position: 'insideTopRight',
                    style: {
                      fill: '#00FF00',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }
                  }}
                />
              ))}
              
              {/* Líneas de Stop Loss para órdenes activas */}
              {ordenesActivas.filter(orden => orden.crypto === selectedCrypto && orden.tipo === 'stop_loss').map(orden => (
                <ReferenceLine
                  key={`sl-${orden.id}`}
                  y={orden.precio}
                  stroke="#FF0000"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                  label={{
                    value: `SL $${orden.precio.toFixed(2)}`,
                    position: 'insideBottomRight',
                    style: {
                      fill: '#FF0000',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }
                  }}
                />
              ))}
              
              {/* Líneas de precio de liquidación para posiciones abiertas */}
              {posicionesAbiertas.filter(p => p.symbol === selectedCrypto).map(posicion => {
                const precioLiquidacion = calcularPrecioLiquidacion(posicion);
                return (
                  <ReferenceLine
                    key={`liquidacion-${posicion.id}`}
                    y={precioLiquidacion}
                    stroke="#FF4444"
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    label={{
                      value: `LIQ $${precioLiquidacion.toFixed(2)}`,
                      position: 'insideBottomLeft',
                      style: {
                        fill: '#FF4444',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                );
              })}
              
              {/* Líneas de órdenes límite pendientes */}
              {ordenesActivas.filter(orden => orden.crypto === selectedCrypto && orden.tipo === 'limit').map(orden => (
                <ReferenceLine
                  key={`limit-${orden.id}`}
                  y={orden.precio}
                  stroke="#2563EB"
                  strokeWidth={1}
                  strokeDasharray="6 3"
                  label={{
                    value: `${orden.operacion.toUpperCase()} $${orden.precio.toFixed(2)}`,
                    position: 'insideTopLeft',
                    style: {
                      fill: '#2563EB',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }
                  }}
                />
              ))}
              
              {/* Línea de precio actual */}
              {(() => {
                const cryptoActual = criptomonedas.find(c => c.symbol === selectedCrypto);
                if (cryptoActual) {
                  return (
                    <ReferenceLine
                      key="precio-actual"
                      y={cryptoActual.precio}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      strokeDasharray="1 1"
                      label={{
                        value: `PRECIO ACTUAL: $${cryptoActual.precio.toFixed(2)}`,
                        position: 'insideTopLeft',
                        style: {
                          fill: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }
                      }}
                    />
                  );
                }
                return null;
              })()}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
        {/* Panel de Balance y Rendimiento */}
        <div style={{background: '#18181b', padding: '1.5rem', borderRadius: '12px'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1rem'}}>Balance y Rendimiento</h3>
          
          <div style={{marginBottom: '1rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Capital Inicial:</span>
              <span style={{color: '#888'}}>$50,000.00</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Balance Actual:</span>
              <span style={{color: '#10B981', fontWeight: 'bold'}}>
                ${balance.toFixed(2)}
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Valor Portfolio:</span>
              <span style={{color: '#D4AF37'}}>
                ${Object.entries(portfolio).reduce((total, [symbol, cantidad]) => {
                  const crypto = criptomonedas.find(c => c.symbol === symbol);
                  return total + (crypto?.precio || 0) * (cantidad as number);
                }, 0).toFixed(2)}
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>PnL Posiciones:</span>
              <span style={{color: pnlTotal >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold'}}>
                ${pnlTotal.toFixed(2)}
              </span>
            </div>
            <hr style={{border: '1px solid #333', margin: '0.5rem 0'}} />
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span style={{fontWeight: 'bold'}}>Valor Total:</span>
              <span style={{color: '#D4AF37', fontWeight: 'bold', fontSize: '1.1rem'}}>
                ${(() => {
                  const valorPortfolio = Object.entries(portfolio).reduce((total, [symbol, cantidad]) => {
                    const crypto = criptomonedas.find(c => c.symbol === symbol);
                    return total + (crypto?.precio || 0) * (cantidad as number);
                  }, 0);
                  return (balance + valorPortfolio + pnlTotal).toFixed(2);
                })()}
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span style={{fontWeight: 'bold'}}>Ganancia/Pérdida:</span>
              <span style={{
                color: (() => {
                  const valorPortfolio = Object.entries(portfolio).reduce((total, [symbol, cantidad]) => {
                    const crypto = criptomonedas.find(c => c.symbol === symbol);
                    return total + (crypto?.precio || 0) * (cantidad as number);
                  }, 0);
                  const ganancia = (balance + valorPortfolio + pnlTotal) - 50000;
                  return ganancia >= 0 ? '#10B981' : '#EF4444';
                })(),
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                {(() => {
                  const valorPortfolio = Object.entries(portfolio).reduce((total, [symbol, cantidad]) => {
                    const crypto = criptomonedas.find(c => c.symbol === symbol);
                    return total + (crypto?.precio || 0) * (cantidad as number);
                  }, 0);
                  const ganancia = (balance + valorPortfolio + pnlTotal) - 50000;
                  const porcentaje = (ganancia / 50000) * 100;
                  return `${ganancia >= 0 ? '+' : ''}$${ganancia.toFixed(2)} (${porcentaje.toFixed(2)}%)`;
                })()}
              </span>
            </div>
          </div>
          
          <div style={{fontSize: '0.9rem'}}>
            <h4 style={{color: '#D4AF37', marginBottom: '0.5rem'}}>Portfolio:</h4>
            {Object.entries(portfolio).map(([symbol, cantidad]) => (
              <div key={symbol} style={{display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem'}}>
                <span>{symbol}:</span>
                <span>{(cantidad as number).toFixed(6)}</span>
              </div>
            ))}
            {Object.keys(portfolio).length === 0 && (
              <p style={{color: '#888', fontSize: '0.8rem'}}>No tienes criptomonedas</p>
            )}
          </div>
        </div>

        {/* Panel de PnL y Posiciones */}
        <div style={{background: '#18181b', padding: '1.5rem', borderRadius: '12px'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1rem'}}>PnL y Posiciones</h3>
          <div style={{marginBottom: '1rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>PnL Total:</span>
              <span style={{color: pnlTotal >= 0 ? '#10B981' : '#EF4444', fontWeight: 'bold'}}>
                ${pnlTotal.toFixed(2)}
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Margen Usado:</span>
              <span style={{color: '#D4AF37'}}>${margenUsado.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span>Margen Libre:</span>
              <span style={{color: '#10B981'}}>${(balance - margenUsado).toFixed(2)}</span>
            </div>
          </div>
          
          <div style={{maxHeight: '200px', overflowY: 'auto'}}>
            <h4 style={{color: '#D4AF37', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Posiciones Abiertas:</h4>
            {posicionesAbiertas.length === 0 ? (
              <p style={{color: '#888', fontSize: '0.8rem'}}>No tienes posiciones abiertas</p>
            ) : (
              posicionesAbiertas.map(posicion => (
                <div key={posicion.id} style={{
                  background: '#0A0A0A',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  border: `1px solid ${posicion.tipo === 'long' ? '#10B981' : '#EF4444'}`
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}>
                    <span>{posicion.symbol} {posicion.tipo.toUpperCase()} {posicion.apalancamiento}x</span>
                    <span style={{color: posicion.pnl >= 0 ? '#10B981' : '#EF4444'}}>
                      ${posicion.pnl.toFixed(2)}
                    </span>
                  </div>
                                     <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#888'}}>
                     <div>
                       <div>Entrada: ${posicion.precioEntrada.toFixed(2)}</div>
                       <div>Liquidación: ${calcularPrecioLiquidacion(posicion).toFixed(2)}</div>
                     </div>
                     <button
                       onClick={() => cerrarPosicion(posicion.id)}
                       style={{
                         padding: '0.2rem 0.4rem',
                         background: '#EF4444',
                         color: '#fff',
                         border: 'none',
                         borderRadius: '4px',
                         cursor: 'pointer',
                         fontSize: '0.7rem'
                       }}
                     >
                       Cerrar
                     </button>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel de Trading */}
        <div style={{background: '#18181b', padding: '1.5rem', borderRadius: '12px'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1rem'}}>Panel de Trading</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
            <select 
              value={selectedCrypto} 
              onChange={(e) => setSelectedCrypto(e.target.value)}
              style={{padding: '0.5rem', background: '#0A0A0A', color: '#E0E0E0', border: '1px solid #333', borderRadius: '6px'}}
            >
              {criptomonedas.map(crypto => {
                const posicionesEnCrypto = posicionesAbiertas.filter(p => p.symbol === crypto.symbol);
                const ordenesEnCrypto = ordenesActivas.filter(o => o.crypto === crypto.symbol);
                const indicators = [];
                if (posicionesEnCrypto.length > 0) {
                  indicators.push(`📈${posicionesEnCrypto.length}`);
                }
                if (ordenesEnCrypto.length > 0) {
                  indicators.push(`📋${ordenesEnCrypto.length}`);
                }
                
                return (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol}) {indicators.length > 0 ? ` [${indicators.join(' ')}]` : ''}
                  </option>
                );
              })}
            </select>
            
            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button 
                onClick={() => setOperacion('comprar')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  background: operacion === 'comprar' ? '#10B981' : '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Comprar
              </button>
              <button 
                onClick={() => setOperacion('vender')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  background: operacion === 'vender' ? '#EF4444' : '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Vender
              </button>
            </div>

            <div style={{display: 'flex', gap: '0.5rem'}}>
              <button 
                onClick={() => setTipoOrden('market')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  background: tipoOrden === 'market' ? '#2563EB' : '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Mercado
              </button>
              <button 
                onClick={() => setTipoOrden('limit')}
                style={{
                  flex: 1,
                  padding: '0.4rem',
                  background: tipoOrden === 'limit' ? '#2563EB' : '#374151',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Límite
              </button>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              <label style={{color: '#D4AF37', fontSize: '0.9rem'}}>Apalancamiento:</label>
              <select 
                value={apalancamiento} 
                onChange={(e) => setApalancamiento(parseInt(e.target.value))}
                style={{padding: '0.5rem', background: '#0A0A0A', color: '#E0E0E0', border: '1px solid #333', borderRadius: '6px'}}
              >
                <option value={1}>1x (Sin apalancamiento)</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
                <option value={10}>10x</option>
                <option value={20}>20x</option>
              </select>
              
              {apalancamiento > 1 && cantidad && (
                <div style={{fontSize: '0.7rem', color: '#888', marginTop: '0.2rem'}}>
                  💡 Margen requerido: ${((parseFloat(cantidad) || 0) * (criptomonedas.find(c => c.symbol === selectedCrypto)?.precio || 0) / apalancamiento).toFixed(2)}
                  <br />
                  📊 Exposición total: ${((parseFloat(cantidad) || 0) * (criptomonedas.find(c => c.symbol === selectedCrypto)?.precio || 0)).toFixed(2)}
                </div>
              )}
            </div>
            
            <input 
              type="number" 
              value={cantidad} 
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Cantidad"
              style={{padding: '0.5rem', background: '#0A0A0A', color: '#E0E0E0', border: '1px solid #333', borderRadius: '6px'}}
            />

            {tipoOrden === 'limit' && (
              <input 
                type="number" 
                value={precioLimite} 
                onChange={(e) => setPrecioLimite(e.target.value)}
                placeholder="Precio límite"
                style={{padding: '0.5rem', background: '#0A0A0A', color: '#E0E0E0', border: '1px solid #333', borderRadius: '6px'}}
              />
            )}

            <button 
              onClick={() => setShowOrderPanel(!showOrderPanel)}
              style={{
                padding: '0.5rem',
                background: '#6B7280',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {showOrderPanel ? 'Ocultar' : 'Mostrar'} TP/SL
            </button>

            {showOrderPanel && (
              <>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.2rem'}}>
                  <input 
                    type="number" 
                    value={takeProfit} 
                    onChange={(e) => setTakeProfit(e.target.value)}
                                          placeholder="Take Profit ($ o 0 = sin TP)"
                    style={{
                      padding: '0.5rem', 
                      background: '#0A0A0A', 
                      color: '#E0E0E0', 
                      border: (() => {
                        if (!takeProfit) return '1px solid #10B981';
                        const tp = parseFloat(takeProfit);
                        const crypto = criptomonedas.find(c => c.symbol === selectedCrypto);
                        const esValido = (operacion === 'comprar' && tp > (crypto?.precio || 0)) || 
                                        (operacion === 'vender' && tp < (crypto?.precio || 0));
                        return esValido ? '1px solid #10B981' : '1px solid #EF4444';
                      })(),
                      borderRadius: '6px'
                    }}
                  />
                  {takeProfit && (() => {
                    const tp = parseFloat(takeProfit);
                    const crypto = criptomonedas.find(c => c.symbol === selectedCrypto);
                    const margenSeguridad = (crypto?.precio || 0) * 0.01;
                    const esValido = (operacion === 'comprar' && tp > (crypto?.precio || 0) + margenSeguridad) || 
                                    (operacion === 'vender' && tp < (crypto?.precio || 0) - margenSeguridad);
                    if (!esValido) {
                      const minMaxValue = operacion === 'comprar' ? 
                        ((crypto?.precio || 0) + margenSeguridad).toFixed(2) : 
                        ((crypto?.precio || 0) - margenSeguridad).toFixed(2);
                      return (
                        <span style={{color: '#EF4444', fontSize: '0.7rem'}}>
                          {operacion === 'comprar' ? 
                            `⚠️ TP debe ser > $${minMaxValue} (precio + 1%)` : 
                            `⚠️ TP debe ser < $${minMaxValue} (precio - 1%)`
                          }
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.2rem'}}>
                  <input 
                    type="number" 
                    value={stopLoss} 
                    onChange={(e) => setStopLoss(e.target.value)}
                                          placeholder="Stop Loss ($ o 0 = sin SL)"
                    style={{
                      padding: '0.5rem', 
                      background: '#0A0A0A', 
                      color: '#E0E0E0', 
                      border: (() => {
                        if (!stopLoss) return '1px solid #EF4444';
                        const sl = parseFloat(stopLoss);
                        const crypto = criptomonedas.find(c => c.symbol === selectedCrypto);
                        const esValido = (operacion === 'comprar' && sl < (crypto?.precio || 0)) || 
                                        (operacion === 'vender' && sl > (crypto?.precio || 0));
                        return esValido ? '1px solid #10B981' : '1px solid #EF4444';
                      })(),
                      borderRadius: '6px'
                    }}
                  />
                  {stopLoss && (() => {
                    const sl = parseFloat(stopLoss);
                    const crypto = criptomonedas.find(c => c.symbol === selectedCrypto);
                    const margenSeguridad = (crypto?.precio || 0) * 0.01;
                    const esValido = (operacion === 'comprar' && sl < (crypto?.precio || 0) - margenSeguridad) || 
                                    (operacion === 'vender' && sl > (crypto?.precio || 0) + margenSeguridad);
                    if (!esValido) {
                      const minMaxValue = operacion === 'comprar' ? 
                        ((crypto?.precio || 0) - margenSeguridad).toFixed(2) : 
                        ((crypto?.precio || 0) + margenSeguridad).toFixed(2);
                      return (
                        <span style={{color: '#EF4444', fontSize: '0.7rem'}}>
                          {operacion === 'comprar' ? 
                            `⚠️ SL debe ser < $${minMaxValue} (precio - 1%)` : 
                            `⚠️ SL debe ser > $${minMaxValue} (precio + 1%)`
                          }
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
                
                <div style={{fontSize: '0.7rem', color: '#888', marginTop: '0.2rem'}}>
                  💡 Precio actual: ${criptomonedas.find(c => c.symbol === selectedCrypto)?.precio.toFixed(2)}
                  <br />
                  📊 {operacion === 'comprar' ? 'LONG' : 'SHORT'}: TP {operacion === 'comprar' ? '>' : '<'} precio+1%, SL {operacion === 'comprar' ? '<' : '>'} precio-1%
                  <br />
                  ⏱️ Las órdenes TP/SL se activarán después de 3 segundos para evitar ejecuciones inmediatas
                </div>
              </>
            )}
            
            <button 
              onClick={ejecutarTrade}
              style={{
                padding: '0.8rem',
                background: 'linear-gradient(45deg, #D4AF37, #2563EB)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {tipoOrden === 'market' ? 'Ejecutar' : 'Crear Orden'}
            </button>
          </div>
        </div>

        {/* Panel de Órdenes Activas */}
        <div style={{background: '#18181b', padding: '1.5rem', borderRadius: '12px'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1rem'}}>Órdenes Activas</h3>
          <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            {ordenesActivas.length === 0 ? (
              <p style={{color: '#888', fontSize: '0.9rem'}}>No hay órdenes activas</p>
            ) : (
              ordenesActivas.map(orden => (
                <div key={orden.id} style={{
                  background: '#0A0A0A',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  border: `1px solid ${orden.tipo === 'take_profit' ? '#10B981' : orden.tipo === 'stop_loss' ? '#EF4444' : '#2563EB'}`
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: '0.8rem', color: '#D4AF37', fontWeight: 'bold'}}>
                        {orden.tipo.toUpperCase().replace('_', ' ')}
                      </div>
                      <div style={{fontSize: '0.7rem', color: '#E0E0E0'}}>
                        {orden.operacion.toUpperCase()} {orden.cantidad} {orden.crypto} @ ${orden.precio}
                      </div>
                    </div>
                    <button 
                      onClick={() => cancelarOrden(orden.id)}
                      style={{
                        background: '#EF4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Precios */}
      <div style={{background: '#18181b', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem'}}>
        <h3 style={{color: '#D4AF37', marginBottom: '1rem'}}>Mercado</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
          <div>Moneda</div>
          <div>Precio</div>
          <div>Cambio 24h</div>
          <div>Acción</div>
        </div>
        {criptomonedas.map(crypto => (
          <div key={crypto.symbol} style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #333', alignItems: 'center'}}>
            <div>{crypto.name} ({crypto.symbol})</div>
            <div>${crypto.precio.toFixed(2)}</div>
            <div style={{color: crypto.cambio24h >= 0 ? '#10B981' : '#EF4444'}}>
              {crypto.cambio24h >= 0 ? '+' : ''}{crypto.cambio24h.toFixed(2)}%
            </div>
            <button 
              onClick={() => setSelectedCrypto(crypto.symbol)}
              style={{
                padding: '0.3rem 0.8rem',
                background: selectedCrypto === crypto.symbol ? '#D4AF37' : '#2563EB',
                color: selectedCrypto === crypto.symbol ? '#0A0A0A' : '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {selectedCrypto === crypto.symbol ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>

      {/* Historial de Trades */}
      {historialTrades.length > 0 && (
        <div style={{background: '#18181b', padding: '1.5rem', borderRadius: '12px'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1rem'}}>Historial de Trades</h3>
          <div style={{maxHeight: '200px', overflowY: 'auto'}}>
            {historialTrades.slice(-15).reverse().map((trade, index) => (
              <div key={index} style={{
                padding: '0.8rem', 
                borderBottom: '1px solid #333', 
                fontSize: '0.9rem',
                background: trade.pnl ? (trade.pnl > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'transparent',
                borderRadius: '6px',
                marginBottom: '0.5rem'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <span style={{color: trade.tipo.includes('COMPRA') || trade.tipo.includes('LONG') ? '#10B981' : '#EF4444', fontWeight: 'bold'}}>
                      {trade.tipo}
                    </span>
                    {trade.tipoOrden && (
                      <span style={{color: '#D4AF37', fontSize: '0.8rem', marginLeft: '0.5rem'}}>
                        ({trade.tipoOrden.replace('_', ' ').toUpperCase()})
                      </span>
                    )}
                    <br />
                    <span style={{color: '#E0E0E0', fontSize: '0.8rem'}}>
                      {trade.cantidad} {trade.crypto} @ ${trade.precio.toFixed(2)}
                    </span>
                    {trade.margen && (
                      <span style={{color: '#D4AF37', fontSize: '0.7rem', marginLeft: '0.5rem'}}>
                        (Margen: ${trade.margen.toFixed(2)})
                      </span>
                    )}
                  </div>
                  <div style={{textAlign: 'right'}}>
                    {trade.pnl !== undefined && (
                      <div style={{
                        color: trade.pnl >= 0 ? '#10B981' : '#EF4444', 
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {trade.pnl >= 0 ? '✅ +' : '❌ '}${Math.abs(trade.pnl).toFixed(2)}
                      </div>
                    )}
                    <div style={{color: '#888', fontSize: '0.7rem'}}>
                      {trade.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
    setPuntaje(p => p + score);
    // Aquí deberías guardar el puntaje en el backend
  };

  if (!id || !juegosInfo[id as keyof typeof juegosInfo]) {
    return <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#ff4444'}}>Juego no encontrado</div>;
  }

  if (id !== 'trading') {
    return <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#ff4444'}}>Juego no disponible</div>;
  }

  return (
    <div className="juego-individual-page" style={{minHeight:'100vh', background:'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #D4AF37 100%)', padding:'2rem 0'}}>
      <div style={{maxWidth:1400, margin:'0 auto', background:'rgba(26,26,26,0.85)', borderRadius:20, boxShadow:'0 4px 24px #1E3A8A33', padding:'2.5rem 2rem'}}>
        <h1 style={{color:'#D4AF37', fontFamily:'Orbitron', fontSize:'2.2rem', marginBottom:18}}>{juegosInfo[id as keyof typeof juegosInfo].nombre}</h1>
        
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:16}}>
          <div style={{color:'#2563EB', fontWeight:700, fontSize:'1.2rem'}}>
            Tu mejor puntuación: <span style={{color:'#D4AF37'}}>{puntaje}</span>
          </div>
          <div style={{color:'#D4AF37', fontWeight:700, fontSize:'1.2rem'}}>Ranking Global</div>
        </div>
        
        <div style={{marginBottom:32}}>
          <div style={{background:'#101014', borderRadius:12, padding:'1rem 2rem', color:'#fff', fontSize:'1.1rem'}}>
            <h3 style={{color:'#D4AF37', marginBottom:'1rem'}}>Top Traders</h3>
            {ranking.map((r, i) => (
              <div key={r.wallet} style={{
                display:'flex', 
                justifyContent:'space-between', 
                alignItems:'center',
                marginBottom:8, 
                padding:'0.5rem',
                background: i < 3 ? 'rgba(212,175,55,0.1)' : 'transparent',
                borderRadius:'6px'
              }}>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                  <span style={{
                    color: i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#fff',
                    fontWeight:'bold'
                  }}>
                    #{i+1}
                  </span>
                  <span>{r.wallet}</span>
                </div>
                <div style={{display:'flex', gap:'1rem'}}>
                  <span style={{color:'#10B981'}}>+{r.ganancias}%</span>
                  <span style={{color:'#D4AF37'}}>{r.trades} trades</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Información educativa sobre el margen */}
        <div style={{background:'#18181b', borderRadius:16, padding:'1.5rem', marginBottom:'2rem', color:'#fff'}}>
          <h3 style={{color:'#D4AF37', marginBottom:'1rem'}}>💡 ¿Cómo funciona el Margen?</h3>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'1rem'}}>
            <div style={{background:'#0A0A0A', padding:'1rem', borderRadius:'8px', border:'1px solid #333'}}>
              <h4 style={{color:'#10B981', marginBottom:'0.5rem'}}>📊 Cálculo del Margen</h4>
              <p style={{fontSize:'0.9rem', color:'#E0E0E0'}}>
                <strong>Margen = (Precio × Cantidad) ÷ Apalancamiento</strong>
                <br />
                <span style={{color:'#888'}}>
                  Ejemplo: $50,000 con 10x = $5,000 margen
                </span>
              </p>
            </div>
            <div style={{background:'#0A0A0A', padding:'1rem', borderRadius:'8px', border:'1px solid #333'}}>
              <h4 style={{color:'#EF4444', marginBottom:'0.5rem'}}>⚠️ Precio de Liquidación</h4>
              <p style={{fontSize:'0.9rem', color:'#E0E0E0'}}>
                Si el precio se mueve demasiado en contra de tu posición (aproximadamente 90% del margen), serás liquidado.
              </p>
            </div>
            <div style={{background:'#0A0A0A', padding:'1rem', borderRadius:'8px', border:'1px solid #333'}}>
              <h4 style={{color:'#D4AF37', marginBottom:'0.5rem'}}>🚀 PnL en Tiempo Real</h4>
              <p style={{fontSize:'0.9rem', color:'#E0E0E0'}}>
                Tus ganancias/pérdidas se calculan automáticamente. Las líneas punteadas en el gráfico muestran tus precios de liquidación.
              </p>
            </div>
            <div style={{background:'#0A0A0A', padding:'1rem', borderRadius:'8px', border:'1px solid #333'}}>
              <h4 style={{color:'#10B981', marginBottom:'0.5rem'}}>✅ Take Profit y Stop Loss</h4>
              <p style={{fontSize:'0.9rem', color:'#E0E0E0'}}>
                <strong>Sin límites de distancia</strong> - Puedes configurar TP y SL a cualquier precio que desees.
                <br />
                <span style={{color:'#888'}}>
                  Solo verifica la dirección: LONG → TP mayor, SL menor al precio actual
                  <br />
                  Valor 0 = Sin TP/SL configurado
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Renderizar el simulador de trading */}
        <div style={{background:'#18181b', borderRadius:16, padding:'2rem', minHeight:600, color:'#fff'}}>
          <TradingSimulator onScore={handleScore} />
        </div>
      </div>
    </div>
  );
};

export default JuegoIndividual; 