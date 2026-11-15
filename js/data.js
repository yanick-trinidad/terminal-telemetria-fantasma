// Diccionario Bilingüe (ES / EN), Storytelling de Mateo, Identidad Cultural México y 4 Misiones
// Terminal de Telemetría Fantasma - Equipo Mapache Cosmos

const TEXTOS_UI = {
  es: {
    // Pantalla 1: Storytelling de Bienvenida (Mateo)
    introBadge: "ARCHIVO ENCONTRADO // ESTACIÓN GUAYMAS, SONORA",
    introTitulo: "EL CÓDICE DEL ESPACIO PROFUNDO",
    introBtnSiguiente: "SIGUIENTE VIÑETA ➔",
    introBtnIniciar: "🚀 ENCENDER TERMINAL ESPACIAL",
    introBtnSaltar: "Saltar historia ➔",

    // Pantalla 2: Consola Principal
    titulo: "TERMINAL DE TELEMETRÍA FANTASMA",
    subtitulo: "PUENTE ESTELAR MÉXICO – NASA // EQUIPO MAPACHE COSMOS",
    btnHistoria: "📖 HISTORIA",
    btnLuna: "🌑 LUNA",
    btnMarte: "🔴 MARTE",
    sectorLuna: "SECTOR ACTIVO: SUPERFICIE LUNAR (COYOLXAUHQUI)",
    sectorMarte: "SECTOR ACTIVO: SUPERFICIE MARCIANA (CÓDICE DRESDE)",
    lblHardware: "[ 🔧 HARDWARE DE LA SONDA ]",
    lblCiencia: "[ 🔬 DESCUBRIMIENTO CIENTÍFICO ]",
    lblMexico: "[ 🇲🇽 PUENTE ESTELAR: MÉXICO Y EL COSMOS ]",
    lblBitacora: "🎙️ BITÁCORA DE VOZ RECUPERADA",
    btnPlay: "▶ ESCUCHAR BITÁCORA",
    btnStop: "❚❚ DETENER AUDIO",
    btnNasa: "↗ VER ARCHIVO OFICIAL EN NASA.GOV",
    btnJugarMision: "🎮 INICIAR MISIÓN JUGABLE (AUDIO SINCRONIZADO)",

    // Modal del Juego
    lblAudioBloqueado: "📡 TRANSMISIÓN EN CURSO — ESCUCHA LA BITÁCORA MIENTRAS COMPLETAS LA MISIÓN",
    btnCerrarJuego: "[ SALIR DE MISIÓN ]"
  },
  en: {
    // Screen 1: Welcome Storytelling (Mateo)
    introBadge: "RECOVERED ARCHIVE // GUAYMAS STATION, SONORA",
    introTitulo: "THE DEEP SPACE CODEX",
    introBtnSiguiente: "NEXT SCENE ➔",
    introBtnIniciar: "🚀 POWER ON SPACE TERMINAL",
    introBtnSaltar: "Skip story ➔",

    // Screen 2: Main Console
    titulo: "GHOST TELEMETRY TERMINAL",
    subtitulo: "MEXICO – NASA STAR BRIDGE // TEAM MAPACHE COSMOS",
    btnHistoria: "📖 STORY",
    btnLuna: "🌑 MOON",
    btnMarte: "🔴 MARS",
    sectorLuna: "ACTIVE SECTOR: LUNAR SURFACE (COYOLXAUHQUI)",
    sectorMarte: "ACTIVE SECTOR: MARTIAN SURFACE (DRESDEN CODEX)",
    lblHardware: "[ 🔧 SPACECRAFT HARDWARE ]",
    lblCiencia: "[ 🔬 SCIENTIFIC DISCOVERY ]",
    lblMexico: "[ 🇲🇽 STAR BRIDGE: MEXICO & THE COSMOS ]",
    lblBitacora: "🎙️ RECOVERED VOICE LOG",
    btnPlay: "▶ LISTEN TO LOG",
    btnStop: "❚❚ STOP AUDIO",
    btnNasa: "↗ VIEW OFFICIAL ARCHIVE ON NASA.GOV",
    btnJugarMision: "🎮 LAUNCH PLAYABLE MISSION (SYNCED AUDIO)",

    // Game Modal
    lblAudioBloqueado: "📡 TRANSMISSION IN PROGRESS — LISTEN TO THE LOG WHILE COMPLETING THE MISSION",
    btnCerrarJuego: "[ EXIT MISSION ]"
  }
};

