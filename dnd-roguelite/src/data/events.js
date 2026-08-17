// ============================================================
//  events.js — Catálogo de 26+ Eventos Procedurales de Viaje
//  Clasificados por fase: 'ida' | 'vuelta' | 'especial'
//  Tipos: combate | moral | trampa | aliado | romance | tesoro | arcano | traicion
// ============================================================

export const EVENTOS_EXPANDIDOS = [
  // ──────────────────────────────────────────────────────────
  //  FASE 1: IDA (EN CAMINO AL OBJETIVO)
  // ──────────────────────────────────────────────────────────

  // 1. Emboscada de Mercenarios
  {
    id: 'emboscada_bandidos_1',
    fase: 'ida',
    tipo: 'combate',
    titulo: 'Emboscada en el Desfiladero',
    descripcion: 'Varios tiradores orcos y forajidos bloquean el paso con troncos ardiendo. El aire huele a azufre y flechas envenenadas.',
    icono: 'Swords',
    opciones: [
      {
        id: 'combatir',
        texto: 'Cargar de frente y quebrar sus filas (QTE)',
        tipo: 'qte',
        qte: { titulo: '¡Carga contra los Orcos!', vel: 1.3, zona: [36, 56] },
        exito: { txt: 'Atraviesas su barricada con una ferocidad imparable. Los orcos huyen dejando su botín.', hp: 0, mana: -10, oro: 45, karma: 2, xp: 35 },
        parcial: { txt: 'Abres paso a través del fuego, pero una flecha te roza el hombro.', hp: -15, mana: -5, oro: 20, karma: 1, xp: 20 },
        fallo: { txt: 'Te acorralan bajo una lluvia de proyectiles. Escapas gravemente herido.', hp: -35, mana: -15, oro: -15, karma: 0, xp: 10 },
      },
      {
        id: 'sigilo_desfiladero',
        texto: 'Flanquear por las rocas altas (Destreza DC 13)',
        tipo: 'dado',
        stat: 'destreza',
        dc: 13,
        exito: { txt: 'Te deslizas sin ser visto sobre los tiradores y tomas su cofre de suministros.', hp: 0, mana: 0, oro: 35, karma: 1, xp: 25 },
        fallo: { txt: 'Cae gravilla alertando a los vigías. Te disparan mientras huyes.', hp: -22, mana: 0, oro: 0, karma: 0, xp: 10 },
      },
      {
        id: 'sobornar_orcos',
        texto: 'Pagar peaje de sangre (40 oro)',
        tipo: 'costo',
        costeOro: 40,
        exito: { txt: 'Arrojas la bolsa. El cabecilla ríe entre dientes y despeja el camino.', hp: 0, mana: 0, oro: -40, karma: -2, xp: 5 },
        fallo: { txt: 'No tienes suficiente oro. Se enfurecen y te atacan a traición.', hp: -25, mana: 0, oro: 0, karma: -1, xp: 5 },
      },
    ],
  },

  // 2. Cofre Sellado con Runas
  {
    id: 'cofre_runico_camino',
    fase: 'ida',
    tipo: 'arcano',
    titulo: 'El Cofre Rúnico de los Magos Rojos',
    descripcion: 'Semienterrado bajo un sauce marchito yace un cofre cubierto de glifos pulsantes. Si las runas no se emparejan a tiempo, el mecanismo de autodestrucción lo pulverizará.',
    icono: 'Sparkles',
    opciones: [
      {
        id: 'descifrar_runas',
        texto: 'Descifrar la combinación de runas (Minijuego de Memoria)',
        tipo: 'memoria',
        memoria: { parejas: 3, tiempo: 22, titulo: 'Descifrar Sello Rúnico' },
        exito: { txt: '¡Los glifos resuenan en armonía y el cerrojo cede! Encuentras gemas arcanas y oro antiguo.', hp: 0, mana: 15, oro: 70, karma: 2, xp: 45 },
        fallo: { txt: 'El sello colapsa en una onda de choque arcana que quema tus manos y destruye el contenido.', hp: -25, mana: -20, oro: 0, karma: 0, xp: 10 },
      },
      {
        id: 'forzar_fuerza',
        texto: 'Intentar reventar el candado con fuerza bruta (Fuerza DC 16)',
        tipo: 'dado',
        stat: 'fuerza',
        dc: 16,
        exito: { txt: 'De un tremendo golpe revientas la bisagra antes de que el hechizo detone. Rescatas parte del tesoro.', hp: -5, mana: 0, oro: 40, karma: 0, xp: 25 },
        fallo: { txt: 'El golpe activa la trampa de fuego en tu rostro.', hp: -30, mana: 0, oro: 0, karma: 0, xp: 5 },
      },
      {
        id: 'dejar_cofre',
        texto: 'No tentar al destino y seguir marchando',
        tipo: 'inmediato',
        resultado: { txt: 'La prudencia te mantiene ileso. Continuas la senda.', hp: 0, mana: 0, oro: 0, karma: 1, xp: 5 },
      },
    ],
  },

  // 3. Compañero: Lyra la Cazadora de Monstruos
  {
    id: 'companero_lyra',
    fase: 'ida',
    tipo: 'aliado',
    titulo: 'La Pista de la Cazadora Lyra',
    descripcion: 'Una elfa de mirada penetrante con un arco de madera de tejo remata a una cría de basilisco. Te observa de arriba a abajo y ofrece unir fuerzas temporalmente.',
    icono: 'Users',
    opciones: [
      {
        id: 'reclutar_lyra',
        texto: 'Compartir provisiones y viajar juntos (Sabiduría DC 12)',
        tipo: 'dado',
        stat: 'sabiduria',
        dc: 12,
        exito: {
          txt: 'Lyra sonríe y acepta tu compañía. Su instinto cazador amplía tus reflejos en combate.',
          hp: 10, mana: 0, oro: 0, karma: 6, xp: 35,
          companero: { id: 'lyra', nombre: 'Lyra la Cazadora', bonusTexto: '+10% zona verde en QTE', tipo: 'cazadora' },
        },
        fallo: { txt: 'Lyra desconfía de tus intenciones pero te regala un bálsamo medicinal antes de partir en solitario.', hp: 20, mana: 0, oro: 0, karma: 2, xp: 15 },
      },
      {
        id: 'rechazar_lyra',
        texto: 'Declinar amablemente. Prefieres viajar en soledad.',
        tipo: 'inmediato',
        resultado: { txt: 'Cada uno toma su sendero. La soledad tiene su propio peso.', hp: 0, mana: 0, oro: 0, karma: 0, xp: 5 },
      },
    ],
  },

  // 4. Decisión Moral: El Aldeano Acusado
  {
    id: 'aldeano_acusado',
    fase: 'ida',
    tipo: 'moral',
    titulo: 'El Juicio del Árbol de los Ahorcados',
    descripcion: 'Una turba enfurecida de aldeanos está a punto de colgar a un joven acusado de robar trigo del señor feudal para alimentar a sus hermanos enfermos.',
    icono: 'Heart',
    opciones: [
      {
        id: 'defender_joven',
        texto: 'Intervenir con tu espada y pagar la deuda del muchacho (30 oro)',
        tipo: 'costo',
        costeOro: 30,
        exito: { txt: 'Pagas la deuda y amenazas a la turba. El muchacho te jura eterna lealtad y el pueblo te ve como un héroe justo.', hp: 0, mana: 0, oro: -30, karma: 15, xp: 40 },
        fallo: { txt: 'No tienes suficiente oro para aplacar a la turba y la situación escala en una pelea callejera.', hp: -15, mana: 0, oro: 0, karma: 5, xp: 15 },
      },
      {
        id: 'intimidar_turba',
        texto: 'Intimidar a la turba con tu presencia marcial (Fuerza DC 14)',
        tipo: 'dado',
        stat: 'fuerza',
        dc: 14,
        exito: { txt: 'Desenvainas tu arma con una mirada gélida. La muchedumbre se dispersa atemorizada.', hp: 0, mana: 0, oro: 0, karma: 8, xp: 30 },
        fallo: { txt: 'Los aldeanos te arrojan piedras y antorchas antes de dispersarse.', hp: -18, mana: 0, oro: 0, karma: 2, xp: 10 },
      },
      {
        id: 'unirse_linchamiento',
        texto: 'Apoyar al señor feudal y reclamar parte de la recompensa',
        tipo: 'inmediato',
        resultado: { txt: 'El alguacil te entrega unas monedas ensangrentadas. Tu alma se oscurece con el peso del acto.', hp: 0, mana: 0, oro: 35, karma: -15, xp: 15 },
      },
    ],
  },

  // 5. Trampa de Agujas Venenosas
  {
    id: 'trampa_agujas_cripta',
    fase: 'ida',
    tipo: 'trampa',
    titulo: 'El Mecanismo de las Agujas de Sierpe',
    descripcion: 'Al pisar una losa falsa en el puente subterráneo, una compuerta de dardos envenenados se arma con un chasquido metálico.',
    icono: 'AlertTriangle',
    opciones: [
      {
        id: 'desarmar_qte',
        texto: 'Parar el engranaje central antes del disparo (QTE)',
        tipo: 'qte',
        qte: { titulo: '¡Frena el Mecanismo!', vel: 1.5, zona: [38, 54] },
        exito: { txt: 'Introduces tu daga en el diente exacto. El mecanismo se desarma y recoges el veneno intacto.', hp: 0, mana: 0, oro: 25, karma: 1, xp: 30 },
        parcial: { txt: 'Logras trabar parte del mecanismo, pero un dardo te rasga la pierna.', hp: -18, mana: -5, oro: 0, karma: 0, xp: 15 },
        fallo: { txt: 'Una andanada de púas venenosas te alcanza de lleno. El veneno arde en tus venas.', hp: -35, mana: -15, oro: 0, karma: 0, xp: 5 },
      },
      {
        id: 'salto_reflejo',
        texto: 'Lanzarte al vacío hacia la repisa inferior (Destreza DC 14)',
        tipo: 'dado',
        stat: 'destreza',
        dc: 14,
        exito: { txt: 'Aterrizas limpiamente esquivando la salva de dardos en el aire.', hp: -5, mana: 0, oro: 0, karma: 0, xp: 20 },
        fallo: { txt: 'El impacto contra las rocas te fractura las costillas.', hp: -28, mana: 0, oro: 0, karma: 0, xp: 5 },
      },
    ],
  },

  // 6. Romance / Compañero: Morgana la Hechicera Renegada
  {
    id: 'companero_morgana',
    fase: 'ida',
    tipo: 'romance',
    titulo: 'El Santuario Oculto de Morgana',
    descripcion: 'Entre zarzas espinosas encuentras una torre en ruinas donde una hechicera de ojos violetas traza círculos de invocación. Te ofrece té de hierbas lunares y secretos prohibidos.',
    icono: 'Flame',
    opciones: [
      {
        id: 'meditar_morgana',
        texto: 'Meditar junto a ella y sintonizar vuestras mentes (Inteligencia DC 13)',
        tipo: 'dado',
        stat: 'inteligencia',
        dc: 13,
        exito: {
          txt: 'La chispa mágica arde entre ambos. Morgana decide acompañarte para estudiar los misterios de tu destino.',
          hp: 15, mana: 40, oro: 0, karma: 4, xp: 45,
          companero: { id: 'morgana', nombre: 'Morgana la Hechicera', bonusTexto: '+25 Maná Máx y pistas en Runas', tipo: 'hechicera' },
        },
        fallo: { txt: 'La sobrecarga mágica te marea, pero Morgana cura tus fatigas con un beso misterioso en la frente.', hp: 25, mana: 15, oro: 0, karma: 2, xp: 20 },
      },
      {
        id: 'exigir_tributo',
        texto: 'Acusarla de brujería y exigirle que pague por su herejía',
        tipo: 'inmediato',
        resultado: { txt: 'Morgana desata una ráfaga de viento helado que te expulsa de la torre magullado.', hp: -20, mana: -10, oro: 0, karma: -8, xp: 10 },
      },
    ],
  },

  // 7. Traición y Tentación: La Bruja de la Ciénaga
  {
    id: 'pacto_bruja_cienaga',
    fase: 'ida',
    tipo: 'traicion',
    titulo: 'La Oferta de la Bruja de la Ciénaga',
    descripcion: 'Una anciana con garras de cuervo emerge del lodo con una botella de almas brillantes: "Dame un poco de tu sangre vital, viajero, y te haré inmensamente rico... a un pequeño precio moral."',
    icono: 'Skull',
    opciones: [
      {
        id: 'aceptar_pacto_oscuro',
        texto: 'Pactar con la Bruja (−20 HP Máx a cambio de 120 oro)',
        tipo: 'inmediato',
        resultado: { txt: 'La bruja bebe tu vitalidad con deleite y arroja un saco rebosante de monedas de oro antiguo.', hp: -20, mana: 0, oro: 120, karma: -20, xp: 25 },
      },
      {
        id: 'purgar_bruja',
        texto: 'Desenvainar y purgar a la criatura (Sabiduría DC 15)',
        tipo: 'dado',
        stat: 'sabiduria',
        dc: 15,
        exito: { txt: 'Tu fe canaliza una luz cegadora que disuelve a la bruja en cenizas. Liberas las almas atrapadas.', hp: 0, mana: -15, oro: 40, karma: 20, xp: 50 },
        fallo: { txt: 'La bruja te maldice con visiones terroríficas antes de desaparecer en el fango.', hp: -25, mana: -20, oro: 0, karma: 5, xp: 15 },
      },
      {
        id: 'rechazar_bruja',
        texto: 'Hacer el signo protector y marcharte deprisa',
        tipo: 'inmediato',
        resultado: { txt: 'Caminas sin mirar atrás mientras sus risas malévolas resuenan en la niebla.', hp: 0, mana: 0, oro: 0, karma: 3, xp: 5 },
      },
    ],
  },

  // 8. Tumba Profanada de los Héroes
  {
    id: 'tumba_heroes_antiguos',
    fase: 'ida',
    tipo: 'moral',
    titulo: 'El Mausoleo de los Siete Paladines',
    descripcion: 'Una tumba sagrada con los sarcófagos intactos de antiguos paladines. Una espada ceremonial de plata reluce sobre el altar.',
    icono: 'Cross',
    opciones: [
      {
        id: 'rezar_bendicion',
        texto: 'Arrodillarte y rezar con respeto por sus almas',
        tipo: 'inmediato',
        resultado: { txt: 'Una calidez divina desciende sobre ti. Tus heridas sanan y tu espíritu se llena de fervor.', hp: 35, mana: 30, oro: 0, karma: 12, xp: 30 },
      },
      {
        id: 'saquear_espada',
        texto: 'Tomar la espada de plata y las joyas del altar',
        tipo: 'inmediato',
        resultado: { txt: 'Tomas el botín, pero un frío espectral recorre tu espina dorsal. Una maldición pesa sobre tu karma.', hp: 0, mana: 0, oro: 85, karma: -18, xp: 20 },
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  //  FASE 2: REGRESO / VUELTA (DE VUELTA A LA TABERNA)
  // ──────────────────────────────────────────────────────────

  // 9. Romance / Compañero: Valerius el Bardo Errante
  {
    id: 'companero_valerius',
    fase: 'vuelta',
    tipo: 'romance',
    titulo: 'Las Baladas de Valerius',
    descripcion: 'Junto a una fogata a la orilla del camino, un apuesto bardo de cabellos dorados toca un laúd melancólico. Te invita a compartir vino especiado y escuchar sus historias.',
    icono: 'Flame',
    opciones: [
      {
        id: 'cantar_valerius',
        texto: 'Compartir tus hazañas y cantar bajo las estrellas (Sabiduría DC 11)',
        tipo: 'dado',
        stat: 'sabiduria',
        dc: 11,
        exito: {
          txt: 'Valerius queda fascinado por tu valentía. Compone una balada en tu honor y decide acompañarte como cronista y amante.',
          hp: 20, mana: 25, oro: 15, karma: 8, xp: 40,
          companero: { id: 'valerius', nombre: 'Valerius el Bardo', bonusTexto: '+20% oro ganado y moral alta', tipo: 'bardo' },
        },
        fallo: { txt: 'Desafinas un poco pero la velada es cálida y reconfortante. Descansas plenamente.', hp: 25, mana: 20, oro: 0, karma: 4, xp: 15 },
      },
      {
        id: 'seguir_noche',
        texto: 'Agradecer el vino y continuar la marcha nocturna',
        tipo: 'inmediato',
        resultado: { txt: 'La música de Valerius te acompaña en la distancia mientras avanzas hacia el hogar.', hp: 5, mana: 5, oro: 0, karma: 1, xp: 5 },
      },
    ],
  },

  // 10. La Celada del Puente del Diablo
  {
    id: 'celada_puente_diablo',
    fase: 'vuelta',
    tipo: 'combate',
    titulo: 'La Celada del Puente del Diablo',
    descripcion: 'Mercenarios contratados por enemigos que te ganaste en tu última misión te esperan con ballestas pesadas en el estrecho puente colgante.',
    icono: 'Swords',
    opciones: [
      {
        id: 'batalla_puente_qte',
        texto: 'Pelear sobre las tablas crujientes (QTE)',
        tipo: 'qte',
        qte: { titulo: '¡Duelo en el Abismo!', vel: 1.4, zona: [35, 55] },
        exito: { txt: 'Cortas las cuerdas del flanco enemigo. Tres mercenarios caen al río y el resto huye despavorido.', hp: -5, mana: -10, oro: 60, karma: 3, xp: 40 },
        parcial: { txt: 'Vences a duras penas, pero recibes varios cortes profundos.', hp: -25, mana: -15, oro: 25, karma: 1, xp: 20 },
        fallo: { txt: 'Te empujan al río helado. Nadas hasta la orilla perdiendo parte de tu bolsa.', hp: -40, mana: -25, oro: -35, karma: 0, xp: 10 },
      },
      {
        id: 'nadar_corriente',
        texto: 'Saltar preventivamente y descender con la corriente (Destreza DC 15)',
        tipo: 'dado',
        stat: 'destreza',
        dc: 15,
        exito: { txt: 'Nadas como una nutria entre los rápidos y apareces río abajo fuera de su alcance.', hp: -8, mana: 0, oro: 0, karma: 0, xp: 25 },
        fallo: { txt: 'Las rocas del fondo te golpean con violencia.', hp: -32, mana: 0, oro: 0, karma: 0, xp: 5 },
      },
    ],
  },

  // 11. Caravana de Refugiados
  {
    id: 'caravana_refugiados',
    fase: 'vuelta',
    tipo: 'moral',
    titulo: 'La Caravana de los Desplazados',
    descripcion: 'Una columna de familias huyendo de tierras arrasadas por monstruos tiene una carreta con una rueda rota. Los lobos aúllan cerca.',
    icono: 'Heart',
    opciones: [
      {
        id: 'reparar_escoltar',
        texto: 'Ayudar a reparar la carreta y escoltarlos hasta el pueblo (Fuerza DC 12)',
        tipo: 'dado',
        stat: 'fuerza',
        dc: 12,
        exito: { txt: 'Levantas la carreta con vigor. Llegas a la taberna aclamado por los ancianos y niños.', hp: 0, mana: -10, oro: 20, karma: 18, xp: 45 },
        fallo: { txt: 'El esfuerzo te agota los músculos, pero logras llevarlos a salvo.', hp: -12, mana: -10, oro: 10, karma: 12, xp: 25 },
      },
      {
        id: 'donar_oro_refugiados',
        texto: 'Darles 25 monedas de oro para que contraten guardias',
        tipo: 'costo',
        costeOro: 25,
        exito: { txt: 'Las madres te bendicen con lágrimas en los ojos. Tu nombre será recordado.', hp: 0, mana: 0, oro: -25, karma: 15, xp: 30 },
        fallo: { txt: 'No tienes suficiente oro para darles.', hp: 0, mana: 0, oro: 0, karma: 0, xp: 0 },
      },
      {
        id: 'ignorar_refugiados',
        texto: 'Apurar el paso. Las tierras salvajes son crueles.',
        tipo: 'inmediato',
        resultado: { txt: 'Ignoras sus súplicas. Los aullidos se escuchan a tu espalda.', hp: 0, mana: 0, oro: 0, karma: -12, xp: 0 },
      },
    ],
  },

  // 12. El Altar Olvidado en la Niebla
  {
    id: 'altar_niebla_runas',
    fase: 'vuelta',
    tipo: 'arcano',
    titulo: 'El Monolito de las Cuatro Lunas',
    descripcion: 'En mitad del bosque surge un círculo de piedras resplandecientes que guardan una ofrenda sagrada de la antigüedad.',
    icono: 'Sparkles',
    opciones: [
      {
        id: 'resolver_monolito',
        texto: 'Resolver la secuencia de runas lunares (Minijuego de Memoria)',
        tipo: 'memoria',
        memoria: { parejas: 4, tiempo: 25, titulo: 'Secuencia del Monolito Lunar' },
        exito: { txt: '¡Una columna de luz plateada te envuelve! Restauras toda tu vitalidad y maná por completo.', hp: 50, mana: 50, oro: 30, karma: 8, xp: 50 },
        fallo: { txt: 'La energía lunar te rechaza con un relámpago plateado.', hp: -20, mana: -15, oro: 0, karma: 0, xp: 10 },
      },
      {
        id: 'rezar_respeto',
        texto: 'Inclinar la cabeza con humildad y pasar de largo',
        tipo: 'inmediato',
        resultado: { txt: 'Sientes una suave brisa bendita que calma tus dolores.', hp: 15, mana: 15, oro: 0, karma: 3, xp: 10 },
      },
    ],
  },

  // 13. El Cazador Furtivo Atrapado
  {
    id: 'cazador_furtivo',
    fase: 'vuelta',
    tipo: 'moral',
    titulo: 'El Trampero en su Propio Cepo',
    descripcion: 'Un furtivo que cazaba unicornios en el bosque sagrado ha caído en su propia trampa de oso y pide auxilio a gritos.',
    icono: 'AlertTriangle',
    opciones: [
      {
        id: 'liberar_furtivo',
        texto: 'Liberarlo pero confiscar su botín robado',
        tipo: 'inmediato',
        resultado: { txt: 'Abres el cepo y te quedas con sus pieles y joyas. El hombre huye cojeando.', hp: 0, mana: 0, oro: 50, karma: 2, xp: 20 },
      },
      {
        id: 'dejarlo_suerte',
        texto: 'Dejarlo a merced de los espíritus del bosque por profanador',
        tipo: 'inmediato',
        resultado: { txt: 'Los árboles parecen susurrar su aprobación ante el castigo del bosque.', hp: 0, mana: 0, oro: 0, karma: -4, xp: 10 },
      },
    ],
  },

  // 14. Tesoro en el Árbol Hueco
  {
    id: 'arbol_hueco_vuelta',
    fase: 'vuelta',
    tipo: 'tesoro',
    titulo: 'El Alijo del Ladrón Caído',
    descripcion: 'Siguiendo marcas de tiza en los robles, encuentras un árbol hueco con un saco sellado con lacre noble.',
    icono: 'MapPin',
    opciones: [
      {
        id: 'abrir_alijo',
        texto: 'Tomar el alijo sin dudar',
        tipo: 'inmediato',
        resultado: { txt: '¡Monedas de plata, un anillo de ámbar y cartas de cambio! Un gran botín de regreso.', hp: 0, mana: 0, oro: 65, karma: -2, xp: 20 },
      },
      {
        id: 'entregar_guardia',
        texto: 'Llevarlo a la guardia de la taberna para buscar a su dueño',
        tipo: 'inmediato',
        resultado: { txt: 'El capitán te recompensa con una gratificación oficial y su respeto.', hp: 0, mana: 0, oro: 30, karma: 10, xp: 25 },
      },
    ],
  },

  // 15. Romance: La Dama / Caballero de la Torre Aislada
  {
    id: 'romance_torre_noble',
    fase: 'vuelta',
    tipo: 'romance',
    titulo: 'Luz en la Atalaya Abandonada',
    descripcion: 'Una figura de porte noble vestida con sedas oscuras te observa desde el balcón de una atalaya solitaria. Te invita a resguardarte de la tormenta que se avecina.',
    icono: 'Flame',
    opciones: [
      {
        id: 'cenar_torre',
        texto: 'Aceptar la invitación y cenar junto al fuego (Carisma / Sabiduría DC 12)',
        tipo: 'dado',
        stat: 'sabiduria',
        dc: 12,
        exito: { txt: 'Una velada de confidencias, miradas cómplices y promesas para cuando la Marca Oscura sea derrotada.', hp: 30, mana: 30, oro: 20, karma: 5, xp: 35 },
        fallo: { txt: 'La cena es algo tensa por la desconfianza mutua, pero duermes en cama blanda.', hp: 20, mana: 15, oro: 0, karma: 1, xp: 15 },
      },
      {
        id: 'continuar_lluvia',
        texto: 'Declinar y seguir bajo la lluvia para llegar cuanto antes',
        tipo: 'inmediato',
        resultado: { txt: 'Llegas empapado pero con el deber cumplido.', hp: -5, mana: 0, oro: 0, karma: 0, xp: 5 },
      },
    ],
  },

  // 16. La Aparición del Fantasma del Héroe Caído
  {
    id: 'aparicion_fantasma',
    fase: 'vuelta',
    tipo: 'arcano',
    titulo: 'El Espectro del Guardián Plateado',
    descripcion: 'Un espectro azulado con armadura centelleante se manifiesta en el sendero: "Aquel que porta la llama del coraje debe demostrar que su mente es tan afilada como su acero."',
    icono: 'Sparkles',
    opciones: [
      {
        id: 'resolver_acertijo_espectro',
        texto: 'Descifrar su enigma espiritual (Minijuego de Memoria)',
        tipo: 'memoria',
        memoria: { parejas: 3, tiempo: 20, titulo: 'Juicio del Guardián Espectral' },
        exito: { txt: 'El espectro asiente con reverencia y te otorga la Bendición del Alba: +30 HP Máx y XP generosa.', hp: 40, mana: 40, oro: 0, karma: 10, xp: 60 },
        fallo: { txt: 'El espectro niega con tristeza y una ráfaga helada te deja temblando.', hp: -20, mana: -20, oro: 0, karma: 0, xp: 10 },
      },
      {
        id: 'pasar_temeroso',
        texto: 'Rezar y rodear al fantasma sin mirarlo a los ojos',
        tipo: 'inmediato',
        resultado: { txt: 'El espectro se disuelve en niebla fría sin dañarte.', hp: 0, mana: 0, oro: 0, karma: 0, xp: 5 },
      },
    ],
  },
];
