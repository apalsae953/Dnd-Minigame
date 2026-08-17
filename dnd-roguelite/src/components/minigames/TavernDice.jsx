// ============================================================
//  TavernDice.jsx — Minijuego de Dados de Farol en la Taberna
//  Tipografía Inter Clara · Duelo de dados 2d6 con apuestas y trucos
// ============================================================
import { useState } from 'react';
import {
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6,
  Coins, Sparkles, AlertTriangle, ShieldCheck, Flame,
  Trophy, XCircle, RotateCcw,
} from 'lucide-react';

const DADOS_ICONOS = [null, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export default function TavernDice({
  oroJugador = 50,
  destrezaJugador = 12,
  onFinalizar, // function({ resultado: 'victoria'|'derrota'|'empate', oroGanado: number, texto: string })
}) {
  const [apuestaBase, setApuestaBase] = useState(20);
  const [fase, setFase] = useState('inicio'); // 'inicio' | 'rodando' | 'decision' | 'resultado'
  const [dadosJugador, setDadosJugador] = useState([1, 1]);
  const [dadosNpc, setDadosNpc] = useState([1, 1]);
  const [trucoIntentado, setTrucoIntentado] = useState(false);
  const [mensajeResultado, setMensajeResultado] = useState('');
  const [resultadoFinal, setResultadoFinal] = useState(null); // 'victoria' | 'derrota' | 'empate'

  const iniciarRonda = (apuesta) => {
    setApuestaBase(apuesta);
    setFase('rodando');
    setTrucoIntentado(false);

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const n1 = Math.floor(Math.random() * 6) + 1;
      const n2 = Math.floor(Math.random() * 6) + 1;

      setDadosJugador([d1, d2]);
      setDadosNpc([n1, n2]);
      setFase('decision');
    }, 800);
  };

  const totalJugador = dadosJugador[0] + dadosJugador[1];
  const totalNpc = dadosNpc[0] + dadosNpc[1];

  const resolverNormal = (multiplicador = 1) => {
    const ganancia = apuestaBase * multiplicador;

    if (totalJugador > totalNpc) {
      const msg = `¡Victoria en la mesa! Sacaste ${totalJugador} contra ${totalNpc} del parroquiano.`;
      setMensajeResultado(msg);
      setResultadoFinal('victoria');
      setFase('resultado');
      setTimeout(() => {
        onFinalizar?.({ resultado: 'victoria', oroGanado: ganancia, texto: msg });
      }, 1800);
    } else if (totalJugador < totalNpc) {
      const msg = `El parroquiano sonríe con arrogancia. Sacó ${totalNpc} contra tus ${totalJugador}.`;
      setMensajeResultado(msg);
      setResultadoFinal('derrota');
      setFase('resultado');
      setTimeout(() => {
        onFinalizar?.({ resultado: 'derrota', oroGanado: -ganancia, texto: msg });
      }, 1800);
    } else {
      const msg = `¡Empate a ${totalJugador}! Las monedas se quedan en la mesa para la próxima ronda.`;
      setMensajeResultado(msg);
      setResultadoFinal('empate');
      setFase('resultado');
      setTimeout(() => {
        onFinalizar?.({ resultado: 'empate', oroGanado: 0, texto: msg });
      }, 1800);
    }
  };

  const intentarTruco = () => {
    if (trucoIntentado) return;
    setTrucoIntentado(true);

    const tiradaD20 = Math.floor(Math.random() * 20) + 1;
    const mod = Math.floor((destrezaJugador - 10) / 2);
    const totalTruco = tiradaD20 + mod;
    const exitoTruco = totalTruco >= 12;

    if (exitoTruco) {
      const nuevosDados = [...dadosJugador];
      if (nuevosDados[0] < nuevosDados[1]) nuevosDados[0] = Math.min(6, nuevosDados[0] + 3);
      else nuevosDados[1] = Math.min(6, nuevosDados[1] + 3);
      setDadosJugador(nuevosDados);
      setMensajeResultado('¡Tus dedos ágiles voltean el dado sin que nadie en la mesa se dé cuenta!');
    } else {
      const perdida = apuestaBase * 2;
      const msg = `¡Te descubrieron volteando el dado! El tabernero confisca tu bolsa y te expulsa de la mesa (−${perdida} oro).`;
      setMensajeResultado(msg);
      setResultadoFinal('derrota');
      setFase('resultado');
      setTimeout(() => {
        onFinalizar?.({ resultado: 'derrota', oroGanado: -perdida, texto: msg });
      }, 2000);
    }
  };

  const IconoDadoJ1 = DADOS_ICONOS[dadosJugador[0]] || Dice1;
  const IconoDadoJ2 = DADOS_ICONOS[dadosJugador[1]] || Dice1;
  const IconoDadoN1 = DADOS_ICONOS[dadosNpc[0]] || Dice1;
  const IconoDadoN2 = DADOS_ICONOS[dadosNpc[1]] || Dice1;

  return (
    <div className="animate-pop-in" style={{ width: '100%', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>

      {/* Cabecera */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.25rem', color: '#f0c96f', fontWeight: 700, marginBottom: '.25rem' }}>
          🎲 Dados de Farol de la Posada
        </h3>
        <p style={{ fontSize: '.88rem', color: '#f3f4f6', fontFamily: "'Inter', sans-serif" }}>
          Duelo a dos dados d6. Juega limpio, apuesta fuerte o arriésgate a trucar la mesa.
        </p>
      </div>

      {/* Fase: Selección de apuesta inicial */}
      {fase === 'inicio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          <div style={{ fontSize: '.88rem', color: '#f3f4f6', marginBottom: '.25rem', fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            Selecciona tu apuesta:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.6rem' }}>
            {[15, 30, 50].map(monto => (
              <button
                key={monto}
                disabled={oroJugador < monto}
                className="btn-gold"
                style={{ padding: '.8rem .5rem', fontSize: '.88rem' }}
                onClick={() => iniciarRonda(monto)}
              >
                <Coins size={14} style={{ display: 'inline', marginRight: 4 }} />
                {monto} oro
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fase: Rodando / Decisión / Resultado */}
      {fase !== 'inicio' && (
        <div>
          {/* Tapete de dados */}
          <div style={{
            background: 'rgba(10,35,20,.65)',
            border: '2px solid rgba(201,168,76,.35)',
            borderRadius: 14, padding: '1.25rem', marginBottom: '1rem',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,.6)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              {/* Lado Jugador */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.78rem', color: '#f0c96f', marginBottom: '.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Tus Dados ({fase === 'rodando' ? '...' : totalJugador})
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '.6rem' }}>
                  <div style={{ background: 'rgba(255,255,255,.08)', padding: '.4rem', borderRadius: 8 }}>
                    <IconoDadoJ1 size={36} color="#f0c96f" />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.08)', padding: '.4rem', borderRadius: 8 }}>
                    <IconoDadoJ2 size={36} color="#f0c96f" />
                  </div>
                </div>
              </div>

              {/* Lado Parroquiano */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '.78rem', color: '#e74c3c', marginBottom: '.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Parroquiano ({fase === 'rodando' ? '...' : totalNpc})
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '.6rem' }}>
                  <div style={{ background: 'rgba(255,255,255,.08)', padding: '.4rem', borderRadius: 8 }}>
                    <IconoDadoN1 size={36} color="#e74c3c" />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,.08)', padding: '.4rem', borderRadius: 8 }}>
                    <IconoDadoN2 size={36} color="#e74c3c" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opciones de juego */}
          {fase === 'decision' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
                <button
                  className="btn-gold"
                  style={{ padding: '.8rem', fontSize: '.88rem' }}
                  onClick={() => resolverNormal(1)}
                >
                  <ShieldCheck size={15} style={{ display: 'inline', marginRight: 4 }} />
                  Plantarse ({apuestaBase} oro)
                </button>

                <button
                  disabled={oroJugador < apuestaBase * 2}
                  style={{
                    padding: '.8rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #e67e22, #d35400)',
                    color: '#f3f4f6', fontFamily: "'Cinzel',serif", fontSize: '.88rem', fontWeight: 700,
                  }}
                  onClick={() => resolverNormal(2)}
                >
                  <Flame size={15} style={{ display: 'inline', marginRight: 4 }} />
                  Doblar ({apuestaBase * 2} oro)
                </button>
              </div>

              <button
                disabled={trucoIntentado}
                style={{
                  padding: '.75rem', borderRadius: 8, cursor: 'pointer',
                  background: 'rgba(142,68,173,.15)', border: '1px solid rgba(142,68,173,.4)',
                  color: '#9b59b6', fontFamily: "'Inter', sans-serif", fontSize: '.85rem', fontWeight: 600,
                }}
                onClick={intentarTruco}
              >
                <Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} />
                {trucoIntentado ? 'Ya trucaste esta ronda' : 'Trucar tirada (Destreza DC 12)'}
              </button>
            </div>
          )}

          {/* Resultado final */}
          {fase === 'resultado' && (
            <div
              className="animate-pop-in"
              style={{
                padding: '1rem', borderRadius: 10,
                background: resultadoFinal === 'victoria' ? 'rgba(39,174,96,.12)' : resultadoFinal === 'derrota' ? 'rgba(192,57,43,.12)' : 'rgba(201,168,76,.12)',
                border: `1px solid ${resultadoFinal === 'victoria' ? 'rgba(39,174,96,.4)' : resultadoFinal === 'derrota' ? 'rgba(192,57,43,.4)' : 'rgba(201,168,76,.4)'}`,
              }}
            >
              {resultadoFinal === 'victoria' && <Trophy size={26} color="#27ae60" style={{ display: 'inline', marginBottom: '.3rem' }} />}
              {resultadoFinal === 'derrota' && <XCircle size={26} color="#e74c3c" style={{ display: 'inline', marginBottom: '.3rem' }} />}
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.95rem', color: '#f3f4f6', lineHeight: 1.6 }}>
                {mensajeResultado}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
