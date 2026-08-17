// ============================================================
//  EpilogueScreen.jsx — Pantalla de Fin de Partida
//  Crónica Narrativa con Inter Limpia · Título de Leyenda en Cinzel
// ============================================================
import { useState, useEffect, useRef } from 'react';
import {
  Crown, Shield, Coffee, CloudLightning, Compass,
  Sparkles, Star, Coins, Heart, Map, RotateCcw,
  Scroll, Skull, CheckCircle, Trophy,
} from 'lucide-react';
import { obtenerEpilogo } from '../data/gameData';
import { registrarEnHallOfFame } from './HallOfFame';

const ICON_MAP = { Crown, Shield, Coffee, CloudLightning, Compass, Sparkles, Star, Skull, CheckCircle };
function EpiIcon({ name, size = 56, color }) {
  const Comp = ICON_MAP[name] || Star;
  return <Comp size={size} color={color} />;
}

function StatFinal({ icono: Icon, color, label, valor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)',
      borderRadius: 8, padding: '.75rem 1rem',
      display: 'flex', alignItems: 'center', gap: '.6rem',
    }}>
      <Icon size={18} color={color} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '.72rem', color: '#f3f4f6', marginBottom: '.1rem', fontFamily: "'Inter', sans-serif" }}>{label}</div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.95rem', color: '#f3f4f6', fontWeight: 700 }}>{valor}</div>
      </div>
    </div>
  );
}

function TextoAnimado({ texto, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span style={{ ...style, opacity: visible ? 1 : 0, transition: 'opacity .8s ease' }}>
      {texto}
    </span>
  );
}

export default function EpilogueScreen({ heroe, onReiniciar, onVerHallOfFame }) {
  const epilogo = obtenerEpilogo(heroe);
  const cronica = epilogo.cronica(heroe);
  const registradoRef = useRef(false);

  useEffect(() => {
    if (!registradoRef.current && heroe) {
      registradoRef.current = true;
      registrarEnHallOfFame(heroe, epilogo);
    }
  }, [heroe, epilogo]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundColor: '#0d0d11',
    }}>
      <div
        className="animate-pop-in"
        style={{
          width: '100%', maxWidth: 660,
          background: 'linear-gradient(150deg, #14141c, #1a1a24)',
          border: '1px solid rgba(201,168,76,.4)',
          borderRadius: 20, padding: '2.5rem 2rem',
          boxShadow: '0 0 80px rgba(0,0,0,.9)',
          textAlign: 'center',
        }}
      >
        {/* Icono del epílogo */}
        <div style={{ marginBottom: '1rem' }} className="animate-float">
          <EpiIcon name={epilogo.icono} size={56} color={epilogo.colorTitulo} />
        </div>

        {/* Título de Leyenda */}
        <h1 style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 'clamp(1.5rem,4vw,2.2rem)',
          color: epilogo.colorTitulo,
          textShadow: `0 0 20px ${epilogo.colorTitulo}88`,
          fontWeight: 800, lineHeight: 1.2, marginBottom: '.4rem',
        }}>
          <TextoAnimado texto={epilogo.titulo} delay={200} />
        </h1>

        {/* Subtítulo */}
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', color: '#f3f4f6', marginBottom: '1rem', fontWeight: 500 }}>
          <TextoAnimado texto={epilogo.subtitulo} delay={600} />
        </p>

        {/* Nombre del héroe */}
        <div style={{
          fontFamily: "'Cinzel',serif", fontSize: '.85rem',
          color: '#f0c96f', letterSpacing: '.2em',
          textTransform: 'uppercase', marginBottom: '.6rem', fontWeight: 700,
        }}>
          <TextoAnimado texto={`— ${heroe.nombre}, ${heroe.claseNombre} —`} delay={800} />
        </div>

        <div className="rune-divider" style={{ margin: '.75rem 0' }}>
          <Scroll size={14} />
        </div>

        {/* Crónica narrativa limpia con Inter */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '1rem', lineHeight: 1.8,
          color: '#f3f4f6', textAlign: 'left',
          background: 'rgba(0,0,0,.35)', borderRadius: 10, padding: '1.25rem',
          marginBottom: '1.5rem',
          borderLeft: `4px solid ${epilogo.colorTitulo}`,
        }}>
          <TextoAnimado texto={cronica} delay={1000} />
        </div>

        <div className="rune-divider" style={{ margin: '.75rem 0' }}>
          <Crown size={14} />
        </div>

        {/* Estadísticas finales */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <StatFinal icono={Heart}    color="#e74c3c" label="HP Final"             valor={`${Math.max(0, heroe.atributos.hp)} / ${heroe.atributos.maxHp}`} />
          <StatFinal icono={Coins}    color="#f0c96f" label="Oro Acumulado"         valor={`${heroe.atributos.oro} ⬡`} />
          <StatFinal icono={Star}     color="#2ecc71" label="Karma"                 valor={`${heroe.atributos.karma >= 0 ? '+' : ''}${heroe.atributos.karma}`} />
          <StatFinal icono={Map}      color="#9b59b6" label="Misiones Cumplidas"    valor={heroe.misionesCompletadas || 0} />
          <StatFinal icono={Sparkles} color="#3498db" label="Nivel Final"           valor={`Nivel ${heroe.atributos.nivel}`} />
          <StatFinal icono={Skull}    color="#7f8c8d" label="Desenlace"             valor={heroe.causaMuerte ? 'Caído en batalla' : heroe.misionFinalCompletada ? '👑 Salvador Supremo' : 'Aventura Concluida'} />
        </div>

        {/* Rango final */}
        <div style={{
          background: `${epilogo.colorTitulo}15`,
          border: `1px solid ${epilogo.colorTitulo}45`,
          borderRadius: 10, padding: '1rem', marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '.75rem', fontFamily: "'Cinzel',serif", letterSpacing: '.12em', textTransform: 'uppercase', color: '#f0c96f', marginBottom: '.25rem', fontWeight: 700 }}>
            Rango de Leyenda
          </div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.25rem', color: epilogo.colorTitulo, fontWeight: 800 }}>
            {epilogo.titulo}
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <button
            className="btn-gold"
            style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem' }}
            onClick={onReiniciar}
          >
            <RotateCcw size={18} style={{ display: 'inline', marginRight: 8 }} />
            Comenzar Nueva Partida
          </button>

          {onVerHallOfFame && (
            <button
              onClick={onVerHallOfFame}
              style={{
                width: '100%', padding: '.85rem', background: 'rgba(52,152,219,.15)',
                border: '1px solid rgba(52,152,219,.4)', color: '#3498db',
                borderRadius: 8, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '.9rem', fontWeight: 600,
              }}
            >
              <Trophy size={16} style={{ display: 'inline', marginRight: 6 }} />
              Ver Salón de Leyendas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