// Viñetas de la historia inicial de Mateo (10 años)
const HISTORIA_INTRO = {
  es: [
    {
      escena: "01 / 03 — EL DESVÁN DEL ABUELO",
      texto: "Hola, soy Mateo y tengo 10 años. Hoy, limpiando el taller de mi abuelo en Sonora, encontré una caja metálica grabada con glifos estelares mayas y el logotipo antiguo de la NASA. Adentro brillaba esta extraña bitácora."
    },
    {
      escena: "02 / 03 — EL SECRETO DE GUAYMAS",
      texto: "Mi abuelo fue ingeniero en la Estación Rastreadora de Guaymas, México, donde ayudó a recibir las señales de los astronautas del Apolo. Esta bitácora guarda las últimas voces de robots exploradores que quedaron dormidos en la Luna y Marte."
    },
    {
      escena: "03 / 03 — TU MISIÓN COMO EXPLORADOR",
      texto: "Al igual que los antiguos astrónomos mexicanos observaban las estrellas para entender el universo, hoy tú puedes reactivar estas 4 sondas. ¡Elige un planeta, escucha su historia y supera su reto espacial!"
    }
  ],
  en: [
    {
      escena: "01 / 03 — GRANDPA'S WORKSHOP",
      texto: "Hi, I'm Mateo and I'm 10 years old. Today, while cleaning my grandpa's workshop in Sonora, Mexico, I found a metal box engraved with ancient Mayan star glyphs and a vintage NASA logo. Inside, this strange logbook was glowing."
    },
    {
      escena: "02 / 03 — THE SECRET OF GUAYMAS",
      texto: "My grandpa worked as an engineer at the Guaymas Tracking Station in Mexico, helping receive signals from Apollo astronauts. This device stores the final voice logs of robotic explorers resting on the Moon and Mars."
    },
    {
      escena: "03 / 03 — YOUR EXPLORER MISSION",
      texto: "Just as ancient Mexican astronomers watched the skies to understand the cosmos, today you can reactivate these 4 probes. Pick a planet, listen to their voice logs, and complete their space challenge!"
    }
  ]
};

