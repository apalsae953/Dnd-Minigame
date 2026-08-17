// ============================================================
//  ExplorationView.jsx — Expedición Libre por Biomas con biomesData.js
//  Tipografía Inter limpia, Nodos de Riesgo y Helper de Huida (calculateEscapeRisk)
// ============================================================
import { useState, useCallback } from 'react';
import {
  Compass, Trees, Skull, Sparkles, Flame,
  Shield, Coins, Star, Heart, Droplets, ArrowRight,
  Home, ChevronRight, AlertTriangle, Trophy, Swords,
  Package, KeyRound, CheckCircle2, XCircle, Footprints,
} from 'lucide-react';
import QteBar from './minigames/QteBar';
import MemoryRunes from './minigames/MemoryRunes';
import Lockpicking from './minigames/Lockpicking';
import DiceModal from './DiceModal';
import { BIOMES, calculateEscapeRisk } from '../data/biomesData';

const ICON_MAP = {
  Trees: Trees,
  Skull: Skull,
  Flame: Flame,
  Sparkles: Sparkles,
};

export default function ExplorationView({
  heroe,
  onActualizarHeroe,
  onVolverTaberna,
  onMuerte,
  onAbrirInventario,
}) {
  const [biomaSeleccionado, setBiomaSeleccionado] = useState(null);
  const [profundidad, setProfundidad] = useState(1);
  const [botinAcumulado, setBotinAcumulado] = useState({ oro: 0, xp: 0, items: [] });
  const [eventoActual, setEventoActual] = useState(null);
  const [modoMinijuego, setModoMinijuego] = useState(null);
  const [resultadoNodo, setResultadoNodo] = useState(null);
  const [opcionActiva, setOpcionActiva] = useState(null);
  const [logExploracion, setLogExploracion] = useState([]);
  const [alertaEscape, setAlertaEscape] = useState(null);

  const addLog = useCallback((tipo, texto) => {
    setLogExploracion(prev => [{ id: Date.now() + Math.random(), tipo, texto }, ...prev].slice(0, 10));
  }, []);

  // Seleccionar un evento procedural del bioma según la profundidad
  const obtenerEventoDeBioma = useCallback((bioma, prof) => {
    const eventosBioma = bioma.events || [];
    const idx = (prof - 1) % eventosBioma.length;
    return eventosBioma[idx] || eventosBioma[0];
  }, []);

  // Entrar a un bioma
  const entrarBioma = (bioma) => {
    setBiomaSeleccionado(bioma);
    setProfundidad(1);
    setBotinAcumulado({ oro: 0, xp: 0, items: [] });
    setResultadoNodo(null);
    setAlertaEscape(null);
    const primerEv = obtenerEventoDeBioma(bioma, 1);
    setEventoActual(primerEv);
    addLog('neutral', `Te adentras en ${bioma.name} (Profundidad Nivel 1).`);
  };

  // Aplicar consecuencias de un resultado
  const aplicarResultado = useCallback((res) => {
    setResultadoNodo(res);
    const hpCambio = -(res.hpLoss || 0) + (res.hpGain || 0);
    const manaCambio = -(res.manaLoss || 0) + (res.manaGain || 0);
    const oroGanado = Math.max(0, (res.gold || 0) - (res.goldLoss || 0));
    const xpGanada = 25 + profundidad * 15;

    setBotinAcumulado(prev => ({
      oro: prev.oro + oroGanado,
      xp: prev.xp + xpGanada,
      items: res.item ? [...prev.items, res.item] : prev.items,
    }));

    const a = heroe.atributos;
    const nuevosHp = Math.max(0, Math.min(a.maxHp, a.hp + hpCambio));
    const nuevosMana = Math.max(0, Math.min(a.maxMana, a.mana + manaCambio));
    const nuevosKarma = a.karma + (res.karma || 0);

    const actualizacion = {
      atributos: { ...a, hp: nuevosHp, mana: nuevosMana, karma: nuevosKarma },
    };

    if (res.item) {
      actualizacion.mochila = [...(heroe.mochila || []), res.item];
    }
    if (res.companionUnlocked) {
      actualizacion.companeroActivo = res.companionUnlocked;
      addLog('critico', `¡${res.companionUnlocked.name} se une a ti!`);
    }

    onActualizarHeroe(actualizacion);
    addLog(nuevosHp <= 0 ? 'fallo' : hpCambio < 0 ? 'fallo' : 'exito', res.log || 'Acción resuelta.');

    // Muerte instantánea o por reducción de HP
    if (res.instantDeath || nuevosHp <= 0) {
      setTimeout(() => onMuerte('combate'), 1400);
    }
  }, [heroe, profundidad, onActualizarHeroe, addLog, onMuerte]);

  // Selección de opción dentro del evento
  const elegirOpcion = (op) => {
    setOpcionActiva(op);

    // Evento de engaño procedural (isDeceptiveSeed)
    if (eventoActual.isDeceptiveSeed) {
      const esTraidor = Math.random() < 0.5;
      const res = esTraidor ? eventoActual.traitorOutcome : eventoActual.honestOutcome;
      aplicarResultado(res);
      return;
    }

    if (op.minigame === 'qte' || op.rollType === 'qte') {
      setModoMinijuego('qte');
    } else if (op.minigame === 'memory_runes' || op.rollType === 'memory_runes') {
      setModoMinijuego('memoria');
    } else if (op.minigame === 'lockpick' || op.rollType === 'lockpick') {
      setModoMinijuego('lockpick');
    } else if (op.rollType === 'dice_check') {
      setModoMinijuego('dado');
    } else if (op.rollType === 'percentage') {
      const exito = Math.random() <= (op.successRate || 0.5);
      aplicarResultado(exito ? op.success : op.failure);
    } else if (op.success) {
      aplicarResultado(op.success);
    }
  };

  // Avanzar a la siguiente profundidad
  const avanzarMasProfundo = () => {
    const nuevaProf = profundidad + 1;
    setProfundidad(nuevaProf);
    setResultadoNodo(null);
    setOpcionActiva(null);
    setModoMinijuego(null);
    setAlertaEscape(null);
    const nuevoEv = obtenerEventoDeBioma(biomaSeleccionado, nuevaProf);
    setEventoActual(nuevoEv);
    addLog('neutral', `Avanzas más profundo hacia el Nivel ${nuevaProf}...`);
  };

  // Retirarse a la Taberna calculando el riesgo con calculateEscapeRisk
  const intentarRetirada = () => {
    const escapeResult = calculateEscapeRisk(biomaSeleccionado, profundidad);

    if (escapeResult.escaped) {
      // Retirada exitosa: consolida botín
      onActualizarHeroe({
        atributos: {
          ...heroe.atributos,
          oro: heroe.atributos.oro + botinAcumulado.oro,
          xp: heroe.atributos.xp + botinAcumulado.xp,
        },
      });
      onVolverTaberna();
    } else {
      // Falla la retirada: emboscada de huida
      setAlertaEscape(`¡Emboscada al intentar escapar! (${escapeResult.chancePercent}% de éxito fallido). Criaturas del bioma cortan tu retirada.`);
      const danoEscape = 15 + profundidad * 4;
      const a = heroe.atributos;
      const nuevosHp = Math.max(0, a.hp - danoEscape);
      onActualizarHeroe({ atributos: { ...a, hp: nuevosHp } });
      addLog('fallo', `¡Falló la huida! Recibes ${danoEscape} de daño.`);

      if (nuevosHp <= 0) {
        setTimeout(() => onMuerte('combate'), 1400);
      }
    }
  };

  // Uso rápido de pociones
  const usarPocion = (tipo) => {
    const mochila = heroe.mochila || [];
    const idx = mochila.findIndex(i => tipo === 'vida' ? (i.id?.includes('vida') || i.hp > 0 || i.heal > 0) : (i.id?.includes('mana') || i.mana > 0));
    if (idx === -1) return;

    const pocion = mochila[idx];
    const nuevaMochila = mochila.filter((_, i) => i !== idx);
    const healAmount = pocion.heal || pocion.hp || 45;

    onActualizarHeroe({
      atributos: {
        ...heroe.atributos,
        hp: tipo === 'vida' ? Math.min(heroe.atributos.maxHp, heroe.atributos.hp + healAmount) : heroe.atributos.hp,
        mana: tipo === 'mana' ? Math.min(heroe.atributos.maxMana, heroe.atributos.mana + (pocion.mana || 35)) : heroe.atributos.mana,
      },
      mochila: nuevaMochila,
    });
    addLog('exito', `Usaste ${pocion.name || pocion.nombre} (+${healAmount} HP).`);
  };

  return (
    <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Pantalla 1: Selector de Bioma ── */}
      {!biomaSeleccionado && (
        <div className="glass-panel animate-fade-up" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <Compass size={44} color="#f0c96f" style={{ margin: '0 auto .5rem' }} />
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.65rem', color: '#f0c96f', fontWeight: 700 }}>
              Expedición Libre por Biomas
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', color: '#f3f4f6', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              Adéntrate en territorios inexplorados. Cada nivel de profundidad multiplica las riquezas, pero el peligro de quedar atrapado aumenta.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {BIOMES.map(b => {
              const IconComp = ICON_MAP[b.icon] || Compass;
              return (
                <div
                  key={b.id}
                  className="glass-panel-hover"
                  style={{
                    background: 'rgba(18,18,24,.85)', border: '1px solid rgba(201,168,76,.3)',
                    borderRadius: 12, padding: '1.35rem', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}
                  onClick={() => entrarBioma(b)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.75rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconComp size={22} color="#f0c96f" />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.05rem', color: '#f3f4f6', fontWeight: 700 }}>{b.name}</div>
                        <div style={{ fontSize: '.75rem', color: '#f0c96f', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>Peligro Nivel {b.dangerLevel}</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.85rem', color: '#f3f4f6', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {b.description}
                    </p>
                  </div>
                  <button className="btn-gold" style={{ width: '100%', padding: '.75rem', fontSize: '.9rem' }}>
                    Explorar esta región →
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onVolverTaberna}
              style={{
                background: 'none', border: '1px solid rgba(201,168,76,.3)', color: '#f3f4f6',
                padding: '.65rem 1.75rem', borderRadius: 8, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '.9rem', fontWeight: 600,
              }}
            >
              ← Volver a La Posada del Grifo
            </button>
          </div>
        </div>
      )}

      {/* ── Pantalla 2: Expedición Activa por Nodos (Press-Your-Luck) ── */}
      {biomaSeleccionado && eventoActual && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Barra Superior del Bioma */}
          <div className="glass-panel animate-fade-up" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: '#f0c96f', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700 }}>
                {biomaSeleccionado.name}
              </div>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.35rem', color: '#f3f4f6', fontWeight: 700 }}>
                Profundidad: Nivel {profundidad}
              </h2>
            </div>

            {/* Saco de botín acumulado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,.4)', padding: '.5rem 1rem', borderRadius: 8, border: '1px solid rgba(240,201,111,.3)' }}>
              <span style={{ fontSize: '.8rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Saco Provisional:</span>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1.05rem', color: '#f0c96f', fontWeight: 800 }}>
                <Coins size={14} style={{ display: 'inline', marginRight: 3 }} />+{botinAcumulado.oro} oro
              </span>
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1.05rem', color: '#3498db', fontWeight: 800 }}>
                <Star size={14} style={{ display: 'inline', marginRight: 3 }} />+{botinAcumulado.xp} XP
              </span>
            </div>

            {/* Pociones rápidas */}
            <div style={{ display: 'flex', gap: '.45rem' }}>
              <button
                onClick={() => usarPocion('vida')}
                style={{ fontSize: '.78rem', padding: '.4rem .8rem', background: 'rgba(192,57,43,.22)', border: '1px solid rgba(192,57,43,.5)', borderRadius: 6, color: '#f1948a', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                <Heart size={12} style={{ display: 'inline', marginRight: 3 }} /> Curar
              </button>
              <button
                onClick={() => usarPocion('mana')}
                style={{ fontSize: '.78rem', padding: '.4rem .8rem', background: 'rgba(52,152,219,.22)', border: '1px solid rgba(52,152,219,.5)', borderRadius: 6, color: '#aed6f1', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                <Droplets size={12} style={{ display: 'inline', marginRight: 3 }} /> Éter
              </button>
            </div>
          </div>

          {/* Alerta de huida fallida si ocurrió */}
          {alertaEscape && (
            <div className="animate-pop-in" style={{ background: 'rgba(231,76,60,.18)', border: '1px solid #e74c3c', borderRadius: 10, padding: '.9rem 1.25rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif", fontSize: '.9rem' }}>
              <AlertTriangle size={16} color="#e74c3c" style={{ display: 'inline', marginRight: 8 }} />
              {alertaEscape}
            </div>
          )}

          {/* Grid de Evento + Log Lateral */}
          <div style={{ display: 'grid', gridTemplateColumns: logExploracion.length > 0 ? '1fr 280px' : '1fr', gap: '1rem', alignItems: 'start' }}>

            <div className="glass-panel animate-fade-up" style={{ padding: '1.75rem' }}>

              {/* Título y descripción con Inter */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.4rem', color: '#f0c96f', fontWeight: 700, marginBottom: '.4rem' }}>
                  {eventoActual.title}
                </h3>
                <div className="rune-divider"><span>✦</span></div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.75, color: '#f3f4f6', maxWidth: 580, margin: '0 auto' }}>
                  {eventoActual.description}
                </p>
              </div>

              {/* Minijuegos interactivos */}
              {modoMinijuego === 'qte' && opcionActiva && (
                <QteBar
                  titulo="¡Encuentro Hostil en la Espesura!"
                  velocidad={2.4 + profundidad * 0.15}
                  zonaVerde={[42, 58]}
                  onResultado={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res === 'critico' ? opcionActiva.success : opcionActiva.failure);
                  }}
                />
              )}

              {modoMinijuego === 'memoria' && opcionActiva && (
                <MemoryRunes
                  tiempoLimite={10}
                  onResultado={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res === 'exito' ? opcionActiva.success : opcionActiva.failure);
                  }}
                />
              )}

              {modoMinijuego === 'lockpick' && opcionActiva && (
                <Lockpicking
                  titulo="Forzar Cerrojo Antiguo"
                  velocidad={2.4 + profundidad * 0.15}
                  onResultado={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res === 'exito' ? opcionActiva.success : opcionActiva.failure);
                  }}
                />
              )}

              {modoMinijuego === 'dado' && opcionActiva && (
                <DiceModal
                  statNombre={(opcionActiva.attribute || 'fuerza').toUpperCase()}
                  modificador={Math.floor(((heroe.atributos[opcionActiva.attribute || 'fuerza'] || 10) - 10) / 2)}
                  dc={opcionActiva.dc || 12}
                  tituloPrueba={`Prueba de ${opcionActiva.attribute || 'fuerza'}`}
                  onFinalizar={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res.exito ? opcionActiva.success : opcionActiva.failure);
                  }}
                />
              )}

              {/* Opciones del evento */}
              {!modoMinijuego && !resultadoNodo && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '1.25rem' }}>
                  {eventoActual.isDeceptiveSeed ? (
                    <button
                      onClick={() => elegirOpcion({})}
                      className="glass-panel-hover"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '.85rem', padding: '1.1rem 1.25rem',
                        background: 'rgba(18,18,24,.85)', border: '1px solid rgba(201,168,76,.3)',
                        borderRadius: 10, cursor: 'pointer', color: '#f3f4f6', textAlign: 'left',
                      }}
                    >
                      <Sparkles size={20} color="#f0c96f" style={{ flexShrink: 0 }} />
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', fontWeight: 600 }}>
                        {eventoActual.honestOutcome?.text || 'Interactuar con la figura'} [Riesgo de Engaño]
                      </div>
                    </button>
                  ) : (
                    (eventoActual.choices || []).map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => elegirOpcion(ch)}
                        className="glass-panel-hover"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '.85rem', padding: '1.1rem 1.25rem',
                          background: 'rgba(18,18,24,.85)', border: '1px solid rgba(201,168,76,.25)',
                          borderRadius: 10, cursor: 'pointer', color: '#f3f4f6', textAlign: 'left',
                        }}
                      >
                        <Sparkles size={20} color="#f0c96f" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', fontWeight: 600 }}>
                            {ch.text}
                          </div>
                          {ch.riskNote && (
                            <div style={{ fontSize: '.78rem', color: '#f0c96f', marginTop: '.2rem', fontFamily: "'Inter', sans-serif" }}>
                              {ch.riskNote}
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Resultado del nodo + Gran decisión Press-Your-Luck */}
              {resultadoNodo && !modoMinijuego && (
                <div className="animate-pop-in" style={{ marginTop: '1.25rem', padding: '1.5rem', background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.35)', borderRadius: 12 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.75, textAlign: 'center', marginBottom: '1.5rem', color: '#f3f4f6' }}>
                    {resultadoNodo.log || 'Nodo completado.'}
                  </p>

                  <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '.85rem', color: '#f0c96f', fontFamily: "'Cinzel',serif", fontWeight: 700 }}>
                    ¿Qué decides hacer ahora? (Press-Your-Luck)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
                    {/* Avanzar más profundo */}
                    <button
                      className="btn-gold"
                      style={{ padding: '.95rem', fontSize: '.95rem' }}
                      onClick={avanzarMasProfundo}
                    >
                      🔥 Avanzar a Profundidad {profundidad + 1}
                    </button>

                    {/* Intentar retirarse a la taberna con calculateEscapeRisk */}
                    <button
                      style={{
                        padding: '.95rem', fontSize: '.95rem', background: 'rgba(46,204,113,.18)',
                        border: '1px solid #2ecc71', borderRadius: 8, color: '#2ecc71',
                        cursor: 'pointer', fontFamily: "'Cinzel',serif", fontWeight: 700,
                      }}
                      onClick={intentarRetirada}
                    >
                      <Home size={16} style={{ display: 'inline', marginRight: 6 }} />
                      Huir con el Botín ({Math.max(10, biomaSeleccionado.baseEscapeChance - ((profundidad - 1) * 15))}% éxito)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Log lateral */}
            {logExploracion.length > 0 && (
              <div className="glass-panel" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: '#c9a84c', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '.5rem' }}>
                  Crónica de Exploración
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', maxHeight: 420, overflowY: 'auto' }}>
                  {logExploracion.map(e => (
                    <div
                      key={e.id}
                      style={{
                        borderLeft: `3px solid ${e.tipo === 'exito' ? '#2ecc71' : e.tipo === 'fallo' ? '#e74c3c' : '#f0c96f'}`,
                        background: 'rgba(0,0,0,.3)', padding: '.4rem .6rem', borderRadius: 4,
                        fontSize: '.8rem', color: '#f3f4f6', lineHeight: 1.5, fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {e.texto}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
