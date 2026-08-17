// ============================================================
//  HallOfFame.jsx — Salón de la Fama y Registro Histórico
//  Tipografía Inter Clara · Persistencia en localStorage
// ============================================================
import { useState, useEffect } from 'react';
import {
  Trophy, Skull, Star, Coins, Crown,
  Calendar, Shield, X, Trash2, RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'dnd_roguelite_hall_of_fame';

export function registrarEnHallOfFame(heroe, epilogo) {
  try {
    const registroActual = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const nuevaEntrada = {
      id: Date.now(),
      nombre: heroe.nombre,
      claseNombre: heroe.claseNombre,
      nivel: heroe.atributos?.nivel || 1,
      oro: heroe.atributos?.oro || 0,
      karma: heroe.atributos?.karma || 0,
      misionesCompletadas: heroe.misionesCompletadas || 0,
      misionFinal: !!heroe.misionFinalCompletada,
      causaMuerte: heroe.causaMuerte,
      tituloEpilogo: epilogo?.titulo || 'El Errante del Camino',
      colorTitulo: epilogo?.colorTitulo || '#f0c96f',
      fecha: new Date().toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
    };
    registroActual.unshift(nuevaEntrada);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registroActual.slice(0, 25)));
  } catch (err) {
    console.error('Error guardando en Hall of Fame:', err);
  }
}

export default function HallOfFame({ isOpen, onClose }) {
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setPartidas(guardadas);
      } catch (err) {
        setPartidas([]);
      }
    }
  }, [isOpen]);

  const limpiarHistorial = () => {
    if (window.confirm('¿Seguro que deseas borrar el registro de leyendas?')) {
      localStorage.removeItem(STORAGE_KEY);
      setPartidas([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 160,
      background: 'rgba(5,5,10,.88)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div
        className="glass-panel animate-pop-in"
        style={{
          width: '100%', maxWidth: 740, maxHeight: '85vh', overflowY: 'auto',
          padding: '1.75rem', border: '1px solid rgba(201,168,76,.4)',
          boxShadow: '0 0 70px rgba(0,0,0,.9)',
        }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
            <Trophy size={26} color="#f0c96f" />
            <div>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.35rem', color: '#f0c96f', fontWeight: 700 }}>
                Salón de las Leyendas
              </h2>
              <p style={{ fontSize: '.82rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
                Registro histórico de aventureros de la Marca Oscura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: '#f0c96f',
              cursor: 'pointer', padding: '.4rem',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Lista de partidas */}
        {partidas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
            <Crown size={38} style={{ margin: '0 auto .75rem', color: '#f0c96f', opacity: .6 }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Aún no hay crónicas grabadas en piedra.</p>
            <p style={{ fontSize: '.85rem', marginTop: '.3rem', color: 'rgba(244,233,208,.6)' }}>Completa tu primera expedición o cae en batalla para inscribir tu nombre.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '1.25rem' }}>
            {partidas.map(p => (
              <div
                key={p.id}
                style={{
                  background: 'rgba(18,18,24,.85)', border: `1px solid ${p.colorTitulo}55`,
                  borderRadius: 10, padding: '1rem', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
                    <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1rem', color: '#f3f4f6', fontWeight: 700 }}>
                      {p.nombre}
                    </span>
                    <span style={{ fontSize: '.8rem', color: '#f0c96f', fontFamily: "'Inter', sans-serif" }}>
                      ({p.claseNombre} · Nivel {p.nivel})
                    </span>
                  </div>

                  <div style={{
                    fontFamily: "'Cinzel',serif", fontSize: '.9rem',
                    color: p.colorTitulo, fontWeight: 700, marginBottom: '.3rem',
                  }}>
                    {p.tituloEpilogo}
                  </div>

                  <div style={{ display: 'flex', gap: '.85rem', fontSize: '.75rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
                    <span><Coins size={12} style={{ display: 'inline', marginRight: 3, color: '#f0c96f' }} /> {p.oro} oro</span>
                    <span><Star size={12} style={{ display: 'inline', marginRight: 3, color: '#2ecc71' }} /> {p.karma >= 0 ? '+' : ''}{p.karma} karma</span>
                    <span><Shield size={12} style={{ display: 'inline', marginRight: 3, color: '#3498db' }} /> {p.misionesCompletadas} misiones</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '.7rem', fontFamily: "'Cinzel',serif", fontWeight: 700, padding: '.2rem .65rem',
                    borderRadius: 12, display: 'inline-block', marginBottom: '.3rem',
                    background: p.causaMuerte ? 'rgba(231,76,60,.18)' : 'rgba(46,204,113,.18)',
                    border: `1px solid ${p.causaMuerte ? '#e74c3c' : '#2ecc71'}`,
                    color: p.causaMuerte ? '#e74c3c' : '#2ecc71',
                  }}>
                    {p.causaMuerte ? 'Caído en batalla' : p.misionFinal ? '👑 Salvador' : 'Sobreviviente'}
                  </span>
                  <div style={{ fontSize: '.72rem', color: 'rgba(244,233,208,.6)', fontFamily: "'Inter', sans-serif" }}>
                    <Calendar size={11} style={{ display: 'inline', marginRight: 3 }} /> {p.fecha}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botones de pie */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.6rem', borderTop: '1px solid rgba(201,168,76,.15)' }}>
          {partidas.length > 0 && (
            <button
              onClick={limpiarHistorial}
              style={{
                background: 'none', border: 'none', color: '#e74c3c',
                fontSize: '.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
              }}
            >
              <Trash2 size={14} /> Borrar registro
            </button>
          )}
          <button
            className="btn-gold"
            style={{ padding: '.55rem 1.4rem', fontSize: '.88rem', marginLeft: 'auto' }}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
