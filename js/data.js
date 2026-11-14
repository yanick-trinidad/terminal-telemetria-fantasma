// Diccionario de interfaz y base de datos bilingüe (ES / EN)
// Terminal de Telemetría Fantasma - Equipo Mapache Cosmos

const TEXTOS_UI = {
  es: {
    titulo: "TERMINAL DE TELEMETRÍA FANTASMA",
    subtitulo: "RED DE ESPACIO PROFUNDO // EQUIPO MAPACHE COSMOS",
    btnLuna: "[ 01. LUNA ]",
    btnMarte: "[ 02. MARTE ]",
    sectorLuna: "SECTOR ACTIVO: SUPERFICIE LUNAR",
    sectorMarte: "SECTOR ACTIVO: SUPERFICIE MARCIANA",
    lblHardware: "[ HARDWARE DESPLEGADO ]",
    lblCiencia: "[ DESCUBRIMIENTO CIENTÍFICO ]",
    lblBitacora: "BITÁCORA DE VOZ RECUPERADA",
    btnPlay: "▶ REPRODUCIR BITÁCORA",
    btnStop: "❚❚ DETENER BITÁCORA",
    btnNasa: "↗ VER ARCHIVO OFICIAL EN NASA.GOV",
    btnJuego: "⚡ INICIAR PROTOCOLO: ÚLTIMA TRANSMISIÓN (MINIJUEGO)"
  },
  en: {
    titulo: "GHOST TELEMETRY TERMINAL",
    subtitulo: "DEEP SPACE NETWORK // TEAM MAPACHE COSMOS",
    btnLuna: "[ 01. MOON ]",
    btnMarte: "[ 02. MARS ]",
    sectorLuna: "ACTIVE SECTOR: LUNAR SURFACE",
    sectorMarte: "ACTIVE SECTOR: MARTIAN SURFACE",
    lblHardware: "[ DEPLOYED HARDWARE ]",
    lblCiencia: "[ SCIENTIFIC DISCOVERY ]",
    lblBitacora: "RECOVERED VOICE LOG",
    btnPlay: "▶ PLAY VOICE LOG",
    btnStop: "❚❚ STOP VOICE LOG",
    btnNasa: "↗ VIEW OFFICIAL ARCHIVE ON NASA.GOV",
    btnJuego: "⚡ LAUNCH PROTOCOL: LAST TRANSMISSION (MINIGAME)"
  }
};

