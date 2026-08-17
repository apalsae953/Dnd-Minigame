// ============================================================
//  InventoryModal.jsx — Modal de Inventario y Equipamiento Activo
//  Tipografía Inter Clara y Legible · Slots de Equipo y Mochila
// ============================================================
import {
  Sword, Shield, Star, Droplets, Sparkles, X,
  Heart, Zap, ShieldCheck, Check, Plus, Trash2,
} from 'lucide-react';
import { RAREZAS } from '../data/items';

export default function InventoryModal({
  heroe,
  isOpen,
  onClose,
  onEquiparItem,
  onDesequiparItem,
  onUsarConsumible,
}) {
  if (!isOpen || !heroe) return null;

  const { equipoInicial = {}, inventario = [], mochila = [] } = heroe;
  const todosLosObjetosMochila = mochila.length > 0 ? mochila : inventario;

  const armaEquipada = heroe.equipo?.arma || equipoInicial?.arma || null;
  const armaduraEquipada = heroe.equipo?.armadura || equipoInicial?.armadura || null;
  const reliquiaEquipada = heroe.equipo?.reliquia || equipoInicial?.reliquia || null;

  const renderSlot = (titulo, slotTipo, item, iconoDefault) => {
    const IconoDefault = iconoDefault;
    const rarezaInfo = item ? (RAREZAS[item.rareza] || RAREZAS.comun) : null;

    return (
      <div style={{
        background: item ? rarezaInfo.bg : 'rgba(18,18,24,.85)',
        border: `1px solid ${item ? rarezaInfo.border : 'rgba(201,168,76,.25)'}`,
        borderRadius: 12, padding: '1rem', flex: 1, minWidth: 200,
        position: 'relative',
      }}>
        <div style={{
          fontSize: '.72rem', fontFamily: "'Cinzel',serif", textTransform: 'uppercase',
          letterSpacing: '.1em', color: '#f0c96f', marginBottom: '.5rem', fontWeight: 700,
        }}>
          {titulo}
        </div>

        {item ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', marginBottom: '.4rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(0,0,0,.35)', border: `1px solid ${rarezaInfo.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconoDefault size={18} color={rarezaInfo.color} />
              </div>
              <div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.9rem', color: '#f3f4f6', fontWeight: 700 }}>
                  {item.nombre || item.name}
                </div>
                <div style={{ fontSize: '.68rem', color: rarezaInfo.color, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                  {rarezaInfo.nombre}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '.78rem', color: '#f3f4f6', marginBottom: '.6rem', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
              {item.descripcion || item.desc || item.bonus}
            </p>
            <button
              onClick={() => onDesequiparItem(slotTipo)}
              style={{
                fontSize: '.72rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                background: 'rgba(192,57,43,.2)', border: '1px solid rgba(192,57,43,.5)',
                color: '#f1948a', padding: '.3rem .75rem', borderRadius: 6, cursor: 'pointer',
              }}
            >
              Desequipar
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '.8rem 0', color: 'rgba(244,233,208,.4)' }}>
            <IconoDefault size={24} style={{ margin: '0 auto .3rem', opacity: .5 }} />
            <div style={{ fontSize: '.8rem', fontFamily: "'Inter', sans-serif" }}>Ranura vacía</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: 'rgba(5,5,10,.88)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div
        className="glass-panel animate-pop-in"
        style={{
          width: '100%', maxWidth: 780, maxHeight: '90vh', overflowY: 'auto',
          padding: '1.75rem', border: '1px solid rgba(201,168,76,.4)',
          boxShadow: '0 0 60px rgba(0,0,0,.9)',
        }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.35rem', color: '#f0c96f', fontWeight: 700 }}>
              🎒 Equipo e Inventario de {heroe.nombre}
            </h2>
            <p style={{ fontSize: '.85rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
              Gestiona tu equipamiento activo y usa pociones para la expedición
            </p>
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

        {/* Ranuras de Equipamiento */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: '#c9a84c',
            letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.75rem', fontWeight: 700,
          }}>
            Ranuras de Equipamiento Activo
          </div>
          <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            {renderSlot('Arma Principal', 'arma', armaEquipada, Sword)}
            {renderSlot('Armadura', 'armadura', armaduraEquipada, Shield)}
            {renderSlot('Reliquia Arcana', 'reliquia', reliquiaEquipada, Star)}
          </div>
        </div>

        {/* Bonificaciones Pasivas Activas */}
        <div style={{
          background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.25)',
          borderRadius: 10, padding: '.85rem 1.1rem', marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: '#f0c96f', marginBottom: '.4rem', textTransform: 'uppercase', fontWeight: 700 }}>
            ⚡ Bonificaciones Pasivas Activas:
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '.82rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
            {armaEquipada?.efectos?.qteBonusZona && (
              <span>• QTE Precisión: <strong style={{ color: '#2ecc71' }}>+{armaEquipada.efectos.qteBonusZona}% zona verde</strong></span>
            )}
            {armaduraEquipada?.efectos?.reduccionDano && (
              <span>• Protección: <strong style={{ color: '#3498db' }}>-{armaduraEquipada.efectos.reduccionDano} daño en combate</strong></span>
            )}
            {reliquiaEquipada?.efectos?.memoryTiempoExtra && (
              <span>• Runas: <strong style={{ color: '#9b59b6' }}>+{reliquiaEquipada.efectos.memoryTiempoExtra}s tiempo extra</strong></span>
            )}
            {heroe.companeroActivo && (
              <span>• Compañero: <strong style={{ color: '#f39c12' }}>{heroe.companeroActivo.name || heroe.companeroActivo.nombre}</strong></span>
            )}
          </div>
        </div>

        {/* Mochila */}
        <div>
          <div style={{
            fontSize: '.75rem', fontFamily: "'Cinzel',serif", color: '#c9a84c',
            letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.75rem', fontWeight: 700,
          }}>
            Mochila ({todosLosObjetosMochila.length} objetos)
          </div>

          {todosLosObjetosMochila.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'rgba(244,233,208,.5)', fontFamily: "'Inter', sans-serif" }}>
              Tu mochila está vacía. Visita el Bazar en la taberna para abastecerte.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '.75rem' }}>
              {todosLosObjetosMochila.map((item, idx) => {
                const rareza = RAREZAS[item.rareza] || RAREZAS.comun;
                const esConsumible = item.slot === 'consumible' || item.type === 'consumible';

                return (
                  <div
                    key={`${item.id}_${idx}`}
                    style={{
                      background: 'rgba(18,18,24,.85)', border: `1px solid ${rareza.border}`,
                      borderRadius: 10, padding: '.85rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.3rem' }}>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.9rem', color: '#f3f4f6', fontWeight: 700 }}>
                          {item.nombre || item.name}
                        </div>
                        <span style={{ fontSize: '.65rem', color: rareza.color, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
                          {rareza.nombre}
                        </span>
                      </div>
                      <p style={{ fontSize: '.78rem', color: '#f3f4f6', marginBottom: '.65rem', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                        {item.descripcion || item.desc || item.bonus}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '.4rem', marginTop: '.3rem' }}>
                      {esConsumible ? (
                        <button
                          className="btn-gold"
                          style={{ padding: '.35rem .75rem', fontSize: '.78rem', width: '100%' }}
                          onClick={() => onUsarConsumible(item, idx)}
                        >
                          Usar poción
                        </button>
                      ) : (
                        <button
                          style={{
                            width: '100%', padding: '.35rem .75rem', fontSize: '.78rem',
                            background: 'rgba(201,168,76,.18)', border: '1px solid rgba(201,168,76,.4)',
                            color: '#f0c96f', borderRadius: 6, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                          }}
                          onClick={() => onEquiparItem(item, idx)}
                        >
                          Equipar ({item.slot || item.type})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
