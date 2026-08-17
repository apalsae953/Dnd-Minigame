// ============================================================
//  MemoryRunes.jsx — Minijuego de Memoria de Runas Arcanas
//  Tipografía Inter Clara · Temporizador Estricto de 10s (8 Cartas)
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Timer, CheckCircle2, XCircle } from 'lucide-react';

const RUNAS_BASE = [
  { id: 'fuego',  simbolo: 'ᚠ', nombre: 'Fehu (Fuego)',  color: '#e74c3c' },
  { id: 'agua',   simbolo: 'ᛚ', nombre: 'Laguz (Agua)',  color: '#3498db' },
  { id: 'trueno', simbolo: 'ᚦ', nombre: 'Thurisaz (Rayo)', color: '#f1c40f' },
  { id: 'muerte', simbolo: 'ᛞ', nombre: 'Dagaz (Luz)',   color: '#9b59b6' },
];

export default function MemoryRunes({
  titulo = 'Descifrar Sello Rúnico',
  descripcion = 'Empareja las 4 parejas de runas antes de que el sello colapse (10s).',
  tiempoLimite = 10,
  tiempoBonus = 0,
  onResultado, // ( 'exito' | 'fallo' ) => void
}) {
  const tiempoTotal = tiempoLimite + tiempoBonus;
  const [segundos, setSegundos] = useState(tiempoTotal);
  const [cartas, setCartas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [acertadas, setAcertadas] = useState([]);
  const [activo, setActivo] = useState(true);
  const [resultado, setResultado] = useState(null);

  // Inicializar cartas (8 cartas = 4 pares barajados)
  useEffect(() => {
    const baraja = [...RUNAS_BASE, ...RUNAS_BASE]
      .map((runa, index) => ({
        uuid: `${runa.id}_${index}`,
        ...runa,
      }))
      .sort(() => Math.random() - 0.5);

    setCartas(baraja);
    setSegundos(tiempoTotal);
    setActivo(true);
    setResultado(null);
  }, [tiempoTotal]);

  // Temporizador estricto
  useEffect(() => {
    if (!activo || segundos <= 0) return;

    const timer = setInterval(() => {
      setSegundos(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setActivo(false);
          setResultado('fallo');
          setTimeout(() => onResultado?.('fallo'), 1400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activo, segundos, onResultado]);

  const seleccionarCarta = (carta) => {
    if (!activo) return;
    if (seleccionadas.some(c => c.uuid === carta.uuid)) return;
    if (acertadas.includes(carta.id)) return;
    if (seleccionadas.length >= 2) return;

    const nuevas = [...seleccionadas, carta];
    setSeleccionadas(nuevas);

    if (nuevas.length === 2) {
      const [c1, c2] = nuevas;
      if (c1.id === c2.id) {
        const nuevosAciertos = [...acertadas, c1.id];
        setAcertadas(nuevosAciertos);
        setSeleccionadas([]);

        // Victoria si completa las 4 parejas
        if (nuevosAciertos.length === RUNAS_BASE.length) {
          setActivo(false);
          setResultado('exito');
          setTimeout(() => onResultado?.('exito'), 1400);
        }
      } else {
        setTimeout(() => setSeleccionadas([]), 650);
      }
    }
  };

  return (
    <div className="animate-pop-in" style={{ width: '100%', maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>

      {/* Cabecera */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem', marginBottom: '.25rem' }}>
          <Sparkles size={22} color="#9b59b6" />
          <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.25rem', color: '#f0c96f', fontWeight: 700 }}>
            {titulo}
          </h3>
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.9rem', color: '#f3f4f6' }}>
          {descripcion}
        </p>
      </div>

      {/* Temporizador de cuenta atrás */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.5rem', marginBottom: '1.25rem', fontFamily: "'Inter', sans-serif" }}>
        <Timer size={18} color={segundos <= 3 ? '#e74c3c' : '#f0c96f'} />
        <span style={{
          fontFamily: "'Cinzel',serif", fontSize: '1.25rem', fontWeight: 800,
          color: segundos <= 3 ? '#e74c3c' : '#f0c96f',
        }}>
          {segundos}s restantes
        </span>
      </div>

      {/* Cuadrícula de 8 cartas de runas (4x2) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.65rem', marginBottom: '1.25rem' }}>
        {cartas.map(c => {
          const revelada = seleccionadas.some(s => s.uuid === c.uuid) || acertadas.includes(c.id);

          return (
            <div
              key={c.uuid}
              onClick={() => seleccionarCarta(c)}
              style={{
                aspectRatio: '1', borderRadius: 10, cursor: activo && !revelada ? 'pointer' : 'default',
                background: revelada ? 'rgba(0,0,0,.6)' : 'linear-gradient(145deg, #1f1f2a, #14141e)',
                border: `2px solid ${revelada ? c.color : 'rgba(201,168,76,.35)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: revelada ? `0 0 15px ${c.color}66` : 'none',
                transform: revelada ? 'scale(1.03)' : 'none',
                transition: 'all .25s ease',
              }}
            >
              {revelada ? (
                <span style={{ fontSize: '2rem', color: c.color, fontFamily: 'serif', fontWeight: 900 }}>
                  {c.simbolo}
                </span>
              ) : (
                <span style={{ fontSize: '1.2rem', color: 'rgba(201,168,76,.4)' }}>
                  ✦
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensaje de resultado */}
      {resultado === 'exito' && (
        <div style={{
          background: 'rgba(39,174,96,.18)', border: '1px solid #2ecc71',
          borderRadius: 8, padding: '.85rem', color: '#2ecc71',
          fontFamily: "'Cinzel',serif", fontSize: '1.1rem', fontWeight: 800,
        }}>
          <CheckCircle2 size={20} style={{ display: 'inline', marginRight: 6 }} />
          ¡SELLO ARCANO DESCIFRADO!
        </div>
      )}

      {resultado === 'fallo' && (
        <div style={{
          background: 'rgba(231,76,60,.18)', border: '1px solid #e74c3c',
          borderRadius: 8, padding: '.85rem', color: '#e74c3c',
          fontFamily: "'Cinzel',serif", fontSize: '1.1rem', fontWeight: 800,
        }}>
          <XCircle size={20} style={{ display: 'inline', marginRight: 6 }} />
          ¡COLAPSO DEL SELLO! TIEMPO AGOTADO
        </div>
      )}
    </div>
  );
}
