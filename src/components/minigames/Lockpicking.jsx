// ============================================================
//  Lockpicking.jsx — Minijuego de Ganzúa de Precisión Radial
//  Tipografía Inter Clara · Aguja Giratoria y Rotura de Ganzúas
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

export default function Lockpicking({
  titulo = 'Forzar Cerrojo Antiguo',
  descripcion = 'Presiona el botón cuando la aguja giratoria pase por el perno verde.',
  velocidad = 2.5,
  bonoDestreza = 0,
  ganzuasMax = 3,
  onResultado, // ( 'exito' | 'fallo' ) => void
}) {
  const [angulo, setAngulo] = useState(0);
  const [ganzuasRestantes, setGanzuasRestantes] = useState(ganzuasMax);
  const [activo, setActivo] = useState(true);
  const [resultado, setResultado] = useState(null);

  // Zona de acierto en grados (0 a 360)
  const [zonaAcierto] = useState(() => {
    const centro = Math.floor(Math.random() * 260) + 50; // Entre 50 y 310 grados
    const tamano = 38 + bonoDestreza * 4; // Ampliable con destreza
    return {
      inicio: Math.max(10, centro - tamano / 2),
      fin: Math.min(350, centro + tamano / 2),
    };
  });

  const animRef = useRef(null);
  const anguloRef = useRef(0);

  useEffect(() => {
    let ultimoTiempo = performance.now();

    const loop = (tiempoActual) => {
      const delta = (tiempoActual - ultimoTiempo) / 1000;
      ultimoTiempo = tiempoActual;

      if (activo) {
        anguloRef.current = (anguloRef.current + velocidad * delta * 120) % 360;
        setAngulo(anguloRef.current);
        animRef.current = requestAnimationFrame(loop);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [activo, velocidad]);

  const intentarForzar = useCallback(() => {
    if (!activo) return;

    const actual = anguloRef.current;
    const acerto = actual >= zonaAcierto.inicio && actual <= zonaAcierto.fin;

    if (acerto) {
      setActivo(false);
      setResultado('exito');
      cancelAnimationFrame(animRef.current);
      setTimeout(() => onResultado?.('exito'), 1400);
    } else {
      const nuevasGanzuas = ganzuasRestantes - 1;
      setGanzuasRestantes(nuevasGanzuas);

      if (nuevasGanzuas <= 0) {
        setActivo(false);
        setResultado('fallo');
        cancelAnimationFrame(animRef.current);
        setTimeout(() => onResultado?.('fallo'), 1400);
      }
    }
  }, [activo, zonaAcierto, ganzuasRestantes, onResultado]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        intentarForzar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [intentarForzar]);

  return (
    <div className="animate-pop-in" style={{ width: '100%', maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>

      {/* Cabecera */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', marginBottom: '.25rem' }}>
          <KeyRound size={22} color="#f0c96f" />
          <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.25rem', color: '#f0c96f', fontWeight: 700 }}>
            {titulo}
          </h3>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.9rem', color: '#f3f4f6' }}>
          {descripcion}
        </p>
      </div>

      {/* Ganzúas restantes */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.6rem', marginBottom: '1.25rem', fontFamily: "'Inter', sans-serif" }}>
        <span style={{ fontSize: '.82rem', color: '#f3f4f6', fontWeight: 600 }}>Ganzúas de hierro:</span>
        <div style={{ display: 'flex', gap: '.3rem' }}>
          {Array.from({ length: ganzuasMax }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 14, height: 26, borderRadius: 3,
                background: i < ganzuasRestantes ? 'linear-gradient(to top, #c9a84c, #f0c96f)' : 'rgba(255,255,255,.15)',
                border: '1px solid rgba(0,0,0,.5)',
                transform: i >= ganzuasRestantes ? 'rotate(45deg)' : 'none',
                opacity: i < ganzuasRestantes ? 1 : 0.35,
                transition: 'all .3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Mecanismo Radial de la Cerradura */}
      <div style={{
        position: 'relative', width: 220, height: 220, margin: '0 auto 1.5rem',
        borderRadius: '50%', background: '#121218',
        border: '4px solid #7a5e1e',
        boxShadow: '0 0 30px rgba(0,0,0,.8), inset 0 0 20px rgba(0,0,0,.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Perno Verde (Zona de acierto radial) */}
        <div style={{
          position: 'absolute', inset: 12, borderRadius: '50%',
          background: `conic-gradient(from 0deg, transparent 0deg, transparent ${zonaAcierto.inicio}deg, #2ecc71 ${zonaAcierto.inicio}deg, #27ae60 ${zonaAcierto.fin}deg, transparent ${zonaAcierto.fin}deg, transparent 360deg)`,
          opacity: 0.75,
        }} />

        {/* Círculo interior del bombín */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, #252530 0%, #101015 100%)',
          border: '2px solid rgba(201,168,76,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0,0,0,.7)',
          zIndex: 5,
        }}>
          <KeyRound size={32} color={resultado === 'exito' ? '#2ecc71' : resultado === 'fallo' ? '#e74c3c' : '#f0c96f'} />
        </div>

        {/* Aguja Ganzúa Giratoria */}
        <div style={{
          position: 'absolute', width: '100%', height: '100%',
          transform: `rotate(${angulo}deg)`,
          pointerEvents: 'none', zIndex: 10,
        }}>
          <div style={{
            position: 'absolute', top: 6, left: '50%',
            transform: 'translateX(-50%)',
            width: 4, height: 95,
            background: 'linear-gradient(to top, #ffffff, #f0c96f)',
            borderRadius: 2,
            boxShadow: '0 0 10px #ffffff, 0 0 20px #f0c96f',
          }} />
        </div>
      </div>

      {/* Botón de acción o resultado */}
      {activo ? (
        <button
          className="btn-gold"
          style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
          onClick={intentarForzar}
        >
          ¡FORZAR PERNO! [Espacio]
        </button>
      ) : resultado === 'exito' ? (
        <div style={{
          background: 'rgba(39,174,96,.18)', border: '1px solid #2ecc71',
          borderRadius: 8, padding: '.85rem', color: '#2ecc71',
          fontFamily: "'Cinzel',serif", fontSize: '1.1rem', fontWeight: 800,
        }}>
          <CheckCircle2 size={20} style={{ display: 'inline', marginRight: 6 }} />
          ¡CERROJO ABIERTO CON ÉXITO!
        </div>
      ) : (
        <div style={{
          background: 'rgba(231,76,60,.18)', border: '1px solid #e74c3c',
          borderRadius: 8, padding: '.85rem', color: '#e74c3c',
          fontFamily: "'Cinzel',serif", fontSize: '1.1rem', fontWeight: 800,
        }}>
          <XCircle size={20} style={{ display: 'inline', marginRight: 6 }} />
          ¡GANZÚAS ROTAS! TRAMPA ACTIVADA
        </div>
      )}
    </div>
  );
}
