// ============================================================
//  DiceModal.jsx — Componente Visual de Tirada d20
//  Animación interactiva de rodado con modificadores y comparación DC
// ============================================================
import { useState, useEffect } from 'react';
import {
  Dice5, Sparkles, CheckCircle2, XCircle,
  Trophy, ShieldAlert, ArrowRight,
} from 'lucide-react';

export default function DiceModal({
  statNombre = 'Fuerza',
  modificador = 0,
  bonoExtra = 0,
  dc = 12,
  tituloPrueba = 'Prueba de Habilidad',
  onFinalizar, // ({ exito, total, natural, critico, pifia }) => void
}) {
  const [rodando, setRodando] = useState(true);
  const [numeroAnimado, setNumeroAnimado] = useState(10);
  const [resultadoFinal, setResultadoFinal] = useState(null);

  useEffect(() => {
    // Generamos el valor final de d20
    const tiradaReal = Math.floor(Math.random() * 20) + 1;
    const totalCalc = tiradaReal + modificador + bonoExtra;
    const esCritico = tiradaReal === 20;
    const esPifia = tiradaReal === 1;
    const esExito = esCritico ? true : esPifia ? false : totalCalc >= dc;

    // Intervalo de números aleatorios para la animación de 1 segundo
    let count = 0;
    const interval = setInterval(() => {
      setNumeroAnimado(Math.floor(Math.random() * 20) + 1);
      count += 1;
      if (count > 10) {
        clearInterval(interval);
        setNumeroAnimado(tiradaReal);
        setResultadoFinal({
          natural: tiradaReal,
          total: totalCalc,
          exito: esExito,
          critico: esCritico,
          pifia: esPifia,
        });
        setRodando(false);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [modificador, bonoExtra, dc]);

  const handleContinuar = () => {
    if (resultadoFinal && onFinalizar) {
      onFinalizar(resultadoFinal);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 180,
      background: 'rgba(5,5,10,.88)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div
        className="glass-panel animate-pop-in"
        style={{
          width: '100%', maxWidth: 460, padding: '2rem',
          textAlign: 'center', border: '1px solid rgba(201,168,76,.4)',
          boxShadow: '0 0 70px rgba(0,0,0,.9)',
        }}
      >
        {/* Título de la prueba */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: 'rgba(201,168,76,.6)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
            Prueba de {statNombre} (DC {dc})
          </span>
          <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.3rem', color: '#f0c96f', fontWeight: 700, marginTop: '.25rem' }}>
            {tituloPrueba}
          </h3>
        </div>

        {/* Dado d20 gigante interactivo */}
        <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Fondo resplandeciente */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: rodando
              ? 'radial-gradient(circle, rgba(201,168,76,.25) 0%, transparent 70%)'
              : resultadoFinal?.exito
              ? 'radial-gradient(circle, rgba(39,174,96,.35) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(231,76,60,.35) 0%, transparent 70%)',
            transition: 'background .4s ease',
          }} />

          {/* D20 animado */}
          <div
            className={rodando ? 'animate-dice-roll' : 'animate-pop-in'}
            style={{
              width: 100, height: 100, borderRadius: 20,
              background: rodando
                ? 'linear-gradient(145deg, #2a2215, #14120e)'
                : resultadoFinal?.critico
                ? 'linear-gradient(145deg, #7d5a15, #b8860b)'
                : resultadoFinal?.exito
                ? 'linear-gradient(145deg, #1e4620, #0d280f)'
                : 'linear-gradient(145deg, #4d1815, #240a08)',
              border: `2px solid ${rodando ? '#c9a84c' : resultadoFinal?.exito ? '#2ecc71' : '#e74c3c'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: rodando ? '0 0 25px rgba(201,168,76,.4)' : resultadoFinal?.exito ? '0 0 30px rgba(46,204,113,.5)' : '0 0 30px rgba(231,76,60,.5)',
              transition: 'all .4s ease',
            }}
          >
            <span style={{ fontSize: '.7rem', fontFamily: "'Cinzel',serif", color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>
              D20
            </span>
            <span style={{
              fontFamily: "'Cinzel',serif", fontSize: '2.4rem', fontWeight: 900,
              color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,.8)', lineHeight: 1,
            }}>
              {numeroAnimado}
            </span>
          </div>
        </div>

        {/* Desglose de modificadores */}
        <div style={{
          background: 'rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 10, padding: '.75rem 1rem', marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '.6rem', fontSize: '.95rem', fontFamily: "'Cinzel',serif" }}>
            <span>d20 (<strong style={{ color: '#f0c96f' }}>{rodando ? '?' : resultadoFinal?.natural}</strong>)</span>
            <span style={{ color: 'rgba(255,255,255,.4)' }}>+</span>
            <span>{statNombre} (<strong style={{ color: '#3498db' }}>{modificador >= 0 ? `+${modificador}` : modificador}</strong>)</span>
            {bonoExtra > 0 && (
              <>
                <span style={{ color: 'rgba(255,255,255,.4)' }}>+</span>
                <span>Reliquia (<strong style={{ color: '#9b59b6' }}>+{bonoExtra}</strong>)</span>
              </>
            )}
            <span style={{ color: 'rgba(255,255,255,.4)' }}>=</span>
            <span style={{
              fontSize: '1.2rem', fontWeight: 800,
              color: rodando ? '#f4e9d0' : resultadoFinal?.exito ? '#2ecc71' : '#e74c3c',
            }}>
              {rodando ? '...' : resultadoFinal?.total}
            </span>
          </div>

          <div style={{ fontSize: '.75rem', color: 'rgba(244,233,208,.5)', marginTop: '.3rem' }}>
            Objetivo: Superar o igualar <strong>DC {dc}</strong>
          </div>
        </div>

        {/* Resultado tras frenar */}
        {!rodando && resultadoFinal && (
          <div className="animate-pop-in" style={{ marginBottom: '1.25rem' }}>
            {resultadoFinal.critico ? (
              <div style={{ color: '#f1c40f', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', fontWeight: 800 }}>
                ⭐ ¡ÉXITO CRÍTICO NATURAL! (20)
              </div>
            ) : resultadoFinal.pifia ? (
              <div style={{ color: '#e74c3c', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', fontWeight: 800 }}>
                💀 ¡PIFIA DESASTROSA! (1)
              </div>
            ) : resultadoFinal.exito ? (
              <div style={{ color: '#2ecc71', fontFamily: "'Cinzel',serif", fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}>
                <CheckCircle2 size={20} /> ¡PRUEBA SUPERADA!
              </div>
            ) : (
              <div style={{ color: '#e74c3c', fontFamily: "'Cinzel',serif", fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}>
                <XCircle size={20} /> PRUEBA FALLIDA
              </div>
            )}
          </div>
        )}

        {/* Botón de Continuar */}
        <button
          disabled={rodando}
          className="btn-gold"
          style={{ width: '100%', padding: '.9rem', fontSize: '1rem' }}
          onClick={handleContinuar}
        >
          {rodando ? 'Lanzando el dado...' : 'Continuar'} <ArrowRight size={16} style={{ display: 'inline', marginLeft: 6 }} />
        </button>
      </div>
    </div>
  );
}
