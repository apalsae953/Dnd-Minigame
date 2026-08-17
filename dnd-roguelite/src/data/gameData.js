// ============================================================
//  gameData.js — Hub central de datos del juego
//  Reexporta y orquesta Clases, Items, Misiones, Eventos y Epílogos
// ============================================================
import { ITEMS_CATALOGO } from './items';
import { QUESTS_CATALOGO } from './quests';
import { EVENTOS_EXPANDIDOS } from './events';

export { ITEMS_CATALOGO, RAREZAS } from './items';
export { QUESTS_CATALOGO } from './quests';
export { EVENTOS_EXPANDIDOS } from './events';

// ────────────────────────────────────────────────────────────
//  CLASES DE PERSONAJE CON SLOTS DE EQUIPAMIENTO
// ────────────────────────────────────────────────────────────
export const CLASES = [
  {
    id: 'guerrero',
    nombre: 'Guerrero',
    subtitulo: 'Fuerza Brutal',
    descripcion: 'Maestro del acero y el escudo. Su brazo es tan temido como la oscuridad misma.',
    icono: 'Sword',
    color: '#e74c3c',
    colorBg: 'rgba(192,57,43,0.15)',
    colorBorder: 'rgba(192,57,43,0.35)',
    atributos: {
      hp: 120, maxHp: 120,
      mana: 25, maxMana: 25,
      fuerza: 16,
      destreza: 12,
      inteligencia: 8,
      sabiduria: 10,
      karma: 0,
      oro: 50,
      nivel: 1,
      xp: 0,
    },
    equipoInicial: {
      arma: ITEMS_CATALOGO.find(i => i.id === 'espada_hierro'),
      armadura: ITEMS_CATALOGO.find(i => i.id === 'cuero_tachonado'),
      reliquia: null,
    },
    mochilaInicial: [
      ITEMS_CATALOGO.find(i => i.id === 'pocion_vida_mayor'),
    ],
    bonusPrimario: 'fuerza',
    descripcionBonus: 'Alta reducción de daño base y gran vitalidad.',
  },
  {
    id: 'picaro',
    nombre: 'Pícaro',
    subtitulo: 'Destreza Furtiva',
    descripcion: 'Las sombras son su hogar. Sus dagas hablan más rápido que cualquier palabra.',
    icono: 'EyeOff',
    color: '#9b59b6',
    colorBg: 'rgba(142,68,173,0.15)',
    colorBorder: 'rgba(142,68,173,0.35)',
    atributos: {
      hp: 85, maxHp: 85,
      mana: 40, maxMana: 40,
      fuerza: 10,
      destreza: 18,
      inteligencia: 12,
      sabiduria: 8,
      karma: 0,
      oro: 75,
      nivel: 1,
      xp: 0,
    },
    equipoInicial: {
      arma: ITEMS_CATALOGO.find(i => i.id === 'daga_elfica'),
      armadura: ITEMS_CATALOGO.find(i => i.id === 'manto_sombras'),
      reliquia: null,
    },
    mochilaInicial: [
      ITEMS_CATALOGO.find(i => i.id === 'pocion_vida_mayor'),
    ],
    bonusPrimario: 'destreza',
    descripcionBonus: 'La zona verde en QTE es más ancha por defecto (+8%).',
  },
  {
    id: 'mago',
    nombre: 'Mago',
    subtitulo: 'Inteligencia Arcana',
    descripcion: 'Doblegador del Weave arcano. Los hechizos obedecen su voluntad sin límite.',
    icono: 'Wand2',
    color: '#3498db',
    colorBg: 'rgba(52,152,219,0.15)',
    colorBorder: 'rgba(52,152,219,0.35)',
    atributos: {
      hp: 65, maxHp: 65,
      mana: 100, maxMana: 100,
      fuerza: 6,
      destreza: 10,
      inteligencia: 18,
      sabiduria: 12,
      karma: 0,
      oro: 60,
      nivel: 1,
      xp: 0,
    },
    equipoInicial: {
      arma: ITEMS_CATALOGO.find(i => i.id === 'baston_astral'),
      armadura: null,
      reliquia: ITEMS_CATALOGO.find(i => i.id === 'ojo_adivinacion'),
    },
    mochilaInicial: [
      ITEMS_CATALOGO.find(i => i.id === 'pocion_mana_mayor'),
    ],
    bonusPrimario: 'inteligencia',
    descripcionBonus: 'Gran reserva de Maná y pistas adicionales en minijuegos de runas.',
  },
  {
    id: 'clerigo',
    nombre: 'Clérigo',
    subtitulo: 'Sabiduría Divina',
    descripcion: 'Canal de los dioses. Su fe sana y su castigo es el rayo divino sobre los impuros.',
    icono: 'Sun',
    color: '#f39c12',
    colorBg: 'rgba(243,156,18,0.15)',
    colorBorder: 'rgba(243,156,18,0.35)',
    atributos: {
      hp: 95, maxHp: 95,
      mana: 75, maxMana: 75,
      fuerza: 12,
      destreza: 10,
      inteligencia: 12,
      sabiduria: 16,
      karma: 5,
      oro: 40,
      nivel: 1,
      xp: 0,
    },
    equipoInicial: {
      arma: ITEMS_CATALOGO.find(i => i.id === 'martillo_sol'),
      armadura: ITEMS_CATALOGO.find(i => i.id === 'cota_mallas_enana'),
      reliquia: null,
    },
    mochilaInicial: [
      ITEMS_CATALOGO.find(i => i.id === 'pocion_vida_mayor'),
    ],
    bonusPrimario: 'sabiduria',
    descripcionBonus: 'Karma inicial positivo y resistencia mágica natural.',
  },
];

