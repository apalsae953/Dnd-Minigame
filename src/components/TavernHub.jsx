// ============================================================
//  TavernHub.jsx — Rediseño del Hub Central de la Taberna
//  Bazar con 4 Pestañas Limpias (Armas, Armaduras, Pociones, Reliquias)
//  Tipografía Inter Nítida y Legible · Cinzel para Títulos y Botones
// ============================================================
import { useState } from 'react';
import {
  Flame, ScrollText, ShoppingBag, Moon, Compass,
  Sword, Heart, Droplets, Coins, Star, ChevronRight,
  Info, Dice6, FlaskConical, Shield, Sparkles, Trophy,
  Users, Package, KeyRound, ShieldAlert,
} from 'lucide-react';
import { ITEMS_TIENDA, RAREZAS } from '../data/gameData';
import TavernDice from './minigames/TavernDice';

export default function TavernHub({
  heroe,
  misiones,
  onAceptarMision,
  onComprar,
  onDescansar,
  onExplorarBiomas,
  onActualizarHeroe,
  onAbrirInventario,
  onAbrirHallOfFame,
}) {
  const [tabActiva, setTabActiva] = useState('talon');
  const [subTabBazar, setSubTabBazar] = useState('arma');
  const [jugandoDados, setJugandoDados] = useState(false);
  const [logTaberna, setLogTaberna] = useState([]);

  const addLog = (tipo, texto) => {
    setLogTaberna(prev => [{ id: Date.now() + Math.random(), tipo, texto }, ...prev].slice(0, 8));
  };

  const handleComprar = (item) => {
    if (heroe.atributos.oro < item.precio) {
      addLog('fallo', `No tienes suficiente oro para comprar ${item.nombre}. (Necesitas ${item.precio} ⬡)`);
      return;
    }
    onComprar(item);
    addLog('exito', `Adquiriste "${item.nombre}" por ${item.precio} oro. Guardado en tu mochila.`);
  };

  const handleCurar = (coste, hpRec, manaRec) => {
    if (heroe.atributos.oro < coste) {
      addLog('fallo', `No tienes suficiente oro. (Necesitas ${coste} ⬡)`);
      return;
    }
    onActualizarHeroe({
      atributos: {
        ...heroe.atributos,
        oro: heroe.atributos.oro - coste,
        hp:   Math.min(heroe.atributos.maxHp,   heroe.atributos.hp   + hpRec),
        mana: Math.min(heroe.atributos.maxMana,  heroe.atributos.mana + manaRec),
      },
    });
    addLog('exito', hpRec > 0 ? `Recuperaste ${hpRec} HP. (−${coste} oro)` : `Recuperaste ${manaRec} Maná. (−${coste} oro)`);
  };

  const handleFinDados = ({ resultado, oroGanado, texto }) => {
    onActualizarHeroe({
      atributos: {
        ...heroe.atributos,
        oro: Math.max(0, heroe.atributos.oro + oroGanado),
      },
    });
    addLog(resultado === 'victoria' ? 'critico' : resultado === 'derrota' ? 'fallo' : 'neutral', texto);
    setTimeout(() => setJugandoDados(false), 2000);
  };

  const TABS = [
    { id: 'talon',    label: 'Tablón de Contratos', icon: ScrollText },
    { id: 'bazar',    label: 'Bazar de Grimoiria',  icon: ShoppingBag },
    { id: 'descanso', label: 'Descanso y Dados',    icon: Moon },
    { id: 'libre',    label: 'Expedición por Biomas', icon: Compass },
  ];

  const BAZAR_TABS = [
    { id: 'arma',       label: 'Armas',       icono: Sword },
    { id: 'armadura',   label: 'Armaduras',   icono: Shield },
    { id: 'consumible', label: 'Pociones',    icono: FlaskConical },
    { id: 'reliquia',   label: 'Reliquias',   icono: Sparkles },
  ];

  const itemsFiltrados = ITEMS_TIENDA.filter(i => i.slot === subTabBazar);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: 1040, margin: '0 auto', padding: '1.25rem 1rem' }}>

      {/* ── Cabecera Principal de la Taberna ── */}
      <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, background: 'rgba(232,80,10,.15)',
            border: '1px solid rgba(232,80,10,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Flame size={32} color="#e8500a" style={{ filter: 'drop-shadow(0 0 10px #e8500a)' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.2rem,3vw,1.6rem)', color: '#f0c96f', fontWeight: 700, marginBottom: '.15rem' }}>
              La Posada del Grifo
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.9rem', color: '#f3f4f6' }}>
              El corazón de la Marca Oscura. Aquí se forjan las leyendas y se pagan los contratos.
            </p>
          </div>
        </div>

        {/* Botones de acción rápida */}
        <div style={{ display: 'flex', gap: '.65rem' }}>
          <button
            onClick={onAbrirInventario}
            style={{
              display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.55rem 1rem',
              background: 'rgba(201,168,76,.15)', border: '1px solid rgba(201,168,76,.4)',
              borderRadius: 8, color: '#f0c96f', fontFamily: "'Inter', sans-serif", fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Package size={15} /> Mochila ({heroe.mochila?.length || 0})
          </button>
          <button
            onClick={onAbrirHallOfFame}
            style={{
              display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.55rem 1rem',
              background: 'rgba(52,152,219,.15)', border: '1px solid rgba(52,152,219,.4)',
              borderRadius: 8, color: '#3498db', fontFamily: "'Inter', sans-serif", fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Trophy size={15} /> Salón de Leyendas
          </button>
        </div>
      </div>

      {/* Compañero activo en la taberna */}
      {heroe.companeroActivo && (
        <div style={{
          background: 'rgba(240,201,111,.08)', border: '1px solid rgba(240,201,111,.35)',
          borderRadius: 10, padding: '.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '.75rem',
        }}>
          <Users size={20} color="#f0c96f" />
          <div style={{ fontSize: '.9rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
            Compañero leal a tu lado: <strong style={{ color: '#f0c96f' }}>{heroe.companeroActivo.name || heroe.companeroActivo.nombre}</strong> — <span style={{ color: '#f3f4f6' }}>{heroe.companeroActivo.bonus || heroe.companeroActivo.bonusTexto}</span>
          </div>
        </div>
      )}

      {/* ── Pestañas Principales del Hub ── */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const activa = tabActiva === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setTabActiva(tab.id); setJugandoDados(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '.5rem',
                padding: '.65rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: "'Cinzel',serif", fontSize: '.88rem', fontWeight: 700,
                background: activa ? 'rgba(201,168,76,.22)' : 'rgba(22,22,28,.85)',
                color: activa ? '#f0c96f' : '#f3f4f6',
                borderBottom: activa ? '2px solid #c9a84c' : '2px solid transparent',
                transition: 'all .2s ease',
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Contenido de la Pestaña Activa ── */}
      <div style={{ display: 'grid', gridTemplateColumns: logTaberna.length > 0 ? '1fr 280px' : '1fr', gap: '1rem', alignItems: 'start' }}>

        <div className="glass-panel animate-fade-up" style={{ padding: '1.5rem' }}>

          {/* ════ 1. TABLÓN DE MISIONES ════ */}
          {tabActiva === 'talon' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '.75rem', borderBottom: '1px solid rgba(201,168,76,.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <ScrollText size={18} color="#c9a84c" />
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: '.82rem', letterSpacing: '.12em', color: '#c9a84c', textTransform: 'uppercase', fontWeight: 700 }}>
                    Contratos Disponibles para Aventurero Nivel {heroe.atributos.nivel}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                {misiones.map(m => (
                  <div
                    key={m.id}
                    className="glass-panel-hover"
                    style={{
                      background: m.esFinal ? 'rgba(240,201,111,.08)' : 'rgba(18,18,24,.85)',
                      border: `1px solid ${m.esFinal ? 'rgba(240,201,111,.5)' : 'rgba(201,168,76,.2)'}`,
                      borderRadius: 12, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, flexShrink: 0, borderRadius: 10,
                      background: m.esFinal ? 'rgba(240,201,111,.15)' : 'rgba(201,168,76,.1)',
                      border: `1px solid ${m.esFinal ? '#f0c96f' : 'rgba(201,168,76,.3)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Star size={22} color={m.esFinal ? '#f0c96f' : '#c9a84c'} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.05rem', color: m.esFinal ? '#f0c96f' : '#f3f4f6', fontWeight: 700, marginBottom: '.3rem' }}>
                        {m.titulo}
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.9rem', color: '#f3f4f6', lineHeight: 1.6, marginBottom: '.75rem' }}>
                        {m.descripcion}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '.72rem', fontFamily: "'Cinzel',serif", fontWeight: 700,
                          background: `${m.colorDificultad}22`, border: `1px solid ${m.colorDificultad}55`,
                          color: m.colorDificultad, borderRadius: 20, padding: '.2rem .7rem',
                        }}>
                          {m.textoDificultad}
                        </span>
                        <span style={{ fontSize: '.82rem', color: '#f0c96f', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>+{m.recompensa.oro} oro</span>
                        <span style={{ fontSize: '.82rem', color: '#3498db', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>+{m.recompensa.xp} XP</span>
                        <span style={{ fontSize: '.78rem', color: 'rgba(244,233,208,.6)', fontFamily: "'Inter', sans-serif" }}>
                          Prueba: {m.stat.toUpperCase()} (DC {m.dc})
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn-gold"
                      style={{ padding: '.65rem 1.25rem', fontSize: '.88rem', flexShrink: 0 }}
                      onClick={() => onAceptarMision(m)}
                    >
                      Aceptar Contrato
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ 2. BAZAR REDISEÑADO CON 4 PESTAÑAS ════ */}
          {tabActiva === 'bazar' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '.75rem', borderBottom: '1px solid rgba(201,168,76,.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <ShoppingBag size={18} color="#c9a84c" />
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: '.82rem', letterSpacing: '.12em', color: '#c9a84c', textTransform: 'uppercase', fontWeight: 700 }}>
                    Armería y Suministros de Grimoiria
                  </span>
                </div>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1rem', color: '#f0c96f', fontWeight: 700 }}>
                  Tu Oro: {heroe.atributos.oro} ⬡
                </span>
              </div>

              {/* Sub-pestañas de categorías */}
              <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem' }}>
                {BAZAR_TABS.map(st => {
                  const StIcon = st.icono;
                  const esSeleccionada = subTabBazar === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setSubTabBazar(st.id)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem',
                        padding: '.55rem .8rem', borderRadius: 8, cursor: 'pointer',
                        background: esSeleccionada ? 'rgba(201,168,76,.2)' : 'rgba(0,0,0,.3)',
                        border: `1px solid ${esSeleccionada ? '#c9a84c' : 'rgba(255,255,255,.08)'}`,
                        color: esSeleccionada ? '#f0c96f' : '#f3f4f6',
                        fontFamily: "'Cinzel',serif", fontSize: '.85rem', fontWeight: 700,
                      }}
                    >
                      <StIcon size={14} /> {st.label}
                    </button>
                  );
                })}
              </div>

              {/* Tarjetas de artículos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '.85rem' }}>
                {itemsFiltrados.map(item => {
                  const rareza = RAREZAS[item.rareza] || RAREZAS.comun;
                  return (
                    <div
                      key={item.id}
                      className="glass-panel-hover"
                      style={{
                        background: 'rgba(18,18,24,.85)', border: `1px solid ${rareza.border}`,
                        borderRadius: 12, padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.4rem' }}>
                          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.95rem', color: '#f3f4f6', fontWeight: 700 }}>
                            {item.nombre}
                          </div>
                          <span style={{
                            fontSize: '.68rem', fontFamily: "'Cinzel',serif", fontWeight: 700,
                            color: rareza.color, background: rareza.bg, border: `1px solid ${rareza.border}`,
                            padding: '.15rem .55rem', borderRadius: 12,
                          }}>
                            {rareza.nombre}
                          </span>
                        </div>

                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.82rem', color: '#f3f4f6', lineHeight: 1.5, marginBottom: '.75rem' }}>
                          {item.descripcion}
                        </p>

                        {/* Bonificador pasivo destacado */}
                        <div style={{ background: 'rgba(0,0,0,.35)', padding: '.45rem .65rem', borderRadius: 6, fontSize: '.78rem', color: '#f0c96f', marginBottom: '.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                          {item.efectos?.qteBonusZona && `⚡ +${item.efectos.qteBonusZona}% zona verde QTE`}
                          {item.efectos?.reduccionDano && `🛡️ -${item.efectos.reduccionDano} daño en combate`}
                          {item.efectos?.memoryTiempoExtra && `✦ +${item.efectos.memoryTiempoExtra}s en descifrado`}
                          {item.efectos?.curaHp && `❤️ Cura ${item.efectos.curaHp} HP de inmediato`}
                          {item.efectos?.curaMana && `💧 Restaura ${item.efectos.curaMana} Maná`}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.5rem', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                        <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1rem', color: '#f0c96f', fontWeight: 700 }}>
                          {item.precio} oro
                        </span>
                        <button
                          className="btn-gold"
                          style={{ padding: '.45rem .95rem', fontSize: '.82rem' }}
                          onClick={() => handleComprar(item)}
                          disabled={heroe.atributos.oro < item.precio}
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ 3. DESCANSO Y DADOS ════ */}
          {tabActiva === 'descanso' && (
            <div>
              {jugandoDados ? (
                <div>
                  <button
                    onClick={() => setJugandoDados(false)}
                    style={{
                      background: 'none', border: 'none', color: 'rgba(201,168,76,.8)',
                      fontSize: '.85rem', cursor: 'pointer', marginBottom: '1rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    }}
                  >
                    ← Volver a opciones de descanso
                  </button>
                  <TavernDice
                    oroJugador={heroe.atributos.oro}
                    destrezaJugador={heroe.atributos.destreza}
                    onFinalizar={handleFinDados}
                  />
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.25rem', paddingBottom: '.75rem', borderBottom: '1px solid rgba(201,168,76,.15)' }}>
                    <Moon size={18} color="#c9a84c" />
                    <span style={{ fontFamily: "'Cinzel',serif", fontSize: '.82rem', letterSpacing: '.12em', color: '#c9a84c', textTransform: 'uppercase', fontWeight: 700 }}>
                      Recuperación de Fuerzas y Juegos de Azar
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                    <div style={{ background: 'rgba(192,57,43,.08)', border: '1px solid rgba(192,57,43,.25)', borderRadius: 10, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.95rem', color: '#f3f4f6', fontWeight: 700 }}>
                          <Heart size={14} color="#e74c3c" style={{ display: 'inline', marginRight: 6 }} />
                          Tratamiento de Heridas
                        </div>
                        <div style={{ fontSize: '.82rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>Restaura 35 HP con bálsamos · Costo: 20 oro</div>
                      </div>
                      <button className="btn-gold" style={{ padding: '.5rem 1rem', fontSize: '.82rem' }} onClick={() => handleCurar(20, 35, 0)}>
                        Curar
                      </button>
                    </div>

                    <div style={{ background: 'rgba(52,152,219,.08)', border: '1px solid rgba(52,152,219,.25)', borderRadius: 10, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.95rem', color: '#f3f4f6', fontWeight: 700 }}>
                          <Droplets size={14} color="#3498db" style={{ display: 'inline', marginRight: 6 }} />
                          Meditación en la Capilla
                        </div>
                        <div style={{ fontSize: '.82rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>Recupera 30 Maná · Costo: 15 oro</div>
                      </div>
                      <button className="btn-gold" style={{ padding: '.5rem 1rem', fontSize: '.82rem' }} onClick={() => handleCurar(15, 0, 30)}>
                        Meditar
                      </button>
                    </div>

                    <div style={{ background: 'rgba(201,168,76,.05)', border: '1px solid rgba(201,168,76,.2)', borderRadius: 10, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.95rem', color: '#f3f4f6', fontWeight: 700 }}>
                          <Moon size={14} color="#f0c96f" style={{ display: 'inline', marginRight: 6 }} />
                          Habitación Privada
                        </div>
                        <div style={{ fontSize: '.82rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>HP y Maná al 100% · Costo: 50 oro</div>
                      </div>
                      <button className="btn-gold" style={{ padding: '.5rem 1rem', fontSize: '.82rem' }} onClick={() => handleCurar(50, heroe.atributos.maxHp, heroe.atributos.maxMana)}>
                        Alquilar
                      </button>
                    </div>

                    <div style={{ background: 'rgba(142,68,173,.08)', border: '1px solid rgba(142,68,173,.3)', borderRadius: 10, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.98rem', color: '#f0c96f', fontWeight: 700 }}>
                          <Dice6 size={16} color="#9b59b6" style={{ display: 'inline', marginRight: 6 }} />
                          Mesa de Dados de Farol (Minijuego)
                        </div>
                        <div style={{ fontSize: '.82rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
                          Duelo 2d6: apuesta oro, plántate o usa tu Destreza para voltear los dados.
                        </div>
                      </div>
                      <button className="btn-gold" style={{ padding: '.55rem 1.1rem', fontSize: '.85rem' }} onClick={() => setJugandoDados(true)}>
                        Jugar Dados
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ 4. EXPEDICIÓN POR BIOMAS ════ */}
          {tabActiva === 'libre' && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <Compass size={54} color="#f0c96f" style={{ margin: '0 auto 1rem', opacity: .8 }} />
              <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.3rem', color: '#f0c96f', fontWeight: 700, marginBottom: '.5rem' }}>
                Expedición Libre por Biomas (Modo Roguelite)
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', color: '#f3f4f6', maxWidth: 520, margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
                Explora el Bosque Susurrante, las Criptas Olvidadas o la Ciénaga de Éter. Decide en cada nivel si arriesgarte a profundizar por más botín o retirarte a salvo.
              </p>
              <button
                className="btn-gold"
                style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}
                onClick={onExplorarBiomas}
              >
                <Compass size={18} style={{ display: 'inline', marginRight: 8 }} />
                Abrir Mapa de Biomas
              </button>
            </div>
          )}
        </div>

        {/* Log lateral */}
        {logTaberna.length > 0 && (
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.6rem', paddingBottom: '.4rem', borderBottom: '1px solid rgba(201,168,76,.12)' }}>
              <Info size={14} color="#c9a84c" />
              <span style={{ fontFamily: "'Cinzel',serif", fontSize: '.75rem', letterSpacing: '.1em', color: '#c9a84c', textTransform: 'uppercase', fontWeight: 700 }}>
                Crónica de la Taberna
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {logTaberna.map(e => (
                <div
                  key={e.id}
                  style={{
                    borderLeft: `3px solid ${e.tipo === 'exito' ? '#2ecc71' : e.tipo === 'fallo' ? '#e74c3c' : '#f0c96f'}`,
                    background: 'rgba(0,0,0,.25)', padding: '.4rem .6rem', borderRadius: 4,
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
