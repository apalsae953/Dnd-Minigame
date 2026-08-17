// ============================================================
//  TravelView.jsx — Expedición Fluida con Tipografía Nítida y Legible
//  Inter para narrativa y descripciones · Cinzel para títulos y botones
// ============================================================
import { useState, useCallback } from 'react';
import {
  Swords, Home, ChevronRight, Heart, Droplets,
  Coins, Star, Sparkles, AlertTriangle, KeyRound,
  CheckCircle2, XCircle, Package, ArrowRight,
  Shield, Compass, Flame, Trees, Skull,
} from 'lucide-react';
import QteBar from './minigames/QteBar';
import MemoryRunes from './minigames/MemoryRunes';
import Lockpicking from './minigames/Lockpicking';
import DiceModal from './DiceModal';
import { obtenerEventoAleatorio } from '../data/gameData';

function ChipCambio({ valor, sufijo }) {
  if (!valor || valor === 0) return null;
  const pos = valor > 0;
  return (
    <span style={{
      background: pos ? 'rgba(46,204,113,.15)' : 'rgba(231,76,60,.15)',
      border: `1px solid ${pos ? '#2ecc71' : '#e74c3c'}`,
      borderRadius: 20, padding: '.25rem .8rem',
      fontSize: '.82rem', fontFamily: "'Cinzel',serif", fontWeight: 700,
      color: pos ? '#2ecc71' : '#e74c3c',
    }}>
      {pos ? '+' : ''}{valor} {sufijo}
    </span>
  );
}

