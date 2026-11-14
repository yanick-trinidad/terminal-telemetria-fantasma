// Lógica principal - Terminal de Telemetría Fantasma
// Controla el selector Luna/Marte, balizas interactivas, panel técnico y reproductor de audio

document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias a elementos del DOM
  const btnLuna = document.getElementById("btn-luna");
  const btnMarte = document.getElementById("btn-marte");
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
  let sectorActual = "luna";
  let misionSeleccionada = null;
  let reproductorVoz = new Audio();
  let reproduciendoVoz = false;
  const fxRadio = new Audio("assets/audio/fx_radio.mp3");

  // Función auxiliar para reproducir FX sin romper el código si el archivo aún no existe
  function sonarEfectoRadio() {
    fxRadio.currentTime = 0;
    fxRadio.play().catch(() => {
      // Silencio seguro mientras Julian entrega fx_radio.mp3
    });
  }

  // Función para detener y reiniciar cualquier voz activa
  function detenerAudioVoz() {
    reproductorVoz.pause();
    reproductorVoz.currentTime = 0;
    reproduciendoVoz = false;
    btnAudio.textContent = "▶ REPRODUCIR BITÁCORA";
    btnAudio.classList.remove("bg-amber-400", "text-slate-950");
    btnAudio.classList.add("bg-emerald-500", "text-slate-950");
  }

  // 3. Renderizar pines sobre el mapa según el cuerpo celeste ("luna" o "marte")
  function cargarSector(cuerpo) {
    sectorActual = cuerpo;
    detenerAudioVoz();

    // Actualizar estilos de botones y mapa de fondo
    if (cuerpo === "luna") {
      etiquetaSector.textContent = "SECTOR ACTIVO: SUPERFICIE LUNAR";
      imagenMapa.src = "assets/img/mapa_luna.webp";
      btnLuna.className = "px-4 py-2 border border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/40 transition font-bold cursor-pointer";
      btnMarte.className = "px-4 py-2 border border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold cursor-pointer";
    } else {
      etiquetaSector.textContent = "SECTOR ACTIVO: SUPERFICIE MARCIANA";
      imagenMapa.src = "assets/img/mapa_marte.webp";
      btnMarte.className = "px-4 py-2 border border-amber-400 bg-amber-500/20 text-amber-200 hover:bg-amber-500/40 transition font-bold cursor-pointer";
      btnLuna.className = "px-4 py-2 border border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold cursor-pointer";
    }

    // Limpiar pines anteriores
    capaPines.innerHTML = "";

    // Filtrar misiones del cuerpo seleccionado y crear botones baliza
    const misionesFiltradas = MISIONES.filter((m) => m.cuerpo === cuerpo);

    misionesFiltradas.forEach((mision) => {
      const pin = document.createElement("button");
      pin.type = "button";
      pin.style.top = mision.coordenadas.top;
      pin.style.left = mision.coordenadas.left;
      pin.title = `Interceptar señal: ${mision.nombre}`;
      pin.className = "pin-baliza group flex flex-col items-center cursor-pointer focus:outline-none";

      // Punto luminoso + etiqueta flotante
      pin.innerHTML = `
        <span class="w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 block group-hover:bg-amber-400 transition"></span>
        <span class="mt-1 px-1.5 py-0.5 text-[11px] bg-slate-950/90 border border-emerald-500/60 text-emerald-300 rounded whitespace-nowrap group-hover:border-amber-400 group-hover:text-amber-300">
          ${mision.nombre}
        </span>
      `;

      pin.addEventListener("click", () => seleccionarMision(mision));
      capaPines.appendChild(pin);
    });
  }

  // 4. Inyectar datos de la misión elegida en el panel derecho
  function seleccionarMision(mision) {
    misionSeleccionada = mision;
    sonarEfectoRadio();
    detenerAudioVoz();

    misionAnio.textContent = `AÑO: ${mision.anio}`;
    misionUbicacion.textContent = `UBICACIÓN: ${mision.ubicacion}`;
    misionImg.src = mision.imagen;
    misionImg.alt = mision.nombre;
    misionNombre.textContent = mision.nombre;
    misionHardware.textContent = mision.hardware;
    misionCiencia.textContent = mision.ciencia;
    misionBitacora.textContent = `"${mision.bitacora}"`;

    // Habilitar enlace oficial NASA
    misionEnlace.href = mision.enlaceNasa;
    misionEnlace.classList.remove("hidden");
    misionEnlace.classList.add("block");

    // Preparar audio de bitácora
    reproductorVoz.src = mision.audio;
    btnAudio.disabled = false;
  }

  // 5. Controlador del botón Play / Pausa de la Bitácora
  btnAudio.addEventListener("click", () => {
    if (!misionSeleccionada) return;

    if (!reproduciendoVoz) {
      reproductorVoz.play()
        .then(() => {
          reproduciendoVoz = true;
          btnAudio.textContent = "❚❚ DETENER BITÁCORA";
          btnAudio.classList.remove("bg-emerald-500");
          btnAudio.classList.add("bg-amber-400");
        })
        .catch(() => {
          alert(`Archivo de audio aún no cargado en: ${misionSeleccionada.audio}. Pídeselo a Kim/Jose para colocarlo en assets/audio/.`);
        });
    } else {
      detenerAudioVoz();
    }
  });

  // Restaurar botón automáticamente cuando termine de hablar la bitácora
  reproductorVoz.addEventListener("ended", () => {
    detenerAudioVoz();
  });

  // 6. Eventos de los botones principales Luna / Marte
  btnLuna.addEventListener("click", () => cargarSector("luna"));
  btnMarte.addEventListener("click", () => cargarSector("marte"));

  // Inicializar la terminal mostrando la Luna por defecto
  cargarSector("luna");
});