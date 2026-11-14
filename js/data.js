// Base de datos oficial - Terminal de Telemetría Fantasma
// Estándar de rutas verificado con Operaciones (Jose & Julian)

const MISIONES = [
  {
    id: "surveyor3",
    cuerpo: "luna",
    nombre: "Surveyor 3",
    anio: "1967",
    ubicacion: "Oceanus Procellarum (Luna)",
    coordenadas: { top: "54%", left: "34%" },
    imagen: "assets/img/surveyor3.webp",
    audio: "assets/audio/audio_surveyor3.mp3",
    hardware: "Brazo excavador mecánico de superficie y cámara de televisión con filtros espectrales.",
    ciencia: "Analizó la resistencia mecánica del regolito lunar y demostró que el suelo soportaría el peso de los futuros módulos Apolo.",
    bitacora: "Transmisión recibida desde Oceanus Procellarum. Soy Surveyor 3. Mi brazo excavador probó la firmeza del polvo lunar en 1967 para que los astronautas pudieran aterrizar sin hundirse. Dos años después, la tripulación del Apolo 12 caminó hasta mí y recuperó mi cámara. Hoy permanezco en silencio eterno bajo el sol lunar.",
    enlaceNasa: "https://science.nasa.gov/mission/surveyor-3/"
  },
  {
    id: "lrv_apolo15",
    cuerpo: "luna",
    nombre: "Lunar Roving Vehicle (Apolo 15)",
    anio: "1971",
    ubicacion: "Hadley-Apennine (Luna)",
    coordenadas: { top: "28%", left: "53%" },
    imagen: "assets/img/lrv_apolo15.webp",
    audio: "assets/audio/audio_lrv.mp3",
    hardware: "Vehículo eléctrico plegable de 4 ruedas con malla de alambre de zinc y baterías de plata-zinc.",
    ciencia: "Permitió recorrer 27.9 km lejos del módulo lunar para recolectar la 'Roca del Génesis', revelando la antigüedad de la corteza lunar.",
    bitacora: "Señal débil desde la base de los montes Apeninos. Soy el Rover Lunar del Apolo 15. Fui el primer vehículo conducido por humanos fuera de la Tierra, permitiendo explorar cráteres lejanos y hallar muestras primordiales de la corteza lunar. Mis baterías se agotaron hace décadas, pero mis huellas siguen intactas.",
    enlaceNasa: "https://science.nasa.gov/mission/apollo-15/"
  },
  {
    id: "opportunity",
    cuerpo: "marte",
    nombre: "Rover Opportunity (MER-B)",
    anio: "2004 - 2018",
    ubicacion: "Meridiani Planum (Marte)",
    coordenadas: { top: "48%", left: "46%" },
    imagen: "assets/img/opportunity.webp",
    audio: "assets/audio/audio_opportunity.mp3",
    hardware: "Espectrómetros Mössbauer y APXS, cámara panorámica (Pancam) y herramienta de abrasión de rocas (RAT).",
    ciencia: "Descubrió esférulas de hematita ('arándanos marcianos') y vetas de yeso, probando que hubo agua líquida dulce en la superficie de Marte.",
    bitacora: "Telemetría residual desde Meridiani Planum. Soy Opportunity. Diseñado para durar 90 días marcianos, sobreviví casi 15 años recorriendo 45.16 km y confirmando que Marte tuvo agua líquida. Una tormenta global de polvo cubrió mis paneles solares en 2018. Mi última señal fue: 'Mi batería está baja y está oscureciendo'.",
    enlaceNasa: "https://science.nasa.gov/mission/mer-opportunity/"
  },
  {
    id: "ingenuity",
    cuerpo: "marte",
    nombre: "Helicóptero Ingenuity",
    anio: "2021 - 2024",
    ubicacion: "Cráter Jezero (Marte)",
    coordenadas: { top: "36%", left: "68%" },
    imagen: "assets/img/ingenuity.webp",
    audio: "assets/audio/audio_ingenuity.mp3",
    hardware: "Dron autónomo de 1.8 kg con rotores contrarrotativos de fibra de carbono que giran a 2,400 rpm.",
    ciencia: "Logró el primer vuelo propulsado y controlado en otro planeta, completando 72 vuelos y explorando terreno inaccesible para Perseverance.",
    bitacora: "Baliza activa desde el Cráter Jezero. Soy Ingenuity. Mis rotores demostraron que es posible volar en una atmósfera con apenas el 1% de la densidad terrestre. Completé 72 vuelos históricos hasta que un aterrizaje dañó mis palas de fibra de carbono. Hoy sigo operando como estación meteorológica estática.",
    enlaceNasa: "https://science.nasa.gov/mission/ingenuity/"
  }
];