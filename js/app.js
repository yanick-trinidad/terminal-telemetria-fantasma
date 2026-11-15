// Lógica Principal v2.0 - Storytelling de Mateo, Consola Bilingüe y Puente México-NASA
// MEMORIES IN SPACE - Equipo Nova Itsat

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
  const capaPines = document.getElementById("capa-pines");
  const btnMapaOficial = document.getElementById("btn-mapa-oficial");

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

  // 3. Estado Global
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

  window.detenerAudioVistaPrevia = detenerAudioVoz;

  // 4. Lógica de la Historia Inicial
  function renderizarViñetaIntro() {
    const lang = window.APP_STATE.idioma;
    const t = TEXTOS_UI[lang];
    const escenas = HISTORIA_INTRO[lang];
    const actual = escenas[indiceIntro];

    introEscenaTitulo.textContent = actual.escena;
    introTexto.textContent = actual.texto;

    const puntos = introIndicadores.querySelectorAll("span");
    puntos.forEach((p, idx) => {
      p.className = idx === indiceIntro
        ? "w-3 h-3 rounded-full bg-amber-400 transition"
        : "w-3 h-3 rounded-full bg-slate-700 transition";
    });

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

  // 5. Traducción Dinámica
  function aplicarIdioma() {
    const lang = window.APP_STATE.idioma;
    const t = TEXTOS_UI[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const clave = el.getAttribute("data-i18n");
      if (t[clave]) el.textContent = t[clave];
    });

    btnAudio.textContent = reproduciendoVoz ? t.btnStop : t.btnPlay;

    renderizarViñetaIntro();
    cargarSector(sectorActual, false);

    if (window.APP_STATE.misionActiva) {
      actualizarPanelMision(window.APP_STATE.misionActiva);
      if (!reproduciendoVoz) {
        reproductorVoz.src = window.APP_STATE.misionActiva[lang].audio;
      }
    }
  }

  function alternarIdioma() {
    window.APP_STATE.idioma = window.APP_STATE.idioma === "es" ? "en" : "es";
    aplicarIdioma();
  }

  btnIdioma.addEventListener("click", alternarIdioma);
  btnIdiomaIntro.addEventListener("click", alternarIdioma);

  // =====================================================================
  // MOTOR 3D (THREE.JS) CON BALIZAS DINÁMICAS Y ROTACIÓN SOLO POR ARRASTRE
  // =====================================================================
  let scene, camera, renderer, planetMesh;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let activePinsData = [];

  function getMissionVector(id) {
    switch (id) {
      case 'surveyor3':
        return new THREE.Vector3(-0.35, 0.25, 0.90).normalize();
      case 'lrv_apolo15':
        return new THREE.Vector3(0.25, 0.45, 0.85).normalize();
      case 'opportunity':
        return new THREE.Vector3(-0.20, 0.15, 0.96).normalize();
      case 'ingenuity':
        return new THREE.Vector3(0.40, 0.30, 0.86).normalize();
      default:
        return new THREE.Vector3(0, 0, 1);
    }
  }

  function init3DPlanet(textureUrl) {
    const container = document.getElementById("contenedor-planeta-3d");
    if (!container) return;

    container.querySelector("#canvas-planeta")?.remove();
    const canvas = document.createElement("canvas");
    canvas.id = "canvas-planeta";
    canvas.className = "w-full h-full cursor-grab active:cursor-grabbing";
    container.insertBefore(canvas, container.firstChild);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.8;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureUrl, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(2, 1);

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.85,
        metalness: 0.1
      });

      if (planetMesh) scene.remove(planetMesh);
      planetMesh = new THREE.Mesh(geometry, material);
      scene.add(planetMesh);
    }, undefined, (err) => {
      console.warn("Error cargando textura 3D:", err);
      const material = new THREE.MeshStandardMaterial({ color: 0x334155 });
      planetMesh = new THREE.Mesh(geometry, material);
      scene.add(planetMesh);
    });

    // Bucle de animación: Sin rotación automática (solo renderiza y proyecta pines)
    function animate() {
      requestAnimationFrame(animate);

      if (planetMesh && container) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        activePinsData.forEach(item => {
          // Obtener la posición mundial del pin basada en la rotación de la esfera 3D
          const worldPos = item.vector.clone().applyMatrix4(planetMesh.matrixWorld);
          
          // Verificar si está frente a la cámara (en el espacio de la cámara)
          const vectorCamSpace = worldPos.clone().applyMatrix4(camera.matrixWorldInverse);

          if (vectorCamSpace.z < 0) {
            // Proyectar coordenadas 3D a coordenadas de pantalla 2D
            const v = worldPos.clone().project(camera);
            const x = (v.x *  0.5 + 0.5) * width;
            const y = (v.y * -0.5 + 0.5) * height;

            item.element.style.left = `${x}px`;
            item.element.style.top = `${y}px`;
            
            // Comprobar si está en el horizonte visible de la esfera
            const normal = worldPos.clone().sub(planetMesh.position).normalize();
            const camDir = camera.position.clone().sub(worldPos).normalize();
            const dot = normal.dot(camDir);

            if (dot < 0.15) {
              item.element.style.opacity = '0';
              item.element.style.pointerEvents = 'none';
            } else {
              item.element.style.opacity = '1';
              item.element.style.pointerEvents = 'auto';
            }
            item.element.style.display = 'flex';
          } else {
            // Ocultar si está en la parte trasera del planeta
            item.element.style.display = 'none';
          }
        });
      }

      renderer.render(scene, camera);
    }
    animate();

    // Controles de arrastre (Mouse)
    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging || !planetMesh) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      planetMesh.rotation.y += deltaX * 0.005;
      planetMesh.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Controles táctiles (Celulares y Tablets)
    canvas.addEventListener("touchstart", (e) => {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener("touchmove", (e) => {
      if (!isDragging || !planetMesh) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      planetMesh.rotation.y += deltaX * 0.005;
      planetMesh.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  // 6. Mapa Interactivo / Globos 3D (Luna / Marte) con Botón Dinámico Oficial
  function cargarSector(cuerpo, reiniciarAudio = true) {
    const lang = window.APP_STATE.idioma;
    const t = TEXTOS_UI[lang];
    sectorActual = cuerpo;
    if (reiniciarAudio) detenerAudioVoz();

    if (window.APP_STATE.misionActiva && window.APP_STATE.misionActiva.cuerpo !== cuerpo) {
      window.APP_STATE.misionActiva = null;
      btnAudio.disabled = true;
      btnAbrirJuego.disabled = true;
    }

    if (cuerpo === "luna") {
      etiquetaSector.textContent = t.sectorLuna;
      init3DPlanet("assets/img/mapa_luna.webp");
      btnLuna.className = "px-4 py-2 border-2 border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/40 transition font-bold rounded cursor-pointer text-sm";
      btnMarte.className = "px-4 py-2 border-2 border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold rounded cursor-pointer text-sm";

      if (btnMapaOficial) {
        btnMapaOficial.href = "https://quickmap.lroc.im-ldi.com/?camera=408641.9769%2C-6534111.2119%2C-5479585.0054%2C-0.0479%2C0.7654%2C0.6418%2C0.0401%2C-0.6406%2C0.7668%2C60&earthShadowEnabled=true&proj=22&stack=3314&defs=N4IgzGCMAsIFygPYAcCGBjAlgFwJ70gF9Cg";
        btnMapaOficial.textContent = lang === "es" ? "🛰️ EXPLORAR MAPA 3D OFICIAL EN LROC QUICKMAP (NASA) ↗" : "🛰️ EXPLORE OFFICIAL 3D MAP IN LROC QUICKMAP (NASA) ↗";
      }

      if (!window.APP_STATE.misionActiva) {
        misionAnio.textContent = "AÑO: --";
        misionUbicacion.textContent = "UBICACIÓN: EN ESPERA";
        misionImg.src = "assets/img/surveyor3.webp";
        misionNombre.textContent = lang === "es" ? "Selecciona una baliza en el mapa" : "Select a beacon on the map";
        misionSubguia.textContent = lang === "es" ? "Explora su historia y juega su misión espacial." : "Explore its story and play its space mission.";
        misionHardware.textContent = lang === "es" ? "Esperando selección..." : "Awaiting selection...";
        misionCiencia.textContent = lang === "es" ? "Esperando selección..." : "Awaiting selection...";
        misionMexico.textContent = lang === "es" ? "Esperando selección..." : "Awaiting selection...";
        misionBitacora.textContent = "\"-\"";
        misionEnlace.classList.add("hidden");
      }
    } else {
      etiquetaSector.textContent = t.sectorMarte;
      init3DPlanet("assets/img/mapa_marte.webp");
      btnMarte.className = "px-4 py-2 border-2 border-amber-400 bg-amber-500/20 text-amber-200 hover:bg-amber-500/40 transition font-bold rounded cursor-pointer text-sm";
      btnLuna.className = "px-4 py-2 border-2 border-emerald-500/40 bg-slate-950 text-emerald-500 hover:border-emerald-400 hover:text-emerald-200 transition font-bold rounded cursor-pointer text-sm";

      if (btnMapaOficial) {
        btnMapaOficial.href = "https://eyes.nasa.gov/apps/solar-system/#/mars";
        btnMapaOficial.textContent = lang === "es" ? "🔴 EXPLORAR MARTE EN NASA EYES ON THE SOLAR SYSTEM ↗" : "🔴 EXPLORE MARS IN NASA EYES ON THE SOLAR SYSTEM ↗";
      }

      if (!window.APP_STATE.misionActiva) {
        misionAnio.textContent = lang === "es" ? "PLANETA: MARTE" : "PLANET: MARS";
        misionUbicacion.textContent = lang === "es" ? "SECTOR: PLANETARIO (NASA MARS FACTS)" : "SECTOR: PLANETARY (NASA MARS FACTS)";
        misionImg.src = "assets/img/opportunity.webp";
        misionNombre.textContent = lang === "es" ? "Planeta Rojo - Archivos Oficiales NASA" : "Red Planet - Official NASA Archives";
        misionSubguia.textContent = lang === "es" ? "Selecciona una baliza de sonda o consulta los datos globales." : "Select a probe beacon or view global data.";
        misionHardware.textContent = lang === "es" ? "Atmósfera tenue de dióxido de carbono, volcanes y casquetes polares." : "Thin carbon dioxide atmosphere, volcanoes, and polar ice caps.";
        misionCiencia.textContent = t.marsFactsTexto;
        misionMexico.textContent = lang === "es" ? "Estudio orbital y comparativa con el ciclo de 780 días del Códice de Dresde." : "Orbital study compared with the 780-day cycle of geospatial archives.";
        misionBitacora.textContent = lang === "es" ? "\"Transmitiendo datos globales desde el archivo oficial de Mars Facts.\"" : "\"Transmitting global data from the official Mars Facts archive.\"";
        misionEnlace.href = "https://science.nasa.gov/mars/facts/";
        misionEnlace.textContent = t.btnMarsFactsLink;
        misionEnlace.classList.remove("hidden");
        misionEnlace.classList.add("block");
      }
    }

    // Generar balizas dinámicas en 3D
    capaPines.innerHTML = "";
    activePinsData = [];
    const filtradas = MISIONES.filter((m) => m.cuerpo === cuerpo);

    filtradas.forEach((mision) => {
      const datos = mision[lang];
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "pin-baliza group flex flex-col items-center cursor-pointer focus:outline-none z-30 absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2";

      pin.innerHTML = `
        <span class="w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 block group-hover:bg-amber-400 transition shadow-lg"></span>
        <span class="mt-1 px-2 py-0.5 text-xs font-bold bg-slate-950/90 border border-emerald-500/70 text-emerald-200 rounded whitespace-nowrap group-hover:border-amber-400 group-hover:text-amber-300">
          ${datos.nombre}
        </span>
      `;

      pin.addEventListener("click", (e) => {
        e.stopPropagation();
        seleccionarMision(mision);
      });
      capaPines.appendChild(pin);

      const vector3 = getMissionVector(mision.id);
      activePinsData.push({ element: pin, vector: vector3 });
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
    misionEnlace.textContent = TEXTOS_UI[lang].btnNasa;
    misionEnlace.classList.remove("hidden");
    misionEnlace.classList.add("block");
  }

  function seleccionarMision(mision) {
    window.APP_STATE.misionActiva = mision;
    sonarEfectoRadio();
    detenerAudioVoz();
    actualizarPanelMision(mision);

    reproductorVoz.src = mision[window.APP_STATE.idioma].audio;
    btnAudio.disabled = false;
    btnAbrirJuego.disabled = false;
  }

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
          alert(`Audio pendiente en: ${mision[window.APP_STATE.idioma].audio}`);
        });
    } else {
      detenerAudioVoz();
    }
  });

  reproductorVoz.addEventListener("ended", detenerAudioVoz);
  btnLuna.addEventListener("click", () => cargarSector("luna"));
  btnMarte.addEventListener("click", () => cargarSector("marte"));

  aplicarIdioma();
});