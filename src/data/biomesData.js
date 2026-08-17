// src/data/biomesData.js

export const BIOMES = [
    {
        id: 'whispering_woods',
        name: 'El Bosque Susurrante',
        icon: 'Trees',
        description: 'Arboledas densas cubiertas de niebla donde bandidos, dríadas y bestias acechan a los viajeros incautos.',
        dangerLevel: 1,
        baseEscapeChance: 85, // % de probabilidad de volver con éxito en el nivel 1
        events: [
            {
                id: 'ww_abandoned_wagon',
                title: 'El Carromato Volcado',
                description: 'Un carromato de mercader yace atravesado en el sendero con flechas clavadas. Hay cofres cerrados y manchas de sangre fresca.',
                type: 'risk_choice',
                choices: [
                    {
                        text: 'Forzar el cofre reforzado',
                        riskNote: '60% Botín valioso | 40% Trampa de ballesta',
                        rollType: 'lockpick',
                        successRate: 0.6,
                        success: {
                            log: 'Desactivas el resorte y encuentras 45 monedas de oro y una daga élfica.',
                            gold: 45,
                            karma: 0,
                            item: { id: 'elf_dagger', name: 'Daga Élfica', type: 'weapon', bonus: '+10% QTE' }
                        },
                        failure: {
                            log: '¡El cofre estaba trucado! Un dardo envenenado te impacta en el hombro.',
                            hpLoss: 12,
                            status: 'envenenado'
                        }
                    },
                    {
                        text: 'Buscar supervivientes entre los matorrales',
                        riskNote: '50% Aliado agradecido | 50% Emboscada de bandidos',
                        rollType: 'dice_check',
                        attribute: 'wisdom',
                        dc: 12,
                        success: {
                            log: 'Encuentras a una boticaria herida. Agradecida, te cura las heridas y te entrega un Ungüento de Raíces.',
                            hpGain: 15,
                            karma: 2,
                            item: { id: 'root_ointment', name: 'Ungüento de Raíces', type: 'consumable', heal: 20 }
                        },
                        failure: {
                            log: '¡Era un señuelo! Tres bandidos saltan de las copas de los árboles.',
                            minigame: 'qte',
                            penaltyOnLose: { hpLoss: 18, goldLoss: 20 }
                        }
                    },
                    {
                        text: 'Ignorar el carromato y rodear la zona con sigilo',
                        riskNote: '100% Seguro (Sin riesgo, sin recompensa)',
                        success: {
                            log: 'Decides no tentar a la suerte y sigues avanzando entre la maleza.',
                            gold: 0
                        }
                    }
                ]
            },
            {
                id: 'ww_dryad_shrine',
                title: 'El Santuario de la Dríada',
                description: 'Un viejo roble emite un resplandor esmeralda. Una figura etérea te observa desde las ramas con ojos juzgadores.',
                type: 'moral_choice',
                choices: [
                    {
                        text: 'Ofrendar 15 monedas de oro al santuario',
                        riskNote: 'Bendición garantizada (+Karma)',
                        success: {
                            log: 'La dríada susurra palabras antiguas. Tu vitalidad y maná se restauran por completo.',
                            goldLoss: 15,
                            hpGain: 30,
                            manaGain: 20,
                            karma: 3
                        }
                    },
                    {
                        text: 'Talar la rama de madera arcana para venderla',
                        riskNote: '40% Madera de gran valor | 60% Ira del bosque',
                        rollType: 'qte',
                        successRate: 0.4,
                        success: {
                            log: 'Cortas la rama mágica antes de que el espíritu reaccione. Los magos pagarán una fortuna.',
                            gold: 80,
                            karma: -3
                        },
                        failure: {
                            log: 'Las raíces del suelo cobran vida, aprisionándote y drenando tu energía vital.',
                            hpLoss: 22,
                            manaLoss: 15,
                            karma: -3
                        }
                    }
                ]
            },
            {
                id: 'ww_lost_wanderer',
                title: 'El Errante Encapuchado (Engaño Procedural)',
                description: 'Un anciano tembloroso pide limosna y comida junto a una hoguera apagada.',
                type: 'deception_event',
                isDeceptiveSeed: true, // El juego evalúa al azar en runtime si es ladrón o maestro
                honestOutcome: {
                    text: 'Compartir raciones y charlar',
                    log: 'El anciano resulta ser un veterano de guerra retirado. Te enseña una técnica de combate (+1 Fuerza).',
                    karma: 2,
                    statBuff: { stat: 'fuerza', amount: 1 }
                },
                traitorOutcome: {
                    text: 'Compartir raciones y charlar',
                    log: '¡Al acercarte, el supuesto anciano arroja arena a tus ojos y te corta la bolsa del cinto!',
                    goldLoss: 35,
                    hpLoss: 5,
                    karma: 0
                }
            }
        ]
    },
    {
        id: 'forgotten_crypts',
        name: 'Las Criptas Olvidadas',
        icon: 'Skull',
        description: 'Catacumbas subterráneas donde moran cultistas de la nigromancia y trampas de piedra milenarias.',
        dangerLevel: 3,
        baseEscapeChance: 70,
        events: [
            {
                id: 'fc_runic_vault',
                title: 'La Puerta de las Cuatro Calaveras',
                description: 'Un portón de hierro sellado con runas arcanas parpadeantes. Detrás resuena el eco de oro acumulado.',
                type: 'puzzle_trap',
                choices: [
                    {
                        text: 'Descifrar la secuencia de runas',
                        riskNote: 'Minijuego de Memoria contra reloj (10s)',
                        minigame: 'memory_runes',
                        success: {
                            log: 'Las runas se iluminan al unísono y la losa se desplaza: encuentras un Cáliz de Rubíes y 90 monedas.',
                            gold: 90,
                            item: { id: 'ruby_chalice', name: 'Cáliz Sagrado', type: 'relic', bonus: '+15% Oro en misiones' }
                        },
                        failure: {
                            log: 'Secuencia fallida. Un gas corrosivo inunda la sala.',
                            hpLoss: 25,
                            status: 'enfermo'
                        }
                    },
                    {
                        text: 'Forzar los engranajes con una palanca de hierro',
                        riskNote: '30% Éxito brutal | 70% Derrumbe de techo',
                        rollType: 'dice_check',
                        attribute: 'fuerza',
                        dc: 15,
                        success: {
                            log: 'Con un esfuerzo titánico revientas el pestillo antes de que caiga el contrapeso.',
                            gold: 60
                        },
                        failure: {
                            log: '¡El techo cede! Bloques de granito caen sobre tus piernas.',
                            hpLoss: 35,
                            riskTrapped: true // Aumenta dificultad de escape
                        }
                    }
                ]
            },
            {
                id: 'fc_necromancer_altar',
                title: 'El Altar de los Condenados',
                description: 'Un nigromante encapuchado está a punto de sacrificar a una joven doncella sobre una mesa de obsidiana.',
                type: 'high_stakes_combat',
                choices: [
                    {
                        text: 'Cargar por sorpresa contra el nigromante',
                        riskNote: 'QTE de Alta Velocidad (Parada perfecta requerida)',
                        minigame: 'qte',
                        qteSpeed: 'fast',
                        success: {
                            log: 'Atraviesas el corazón del hechicero antes de que complete el conjuro. Rescatas a Elenor, hija de un noble.',
                            gold: 70,
                            karma: 5,
                            companionUnlocked: { name: 'Elenor la Erudita', role: 'Compañera', bonus: '+2 Sabiduría' }
                        },
                        failure: {
                            log: 'El nigromante desvía tu arma con una barrera espectral y te lanza una ráfaga de fuego fatuo.',
                            hpLoss: 30,
                            manaLoss: 20
                        }
                    },
                    {
                        text: 'Pactar con el nigromante: ignorar el ritual a cambio de poder oscuro',
                        riskNote: '100% Obtienes Grimoire Oscuro | -6 Karma',
                        success: {
                            log: 'Aceptas el tomo prohibido y te marchas en silencio ignorando los gritos.',
                            karma: -6,
                            item: { id: 'dark_grimoire', name: 'Grimorio de Almas', type: 'relic', bonus: '+3 Daño mágico' }
                        }
                    }
                ]
            }
        ]
    },
    {
        id: 'witches_swamp',
        name: 'El Pantano de las Brujas',
        icon: 'Flame',
        description: 'Aguas estancadas, gas metano y cabañas sobre pilotes donde pactar con brujas puede costar tu propia alma.',
        dangerLevel: 4,
        baseEscapeChance: 55,
        events: [
            {
                id: 'ws_hags_cauldron',
                title: 'El Caldero Humeante',
                description: 'Tres brujas del pantano cantan alrededor de un brebaje purpúreo. Al verte, te ofrecen beber a cambio de un favor.',
                type: 'gamble_hazard',
                choices: [
                    {
                        text: 'Beber del caldero',
                        riskNote: '50% Mutación poderosa | 50% Veneno mortal (-35 HP)',
                        rollType: 'percentage',
                        successRate: 0.5,
                        success: {
                            log: 'El líquido quema tus venas y sientes una fuerza sobrenatural permanente (+2 a todos los atributos).',
                            statBuffAll: 2,
                            hpLoss: 10
                        },
                        failure: {
                            log: 'El brebaje es ácido puro. Tus entrañas se retuercen entre vómitos de sangre.',
                            hpLoss: 35
                        }
                    },
                    {
                        text: 'Robar ingredientes del estante mientras están distraídas',
                        riskNote: 'Ganzúa / QTE de Precisión',
                        minigame: 'lockpick',
                        success: {
                            log: 'Sustraes Raíz de Mandrágora y Ojos de Basilisco valorados en una fortuna.',
                            gold: 120,
                            karma: -1
                        },
                        failure: {
                            log: 'Pisas una rama crujiente. Las brujas te maldicen antes de que logres huir.',
                            hpLoss: 20,
                            status: 'maldito'
                        }
                    }
                ]
            },
            {
                id: 'ws_quicksand_trap',
                title: 'Las Arenas Movedizas',
                description: 'La tierra cede bajo tus botas. El lodo te engulle rápidamente hasta el pecho.',
                type: 'deadly_hazard',
                choices: [
                    {
                        text: 'Lanzar un gancho a la raíz más cercana',
                        riskNote: 'QTE de Reflejos Inmediato',
                        minigame: 'qte',
                        qteSpeed: 'extreme',
                        success: {
                            log: 'Te impulsas con la cuerda y sales del fango con el corazón en la garganta.',
                            manaLoss: 5
                        },
                        failure: {
                            log: 'La cuerda se rompe. Te hundes en la fosa y tu aventura termina bajo el lodo.',
                            instantDeath: true,
                            deathReason: 'Ahogado en las profundidades del Pantano de las Brujas'
                        }
                    }
                ]
            }
        ]
    }
];

// Helper para calcular si el jugador logra escapar a la taberna según la profundidad
export const calculateEscapeRisk = (biome, depthLevel) => {
    // Cada nivel de profundidad reduce un 15% las probabilidades de huir
    const finalChance = Math.max(10, biome.baseEscapeChance - ((depthLevel - 1) * 15));
    const roll = Math.random() * 100;
    return {
        escaped: roll <= finalChance,
        chancePercent: finalChance
    };
};