const MISIONES = [
  {
    id: "surveyor3",
    cuerpo: "luna",
    anio: "1967",
    coordenadas: { top: "54%", left: "34%" },
    imagen: "assets/img/surveyor3.webp",
    audio: "assets/audio/audio_surveyor3.mp3",
    enlaceNasa: "https://science.nasa.gov/mission/surveyor-3/",
    es: {
      nombre: "Surveyor 3",
      ubicacion: "Oceanus Procellarum (Luna)",
      hardware: "Brazo excavador mecánico de superficie y cámara de televisión con filtros espectrales.",
      ciencia: "Analizó la resistencia mecánica del regolito lunar y demostró que el suelo soportaría el peso de los futuros módulos Apolo.",
      bitacora: "Transmisión recibida desde Oceanus Procellarum. Soy Surveyor 3. Mi brazo excavador probó la firmeza del polvo lunar en 1967 para que los astronautas pudieran aterrizar sin hundirse. Dos años después, la tripulación del Apolo 12 caminó hasta mí y recuperó mi cámara. Hoy permanezco en silencio eterno bajo el sol lunar."
    },
    en: {
      nombre: "Surveyor 3",
      ubicacion: "Oceanus Procellarum (Moon)",
      hardware: "Mechanical surface sampler scoop and television camera with spectral filters.",
      ciencia: "Analyzed the mechanical strength of lunar regolith, proving the surface could support the weight of future Apollo landers.",
      bitacora: "Transmission received from Oceanus Procellarum. I am Surveyor 3. My mechanical scoop tested the firmness of lunar dust in 1967 so astronauts could land safely. Two years later, the Apollo 12 crew walked up to me and retrieved my camera. Today I remain in eternal silence beneath the lunar sun."
    }
  },
  {
    id: "lrv_apolo15",
    cuerpo: "luna",
    anio: "1971",
    coordenadas: { top: "28%", left: "53%" },
    imagen: "assets/img/lrv_apolo15.webp",
    audio: "assets/audio/audio_lrv.mp3",
    enlaceNasa: "https://science.nasa.gov/mission/apollo-15/",
    es: {
      nombre: "Lunar Roving Vehicle (Apolo 15)",
      ubicacion: "Hadley-Apennine (Luna)",
      hardware: "Vehículo eléctrico plegable de 4 ruedas con malla de alambre de zinc y baterías de plata-zinc.",
      ciencia: "Permitió recorrer 27.9 km lejos del módulo lunar para recolectar la 'Roca del Génesis', revelando la antigüedad de la corteza lunar.",
      bitacora: "Señal débil desde la base de los montes Apeninos. Soy el Rover Lunar del Apolo 15. Fui el primer vehículo conducido por humanos fuera de la Tierra, permitiendo explorar cráteres lejanos y hallar muestras primordiales de la corteza lunar. Mis baterías se agotaron hace décadas, pero mis huellas siguen intactas."
    },
    en: {
      nombre: "Lunar Roving Vehicle (Apollo 15)",
      ubicacion: "Hadley-Apennine (Moon)",
      hardware: "Foldable 4-wheel electric rover with zinc-coated wire mesh tires and silver-zinc batteries.",
      ciencia: "Enabled a 27.9 km traverse away from the lunar module to collect the 'Genesis Rock', revealing the ancient age of the lunar crust.",
      bitacora: "Weak signal from the base of the Apennine Mountains. I am the Apollo 15 Lunar Rover. I was the first vehicle driven by humans beyond Earth, enabling the exploration of distant craters and the discovery of primordial lunar crust samples. My batteries died decades ago, yet my tire tracks remain intact."
    }
  },
  {
    id: "opportunity",
    cuerpo: "marte",
    anio: "2004 - 2018",
    coordenadas: { top: "48%", left: "46%" },
    imagen: "assets/img/opportunity.webp",
    audio: "assets/audio/audio_opportunity.mp3",
    enlaceNasa: "https://science.nasa.gov/mission/mer-opportunity/",
    es: {
      nombre: "Rover Opportunity (MER-B)",
      ubicacion: "Meridiani Planum (Marte)",
      hardware: "Espectrómetros Mössbauer y APXS, cámara panorámica (Pancam) y herramienta de abrasión de rocas (RAT).",
      ciencia: "Descubrió esférulas de hematita ('arándanos marcianos') y vetas de yeso, probando que hubo agua líquida dulce en la superficie de Marte.",
      bitacora: "Telemetría residual desde Meridiani Planum. Soy Opportunity. Diseñado para durar 90 días marcianos, sobreviví casi 15 años recorriendo 45.16 km y confirmando que Marte tuvo agua líquida. Una tormenta global de polvo cubrió mis paneles solares en 2018. Mi última señal fue: 'Mi batería está baja y está oscureciendo'."
    },
    en: {
      nombre: "Opportunity Rover (MER-B)",
      ubicacion: "Meridiani Planum (Mars)",
      hardware: "Mössbauer and APXS spectrometers, Panoramic Camera (Pancam), and Rock Abrasion Tool (RAT).",
      ciencia: "Discovered hematite spherules ('Martian blueberries') and gypsum veins, proving ancient liquid freshwater once existed on Mars.",
      bitacora: "Residual telemetry from Meridiani Planum. I am Opportunity. Designed for 90 Martian days, I survived nearly 15 years driving 45.16 km and confirming Mars had liquid water. A global dust storm covered my solar panels in 2018. My final signal was: 'My battery is low and it's getting dark'."
    }
  },
  {
    id: "ingenuity",
    cuerpo: "marte",
    anio: "2021 - 2024",
    coordenadas: { top: "36%", left: "68%" },
    imagen: "assets/img/ingenuity.webp",
    audio: "assets/audio/audio_ingenuity.mp3",
    enlaceNasa: "https://science.nasa.gov/mission/ingenuity/",
    es: {
      nombre: "Helicóptero Ingenuity",
      ubicacion: "Cráter Jezero (Marte)",
      hardware: "Dron autónomo de 1.8 kg con rotores contrarrotativos de fibra de carbono que giran a 2,400 rpm.",
      ciencia: "Logró el primer vuelo propulsado y controlado en otro planeta, completando 72 vuelos y explorando terreno inaccesible para Perseverance.",
      bitacora: "Baliza activa desde el Cráter Jezero. Soy Ingenuity. Mis rotores demostraron que es posible volar en una atmósfera con apenas el 1% de la densidad terrestre. Completé 72 vuelos históricos hasta que un aterrizaje dañó mis palas de fibra de carbono. Hoy sigo operando como estación meteorológica estática."
    },
    en: {
      nombre: "Ingenuity Mars Helicopter",
      ubicacion: "Jezero Crater (Mars)",
      hardware: "1.8 kg autonomous rotorcraft with counter-rotating carbon-fiber blades spinning at 2,400 rpm.",
      ciencia: "Achieved the first powered, controlled flight on another planet, completing 72 flights and scouting terrain inaccessible to Perseverance.",
      bitacora: "Active beacon from Jezero Crater. I am Ingenuity. My rotors proved flight is possible in an atmosphere just 1% as dense as Earth's. I completed 72 historic flights until a landing damaged my carbon-fiber blades. Today I continue operating as a static weather station."
    }
  }
];