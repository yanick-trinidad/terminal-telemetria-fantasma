// Lógica Principal v2.0 - Storytelling de Mateo, Consola Bilingüe y Puente México-NASA
// Terminal de Telemetría Fantasma - Equipo Mapache Cosmos

document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias Pantalla 1 (Storytelling Intro)
  const pantallaIntro = document.getElementById("pantalla-intro");
  const introEscenaTitulo = document.getElementById("intro-escena-titulo");
  const introTexto = document.getElementById("intro-texto");
  const introIndicadores = document.getElementById("intro-indicadores");
  const btnSiguienteIntro = document.getElementById("btn-siguiente-intro");
  const btnSaltarIntro = document.getElementById("btn-saltar-intro");
  const btnIdiomaIntro = document.getElementById("btn-idioma-intro");
  const btnVerHistoria = document.getElementById("btn-ver-historia");

  // 2. Referencias Pantalla 2 (Consola Principal)
  const btnLuna = document.getElementById("btn-luna");
  const btnMarte = document.getElementById("btn-marte");
  const btnIdioma = document.getElementById("btn-idioma");
  const etiquetaSector = document.getElementById("etiqueta-sector");
  const imagenMapa = document.getElementById("imagen-mapa");
  const capaPines = document.getElementById("capa-pines");

  // Panel Derecho (Telemetría + Cultura México)
  const misionAnio = document.getElementById("mision-anio");
  const misionUbicacion = document.getElementById("mision-ubicacion");
  const misionImg = document.getElementById("mision-img");
  const misionNombre = document.getElementById("mision-nombre");
  const misionSubguia = document.getElementById("mision-subguia");
  const misionHardware = document.getElementById("mision-hardware");
  const misionCiencia = document.getElementById("mision-ciencia");
  const misionMexico = document.getElementById("mision-mexico");
  const misionBitacora = document.getElementById("mision-bitacora");
  const misionEnlace = document.getElementById("mision-enlace");
  const btnAudio = document.getElementById("btn-audio");
  const btnAbrirJuego = document.getElementById("btn-abrir-juego");

  // 3. Estado Global (compartido con game.js mediante window.APP_STATE)
  window.APP_STATE = {
    idioma: "es",
    misionActiva: null
  };

  let indiceIntro = 0;
  let sectorActual = "luna";
  let reproductorVoz = new Audio();
  let reproduciendoVoz = false;
  const fxRadio = new Audio("assets/audio/fx_radio.mp3");

  function sonarEfectoRadio() {
    fxRadio.currentTime = 0;
    fxRadio.play().catch(() => {});
  }

  function detenerAudioVoz() {
    const t = TEXTOS_UI[window.APP_STATE.idioma];
    reproductorVoz.pause();
    reproductorVoz.currentTime = 0;
    reproduciendoVoz = false;
    btnAudio.textContent = t.btnPlay;
    btnAudio.classList.remove("bg-amber-400");
    btnAudio.classList.add("bg-emerald-500");
  }

  // Exponer función para que game.js detenga la vista previa si el usuario abre el juego
  window.detenerAudioVistaPrevia = detenerAudioVoz;

  // 4. Lógica de la Historia Inicial (Storytelling de Mateo)
  function renderizarViñetaIntro() {
    const lang = window.APP_STATE.idioma;
    const t = TEXTOS_UI[lang];
    const escenas = HISTORIA_INTRO[lang];
    const actual = escenas[indiceIntro];

    introEscenaTitulo.textContent = actual.escena;
    introTexto.textContent = actual.texto;

    // Actualizar los 3 puntos indicadores
    const puntos = introIndicadores.querySelectorAll("span");
    puntos.forEach((p, idx) => {
      p.className = idx === indiceIntro
        ? "w-3 h-3 rounded-full bg-amber-400 transition"
        : "w-3 h-3 rounded-full bg-slate-700 transition";
    });

    // Cambiar texto del botón en la última viñeta
    if (indiceIntro === escenas.length - 1) {
      btnSiguienteIntro.textContent = t.introBtnIniciar;
      btnSiguienteIntro.classList.remove("bg-amber-500");
      btnSiguienteIntro.classList.add("bg-emerald-400");
    } else {
      btnSiguienteIntro.textContent = t.introBtnSiguiente;
      btnSiguienteIntro.classList.remove("bg-emerald-400");
      btnSiguienteIntro.classList.add("bg-amber-500");
    }
  }

  btnSiguienteIntro.addEventListener("click", () => {
    sonarEfectoRadio();
    const totalEscenas = HISTORIA_INTRO[window.APP_STATE.idioma].length;
    if (indiceIntro < totalEscenas - 1) {
      indiceIntro++;
      renderizarViñetaIntro();
    } else {
      pantallaIntro.classList.add("hidden");
    }
  });

  btnSaltarIntro.addEventListener("click", () => {
    sonarEfectoRadio();
    pantallaIntro.classList.add("hidden");
  });

  btnVerHistoria.addEventListener("click", () => {
    detenerAudioVoz();
    indiceIntro = 0;
    renderizarViñetaIntro();
    pantallaIntro.classList.remove("hidden");
  });

  // 5. Traducción Dinámica de toda la Interfaz (ES / EN)
  function aplicarIdioma() {
    const lang = window.APP_STATE.idioma;
    const t = TEXTOS_UI[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const clave = el.getAttribute("data-i18n");
      if (t[clave]) el.textContent = t[clave];
    });

    btnAudio.textContent = reproduciendoVoz ? t.btnStop : t.btnPlay;
    misionEnlace.textContent = t.btnNasa;

    renderizarViñetaIntro();
    cargarSector(sectorActual, false);

    if (window.APP_STATE.misionActiva) {
      actualizarPanelMision(window.APP_STATE.misionActiva);
    } else {
      misionNombre.textContent = lang === "es" ? "Selecciona una baliza en el mapa" : "Select a beacon on the map";
      misionSubguia.textContent = lang === "es" ? "Explora su historia y juega su misión espacial." : "Explore its story and play its space mission.";
      misionUbicacion.textContent = lang === "es" ? "UBICACIÓN: EN ESPERA" : "LOCATION: STANDBY";
      misionHardware.textContent = lang === "es" ? "Esperando selección..." : "Awaiting selection...";
      misionCiencia.textContent = lang === "es" ? "Esperando selección..." : "Awaiting selection...";
      misionMexico.textContent = lang === "es" ? "Esperando selección..." : "Awaiting selection...";
    }
  }

  function alternarIdioma() {
    window.APP_STATE.idioma = window.APP_STATE.idioma === "es" ? "en" : "es";
    aplicarIdioma();
  }

  btnIdioma.addEventListener("click", alternarIdioma);
  btnIdiomaIntro.addEventListener("click", alternarIdioma);

  // 6. Mapa Interactivo (Luna / Marte)
  function cargarSector(cuerpo, reiniciarAudio = true) {
    const lang = window.APP_STATE.idioma;
    const t = TEXTOS_UI[lang];
    sectorActual = cuerpo;
    if (reiniciarAudio) detenerAudioVoz();

    if (cuerpo === "luna") {
      etiquetaSector.textContent = t.sectorLuna;
      imagenMapa.src = "assets/img/mapa_luna.webp";
      btnLuna.className = "px-4 py-2 border-2 border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/40 transition font-bold rounded cursor-pointer text-sm";
      btnMarte.className = "px-4 py-2 border-2 border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold rounded cursor-pointer text-sm";
    } else {
      etiquetaSector.textContent = t.sectorMarte;
      imagenMapa.src = "assets/img/mapa_marte.webp";
      btnMarte.className = "px-4 py-2 border-2 border-amber-400 bg-amber-500/20 text-amber-200 hover:bg-amber-500/40 transition font-bold rounded cursor-pointer text-sm";
      btnLuna.className = "px-4 py-2 border-2 border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold rounded cursor-pointer text-sm";
    }

    capaPines.innerHTML = "";
    const filtradas = MISIONES.filter((m) => m.cuerpo === cuerpo);

    filtradas.forEach((mision) => {
      const datos = mision[lang];
      const pin = document.createElement("button");
      pin.type = "button";
      pin.style.top = mision.coordenadas.top;
      pin.style.left = mision.coordenadas.left;
      pin.className = "pin-baliza group flex flex-col items-center cursor-pointer focus:outline-none";

      pin.innerHTML = `
        <span class="w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 block group-hover:bg-amber-400 transition"></span>
        <span class="mt-1 px-2 py-0.5 text-xs font-bold bg-slate-950/90 border border-emerald-500/70 text-emerald-200 rounded whitespace-nowrap group-hover:border-amber-400 group-hover:text-amber-300">
          ${datos.nombre}
        </span>
      `;

      pin.addEventListener("click", () => seleccionarMision(mision));
      capaPines.appendChild(pin);
    });
  }

  // 7. Actualizar Panel Derecho al tocar una baliza
  function actualizarPanelMision(mision) {
    const lang = window.APP_STATE.idioma;
    const datos = mision[lang];

    misionAnio.textContent = `${lang === "es" ? "AÑO" : "YEAR"}: ${mision.anio}`;
    misionUbicacion.textContent = `${lang === "es" ? "UBICACIÓN" : "LOCATION"}: ${datos.ubicacion}`;
    misionImg.src = mision.imagen;
    misionImg.alt = datos.nombre;
    misionNombre.textContent = datos.nombre;
    misionSubguia.textContent = lang === "es"
      ? "¡Baliza interceptada! Lee su historia o inicia su misión."
      : "Beacon intercepted! Read its log or launch its mission.";
    misionHardware.textContent = datos.hardware;
    misionCiencia.textContent = datos.ciencia;
    misionMexico.textContent = datos.mexico;
    misionBitacora.textContent = `"${datos.bitacora}"`;

    misionEnlace.href = mision.enlaceNasa;
    misionEnlace.classList.remove("hidden");
    misionEnlace.classList.add("block");
  }

  function seleccionarMision(mision) {
    window.APP_STATE.misionActiva = mision;
    sonarEfectoRadio();
    detenerAudioVoz();
    actualizarPanelMision(mision);

    reproductorVoz.src = mision.audio;
    btnAudio.disabled = false;
    btnAbrirJuego.disabled = false;
  }

  // Reproductor manual de bitácora en ficha
  btnAudio.addEventListener("click", () => {
    const mision = window.APP_STATE.misionActiva;
    if (!mision) return;
    const t = TEXTOS_UI[window.APP_STATE.idioma];

    if (!reproduciendoVoz) {
      reproductorVoz.play()
        .then(() => {
          reproduciendoVoz = true;
          btnAudio.textContent = t.btnStop;
          btnAudio.classList.remove("bg-emerald-500");
          btnAudio.classList.add("bg-amber-400");
        })
        .catch(() => {
          alert(`Audio pendiente en: ${mision.audio}`);
        });
    } else {
      detenerAudioVoz();
    }
  });

  reproductorVoz.addEventListener("ended", detenerAudioVoz);
  btnLuna.addEventListener("click", () => cargarSector("luna"));
  btnMarte.addEventListener("click", () => cargarSector("marte"));

  // Inicializar aplicación
  aplicarIdioma();
});