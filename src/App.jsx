// ============================================================
//  App.jsx — Orquestador Principal del Roguelite D&D
//  Tipografía Inter Nítida y Legible · Títulos en Cinzel
//  Pantallas: CREATION → TAVERN → TRAVEL / EXPLORATION → EPILOGUE
// ============================================================
import { useState, useCallback } from 'react';
import {
  Shield, Wand2, Sun, EyeOff, Heart, Droplets,
  Coins, Star, Swords, ChevronRight, ArrowLeft,
  Skull, BookOpen, Hammer, Sword, Trophy, Package,
} from 'lucide-react';
import { CLASES, seleccionarMisiones, obtenerEpilogo } from './data/gameData';
import TavernHub       from './components/TavernHub';
import TravelView      from './components/TravelView';
import ExplorationView from './components/ExplorationView';
import EpilogueScreen  from './components/EpilogueScreen';
import InventoryModal  from './components/InventoryModal';
import HallOfFame      from './components/HallOfFame';

const SCREENS = {
  CREATION: 'CREATION',
  TAVERN: 'TAVERN',
  TRAVEL: 'TRAVEL',
  EXPLORATION: 'EXPLORATION',
  EPILOGUE: 'EPILOGUE',
};

const ICONOS_CLASE = { guerrero: Shield, picaro: EyeOff, mago: Wand2, clerigo: Sun };

function MiniBar({ valor, maximo, color }) {
  const pct = Math.max(0, Math.min(100, (valor / maximo) * 100));
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,.12)', borderRadius: 3, overflow: 'hidden', width: 72 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width .4s ease' }} />
    </div>
  );
}