// Base de datos de las 4 misiones con audios separados por idioma (es / en)
const MISIONES = [
  {
    id: "surveyor3",
    cuerpo: "luna",
    anio: "1967",
    coordenadas: { top: "54%", left: "34%" },
    imagen: "assets/img/surveyor3.webp",
    enlaceNasa: "https://science.nasa.gov/mission/surveyor-3/",
    es: {
      nombre: "Surveyor 3",
      ubicacion: "Oceanus Procellarum (Luna)",
      hardware: "Brazo excavador mecánico de superficie y cámara de televisión con filtros espectrales.",
      ciencia: "Analizó la firmeza del polvo lunar y demostró que el suelo soportaría el peso de los futuros módulos Apolo.",
      mexico: "Desde la Estación de Guaymas (Sonora), técnicos mexicanos monitorearon las señales de telemetría lunar que prepararon el camino para el alunizaje humano.",
      bitacora: "Transmisión recibida desde Oceanus Procellarum. Soy Surveyor 3. Mi brazo excavador probó la firmeza del polvo lunar en 1967 para que los astronautas pudieran aterrizar sin hundirse. Dos años después, el Apolo 12 caminó hasta mí. Hoy permanezco en silencio bajo el sol lunar.",
      juegoTitulo: "MISIÓN 01: EXCAVACIÓN EN OCEANUS PROCELLARUM",
      juegoInstruccion: "Presiona [ ESPACIO ] o el botón táctil cuando el indicador esté en la zona VERDE para tomar una muestra segura del suelo lunar.",
      audio: "assets/audio/audio_surveyor3_es.mp3"
    },
    en: {
      nombre: "Surveyor 3",
      ubicacion: "Oceanus Procellarum (Moon)",
      hardware: "Mechanical surface sampler scoop and television camera with spectral filters.",
      ciencia: "Analyzed lunar dust firmness, proving the surface could support the weight of future Apollo landers.",
      mexico: "From the Guaymas Tracking Station in Sonora, Mexican engineers monitored lunar telemetry signals that paved the way for human landings.",
      bitacora: "Transmission from Oceanus Procellarum. I am Surveyor 3. My mechanical scoop tested lunar dust firmness in 1967 so astronauts could land safely. Two years later, Apollo 12 walked up to me. Today I rest in silence beneath the lunar sun.",
      juegoTitulo: "MISSION 01: OCEANUS PROCELLARUM EXCAVATION",
      juegoInstruccion: "Press [ SPACE ] or the touch button when the marker is inside the GREEN zone to safely sample the lunar regolith.",
      audio: "assets/audio/audio_surveyor3_en.mp3"
    }
  },
  {
    {
    id: "lrv_apolo15",
    cuerpo: "luna",
    anio: "1971",
    coordenadas: { top: "28%", left: "53%" },
    imagen: "assets/img/lrv_apolo15.webp",
    enlaceNasa: "https://science.nasa.gov/mission/apollo-15/",
    es: {
      nombre: "Rover Lunar (Apolo 15)",
      ubicacion: "Hadley-Apennine (Luna)",
      hardware: "Vehículo eléctrico plegable de 4 ruedas con malla de alambre de zinc y baterías de plata-zinc.",
      ciencia: "Permitió recorrer 27.9 km lejos del módulo lunar para recolectar la 'Roca del Génesis', revelando la edad de la Luna.",
      mexico: "Las culturas mesoamericanas dedicaron templos a la Luna (Ixchel y Coyolxauhqui) midiendo sus ciclos; siglos después, la antena de Guaymas recibió la voz del Apolo 15.",
      bitacora: "Señal débil desde los montes Apeninos. Soy el Rover Lunar del Apolo 15. Fui el primer vehículo conducido por humanos fuera de la Tierra, hallando muestras primordiales de la corteza lunar. Mis baterías se agotaron hace décadas, pero mis huellas siguen intactas.",
      juegoTitulo: "MISIÓN 02: RUTA HACIA LA ROCA DEL GÉNESIS",
      juegoInstruccion: "Usa [ ← / → ] o los botones táctiles para esquivar cráteres y recoger 3 cristales de la Roca del Génesis.",
      audio: "assets/audio/audio_lrv_es.mp3" // <--- Ruta actualizada en español
    },
    en: {
      nombre: "Lunar Roving Vehicle (Apollo 15)",
      ubicacion: "Hadley-Apennine (Moon)",
      hardware: "Foldable 4-wheel electric rover with zinc-coated wire mesh tires and silver-zinc batteries.",
      ciencia: "Enabled a 27.9 km traverse to collect the 'Genesis Rock', revealing the ancient age of the lunar crust.",
      mexico: "Mesoamerican cultures built temples to the Moon (Ixchel & Coyolxauhqui) tracking its cycles; centuries later, Guaymas Station received Apollo 15's voice.",
      bitacora: "Weak signal from the Apennine Mountains. I am the Apollo 15 Lunar Rover. I was the first vehicle driven by humans beyond Earth, finding primordial lunar crust samples. My batteries died decades ago, yet my tire tracks remain intact.",
      juegoTitulo: "MISSION 02: TRAVERSE TO THE GENESIS ROCK",
      juegoInstruccion: "Use [ ← / → ] or touch buttons to dodge craters and collect 3 glowing Genesis Rock samples.",
      audio: "assets/audio/audio_lrv_en.mp3" // <--- Ruta actualizada en inglés
    }
  },
    en: {
      nombre: "Lunar Roving Vehicle (Apollo 15)",
      ubicacion: "Hadley-Apennine (Moon)",
      hardware: "Foldable 4-wheel electric rover with zinc-coated wire mesh tires and silver-zinc batteries.",
      ciencia: "Enabled a 27.9 km traverse to collect the 'Genesis Rock', revealing the ancient age of the lunar crust.",
      mexico: "Mesoamerican cultures built temples to the Moon (Ixchel & Coyolxauhqui) tracking its cycles; centuries later, Guaymas Station received Apollo 15's voice.",
      bitacora: "Weak signal from the Apennine Mountains. I am the Apollo 15 Lunar Rover. I was the first vehicle driven by humans beyond Earth, finding primordial lunar crust samples. My batteries died decades ago, yet my tire tracks remain intact.",
      juegoTitulo: "MISSION 02: TRAVERSE TO THE GENESIS ROCK",
      juegoInstruccion: "Use [ ← / → ] or touch buttons to dodge craters and collect 3 glowing Genesis Rock samples.",
      audio: "assets/audio/audio_lrv_en.mp3"
    }
  },
  {
    id: "opportunity",
    cuerpo: "marte",
    anio: "2004 - 2018",
    coordenadas: { top: "48%", left: "46%" },
    imagen: "assets/img/opportunity.webp",
    enlaceNasa: "https://science.nasa.gov/mission/mer-opportunity/",
    es: {
      nombre: "Rover Opportunity (MER-B)",
      ubicacion: "Meridiani Planum (Marte)",
      hardware: "Espectrómetros Mössbauer y APXS, cámara panorámica (Pancam) y herramienta de abrasión de rocas (RAT).",
      ciencia: "Descubrió esférulas de hematita ('arándanos marcianos') y vetas de yeso, probando que hubo agua líquida dulce en Marte.",
      mexico: "En el Códice de Dresde, los astrónomos mayas calcularon el ciclo de 780 días de Marte con asombrosa exactitud matemática mucho antes que existieran los telescopios.",
      bitacora: "Telemetría residual desde Meridiani Planum. Soy Opportunity. Diseñado para 90 días, sobreviví casi 15 años recorriendo 45.16 km y confirmando que Marte tuvo agua líquida. Una tormenta cubrió mis paneles en 2018. Mi última señal fue: 'Mi batería está baja y está oscureciendo'.",
      juegoTitulo: "MISIÓN 03: ÚLTIMA TRANSMISIÓN EN LA TORMENTA",
      juegoInstruccion: "Mantén la antena alineada con el haz verde usando [ ← / → ] antes de que la tormenta agote la batería al 0%.",
      audio: "assets/audio/audio_opportunity_es.mp3"
    },
    en: {
      nombre: "Opportunity Rover (MER-B)",
      ubicacion: "Meridiani Planum (Mars)",
      hardware: "Mössbauer and APXS spectrometers, Panoramic Camera (Pancam), and Rock Abrasion Tool (RAT).",
      ciencia: "Discovered hematite spherules ('Martian blueberries') and gypsum veins, proving ancient liquid freshwater existed on Mars.",
      mexico: "In the Dresden Codex, Mayan astronomers calculated Mars' 780-day synodic cycle with astonishing mathematical precision centuries before telescopes.",
      bitacora: "Residual telemetry from Meridiani Planum. I am Opportunity. Built for 90 days, I survived nearly 15 years driving 45.16 km and proving Mars had liquid water. A dust storm covered my panels in 2018. My last signal was: 'My battery is low and it's getting dark'.",
      juegoTitulo: "MISSION 03: LAST TRANSMISSION IN THE STORM",
      juegoInstruccion: "Keep the dish aligned with the green beam using [ ← / → ] before the dust storm drains battery to 0%.",
      audio: "assets/audio/audio_opportunity_en.mp3"
    }
  },
  {
    id: "ingenuity",
    cuerpo: "marte",
    anio: "2021 - 2024",
    coordenadas: { top: "36%", left: "68%" },
    imagen: "assets/img/ingenuity.webp",
    enlaceNasa: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/",
    es: {
      nombre: "Helicóptero Ingenuity",
      ubicacion: "Cráter Jezero (Marte)",
      hardware: "Dron autónomo de 1.8 kg con rotores contrarrotativos de fibra de carbono que giran a 2,400 rpm.",
      ciencia: "Logró el primer vuelo propulsado y controlado en otro planeta, completando 72 vuelos de reconocimiento aéreo.",
      mexico: "Hoy México continúa ese legado estelar desde el Gran Telescopio Milimétrico (GTM) en Puebla y con jóvenes ingenieros mexicanos que colaboran en misiones de la NASA.",
      bitacora: "Baliza activa desde el Cráter Jezero. Soy Ingenuity. Mis rotores demostraron que es posible volar en una atmósfera con apenas el 1% de la densidad terrestre. Completé 72 vuelos históricos y hoy sigo operando como estación meteorológica estática.",
      juegoTitulo: "MISIÓN 04: PRIMER VUELO EN CRÁTER JEZERO",
      juegoInstruccion: "Mantén presionado [ ESPACIO ] o el botón táctil para elevar los rotores y aterriza suavemente en la plataforma verde.",
      audio: "assets/audio/audio_ingenuity_es.mp3"
    },
    en: {
      nombre: "Ingenuity Mars Helicopter",
      ubicacion: "Jezero Crater (Mars)",
      hardware: "1.8 kg autonomous rotorcraft with counter-rotating carbon-fiber blades spinning at 2,400 rpm.",
      ciencia: "Achieved the first powered, controlled flight on another planet, completing 72 aerial scouting flights.",
      mexico: "Today Mexico continues this cosmic legacy from the Large Millimeter Telescope (LMT) in Puebla and through Mexican engineers collaborating on NASA missions.",
      bitacora: "Active beacon from Jezero Crater. I am Ingenuity. My rotors proved flight is possible in an atmosphere just 1% as dense as Earth's. I completed 72 historic flights and today continue operating as a static weather station.",
      juegoTitulo: "MISSION 04: FIRST FLIGHT AT JEZERO CRATER",
      juegoInstruccion: "Hold [ SPACE ] or the touch button to spin rotors and land softly on the green landing pad.",
      audio: "assets/audio/audio_ingenuity_en.mp3"
    }
  }
];