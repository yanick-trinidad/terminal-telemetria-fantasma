// Minijuego: "Última Transmisión" (Opportunity - Marte 2018)
// Mecánica en HTML5 Canvas con soporte para teclado (PC) y botones táctiles (Móvil)

document.addEventListener("DOMContentLoaded", () => {
  // 1. Referencias del DOM y Canvas
  const modalJuego = document.getElementById("modal-juego");
  const btnAbrirJuego = document.getElementById("btn-abrir-juego");
  const btnCerrarJuego = document.getElementById("btn-cerrar-juego");
  const btnIzq = document.getElementById("btn-izq");
  const btnDer = document.getElementById("btn-der");
  const canvas = document.getElementById("canvas-juego");
  const ctx = canvas.getContext("2d");

  // Efecto de sonido de alerta
  const fxAlerta = new Audio("assets/audio/fx_alerta.mp3");

  // 2. Variables de estado del juego
  let animacionId = null;
  let juegoActivo = false;
  let estadoFinal = null; // "victoria" o "derrota"

  // Ángulos en radianes (0 = vertical hacia arriba, rango de -1.1 a 1.1 rad)
  let anguloAntena = 0;
  let anguloObjetivo = 0.4;
  let velocidadObjetivo = 0.012;
  let toleranciaAlineacion = 0.22; // Margen de acierto

  // Métricas de misión
  let bateria = 100; // Cae con la tormenta
  let datosTransmitidos = 0; // Meta: 100%
  let particulasPolvo = [];

  // Control de teclas / botones presionados
  let girandoIzquierda = false;
  let girandoDerecha = false;

  // 3. Inicializar partículas de tormenta marciana
  function crearTormenta() {
    particulasPolvo = [];
    for (let i = 0; i < 45; i++) {
      particulasPolvo.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocidad: 2 + Math.random() * 4,
        tamano: 1 + Math.random() * 2.5
      });
    }
  }

  // 4. Reiniciar partida
  function iniciarPartida() {
    anguloAntena = 0;
    anguloObjetivo = (Math.random() - 0.5) * 1.2;
    velocidadObjetivo = 0.013;
    bateria = 100;
    datosTransmitidos = 0;
    estadoFinal = null;
    juegoActivo = true;
    crearTormenta();

    if (animacionId) cancelAnimationFrame(animacionId);
    bucleJuego();
  }

  // 5. Lógica matemática por fotograma
  function actualizarEstado() {
    if (!juegoActivo) return;

    // Mover antena del jugador
    const velocidadGiro = 0.045;
    if (girandoIzquierda) anguloAntena -= velocidadGiro;
    if (girandoDerecha) anguloAntena += velocidadGiro;

    // Limitar ángulo máximo (-65° a +65° aprox)
    anguloAntena = Math.max(-1.15, Math.min(1.15, anguloAntena));

    // Mover el haz de señal automáticamente (rebota en los bordes)
    anguloObjetivo += velocidadObjetivo;
    if (anguloObjetivo > 1.05 || anguloObjetivo < -1.05) {
      velocidadObjetivo *= -1;
    }

    // Verificar si la antena está dentro del haz de señal
    const diferencia = Math.abs(anguloAntena - anguloObjetivo);
    const estaAlineado = diferencia <= toleranciaAlineacion;

    if (estaAlineado) {
      datosTransmitidos += 0.35; // Sube progreso de envío
      bateria -= 0.07; // Consumo bajo mientras transmite
    } else {
      bateria -= 0.16; // La tormenta drena batería más rápido sin señal
    }

    // Mover polvo en pantalla
    particulasPolvo.forEach((p) => {
      p.x -= p.velocidad;
      if (p.x < 0) {
        p.x = canvas.width;
        p.y = Math.random() * canvas.height;
      }
    });

    // Comprobar condiciones de victoria o derrota
    if (datosTransmitidos >= 100) {
      datosTransmitidos = 100;
      juegoActivo = false;
      estadoFinal = "victoria";
    } else if (bateria <= 0) {
      bateria = 0;
      juegoActivo = false;
      estadoFinal = "derrota";
      fxAlerta.currentTime = 0;
      fxAlerta.play().catch(() => {});
    }
  }

  // 6. Dibujar gráficos en Canvas
  function dibujarEscena() {
    // Fondo oscuro marciano
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Suelo de Meridiani Planum
    ctx.fillStyle = "#451a03";
    ctx.fillRect(0, canvas.height - 35, canvas.width, 35);
    ctx.strokeStyle = "#d97706";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 35);
    ctx.lineTo(canvas.width, canvas.height - 35);
    ctx.stroke();

    const centroX = canvas.width / 2;
    const baseY = canvas.height - 35;

    // Dibujar Haz de Señal Objetivo (Cono desde el rover hacia el cielo)
    ctx.save();
    ctx.translate(centroX, baseY - 22);
    ctx.rotate(anguloObjetivo);
    const gradienteHaz = ctx.createLinearGradient(0, 0, 0, -200);
    gradienteHaz.addColorStop(0, "rgba(16, 185, 129, 0.35)");
    gradienteHaz.addColorStop(1, "rgba(16, 185, 129, 0.02)");
    ctx.fillStyle = gradienteHaz;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-42, -200);
    ctx.lineTo(42, -200);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Dibujar Cuerpo del Rover Opportunity
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(centroX - 28, baseY - 22, 56, 14);
    // Ruedas
    ctx.fillStyle = "#334155";
    [-20, 0, 20].forEach((offset) => {
      ctx.beginPath();
      ctx.arc(centroX + offset, baseY - 6, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Dibujar Antena/Panel móvil del Jugador
    const estaAlineado = Math.abs(anguloAntena - anguloObjetivo) <= toleranciaAlineacion;
    ctx.save();
    ctx.translate(centroX, baseY - 22);
    ctx.rotate(anguloAntena);

    // Mástil y plato de antena
    ctx.strokeStyle = estaAlineado ? "#34d399" : "#fbbf24";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -34);
    ctx.stroke();

    // Plato parabólico
    ctx.beginPath();
    ctx.arc(0, -36, 14, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Línea guía láser de apuntado
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(0, -195);
    ctx.stroke();
    ctx.restore();

    // Dibujar Tormenta de Polvo Marciano
    ctx.fillStyle = "rgba(217, 119, 6, 0.45)";
    particulasPolvo.forEach((p) => {
      ctx.fillRect(p.x, p.y, p.tamano * 3, p.tamano);
    });

    // HUD Superior (Barras de Batería y Transmisión)
    ctx.font = "13px 'Share Tech Mono', monospace";
    
    // Barra Batería
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`BATERÍA: ${Math.ceil(bateria)}%`, 14, 22);
    ctx.strokeStyle = "#475569";
    ctx.strokeRect(14, 28, 150, 10);
    ctx.fillStyle = bateria > 30 ? "#fbbf24" : "#ef4444";
    ctx.fillRect(14, 28, (bateria / 100) * 150, 10);

    // Barra Datos Transmitidos
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`TELEMETRÍA ENVIADA: ${Math.floor(datosTransmitidos)}%`, canvas.width - 195, 22);
    ctx.strokeStyle = "#475569";
    ctx.strokeRect(canvas.width - 195, 28, 180, 10);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(canvas.width - 195, 28, (datosTransmitidos / 100) * 180, 10);

    // Indicador de estado en tiempo real
    if (juegoActivo) {
      ctx.fillStyle = estaAlineado ? "#34d399" : "#f87171";
      ctx.fillText(
        estaAlineado ? "● SEÑAL ENGANCHADA - TRANSMITIENDO..." : "▲ SEÑAL PERDIDA - ALINEA LA ANTENA",
        14,
        56
      );
    }

    // Pantalla Final (Victoria o Derrota)
    if (!juegoActivo && estadoFinal) {
      ctx.fillStyle = "rgba(2, 6, 23, 0.88)";
      ctx.fillRect(20, 65, canvas.width - 40, 150);
      ctx.strokeStyle = estadoFinal === "victoria" ? "#10b981" : "#f59e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 65, canvas.width - 40, 150);

      ctx.textAlign = "center";
      if (estadoFinal === "victoria") {
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 18px 'Share Tech Mono', monospace";
        ctx.fillText("¡TRANSMISIÓN COMPLETADA AL 100%!", centroX, 98);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "13px 'Share Tech Mono', monospace";
        ctx.fillText("Paquete científico recibido en la Tierra con éxito.", centroX, 124);
        ctx.fillText("Legado de Opportunity asegurado tras 45.16 km recorridos.", centroX, 144);
      } else {
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 17px 'Share Tech Mono', monospace";
        ctx.fillText("BATERÍA AGOTADA (0%) - CONEXIÓN PERDIDA", centroX, 96);
        ctx.fillStyle = "#fde68a";
        ctx.font = "italic 13px 'Share Tech Mono', monospace";
        ctx.fillText('"My battery is low and it\'s getting dark"', centroX, 122);
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "12px 'Share Tech Mono', monospace";
        ctx.fillText("Última telemetría recibida antes de la tormenta de 2018.", centroX, 144);
      }

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px 'Share Tech Mono', monospace";
      ctx.fillText("[ PRESIONA 'ESPACIO' O HAZ CLIC AQUÍ PARA REINTENTAR ]", centroX, 188);
      ctx.textAlign = "left";
    }
  }

  function bucleJuego() {
    actualizarEstado();
    dibujarEscena();
    animacionId = requestAnimationFrame(bucleJuego);
  }

  // 7. Eventos para abrir/cerrar Modal
  btnAbrirJuego.addEventListener("click", () => {
    modalJuego.classList.remove("hidden");
    iniciarPartida();
  });

  btnCerrarJuego.addEventListener("click", () => {
    modalJuego.classList.add("hidden");
    juegoActivo = false;
    if (animacionId) cancelAnimationFrame(animacionId);
  });

  // Reiniciar al hacer clic sobre el canvas si ya terminó la partida
  canvas.addEventListener("click", () => {
    if (!juegoActivo && estadoFinal) {
      iniciarPartida();
    }
  });

  // 8. Controles de Teclado (PC)
  window.addEventListener("keydown", (e) => {
    if (modalJuego.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") girandoIzquierda = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") girandoDerecha = true;
    if (e.code === "Space" && !juegoActivo && estadoFinal) {
      e.preventDefault();
      iniciarPartida();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") girandoIzquierda = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") girandoDerecha = false;
  });

  // 9. Controles Táctiles y Mouse (Android / iPhone / Pantalla)
  const activarIzq = (e) => { e.preventDefault(); girandoIzquierda = true; };
  const soltarIzq = () => { girandoIzquierda = false; };
  const activarDer = (e) => { e.preventDefault(); girandoDerecha = true; };
  const soltarDer = () => { girandoDerecha = false; };

  btnIzq.addEventListener("mousedown", activarIzq);
  btnIzq.addEventListener("mouseup", soltarIzq);
  btnIzq.addEventListener("mouseleave", soltarIzq);
  btnIzq.addEventListener("touchstart", activarIzq, { passive: false });
  btnIzq.addEventListener("touchend", soltarIzq);

  btnDer.addEventListener("mousedown", activarDer);
  btnDer.addEventListener("mouseup", soltarDer);
  btnDer.addEventListener("mouseleave", soltarDer);
  btnDer.addEventListener("touchstart", activarDer, { passive: false });
  btnDer.addEventListener("touchend", soltarDer);
});