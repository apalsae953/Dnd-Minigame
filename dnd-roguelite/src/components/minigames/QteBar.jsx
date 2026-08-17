// ============================================================
//  QteBar.jsx — Minijuego de Parada y Golpe Crítico
//  Tipografía Inter Clara · Zona Verde y Bonos de Armas
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { Swords, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function QteBar({
  titulo = '¡Momento Decisivo!',
  descripcion = 'Pulsa el botón o pulsa ESPACIO cuando la aguja entre en la zona verde.',
  velocidad = 2.4, // Mayor velocidad
  zonaVerde = [42, 58], // Rango base estrecho
  zonaVerdeExtra = false,
  bonoArmaZona = 0,
  onResultado,
}) {
  const [posicion, setPosicion] = useState(0);
  const [activo, setActivo] = useState(true);
  const [resultado, setResultado] = useState(null);
  const animRef = useRef(null);
  const direccionRef = useRef(1);
  const posRef = useRef(0);

  // Bonos de zona verde
  const expansion = (zonaVerdeExtra ? 6 : 0) + bonoArmaZona;
  const zv0 = zonaVerde[0];
  const zv1 = zonaVerde[1];
  const zvFinal0 = Math.max(8, zv0 - expansion);
  const zvFinal1 = Math.min(92, zv1 + expansion);

  // Zona amarilla de acierto parcial
  const ya0 = Math.max(0, zvFinal0 - 10);
  const ya3 = Math.min(100, zvFinal1 + 10);

  useEffect(() => {
    let ultimoTiempo = performance.now();

    const loop = (tiempoActual) => {
      const delta = (tiempoActual - ultimoTiempo) / 1000;
      ultimoTiempo = tiempoActual;

      if (activo) {
        posRef.current += direccionRef.current * velocidad * delta * 70;

        if (posRef.current >= 100) {
          posRef.current = 100;
          direccionRef.current = -1;
        } else if (posRef.current <= 0) {
          posRef.current = 0;
          direccionRef.current = 1;
        }

        setPosicion(posRef.current);
        animRef.current = requestAnimationFrame(loop);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [activo, velocidad]);

  const pulsar = useCallback(() => {
    if (!activo) return;
    setActivo(false);
    cancelAnimationFrame(animRef.current);

    const p = posRef.current;
    let res = 'fallo';

    if (p >= zvFinal0 && p <= zvFinal1) {
      res = 'critico';
    } else if (p >= ya0 && p <= ya3) {
      res = 'acierto';
    } else {
      res = 'fallo';
    }

    setResultado(res);
    setTimeout(() => onResultado?.(res), 1400);
  }, [activo, zvFinal0, zvFinal1, ya0, ya3, onResultado]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        pulsar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pulsar]);

  const resultadoCfg = {
    critico: { texto: '¡GOLPE CRÍTICO PERFECTO!', color: '#2ecc71', bg: 'rgba(39,174,96,.18)', borde: '#2ecc71' },
    acierto: { texto: 'ÉXITO PARCIAL', color: '#f39c12', bg: 'rgba(243,156,18,.15)', borde: '#f39c12' },
    fallo:   { texto: '¡FALLO! RECIBES EL CONTRAGOLPE', color: '#e74c3c', bg: 'rgba(231,76,60,.18)', borde: '#e74c3c' },
  };

  return (
    <div className="animate-pop-in" style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>

      {/* Cabecera */}
      <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', marginBottom: '.25rem' }}>
          <Swords size={20} color="#e74c3c" />
          <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.25rem', color: '#f0c96f', fontWeight: 700 }}>
            {titulo}
          </h3>
        </div>
        {descripcion && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.9rem', color: '#f3f4f6' }}>
            {descripcion}
          </p>
        )}
      </div>

      {/* Leyenda de zonas */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '.78rem', marginBottom: '.6rem', fontFamily: "'Inter', sans-serif" }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: '#e74c3c' }}>
          <span style={{ width: 10, height: 10, background: 'rgba(231,76,60,.6)', borderRadius: 2, display: 'inline-block' }} />
          Fallo
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: '#f39c12' }}>
          <span style={{ width: 10, height: 10, background: 'rgba(243,156,18,.5)', borderRadius: 2, display: 'inline-block' }} />
          Parcial
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: '#2ecc71' }}>
          <span style={{ width: 10, height: 10, background: 'rgba(46,204,113,.7)', borderRadius: 2, display: 'inline-block' }} />
          ¡Crítico ({Math.round(zvFinal1 - zvFinal0)}%)!
        </span>
      </div>

      {/* Barra de impacto */}
      <div style={{
        position: 'relative', height: 56,
        background: '#0a0a10',
        border: '2px solid rgba(201,168,76,.45)',
        borderRadius: 10, overflow: 'hidden',
        marginBottom: '.85rem',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,.8)',
      }}>
        {/* Rojo izq */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${ya0}%`, background: 'rgba(231,76,60,.55)' }} />
        {/* Amarillo izq */}
        <div style={{ position: 'absolute', left: `${ya0}%`, top: 0, bottom: 0, width: `${zvFinal0 - ya0}%`, background: 'rgba(243,156,18,.45)' }} />
        {/* Verde crítico */}
        <div style={{
          position: 'absolute', left: `${zvFinal0}%`, top: 0, bottom: 0,
          width: `${zvFinal1 - zvFinal0}%`,
          background: 'linear-gradient(to bottom, #2ecc71, #27ae60)',
          boxShadow: '0 0 15px rgba(46,204,113,.7), inset 0 0 8px #ffffff',
        }} />
        {/* Amarillo der */}
        <div style={{ position: 'absolute', left: `${zvFinal1}%`, top: 0, bottom: 0, width: `${ya3 - zvFinal1}%`, background: 'rgba(243,156,18,.45)' }} />
        {/* Rojo der */}
        <div style={{ position: 'absolute', left: `${ya3}%`, top: 0, bottom: 0, right: 0, background: 'rgba(231,76,60,.55)' }} />

        {/* Aguja móvil */}
        <div style={{
          position: 'absolute',
          left: `${posicion}%`,
          top: 0, bottom: 0,
          width: 6,
          marginLeft: -3,
          background: '#ffffff',
          boxShadow: '0 0 12px #ffffff, 0 0 25px #f0c96f',
          zIndex: 10,
          transition: activo ? 'none' : 'transform .1s ease',
        }}>
          <div style={{
            position: 'absolute', top: -4, left: -4, right: -4, height: 8,
            background: '#f0c96f', borderRadius: '50%',
          }} />
        </div>
      </div>

      {/* Botón de parada */}
      {activo ? (
        <button
          className="btn-gold"
          style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
          onClick={pulsar}
        >
          <Zap size={18} style={{ display: 'inline', marginRight: 6 }} />
          ¡GOLPEAR AHORA! [Espacio]
        </button>
      ) : resultado ? (
        <div style={{
          background: resultadoCfg[resultado].bg,
          border: `1px solid ${resultadoCfg[resultado].borde}`,
          borderRadius: 8, padding: '.85rem', textAlign: 'center',
          fontFamily: "'Cinzel',serif", fontSize: '1.05rem', fontWeight: 800,
          color: resultadoCfg[resultado].color,
        }}>
          {resultadoCfg[resultado].texto}
        </div>
      ) : null}
    </div>
  );
}