// Compatibilidad hacia atrás
export const MISIONES = QUESTS_CATALOGO;
export const EVENTOS_VIAJE = EVENTOS_EXPANDIDOS;
export const ITEMS_TIENDA = ITEMS_CATALOGO;

// ────────────────────────────────────────────────────────────
//  TÍTULOS DE EPÍLOGO DINÁMICOS
// ────────────────────────────────────────────────────────────
export const EPILOGOS = [
  {
    id: 'leyenda_marca',
    titulo: 'La Leyenda de la Marca Oscura',
    subtitulo: 'El salvador supremo que quebró la era de sombras',
    condicion: ({ misionFinalCompletada }) => misionFinalCompletada === true,
    cronica: (h) =>
      `Lo que ${h.nombre} logró desafía la comprensión de los mortales. Concluyó la Misión Final Cataclísmica y purgó el mal de raíz. Los reinos del Norte alzan estandartes en su nombre y los dioses inclinan su mirada en señal de respeto. Su nombre resonará por toda la eternidad.`,
    colorTitulo: '#f0c96f',
    icono: 'Crown',
  },
  {
    id: 'heroe_pueblo',
    titulo: 'El Héroe del Pueblo',
    subtitulo: 'Nombre grabado en oro en la plaza mayor',
    condicion: ({ karma, nivel, misionesCompletadas }) =>
      karma >= 25 && nivel >= 3 && (misionesCompletadas || 0) >= 2,
    cronica: (h) =>
      `Los bardos aún entonan las hazañas de ${h.nombre}. Con karma inmaculado forjado en elecciones justas y un corazón generoso, ${h.nombre} completó contratos vitales y devolvió la sonrisa a los campesinos. Las tierras recuperan la paz gracias a su espada.`,
    colorTitulo: '#2ecc71',
    icono: 'Shield',
  },
  {
    id: 'angel_caido',
    titulo: 'El Señor de la Tiranía',
    subtitulo: 'Quien pudo salvar el mundo... y prefirió dominarlo',
    condicion: ({ karma, nivel }) => karma < -20 && nivel >= 2,
    cronica: (h) =>
      `${h.nombre} acumuló un inmenso poder, pero a costa de vender su alma a la oscuridad. Pactos con brujas, saqueos sacrílegos y traiciones sellaron su destino. Hoy su nombre se susurra con temor en las noches cerradas.`,
    colorTitulo: '#e74c3c',
    icono: 'CloudLightning',
  },
  {
    id: 'tabernero_retirado',
    titulo: 'El Tabernero de las Cien Bolsas',
    subtitulo: 'Quizás la taberna era la verdadera aventura',
    condicion: ({ oro }) => oro >= 350,
    cronica: (h) =>
      `Con ${h.oro} monedas de oro en el bolsillo y tras vencer incontables apuestas y contratos, ${h.nombre} compró La Posada del Grifo. Hoy sirve el mejor hidromiel del reino y ríe recordando los días en que casi muere por un puñado de plata.`,
    colorTitulo: '#f39c12',
    icono: 'Coffee',
  },
  {
    id: 'caballero_fracturado',
    titulo: 'El Guerrero que no pudo Continuar',
    subtitulo: 'Caído con honor en el fragor de la batalla',
    condicion: ({ causaMuerte }) => causaMuerte === 'combate',
    cronica: (h) =>
      `${h.nombre} cayó en combate como vivió: empuñando su arma de frente sin retroceder jamás. Sus compañeros recogieron su estandarte y juraron que la tierra donde derramó su sangre no volverá a ser profanada por la oscuridad.`,
    colorTitulo: '#95a5a6',
    icono: 'Skull',
  },
  {
    id: 'errante_silencioso',
    titulo: 'El Errante del Camino Olvidado',
    subtitulo: 'Algunas leyendas eligen desvanecerse',
    condicion: () => true,
    cronica: (h) =>
      `De ${h.nombre} se sabe poco. Llegó una fría noche de invierno a La Posada del Grifo, empuñó su acero contra la penumbra y un día simplemente siguió su marcha hacia tierras lejanas. Pocos recuerdan su rostro, pero su huella perdura.`,
    colorTitulo: '#7f8c8d',
    icono: 'Compass',
  },
];

export function obtenerEpilogo(heroe) {
  for (const ep of EPILOGOS) {
    if (ep.condicion(heroe)) return ep;
  }
  return EPILOGOS[EPILOGOS.length - 1];
}

export function seleccionarMisiones(cantidad = 4, nivelHeroe = 1) {
  // Filtrar misiones disponibles para el nivel del héroe
  const disponibles = QUESTS_CATALOGO.filter(q => q.nivelRequerido <= nivelHeroe);
  const mezcladas = [...disponibles].sort(() => Math.random() - 0.5);
  return mezcladas.slice(0, cantidad);
}

export function obtenerEventoAleatorio(fase = 'ida') {
  const filtrados = EVENTOS_EXPANDIDOS.filter(e => e.fase === fase || e.fase === 'ambas');
  return filtrados[Math.floor(Math.random() * filtrados.length)] || EVENTOS_EXPANDIDOS[0];
}