export default function App() {
  const [pantalla, setPantalla]               = useState(SCREENS.CREATION);
  const [heroe,    setHeroe]                  = useState(null);
  const [mision,   setMision]                 = useState(null);
  const [misiones, setMisiones]               = useState([]);
  const [modalInventario, setModalInventario] = useState(false);
  const [modalHallOfFame, setModalHallOfFame] = useState(false);

  // Formulario creación
  const [nombreInput, setNombreInput]         = useState('');
  const [claseSelec,  setClaseSelec]          = useState(null);
  const [errorNombre, setErrorNombre]         = useState('');

  const actualizarHeroe = useCallback((cambios) => {
    setHeroe(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...cambios,
        atributos: cambios.atributos
          ? { ...prev.atributos, ...cambios.atributos }
          : prev.atributos,
        equipo: cambios.equipo
          ? { ...prev.equipo, ...cambios.equipo }
          : prev.equipo,
      };
    });
  }, []);

  const handleIniciar = () => {
    if (nombreInput.trim().length < 2) {
      setErrorNombre('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    if (!claseSelec) {
      setErrorNombre('Selecciona una vocación antes de continuar.');
      return;
    }
    setErrorNombre('');

    const claseData = CLASES.find(c => c.id === claseSelec);
    const nuevoHeroe = {
      nombre: nombreInput.trim(),
      claseId: claseData.id,
      claseNombre: claseData.nombre,
      atributos: { ...claseData.atributos },
      equipo: {
        arma: claseData.equipoInicial?.arma || null,
        armadura: claseData.equipoInicial?.armadura || null,
        reliquia: claseData.equipoInicial?.reliquia || null,
      },
      mochila: [...(claseData.mochilaInicial || [])],
      misionesCompletadas: 0,
      causaMuerte: null,
      misionFinalCompletada: false,
      companeroActivo: null,
      efectos: { zonaVerdeExtra: false, bonusDado: 0, bonusDadoTurnos: 0 },
    };

    setHeroe(nuevoHeroe);
    const ms = seleccionarMisiones(4, 1);
    setMisiones(ms);
    setPantalla(SCREENS.TAVERN);
  };

  const handleAceptarMision = useCallback((m) => {
    setMision(m);
    setPantalla(SCREENS.TRAVEL);
  }, []);

  const handleComprar = useCallback((item) => {
    setHeroe(prev => {
      const a = { ...prev.atributos };
      a.oro -= item.precio;
      const nuevaMochila = [...(prev.mochila || []), item];
      return { ...prev, atributos: a, mochila: nuevaMochila };
    });
  }, []);

  const handleEquiparItem = useCallback((item, mochilaIndex) => {
    setHeroe(prev => {
      const slot = item.slot || item.type;
      if (!['arma', 'armadura', 'reliquia', 'weapon', 'armor', 'relic'].includes(slot)) return prev;

      const slotNorm = slot === 'weapon' ? 'arma' : slot === 'armor' ? 'armadura' : slot === 'relic' ? 'reliquia' : slot;
      const itemAnterior = prev.equipo?.[slotNorm] || null;
      const nuevaMochila = prev.mochila.filter((_, i) => i !== mochilaIndex);
      if (itemAnterior) nuevaMochila.push(itemAnterior);

      const nuevoEquipo = { ...(prev.equipo || {}), [slotNorm]: item };
      return { ...prev, equipo: nuevoEquipo, mochila: nuevaMochila };
    });
  }, []);

  const handleDesequiparItem = useCallback((slotTipo) => {
    setHeroe(prev => {
      const itemDesequipado = prev.equipo?.[slotTipo];
      if (!itemDesequipado) return prev;

      const nuevoEquipo = { ...(prev.equipo || {}), [slotTipo]: null };
      const nuevaMochila = [...prev.mochila, itemDesequipado];
      return { ...prev, equipo: nuevoEquipo, mochila: nuevaMochila };
    });
  }, []);

  const handleUsarConsumible = useCallback((item, mochilaIndex) => {
    setHeroe(prev => {
      const a = { ...prev.atributos };
      const curaHp = item.efectos?.curaHp || item.hp || item.heal || 0;
      const curaMana = item.efectos?.curaMana || item.mana || 0;

      if (curaHp > 0)   a.hp   = Math.min(a.maxHp,   a.hp   + curaHp);
      if (curaMana > 0) a.mana = Math.min(a.maxMana,  a.mana + curaMana);

      const nuevaMochila = prev.mochila.filter((_, i) => i !== mochilaIndex);
      return { ...prev, atributos: a, mochila: nuevaMochila };
    });
  }, []);

  const handleExplorarBiomas = useCallback(() => {
    setPantalla(SCREENS.EXPLORATION);
  }, []);

  const handleVolverTaberna = useCallback(() => {
    setHeroe(prev => {
      const nivel = prev?.atributos?.nivel || 1;
      const ms = seleccionarMisiones(4, nivel);
      setMisiones(ms);
      return prev;
    });
    setMision(null);
    setPantalla(SCREENS.TAVERN);
  }, []);

  const handleMuerte = useCallback((causa) => {
    setHeroe(prev => ({ ...prev, causaMuerte: causa }));
    setPantalla(SCREENS.EPILOGUE);
  }, []);

  const handleReiniciar = useCallback(() => {
    setHeroe(null); setMision(null); setMisiones([]);
    setNombreInput(''); setClaseSelec(null); setErrorNombre('');
    setPantalla(SCREENS.CREATION);
  }, []);

  const BarraSuperior = heroe && [SCREENS.TAVERN, SCREENS.TRAVEL, SCREENS.EXPLORATION].includes(pantalla) ? (
    <header style={{
      backgroundColor: '#121217',
      borderBottom: '1px solid rgba(201,168,76,.3)',
      padding: '.65rem 1.5rem',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,.7)',
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          {(() => { const Icon = ICONOS_CLASE[heroe.claseId] || Shield; return <Icon size={20} color="#f0c96f" />; })()}
          <div>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1rem', color: '#f0c96f', fontWeight: 700 }}>
              {heroe.nombre}
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.85rem', color: '#f3f4f6', marginLeft: '.5rem', fontWeight: 500 }}>
              {heroe.claseNombre} · Nivel {heroe.atributos.nivel}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
            <span style={{ fontSize: '.75rem', color: '#e74c3c', fontFamily: "'Cinzel',serif", fontWeight: 700 }}>
              <Heart size={11} style={{ display: 'inline', marginRight: 3 }} />{Math.max(0, heroe.atributos.hp)}/{heroe.atributos.maxHp}
            </span>
            <MiniBar valor={heroe.atributos.hp} maximo={heroe.atributos.maxHp} color="#e74c3c" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
            <span style={{ fontSize: '.75rem', color: '#3498db', fontFamily: "'Cinzel',serif", fontWeight: 700 }}>
              <Droplets size={11} style={{ display: 'inline', marginRight: 3 }} />{Math.max(0, heroe.atributos.mana)}/{heroe.atributos.maxMana}
            </span>
            <MiniBar valor={heroe.atributos.mana} maximo={heroe.atributos.maxMana} color="#3498db" />
          </div>

          <span style={{ fontFamily: "'Cinzel',serif", fontSize: '.9rem', color: '#f0c96f', fontWeight: 700 }}>
            <Coins size={14} style={{ display: 'inline', marginRight: 4, color: '#f0c96f' }} />{heroe.atributos.oro} ⬡
          </span>

          <span style={{ fontFamily: "'Cinzel',serif", fontSize: '.9rem', color: heroe.atributos.karma >= 0 ? '#2ecc71' : '#e74c3c', fontWeight: 700 }}>
            <Star size={14} style={{ display: 'inline', marginRight: 3 }} />{heroe.atributos.karma >= 0 ? '+' : ''}{heroe.atributos.karma}
          </span>

          <button
            onClick={() => setModalInventario(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.35rem .75rem',
              background: 'rgba(201,168,76,.18)', border: '1px solid rgba(201,168,76,.45)',
              borderRadius: 6, color: '#f0c96f', fontSize: '.8rem', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600,
            }}
          >
            <Package size={13} /> Mochila ({heroe.mochila?.length || 0})
          </button>
        </div>
      </div>
    </header>
  ) : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d11', color: '#f3f4f6' }}>
      <div id="screen-flash" />

      {BarraSuperior}

      <InventoryModal
        heroe={heroe}
        isOpen={modalInventario}
        onClose={() => setModalInventario(false)}
        onEquiparItem={handleEquiparItem}
        onDesequiparItem={handleDesequiparItem}
        onUsarConsumible={handleUsarConsumible}
      />

      <HallOfFame
        isOpen={modalHallOfFame}
        onClose={() => setModalHallOfFame(false)}
      />

      {/* ════ PANTALLA: CREACIÓN DE PERSONAJE ════ */}
      {pantalla === SCREENS.CREATION && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1rem' }}>

          <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(.85rem,2vw,1.05rem)', color: '#f0c96f', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '.4rem', fontWeight: 700 }}>
              Año 1372 del Calendario de los Reinos · Roguelite D&D
            </p>
            <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(2.2rem,6vw,4.2rem)', color: '#f0c96f', textShadow: '0 0 20px rgba(201,168,76,.6)', lineHeight: 1.1, fontWeight: 800, marginBottom: '.5rem' }}>
              Crónicas de la<br />Marca Oscura
            </h1>
            <div className="rune-divider" style={{ maxWidth: 380, margin: '.5rem auto' }}>
              <Swords size={16} />
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: '#f3f4f6', fontSize: '1rem', lineHeight: 1.6 }}>
              Forja tu leyenda, sobrevive a las expediciones y conquista las Misiones Cataclísmicas.
            </p>
          </div>

          <div className="glass-panel animate-fade-up" style={{ width: '100%', maxWidth: 760, padding: '2rem', animationDelay: '.15s' }}>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setModalHallOfFame(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.45rem .95rem',
                  background: 'rgba(52,152,219,.15)', border: '1px solid rgba(52,152,219,.45)',
                  borderRadius: 8, color: '#3498db', fontFamily: "'Inter', sans-serif", fontSize: '.85rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Trophy size={14} /> Ver Salón de las Leyendas
              </button>
            </div>

            {/* Input Nombre */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontFamily: "'Cinzel',serif", fontSize: '.85rem', letterSpacing: '.18em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '.6rem', fontWeight: 700 }}>
                <BookOpen size={13} style={{ display: 'inline', marginRight: 6 }} />
                Nombre del Aventurero
              </label>
              <input
                type="text"
                value={nombreInput}
                maxLength={30}
                placeholder="¿Cómo te llaman los bardos...?"
                onChange={e => { setNombreInput(e.target.value); setErrorNombre(''); }}
                style={{
                  width: '100%', padding: '.85rem 1.1rem',
                  backgroundColor: '#101015', border: `1px solid ${errorNombre ? '#e74c3c' : 'rgba(201,168,76,.35)'}`,
                  borderRadius: 8, color: '#f3f4f6',
                  fontFamily: "'Inter', sans-serif", fontSize: '1rem',
                  outline: 'none', transition: 'all .3s',
                }}
              />
            </div>

            {/* Selector de Clase */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontFamily: "'Cinzel',serif", fontSize: '.85rem', letterSpacing: '.18em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '.85rem', fontWeight: 700 }}>
                <Sword size={13} style={{ display: 'inline', marginRight: 6 }} />
                Elige tu Vocación
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.85rem' }}>
                {CLASES.map(cls => {
                  const Icon = ICONOS_CLASE[cls.id] || Shield;
                  const activa = claseSelec === cls.id;
                  return (
                    <div
                      key={cls.id}
                      onClick={() => { setClaseSelec(cls.id); setErrorNombre(''); }}
                      style={{
                        background: activa ? `${cls.color}18` : 'rgba(18,18,24,.85)',
                        border: `2px solid ${activa ? cls.color : cls.colorBorder}`,
                        borderRadius: 12, padding: '1.1rem', cursor: 'pointer',
                        transition: 'all .25s ease',
                        boxShadow: activa ? `0 0 25px ${cls.color}55` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.6rem' }}>
                        <div style={{ width: 44, height: 44, background: cls.colorBg, border: `1px solid ${cls.colorBorder}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={22} color={cls.color} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.05rem', color: '#f3f4f6', fontWeight: 700 }}>{cls.nombre}</div>
                          <div style={{ fontSize: '.75rem', color: '#f0c96f', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{cls.subtitulo}</div>
                        </div>
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.82rem', color: '#f3f4f6', lineHeight: 1.5, marginBottom: '.6rem' }}>
                        {cls.descripcion}
                      </p>
                      <div style={{ fontSize: '.75rem', color: '#f0c96f', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                        <Heart size={11} style={{ display: 'inline', color: '#e74c3c' }} /> {cls.atributos.maxHp} HP &nbsp;·&nbsp;
                        <Droplets size={11} style={{ display: 'inline', color: '#3498db' }} /> {cls.atributos.maxMana} Maná &nbsp;·&nbsp;
                        <Coins size={11} style={{ display: 'inline', color: '#f0c96f' }} /> {cls.atributos.oro} oro
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {errorNombre && (
              <p style={{ fontSize: '.88rem', color: '#e74c3c', marginBottom: '.85rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                {errorNombre}
              </p>
            )}

            <button
              className="btn-gold"
              style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem' }}
              onClick={handleIniciar}
              disabled={nombreInput.trim().length < 2 || !claseSelec}
            >
              <Swords size={18} style={{ display: 'inline', marginRight: 8 }} />
              Comenzar la Aventura
            </button>
          </div>
        </div>
      )}

      {/* ════ PANTALLA: TABERNA ════ */}
      {pantalla === SCREENS.TAVERN && heroe && (
        <TavernHub
          heroe={heroe}
          misiones={misiones}
          onAceptarMision={handleAceptarMision}
          onComprar={handleComprar}
          onDescansar={() => {}}
          onExplorarBiomas={handleExplorarBiomas}
          onActualizarHeroe={actualizarHeroe}
          onAbrirInventario={() => setModalInventario(true)}
          onAbrirHallOfFame={() => setModalHallOfFame(true)}
        />
      )}

      {/* ════ PANTALLA: VIAJE / CONTRATO ════ */}
      {pantalla === SCREENS.TRAVEL && heroe && mision && (
        <TravelView
          heroe={heroe}
          mision={mision}
          onActualizarHeroe={actualizarHeroe}
          onVolverTaberna={handleVolverTaberna}
          onMuerte={handleMuerte}
          onAbrirInventario={() => setModalInventario(true)}
        />
      )}

      {/* ════ PANTALLA: EXPEDICIÓN POR BIOMAS ════ */}
      {pantalla === SCREENS.EXPLORATION && heroe && (
        <ExplorationView
          heroe={heroe}
          onActualizarHeroe={actualizarHeroe}
          onVolverTaberna={handleVolverTaberna}
          onMuerte={handleMuerte}
          onAbrirInventario={() => setModalInventario(true)}
        />
      )}

      {/* ════ PANTALLA: EPÍLOGO ════ */}
      {pantalla === SCREENS.EPILOGUE && heroe && (
        <EpilogueScreen
          heroe={heroe}
          onReiniciar={handleReiniciar}
          onVerHallOfFame={() => setModalHallOfFame(true)}
        />
      )}
    </div>
  );
}
