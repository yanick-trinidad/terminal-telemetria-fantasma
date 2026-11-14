// Lógica principal - Terminal de Telemetría Fantasma (Bilingüe ES / EN)
// Controla el idioma, selector Luna/Marte, balizas interactivas, panel técnico y audio

document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias a elementos del DOM
  const btnLuna = document.getElementById("btn-luna");
  const btnMarte = document.getElementById("btn-marte");
  const btnIdioma = document.getElementById("btn-idioma");
  const etiquetaSector = document.getElementById("etiqueta-sector");
  const imagenMapa = document.getElementById("imagen-mapa");
  const capaPines = document.getElementById("capa-pines");

  // Elementos del Panel Derecho (Telemetría)
  const misionAnio = document.getElementById("mision-anio");
  const misionUbicacion = document.getElementById("mision-ubicacion");
  const misionImg = document.getElementById("mision-img");
  const misionNombre = document.getElementById("mision-nombre");
  const misionHardware = document.getElementById("mision-hardware");
  const misionCiencia = document.getElementById("mision-ciencia");
  const misionBitacora = document.getElementById("mision-bitacora");
  const misionEnlace = document.getElementById("mision-enlace");
  const btnAudio = document.getElementById("btn-audio");

  // 2. Estado de la aplicación y controladores de audio
  let idiomaActual = "es"; // Idioma inicial ("es" o "en")
  let sectorActual = "luna";
  let misionSeleccionada = null;
  let reproductorVoz = new Audio();
  let reproduciendoVoz = false;
  const fxRadio = new Audio("assets/audio/fx_radio.mp3");

  // Efecto de radio seguro
  function sonarEfectoRadio() {
    fxRadio.currentTime = 0;
    fxRadio.play().catch(() => {});
  }

  // Detener y reiniciar voz activa respetando el idioma actual
  function detenerAudioVoz() {
    const t = TEXTOS_UI[idiomaActual];
    reproductorVoz.pause();
    reproductorVoz.currentTime = 0;
    reproduciendoVoz = false;
    btnAudio.textContent = t.btnPlay;
    btnAudio.classList.remove("bg-amber-400", "text-slate-950");
    btnAudio.classList.add("bg-emerald-500", "text-slate-950");
  }

  // 3. Traducir toda la interfaz (HTML + Mapa + Ficha seleccionada)
  function aplicarIdioma() {
    const t = TEXTOS_UI[idiomaActual];
    document.documentElement.lang = idiomaActual;

    // Actualizar todos los elementos con atributo data-i18n en index.html
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const clave = el.getAttribute("data-i18n");
      if (t[clave]) el.textContent = t[clave];
    });

    // Actualizar botones de navegación y enlaces
    btnLuna.textContent = t.btnLuna;
    btnMarte.textContent = t.btnMarte;
    misionEnlace.textContent = t.btnNasa;
    btnAudio.textContent = reproduciendoVoz ? t.btnStop : t.btnPlay;

    // Recargar pines del mapa y panel derecho en el nuevo idioma
    cargarSector(sectorActual, false);
    if (misionSeleccionada) {
      actualizarPanelMision(misionSeleccionada);
    } else {
      misionNombre.textContent =
        idiomaActual === "es"
          ? "Selecciona una baliza en el mapa"
          : "Select a beacon on the map";
      misionUbicacion.textContent =
        idiomaActual === "es"
          ? "COORDENADAS: EN ESPERA"
          : "COORDINATES: STANDBY";
      misionHardware.textContent =
        idiomaActual === "es"
          ? "Esperando selección de telemetría..."
          : "Awaiting telemetry selection...";
      misionCiencia.textContent =
        idiomaActual === "es"
          ? "Esperando selección de telemetría..."
          : "Awaiting telemetry selection...";
    }
  }

  // 4. Renderizar pines sobre el mapa ("luna" o "marte")
  function cargarSector(cuerpo, reiniciarAudio = true) {
    const t = TEXTOS_UI[idiomaActual];
    sectorActual = cuerpo;
    if (reiniciarAudio) detenerAudioVoz();

    if (cuerpo === "luna") {
      etiquetaSector.textContent = t.sectorLuna;
      imagenMapa.src = "assets/img/mapa_luna.webp";
      btnLuna.className = "px-4 py-2 border border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/40 transition font-bold cursor-pointer";
      btnMarte.className = "px-4 py-2 border border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold cursor-pointer";
    } else {
      etiquetaSector.textContent = t.sectorMarte;
      imagenMapa.src = "assets/img/mapa_marte.webp";
      btnMarte.className = "px-4 py-2 border border-amber-400 bg-amber-500/20 text-amber-200 hover:bg-amber-500/40 transition font-bold cursor-pointer";
      btnLuna.className = "px-4 py-2 border border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold cursor-pointer";
    }

    capaPines.innerHTML = "";
    const misionesFiltradas = MISIONES.filter((m) => m.cuerpo === cuerpo);

    misionesFiltradas.forEach((mision) => {
      const datosIdioma = mision[idiomaActual];
      const pin = document.createElement("button");
      pin.type = "button";
      pin.style.top = mision.coordenadas.top;
      pin.style.left = mision.coordenadas.left;
      pin.title = datosIdioma.nombre;
      pin.className = "pin-baliza group flex flex-col items-center cursor-pointer focus:outline-none";

      pin.innerHTML = `
        <span class="w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 block group-hover:bg-amber-400 transition"></span>
        <span class="mt-1 px-1.5 py-0.5 text-[11px] bg-slate-950/90 border border-emerald-500/60 text-emerald-300 rounded whitespace-nowrap group-hover:border-amber-400 group-hover:text-amber-300">
          ${datosIdioma.nombre}
        </span>
      `;

      pin.addEventListener("click", () => seleccionarMision(mision));
      capaPines.appendChild(pin);
    });
  }

  // 5. Pintar textos de la misión en el panel derecho
  function actualizarPanelMision(mision) {
    const datosIdioma = mision[idiomaActual];
    const labelAnio = idiomaActual === "es" ? "AÑO" : "YEAR";
    const labelUbic = idiomaActual === "es" ? "UBICACIÓN" : "LOCATION";

    misionAnio.textContent = `${labelAnio}: ${mision.anio}`;
    misionUbicacion.textContent = `${labelUbic}: ${datosIdioma.ubicacion}`;
    misionImg.src = mision.imagen;
    misionImg.alt = datosIdioma.nombre;
    misionNombre.textContent = datosIdioma.nombre;
    misionHardware.textContent = datosIdioma.hardware;
    misionCiencia.textContent = datosIdioma.ciencia;
    misionBitacora.textContent = `"${datosIdioma.bitacora}"`;

    misionEnlace.href = mision.enlaceNasa;
    misionEnlace.classList.remove("hidden");
    misionEnlace.classList.add("block");
  }

  // Al hacer clic en una baliza nueva
  function seleccionarMision(mision) {
    misionSeleccionada = mision;
    sonarEfectoRadio();
    detenerAudioVoz();
    actualizarPanelMision(mision);

    reproductorVoz.src = mision.audio;
    btnAudio.disabled = false;
  }

  // 6. Controlador del botón Play / Pausa de la Bitácora
  btnAudio.addEventListener("click", () => {
    if (!misionSeleccionada) return;
    const t = TEXTOS_UI[idiomaActual];

    if (!reproduciendoVoz) {
      reproductorVoz.play()
        .then(() => {
          reproduciendoVoz = true;
          btnAudio.textContent = t.btnStop;
          btnAudio.classList.remove("bg-emerald-500");
          btnAudio.classList.add("bg-amber-400");
        })
        .catch(() => {
          const msg =
            idiomaActual === "es"
              ? `Archivo de audio aún no cargado en: ${misionSeleccionada.audio}`
              : `Audio file not loaded yet at: ${misionSeleccionada.audio}`;
          alert(msg);
        });
    } else {
      detenerAudioVoz();
    }
  });

  reproductorVoz.addEventListener("ended", () => {
    detenerAudioVoz();
  });

  // 7. Eventos de botones principales
  btnLuna.addEventListener("click", () => cargarSector("luna"));
  btnMarte.addEventListener("click", () => cargarSector("marte"));
  btnIdioma.addEventListener("click", () => {
    idiomaActual = idiomaActual === "es" ? "en" : "es";
    aplicarIdioma();
  });

  // Inicializar consola
  aplicarIdioma();
});