export default function TravelView({
  heroe,
  mision,
  onActualizarHeroe,
  onVolverTaberna,
  onMuerte,
  onAbrirInventario,
}) {
  const [escena, setEscena] = useState('viaje_ida');
  const [eventoIda] = useState(() => obtenerEventoAleatorio('ida'));
  const [eventoVuelta, setEventoVuelta] = useState(null);
  const [opcionActiva, setOpcionActiva] = useState(null);
  const [modoMinijuego, setModoMinijuego] = useState(null);
  const [resultadoEscena, setResultadoEscena] = useState(null);
  const [misionCompletada, setMisionCompletada] = useState(false);
  const [logViaje, setLogViaje] = useState([]);

  // Pasivos
  const arma = heroe.equipo?.arma || heroe.equipoInicial?.arma;
  const armadura = heroe.equipo?.armadura || heroe.equipoInicial?.armadura;
  const reliquia = heroe.equipo?.reliquia || heroe.equipoInicial?.reliquia;
  const companero = heroe.companeroActivo;

  const extraZonaQte = (arma?.efectos?.qteBonusZona || 0) + (companero?.id === 'lyra' ? 10 : 0);
  const reduccionDanoArmadura = armadura?.efectos?.reduccionDano || 0;
  const tiempoExtraRunas = (reliquia?.efectos?.memoryTiempoExtra || 0) + (companero?.id === 'morgana' ? 5 : 0);
  const bonoDadoReliquia = reliquia?.efectos?.bonoDadoGeneral || 0;

  const addLog = useCallback((tipo, texto) => {
    setLogViaje(prev => [{ id: Date.now() + Math.random(), tipo, texto }, ...prev].slice(0, 10));
  }, []);

  const aplicarResultado = useCallback((res) => {
    let hpCambio = res.hp || 0;
    if (hpCambio < 0 && reduccionDanoArmadura > 0) {
      const mitigado = Math.min(Math.abs(hpCambio), reduccionDanoArmadura);
      hpCambio += mitigado;
    }

    let oroCambio = res.oro || 0;
    if (oroCambio > 0 && companero?.id === 'valerius') {
      oroCambio = Math.floor(oroCambio * 1.2);
    }

    const resFinal = { ...res, hp: hpCambio, oro: oroCambio };
    setResultadoEscena(resFinal);

    const a = heroe.atributos;
    const nuevosHp = Math.max(0, Math.min(a.maxHp, a.hp + hpCambio));
    const nuevosMana = Math.max(0, Math.min(a.maxMana, a.mana + (res.mana || 0)));
    const nuevosOro = Math.max(0, a.oro + oroCambio);
    const nuevosKarma = a.karma + (res.karma || 0);
    const nuevosXp = a.xp + (res.xp || 0);

    const actualizacion = {
      atributos: {
        ...a,
        hp: nuevosHp,
        mana: nuevosMana,
        oro: nuevosOro,
        karma: nuevosKarma,
        xp: nuevosXp,
      },
    };

    if (res.companero) {
      actualizacion.companeroActivo = res.companero;
      addLog('critico', `¡${res.companero.nombre} se une a tu causa!`);
    }

    onActualizarHeroe(actualizacion);
    addLog(nuevosHp <= 0 ? 'fallo' : hpCambio < 0 ? 'fallo' : 'exito', res.txt);

    if (nuevosHp <= 0) {
      setTimeout(() => onMuerte('combate'), 1400);
    }
  }, [heroe, reduccionDanoArmadura, companero, onActualizarHeroe, addLog, onMuerte]);

  const elegirOpcion = (op) => {
    setOpcionActiva(op);
    if (op.tipo === 'qte') setModoMinijuego('qte');
    else if (op.tipo === 'memoria') setModoMinijuego('memoria');
    else if (op.tipo === 'lockpicking') setModoMinijuego('lockpicking');
    else if (op.tipo === 'dado') setModoMinijuego('dado');
    else if (op.tipo === 'costo') {
      if (heroe.atributos.oro >= op.costeOro) aplicarResultado(op.exito);
      else aplicarResultado(op.fallo);
    } else if (op.tipo === 'inmediato') {
      aplicarResultado(op.resultado);
    }
  };

  const avanzarEscena = () => {
    setResultadoEscena(null);
    setOpcionActiva(null);
    setModoMinijuego(null);

    if (escena === 'viaje_ida') {
      setEscena('resolucion_mision');
    } else if (escena === 'resolucion_mision') {
      const ev = obtenerEventoAleatorio('vuelta');
      setEventoVuelta(ev);
      setEscena('viaje_regreso');
    } else if (escena === 'viaje_regreso') {
      setEscena('recompensa_final');
    }
  };

  const [modoMision, setModoMision] = useState('idle');

  const resolverMisionConMinijuego = (tipo) => {
    setModoMision(tipo);
  };

  const handleMisionMinijuegoFin = (res) => {
    const ok = res === 'exito' || res === 'critico' || res === 'acierto';
    setMisionCompletada(ok);
    const resObj = ok
      ? { txt: `¡Contrato cumplido con maestría! ${mision.titulo} — Victoria rotunda.`, hp: -8, mana: -10, oro: 0, karma: 6, xp: mision.recompensa.xp }
      : { txt: `El objetivo superó tus defensas. La misión fracasa estrepitosamente.`, hp: -28, mana: -15, oro: 0, karma: -5, xp: Math.floor(mision.recompensa.xp * 0.3) };
    aplicarResultado(resObj);
    setModoMision('resultado');
  };

  const cobrarRecompensaFinal = () => {
    if (misionCompletada) {
      let oroFinal = mision.recompensa.oro;
      if (companero?.id === 'valerius') oroFinal = Math.floor(oroFinal * 1.2);

      onActualizarHeroe({
        atributos: { ...heroe.atributos, oro: heroe.atributos.oro + oroFinal },
        misionesCompletadas: (heroe.misionesCompletadas || 0) + 1,
        misionFinalCompletada: !!mision.esFinal,
      });
      addLog('critico', `¡Cobraste +${oroFinal} oro y ${mision.recompensa.xp} XP!`);
    }

    if (mision.esFinal && misionCompletada) {
      setTimeout(() => onMuerte(null), 300);
      return;
    }

    onVolverTaberna();
  };

  const usarPocion = (tipo) => {
    const mochila = heroe.mochila || [];
    const idx = mochila.findIndex(i => tipo === 'vida' ? (i.id?.includes('vida') || i.hp > 0) : (i.id?.includes('mana') || i.mana > 0));
    if (idx === -1) {
      addLog('fallo', `No tienes pociones de ${tipo} en tu mochila.`);
      return;
    }

    const pocion = mochila[idx];
    const nuevaMochila = mochila.filter((_, i) => i !== idx);

    onActualizarHeroe({
      atributos: {
        ...heroe.atributos,
        hp: tipo === 'vida' ? Math.min(heroe.atributos.maxHp, heroe.atributos.hp + (pocion.hp || 45)) : heroe.atributos.hp,
        mana: tipo === 'mana' ? Math.min(heroe.atributos.maxMana, heroe.atributos.mana + (pocion.mana || 35)) : heroe.atributos.mana,
      },
      mochila: nuevaMochila,
    });
    addLog('exito', `Bebes ${pocion.nombre} (+${tipo === 'vida' ? (pocion.hp || 45) + ' HP' : (pocion.mana || 35) + ' Maná'}).`);
  };

  const eventoActivo = escena === 'viaje_regreso' ? eventoVuelta : eventoIda;

  return (
    <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Cabecera Inmersiva ── */}
      <div className="glass-panel animate-fade-up" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', marginBottom: '.2rem' }}>
            <span style={{ fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: '#f0c96f', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              {escena === 'viaje_ida' && '✦ En Camino hacia el Objetivo'}
              {escena === 'resolucion_mision' && '⚔️ Enfrentamiento Decisivo'}
              {escena === 'viaje_regreso' && '🌙 Retorno entre las Sombras'}
              {escena === 'recompensa_final' && '👑 Llegada a Puerto Seguro'}
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.35rem', color: mision.esFinal ? '#f0c96f' : '#f3f4f6', fontWeight: 700 }}>
            {mision.titulo}
          </h2>
        </div>

        {/* Pociones rápidas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <button
            onClick={() => usarPocion('vida')}
            style={{
              display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.45rem .85rem',
              background: 'rgba(192,57,43,.22)', border: '1px solid rgba(192,57,43,.5)',
              borderRadius: 6, color: '#f1948a', fontSize: '.8rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600,
            }}
          >
            <Heart size={14} color="#e74c3c" /> Poción HP
          </button>
          <button
            onClick={() => usarPocion('mana')}
            style={{
              display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.45rem .85rem',
              background: 'rgba(52,152,219,.22)', border: '1px solid rgba(52,152,219,.5)',
              borderRadius: 6, color: '#aed6f1', fontSize: '.8rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600,
            }}
          >
            <Droplets size={14} color="#3498db" /> Éter Maná
          </button>
          <button
            onClick={onAbrirInventario}
            style={{
              display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.45rem .85rem',
              background: 'rgba(201,168,76,.15)', border: '1px solid rgba(201,168,76,.4)',
              borderRadius: 6, color: '#f0c96f', fontSize: '.8rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600,
            }}
          >
            <Package size={14} /> Mochila
          </button>
        </div>
      </div>

      {/* ── Contenido de la Escena ── */}
      <div style={{ display: 'grid', gridTemplateColumns: logViaje.length > 0 ? '1fr 280px' : '1fr', gap: '1rem', alignItems: 'start' }}>

        <div className="glass-panel animate-fade-up" style={{ padding: '1.75rem' }}>

          {/* ════ EVENTO NARRATIVO ════ */}
          {(escena === 'viaje_ida' || escena === 'viaje_regreso') && eventoActivo && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.4rem', color: '#f0c96f', fontWeight: 700, marginBottom: '.4rem' }}>
                  {eventoActivo.titulo}
                </h3>
                <div className="rune-divider"><span>✦</span></div>
                {/* Párrafo narrativo limpio con Inter */}
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: '#f3f4f6',
                  maxWidth: 580,
                  margin: '0 auto',
                }}>
                  {eventoActivo.descripcion}
                </p>
              </div>

              {/* Minijuegos */}
              {modoMinijuego === 'qte' && opcionActiva && (
                <QteBar
                  titulo={opcionActiva.qte?.titulo || '¡Momento Crítico!'}
                  velocidad={opcionActiva.qte?.vel || 2.4}
                  zonaVerde={opcionActiva.qte?.zona || [42, 58]}
                  zonaVerdeExtra={extraZonaQte > 0}
                  bonoArmaZona={arma?.efectos?.qteBonusZona || 0}
                  onResultado={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res === 'critico' ? opcionActiva.exito : res === 'acierto' ? (opcionActiva.parcial || opcionActiva.exito) : opcionActiva.fallo);
                  }}
                />
              )}

              {modoMinijuego === 'memoria' && opcionActiva && (
                <MemoryRunes
                  tiempoLimite={10}
                  tiempoBonus={tiempoExtraRunas}
                  onResultado={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res === 'exito' ? opcionActiva.exito : opcionActiva.fallo);
                  }}
                />
              )}

              {modoMinijuego === 'lockpicking' && opcionActiva && (
                <Lockpicking
                  titulo="Forzar Cerrojo"
                  bonoDestreza={Math.floor(((heroe.atributos.destreza || 10) - 10) / 2)}
                  onResultado={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res === 'exito' ? opcionActiva.exito : opcionActiva.fallo);
                  }}
                />
              )}

              {modoMinijuego === 'dado' && opcionActiva && (
                <DiceModal
                  statNombre={opcionActiva.stat.toUpperCase()}
                  modificador={Math.floor(((heroe.atributos[opcionActiva.stat] || 10) - 10) / 2)}
                  bonoExtra={bonoDadoReliquia}
                  dc={opcionActiva.dc}
                  tituloPrueba={opcionActiva.texto}
                  onFinalizar={(res) => {
                    setModoMinijuego(null);
                    aplicarResultado(res.exito ? opcionActiva.exito : opcionActiva.fallo);
                  }}
                />
              )}

              {/* Opciones */}
              {!modoMinijuego && !resultadoEscena && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '1.25rem' }}>
                  {eventoActivo.opciones.map(op => {
                    let probTexto = '';
                    if (op.tipo === 'qte') probTexto = '[75% Golpe Preciso / 25% Fallo]';
                    else if (op.tipo === 'memoria') probTexto = '[Prueba de Runas en 10s]';
                    else if (op.tipo === 'dado') {
                      const mod = Math.floor(((heroe.atributos[op.stat] || 10) - 10) / 2);
                      const target = Math.max(1, Math.min(20, op.dc - mod));
                      const prob = Math.round(((21 - target) / 20) * 100);
                      probTexto = `[${prob}% Éxito / ${100 - prob}% Fallo]`;
                    } else if (op.tipo === 'costo') {
                      probTexto = `[Costo Seguro: ${op.costeOro} oro]`;
                    }

                    return (
                      <button
                        key={op.id}
                        onClick={() => elegirOpcion(op)}
                        className="glass-panel-hover"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '.85rem', padding: '1rem 1.25rem',
                          background: 'rgba(18,18,24,.85)', border: '1px solid rgba(201,168,76,.25)',
                          borderRadius: 10, cursor: 'pointer', color: '#f3f4f6', textAlign: 'left',
                        }}
                      >
                        <Sparkles size={20} color="#f0c96f" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', fontWeight: 600 }}>
                            {op.texto}
                          </div>
                          {probTexto && (
                            <div style={{ fontSize: '.75rem', color: '#f0c96f', marginTop: '.2rem', fontFamily: "'Inter', sans-serif" }}>
                              {probTexto}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Resultado de la escena */}
              {resultadoEscena && !modoMinijuego && (
                <div className="animate-pop-in" style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 12 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.75, textAlign: 'center', marginBottom: '1rem', color: '#f3f4f6' }}>
                    {resultadoEscena.txt}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '.5rem', marginBottom: '1.25rem' }}>
                    <ChipCambio valor={resultadoEscena.hp}    sufijo="HP" />
                    <ChipCambio valor={resultadoEscena.mana}  sufijo="Maná" />
                    <ChipCambio valor={resultadoEscena.oro}   sufijo="oro" />
                    <ChipCambio valor={resultadoEscena.karma} sufijo="karma" />
                    <ChipCambio valor={resultadoEscena.xp}    sufijo="XP" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn-gold" style={{ padding: '.75rem 2.5rem', fontSize: '.95rem' }} onClick={avanzarEscena}>
                      Continuar la Senda <ArrowRight size={16} style={{ display: 'inline', marginLeft: 6 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ RESOLUCIÓN DE MISIÓN ════ */}
          {escena === 'resolucion_mision' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <Swords size={40} color="#e74c3c" style={{ display: 'inline', marginBottom: '.5rem' }} />
                <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.4rem', color: mision.esFinal ? '#f0c96f' : '#f3f4f6', fontWeight: 700, marginBottom: '.3rem' }}>
                  {mision.titulo}
                </h3>
                <div className="rune-divider"><span>⚔</span></div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.75, color: '#f3f4f6', maxWidth: 580, margin: '0 auto' }}>
                  {mision.descripcion}
                </p>
              </div>

              {modoMision === 'qte' && (
                <QteBar
                  titulo={`Combate Crítico: ${mision.titulo}`}
                  velocidad={2.5 + mision.dificultad * 0.15}
                  zonaVerde={[40 - mision.dificultad * 2, 58 - mision.dificultad * 2]}
                  zonaVerdeExtra={extraZonaQte > 0}
                  bonoArmaZona={arma?.efectos?.qteBonusZona || 0}
                  onResultado={handleMisionMinijuegoFin}
                />
              )}

              {modoMision === 'memoria' && (
                <MemoryRunes
                  tiempoLimite={10}
                  tiempoBonus={tiempoExtraRunas}
                  titulo={`Sello de la Misión: ${mision.titulo}`}
                  onResultado={handleMisionMinijuegoFin}
                />
              )}

              {modoMision === 'dado' && (
                <DiceModal
                  statNombre={mision.stat.toUpperCase()}
                  modificador={Math.floor(((heroe.atributos[mision.stat] || 10) - 10) / 2)}
                  bonoExtra={bonoDadoReliquia}
                  dc={mision.dc}
                  tituloPrueba={`Resolución de ${mision.titulo}`}
                  onFinalizar={(res) => {
                    handleMisionMinijuegoFin(res.exito ? 'exito' : 'fallo');
                  }}
                />
              )}

              {modoMision === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '1.25rem', maxWidth: 480, margin: '1.25rem auto 0' }}>
                  {mision.minijuegoTipo === 'memoria' ? (
                    <button
                      className="glass-panel-hover"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '.85rem', padding: '1.1rem',
                        background: 'rgba(52,152,219,.14)', border: '1px solid rgba(52,152,219,.4)',
                        borderRadius: 10, cursor: 'pointer', color: '#f3f4f6', textAlign: 'left',
                      }}
                      onClick={() => resolverMisionConMinijuego('memoria')}
                    >
                      <Sparkles size={24} color="#3498db" />
                      <div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', fontWeight: 700 }}>Descifrar Sello Arcano (Memoria en 10s)</div>
                        <div style={{ fontSize: '.78rem', color: '#f0c96f', fontFamily: "'Inter', sans-serif" }}>✦ Empareja las runas antes del colapso</div>
                      </div>
                    </button>
                  ) : (
                    <button
                      className="glass-panel-hover"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '.85rem', padding: '1.1rem',
                        background: 'rgba(192,57,43,.14)', border: '1px solid rgba(192,57,43,.4)',
                        borderRadius: 10, cursor: 'pointer', color: '#f3f4f6', textAlign: 'left',
                      }}
                      onClick={() => resolverMisionConMinijuego('qte')}
                    >
                      <Swords size={24} color="#e74c3c" />
                      <div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', fontWeight: 700 }}>Ataque Frontal y Parada (Minijuego QTE)</div>
                        <div style={{ fontSize: '.78rem', color: '#f0c96f', fontFamily: "'Inter', sans-serif" }}>⚡ Parada ágil de golpe crítico</div>
                      </div>
                    </button>
                  )}

                  <button
                    className="glass-panel-hover"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '.85rem', padding: '1.1rem',
                      background: 'rgba(18,18,24,.85)', border: '1px solid rgba(201,168,76,.3)',
                      borderRadius: 10, cursor: 'pointer', color: '#f3f4f6', textAlign: 'left',
                    }}
                    onClick={() => resolverMisionConMinijuego('dado')}
                  >
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', fontWeight: 600 }}>
                      🎲 Resolver con Tirada d20 + {mision.stat.toUpperCase()} (DC {mision.dc})
                    </div>
                  </button>
                </div>
              )}

              {modoMision === 'resultado' && resultadoEscena && (
                <div className="animate-pop-in" style={{ marginTop: '1.25rem', padding: '1.25rem', background: misionCompletada ? 'rgba(39,174,96,.1)' : 'rgba(231,76,60,.1)', border: `1px solid ${misionCompletada ? '#2ecc71' : '#e74c3c'}`, borderRadius: 12 }}>
                  <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
                    {misionCompletada ? <CheckCircle2 size={36} color="#2ecc71" style={{ display: 'inline' }} /> : <XCircle size={36} color="#e74c3c" style={{ display: 'inline' }} />}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', lineHeight: 1.75, textAlign: 'center', marginBottom: '1.25rem', color: '#f3f4f6' }}>
                    {resultadoEscena.txt}
                  </p>
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn-gold" style={{ padding: '.75rem 2.5rem', fontSize: '.95rem' }} onClick={avanzarEscena}>
                      Emprender el Retorno <ArrowRight size={16} style={{ display: 'inline', marginLeft: 6 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ RECOMPENSA FINAL ════ */}
          {escena === 'recompensa_final' && (
            <div className="animate-pop-in" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <Home size={48} color="#f0c96f" style={{ display: 'inline', marginBottom: '1rem' }} />
              <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.4rem', color: '#f0c96f', fontWeight: 700, marginBottom: '.5rem' }}>
                {misionCompletada ? '¡Expedición Cumplida con Gloria!' : 'Regreso con Heridas pero con Vida'}
              </h3>
              <div className="rune-divider"><span>⬡</span></div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1rem', color: '#f3f4f6', maxWidth: 520, margin: '.75rem auto 1.5rem', lineHeight: 1.75 }}>
                {misionCompletada
                  ? `Completaste "${mision.titulo}". Las campanas de la taberna repican anunciando tu llegada triunfal.`
                  : `El contrato no pudo ser cumplido, pero has vuelto con vida para rearmarte y volver a intentarlo.`}
              </p>

              {misionCompletada && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                  <div style={{ background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.4)', borderRadius: 10, padding: '.85rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '.75rem', color: '#f0c96f', fontFamily: "'Cinzel',serif", marginBottom: '.2rem' }}>Recompensa de Oro</div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.35rem', color: '#f0c96f', fontWeight: 800 }}>
                      +{companero?.id === 'valerius' ? Math.floor(mision.recompensa.oro * 1.2) : mision.recompensa.oro} oro
                    </div>
                  </div>
                  <div style={{ background: 'rgba(52,152,219,.12)', border: '1px solid rgba(52,152,219,.4)', borderRadius: 10, padding: '.85rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '.75rem', color: '#3498db', fontFamily: "'Cinzel',serif", marginBottom: '.2rem' }}>Experiencia Ganada</div>
                    <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.35rem', color: '#3498db', fontWeight: 800 }}>
                      +{mision.recompensa.xp} XP
                    </div>
                  </div>
                </div>
              )}

              <button className="btn-gold" style={{ padding: '1.1rem 3rem', fontSize: '1.05rem' }} onClick={cobrarRecompensaFinal}>
                <Home size={18} style={{ display: 'inline', marginRight: 8 }} />
                {misionCompletada ? 'Cobrar y Entrar a la Taberna' : 'Volver a la Taberna'}
              </button>
            </div>
          )}
        </div>

        {/* Log lateral */}
        {logViaje.length > 0 && (
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: '#c9a84c', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '.5rem' }}>
              Crónica de la Expedición
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', maxHeight: 420, overflowY: 'auto' }}>
              {logViaje.map(e => (
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
  );
}
