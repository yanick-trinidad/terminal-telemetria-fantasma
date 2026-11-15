// Motor Multi-Misión v2.0 - 4 Minijuegos Interactivos + Audio Sincronizado Obligatorio
// Surveyor 3 (Excavación) | Apolo 15 (Rover) | Opportunity (Tormenta) | Ingenuity (Vuelo)

document.addEventListener("DOMContentLoaded", () => {
  const modalJuego = document.getElementById("modal-juego");
  const btnAbrirJuego = document.getElementById("btn-abrir-juego");
  const btnCerrarJuego = document.getElementById("btn-cerrar-juego");
  const juegoTitulo = document.getElementById("juego-titulo");
  const juegoInstruccion = document.getElementById("juego-instruccion");

  const btnIzq = document.getElementById("btn-izq");
  const btnAccion = document.getElementById("btn-accion");
  const btnDer = document.getElementById("btn-der");
  const canvas = document.getElementById("canvas-juego");
  const ctx = canvas.getContext("2d");

  // Reproductor exclusivo de misión (se activa al hacer clic en Iniciar Misión)
  const audioMision = new Audio();
  const fxAlerta = new Audio("assets/audio/fx_alerta.mp3");

  let animacionId = null;
  let juegoActivo = false;
  let estadoFinal = null; // "victoria" o "derrota"
  let misionId = "opportunity";

  // Controles activos
  let izqPresionado = false;
  let derPresionado = false;
  let accionPresionada = false;

  // Variables compartidas de estado
  let progreso = 0; // 0 a 100
  let energia = 100; // 100 a 0

  // Variables específicas por minijuego
  let barraPos = 0, barraDir = 1, muestrasTomadas = 0; // Surveyor 3
  let roverX = 240, obstaculos = [], cristales = []; // LRV Apolo 15
  let anguloAntena = 0, anguloObjetivo = 0.4, velObjetivo = 0.013, polvo = []; // Opportunity
  let heliY = 190, heliVelY = 0, heliX = 80, viento = 0; // Ingenuity

function iniciarAudioObligatorio(rutaAudio) {
    if (window.detenerAudioVistaPrevia) window.detenerAudioVistaPrevia();
    audioMision.pause();
    audioMision.src = rutaAudio;
    audioMision.currentTime = 0;
    
    // Intenta reproducir y reporta cualquier error o éxito en la consola (F12)
    audioMision.play().then(() => {
      console.log("Audio de misión reproducido correctamente:", rutaAudio);
    }).catch((error) => {
      console.warn("Aviso de audio: El archivo no se encontró en assets/audio/ o el navegador bloqueó la reproducción automática.", rutaAudio, error);
    });
  }

  function detenerAudioMision() {
    audioMision.pause();
    audioMision.currentTime = 0;
  }

  function prepararJuego() {
    const mision = window.APP_STATE.misionActiva;
    if (!mision) return;

    const lang = window.APP_STATE.idioma;
    const datos = mision[lang];
    misionId = mision.id;

    juegoTitulo.textContent = datos.juegoTitulo;
    juegoInstruccion.textContent = datos.juegoInstruccion;

    // Resaltar controles útiles según el juego
    const usaFlechas = misionId === "lrv_apolo15" || misionId === "opportunity";
    btnIzq.style.opacity = usaFlechas ? "1" : "0.35";
    btnDer.style.opacity = usaFlechas ? "1" : "0.35";
    btnAccion.style.opacity = !usaFlechas ? "1" : "0.35";

    progreso = 0;
    energia = 100;
    estadoFinal = null;
    juegoActivo = true;

    // Inicializar parámetros según misión
    if (misionId === "surveyor3") {
      barraPos = 10;
      barraDir = 1;
      muestrasTomadas = 0;
    } else if (misionId === "lrv_apolo15") {
      roverX = canvas.width / 2 - 20;
      obstaculos = [];
      cristales = [];
      muestrasTomadas = 0;
    } else if (misionId === "opportunity") {
      anguloAntena = 0;
      anguloObjetivo = (Math.random() - 0.5) * 1.1;
      velObjetivo = 0.013;
      polvo = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        v: 2 + Math.random() * 3.5
      }));
    } else if (misionId === "ingenuity") {
      heliX = 75;
      heliY = 185;
      heliVelY = 0;
      viento = 0;
    }

    iniciarAudioObligatorio(mision.audio);

    if (animacionId) cancelAnimationFrame(animacionId);
    bucle();
  }

  // Acción instantánea (Barra Espaciadora o Botón Central)
  function ejecutarGolpeAccion() {
    if (!juegoActivo) {
      if (estadoFinal) prepararJuego();
      return;
    }

    if (misionId === "surveyor3") {
      // Zona verde está entre 38% y 62%
      if (barraPos >= 38 && barraPos <= 62) {
        muestrasTomadas++;
        progreso = (muestrasTomadas / 3) * 100;
        barraDir *= 1.25; // Aumenta un poco el reto
        if (muestrasTomadas >= 3) {
          juegoActivo = false;
          estadoFinal = "victoria";
        }
      } else {
        energia -= 34;
        if (energia <= 0) {
          energia = 0;
          juegoActivo = false;
          estadoFinal = "derrota";
          fxAlerta.play().catch(() => {});
        }
      }
    }
  }

  function actualizar() {
    if (!juegoActivo) return;

    // --- JUEGO 1: SURVEYOR 3 (Excavación de precisión) ---
    if (misionId === "surveyor3") {
      barraPos += barraDir * 1.45;
      if (barraPos >= 96 || barraPos <= 4) barraDir *= -1;
    }

    // --- JUEGO 2: LRV APOLO 15 (Esquivar cráteres y recoger Roca del Génesis) ---
    if (misionId === "lrv_apolo15") {
      if (izqPresionado) roverX -= 4.5;
      if (derPresionado) roverX += 4.5;
      roverX = Math.max(20, Math.min(canvas.width - 60, roverX));
      energia -= 0.06;

      if (Math.random() < 0.03) {
        obstaculos.push({ x: 30 + Math.random() * (canvas.width - 60), y: -20, r: 14 });
      }
      if (Math.random() < 0.018) {
        cristales.push({ x: 30 + Math.random() * (canvas.width - 60), y: -20 });
      }

      obstaculos.forEach((o) => (o.y += 3.2));
      cristales.forEach((c) => (c.y += 2.8));

      // Colisión con cráteres
      obstaculos = obstaculos.filter((o) => {
        const choque = Math.abs(o.x - (roverX + 20)) < 26 && Math.abs(o.y - 205) < 22;
        if (choque) energia -= 25;
        return !choque && o.y < canvas.height + 20;
      });

      // Recolección de Roca del Génesis
      cristales = cristales.filter((c) => {
        const recogido = Math.abs(c.x - (roverX + 20)) < 28 && Math.abs(c.y - 205) < 24;
        if (recogido) {
          muestrasTomadas++;
          progreso = Math.min(100, (muestrasTomadas / 3) * 100);
        }
        return !recogido && c.y < canvas.height + 20;
      });

      if (muestrasTomadas >= 3) {
        juegoActivo = false;
        estadoFinal = "victoria";
      } else if (energia <= 0) {
        energia = 0;
        juegoActivo = false;
        estadoFinal = "derrota";
        fxAlerta.play().catch(() => {});
      }
    }

    // --- JUEGO 3: OPPORTUNITY (Tormenta de polvo y alineación) ---
    if (misionId === "opportunity") {
      if (izqPresionado) anguloAntena -= 0.045;
      if (derPresionado) anguloAntena += 0.045;
      anguloAntena = Math.max(-1.15, Math.min(1.15, anguloAntena));

      anguloObjetivo += velObjetivo;
      if (anguloObjetivo > 1.05 || anguloObjetivo < -1.05) velObjetivo *= -1;

      const alineado = Math.abs(anguloAntena - anguloObjetivo) <= 0.23;
      if (alineado) {
        progreso += 0.38;
        energia -= 0.06;
      } else {
        energia -= 0.15;
      }

      polvo.forEach((p) => {
        p.x -= p.v;
        if (p.x < 0) p.x = canvas.width;
      });

      if (progreso >= 100) {
        progreso = 100;
        juegoActivo = false;
        estadoFinal = "victoria";
      } else if (energia <= 0) {
        energia = 0;
        juegoActivo = false;
        estadoFinal = "derrota";
        fxAlerta.play().catch(() => {});
      }
    }

    // --- JUEGO 4: INGENUITY (Vuelo controlado en Jezero) ---
    if (misionId === "ingenuity") {
      // Gravedad marciana + empuje del rotor
      if (accionPresionada) {
        heliVelY -= 0.34;
        energia -= 0.14;
      } else {
        heliVelY += 0.16;
      }
      heliVelY = Math.max(-4.2, Math.min(4.2, heliVelY));
      heliY += heliVelY;
      heliX += 1.45; // Avance hacia la plataforma destino (X = 430)

      // Techo y suelo
      if (heliY < 28) { heliY = 28; heliVelY = 0; }
      progreso = Math.min(100, Math.max(0, ((heliX - 75) / 355) * 100));

      // Aterrizaje en plataforma destino (X entre 395 y 465, Y >= 195)
      if (heliY >= 195) {
        if (heliX >= 390 && heliX <= 470 && Math.abs(heliVelY) < 3.2) {
          progreso = 100;
          juegoActivo = false;
          estadoFinal = "victoria";
        } else {
          energia = 0;
          juegoActivo = false;
          estadoFinal = "derrota";
          fxAlerta.play().catch(() => {});
        }
      } else if (energia <= 0 || heliX > canvas.width - 20) {
        energia = 0;
        juegoActivo = false;
        estadoFinal = "derrota";
        fxAlerta.play().catch(() => {});
      }
    }
  }

  function dibujar() {
    const lang = window.APP_STATE.idioma;
    ctx.fillStyle = "#060b14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Superficie planetaria según cuerpo celeste
    const esMarte = misionId === "opportunity" || misionId === "ingenuity";
    ctx.fillStyle = esMarte ? "#451a03" : "#1e293b";
    ctx.fillRect(0, canvas.height - 35, canvas.width, 35);

    // Dibujo específico de cada misión
    if (misionId === "surveyor3") {
      // Módulo Surveyor y brazo excavador
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(210, 130, 100, 55);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(260, 170);
      ctx.lineTo(260, 225);
      ctx.stroke();

      // Barra de calibración de presión
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(60, 75, 400, 26);
      // Zona verde óptima (38% a 62%)
      ctx.fillStyle = "#10b981";
      ctx.fillRect(60 + 400 * 0.38, 75, 400 * 0.24, 26);
      // Cursor móvil
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(60 + (barraPos / 100) * 392, 68, 8, 40);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "14px 'Share Tech Mono', monospace";
      ctx.fillText(
        lang === "es" ? `MUESTRAS DE SUELO: ${muestrasTomadas} / 3` : `SOIL SAMPLES: ${muestrasTomadas} / 3`,
        175,
        52
      );
    }

    if (misionId === "lrv_apolo15") {
      // Pista lunar vertical
      ctx.strokeStyle = "#475569";
      ctx.strokeRect(20, 45, canvas.width - 40, 185);

      // Cráteres
      ctx.fillStyle = "#ef4444";
      obstaculos.forEach((o) => {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cristales Roca del Génesis
      ctx.fillStyle = "#34d399";
      cristales.forEach((c) => {
        ctx.fillRect(c.x - 8, c.y - 8, 16, 16);
      });

      // Rover Apolo 15
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(roverX, 192, 40, 24);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "13px 'Share Tech Mono', monospace";
      ctx.fillText(
        lang === "es" ? `ROCAS DEL GÉNESIS: ${muestrasTomadas} / 3` : `GENESIS ROCKS: ${muestrasTomadas} / 3`,
        175,
        36
      );
    }

    if (misionId === "opportunity") {
      const cx = canvas.width / 2;
      const by = canvas.height - 35;

      // Haz verde objetivo
      ctx.save();
      ctx.translate(cx, by - 20);
      ctx.rotate(anguloObjetivo);
      ctx.fillStyle = "rgba(16, 185, 129, 0.30)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-40, -190);
      ctx.lineTo(40, -190);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Rover y antena
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(cx - 26, by - 20, 52, 14);
      ctx.save();
      ctx.translate(cx, by - 20);
      ctx.rotate(anguloAntena);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -38);
      ctx.stroke();
      ctx.restore();

      // Polvo
      ctx.fillStyle = "rgba(217, 119, 6, 0.45)";
      polvo.forEach((p) => ctx.fillRect(p.x, p.y, 6, 2));
    }

    if (misionId === "ingenuity") {
      // Plataforma de aterrizaje destino
      ctx.fillStyle = "#10b981";
      ctx.fillRect(395, canvas.height - 40, 70, 8);
      ctx.fillStyle = "#a7f3d0";
      ctx.font = "11px 'Share Tech Mono', monospace";
      ctx.fillText("PAD JEZERO", 400, canvas.height - 15);

      // Helicóptero Ingenuity
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(heliX - 12, heliY - 10, 24, 16);
      // Rotores girando
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      const anchoRotor = Math.sin(Date.now() * 0.05) * 28;
      ctx.beginPath();
      ctx.moveTo(heliX - anchoRotor, heliY - 15);
      ctx.lineTo(heliX + anchoRotor, heliY - 15);
      ctx.stroke();
    }

    // HUD Superior (Energía y Progreso)
    ctx.font = "12px 'Share Tech Mono', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${lang === "es" ? "ENERGÍA" : "POWER"}: ${Math.ceil(energia)}%`, 14, 20);
    ctx.fillStyle = energia > 30 ? "#fbbf24" : "#ef4444";
    ctx.fillRect(110, 11, (energia / 100) * 110, 10);

    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`${lang === "es" ? "MISIÓN" : "MISSION"}: ${Math.floor(progreso)}%`, 290, 20);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(385, 11, (progreso / 100) * 115, 10);

    // Pantalla Final (Victoria o Derrota)
    if (!juegoActivo && estadoFinal) {
      ctx.fillStyle = "rgba(2, 6, 23, 0.90)";
      ctx.fillRect(25, 60, canvas.width - 50, 145);
      ctx.strokeStyle = estadoFinal === "victoria" ? "#10b981" : "#f59e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 60, canvas.width - 50, 145);

      ctx.textAlign = "center";
      const cx = canvas.width / 2;

      if (estadoFinal === "victoria") {
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 17px 'Share Tech Mono', monospace";
        ctx.fillText(
          lang === "es" ? "¡MISIÓN CUMPLIDA, EXPLORADOR!" : "MISSION ACCOMPLISHED, EXPLORER!",
          cx,
          98
        );
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "13px 'Share Tech Mono', monospace";
        ctx.fillText(
          lang === "es"
            ? "Datos científicos recuperados para la Terminal."
            : "Scientific data recovered for the Terminal.",
          cx,
          126
        );
      } else {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 17px 'Share Tech Mono', monospace";
        ctx.fillText(
          lang === "es" ? "SEÑAL INTERRUMPIDA — INTENTA DE NUEVO" : "SIGNAL LOST — TRY AGAIN",
          cx,
          98
        );
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "13px 'Share Tech Mono', monospace";
        ctx.fillText(
          lang === "es"
            ? "La exploración espacial requiere precisión."
            : "Space exploration requires precision.",
          cx,
          126
        );
      }

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px 'Share Tech Mono', monospace";
      ctx.fillText(
        lang === "es"
          ? "[ PRESIONA 'ESPACIO' O TOCA AQUÍ PARA REINTENTAR ]"
          : "[ PRESS 'SPACE' OR TAP HERE TO RETRY ]",
        cx,
        175
      );
      ctx.textAlign = "left";
    }
  }

  function bucle() {
    actualizar();
    dibujar();
    animacionId = requestAnimationFrame(bucle);
  }

  // Abrir / Cerrar Modal
  btnAbrirJuego.addEventListener("click", () => {
    if (!window.APP_STATE.misionActiva) return;
    modalJuego.classList.remove("hidden");
    prepararJuego();
  });

  btnCerrarJuego.addEventListener("click", () => {
    modalJuego.classList.add("hidden");
    juegoActivo = false;
    detenerAudioMision();
    if (animacionId) cancelAnimationFrame(animacionId);
  });

  canvas.addEventListener("click", () => {
    if (!juegoActivo && estadoFinal) prepararJuego();
  });

  // Teclado PC
  window.addEventListener("keydown", (e) => {
    if (modalJuego.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") izqPresionado = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") derPresionado = true;
    if (e.code === "Space") {
      e.preventDefault();
      if (!accionPresionada) ejecutarGolpeAccion();
      accionPresionada = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") izqPresionado = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") derPresionado = false;
    if (e.code === "Space") accionPresionada = false;
  });

  // Controles Táctiles Móvil / Tablet
  const enlazarBotonTactil = (btn, alPresionar, alSoltar) => {
    btn.addEventListener("mousedown", (e) => { e.preventDefault(); alPresionar(); });
    btn.addEventListener("mouseup", alSoltar);
    btn.addEventListener("mouseleave", alSoltar);
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); alPresionar(); }, { passive: false });
    btn.addEventListener("touchend", alSoltar);
  };

  enlazarBotonTactil(btnIzq, () => (izqPresionado = true), () => (izqPresionado = false));
  enlazarBotonTactil(btnDer, () => (derPresionado = true), () => (derPresionado = false));
  enlazarBotonTactil(
    btnAccion,
    () => {
      if (!accionPresionada) ejecutarGolpeAccion();
      accionPresionada = true;
    },
    () => (accionPresionada = false)
  );
});