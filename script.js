// script.js - Examen versión 6 (20 preguntas por tema, examen completo 20 mezcladas, repaso inteligente)
// Reemplaza totalmente el script.js anterior por este archivo.

// --- Utilidades iniciales y manejo de vistas ---
function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("visible"));
  const el = document.getElementById(id);
  if (el) el.classList.add("visible");
  if (id === "examen") reiniciarExamen();
}

const STORAGE_KEY = "soa_failed_questions_v6";
let tipoExamen = ""; // 'servicios' | 'metodologias' | 'completo' | 'repaso'
let preguntasSeleccionadas = []; // array de objetos { p, r, c, tema }

// --- Bancos: 20 preguntas por tema (redactadas y alineadas al PDF) ---

const bancoServicios = [
  { p: "1. ¿Qué clase de servicio maneja datos del negocio (clientes, productos, pedidos)?", r: ["Servicio de Utilidad", "Servicio de Entidad", "Servicio de Tarea"], c: 1 },
  { p: "2. ¿Cuál servicio es responsable de orquestar varios servicios para completar un proceso como 'procesar pedido'?", r: ["Servicio de Tarea", "Servicio de Entidad", "Servicio de Utilidad"], c: 0 },
  { p: "3. ¿Qué tipo de servicio típicamente implementa operaciones CRUD (crear, leer, actualizar, eliminar)?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "4. ¿Qué tipo de servicio sería ideal para enviar correos y notificaciones?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "5. ¿Cuál servicio se diseña para ser lo más independiente y reutilizable posible para tareas técnicas?", r: ["Utilidad", "Entidad", "Tarea"], c: 0 },
  { p: "6. ¿Qué servicio es menos reutilizable porque responde a un flujo de negocio específico?", r: ["Entidad", "Utilidad", "Tarea"], c: 2 },
  { p: "7. ¿Qué servicio debe versionarse con cuidado porque otros servicios consumen su contrato de datos?", r: ["Entidad", "Utilidad", "Tarea"], c: 0 },
  { p: "8. ¿Qué servicio normalmente no contiene lógica técnica como encriptación o envío de correos?", r: ["Utilidad", "Tarea", "Entidad"], c: 2 },
  { p: "9. ¿Qué servicio suele exponer endpoints para consultas y actualizaciones de productos?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "10. ¿Qué servicio es más apropiado para centralizar validación técnica (formato de correo, longitud de contraseña)?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "11. ¿Qué servicio tendría sentido para implementar un gateway de pagos o integración con pasarelas?", r: ["Tarea", "Entidad", "Utilidad"], c: 2 },
  { p: "12. ¿Qué servicio se usa para mantener integridad y reglas de negocio sobre los datos (ej. invariant constraints)?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "13. ¿Qué servicio es el encargado de coordinar acciones como validar inventario y cobrar al cliente en un flujo?", r: ["Utilidad", "Entidad", "Tarea"], c: 2 },
  { p: "14. ¿Qué servicio sería el más indicado para exponer métricas, logs y auditoría técnica?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "15. ¿Qué servicio se considera transversal y consumido por múltiples procesos y servicios de negocio?", r: ["Tarea", "Entidad", "Utilidad"], c: 2 },
  { p: "16. ¿Cuál de los siguientes es un ejemplo de servicio de entidad?", r: ["ServicioCliente", "ServicioNotificaciones", "ServicioOrquestador"], c: 0 },
  { p: "17. ¿Cuál de los siguientes es un ejemplo de servicio de utilidad?", r: ["ServicioPago", "ServicioNotificaciones", "ServicioPedido"], c: 1 },
  { p: "18. ¿Qué servicio se diseña pensando más en datos y menos en proceso?", r: ["Tarea", "Entidad", "Utilidad"], c: 1 },
  { p: "19. ¿Qué tipo de servicio debe ser documentado con contratos claros (APIs y esquemas)?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "20. ¿Cuál es la principal razón para separar lógica en entidad/utilidad/tarea?", r: ["Reducir pruebas", "Aumentar acoplamiento", "Reutilización y alineación con el negocio"], c: 2 }
];

const bancoMetodologias = [
  { p: "1. ¿Qué metodología parte del análisis de procesos de negocio para definir servicios?", r: ["Bottom-Up", "Top-Down", "Agile SOA"], c: 1 },
  { p: "2. ¿Qué metodología busca aprovechar sistemas existentes convirtiéndolos en servicios?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "3. ¿Qué enfoque combina análisis de negocio y aprovechamiento de sistemas actuales (híbrido)?", r: ["Meet-in-the-Middle", "Bottom-Up", "Top-Down"], c: 0 },
  { p: "4. ¿Qué metodología es un enfoque formal de IBM con fases de Identificación, Especificación y Realización?", r: ["SOMA", "Agile SOA", "Bottom-Up"], c: 0 },
  { p: "5. ¿Qué metodología aplica principios ágiles como iteraciones y sprints al desarrollo de servicios?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "6. ¿Cuál es una ventaja de Top-Down?", r: ["Alineación con negocio", "Bajo costo inicial", "Desarrollo inmediato"], c: 0 },
  { p: "7. ¿Qué desventaja se asocia comúnmente con Bottom-Up?", r: ["Mayor alineación con negocio", "Menor alineación con negocio", "Mayor formalidad"], c: 1 },
  { p: "8. ¿Qué metodología es ideal cuando se necesita gobernanza y modelado riguroso en empresas grandes?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 1 },
  { p: "9. ¿Qué enfoque es más rápido para obtener prototipos funcionando pero puede dar menos estandarización?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "10. ¿Qué ventaja principal ofrece Meet-in-the-Middle?", r: ["Ignorar sistemas heredados", "Equilibrar visión y realidad técnica", "Eliminar gobernanza"], c: 1 },
  { p: "11. ¿Qué metodología prioriza identificar servicios reutilizables a nivel de negocio antes de implementarlos?", r: ["Bottom-Up", "Top-Down", "Agile SOA"], c: 1 },
  { p: "12. ¿Qué metodología suele recomendar entregas frecuentes y feedback temprano?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "13. ¿Qué enfoque es más apropiado cuando hay muchos sistemas legacy y se desea modernizar gradualmente?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 1 },
  { p: "14. ¿Qué metodología puede ser costosa y compleja por su formalidad y fases definidas?", r: ["Agile SOA", "Bottom-Up", "SOMA"], c: 2 },
  { p: "15. ¿Qué enfoque favorece entregar valor útil rápidamente mediante iteraciones?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "16. ¿Cuál es una razón para elegir Top-Down en una organización?", r: ["Acelerar sin planificación", "Alinear TI con estrategia de negocio", "Evitar gobernanza"], c: 1 },
  { p: "17. ¿Cuál es un riesgo de aplicar solo Bottom-Up sin coordinación?", r: ["Duplicidad de servicios y poca estandarización", "Exceso de documentación", "Entrega lenta"], c: 0 },
  { p: "18. ¿Qué metodología propone fases claras que incluyen la identificación de servicios?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 1 },
  { p: "19. ¿Cuál metodología se adapta bien a entornos cloud por su velocidad y flexibilidad?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "20. Si quieres equilibrio entre visión de negocio y reutilización técnica, ¿qué metodología elegirías?", r: ["Bottom-Up", "Meet-in-the-Middle", "SOMA"], c: 1 }
];

// --- Funciones de selección y renderizado ---

function seleccionarAleatorioSinRepetir(banco, cantidad) {
  const copia = [...banco];
  const seleccion = [];
  while (seleccion.length < Math.min(cantidad, copia.length)) {
    const i = Math.floor(Math.random() * copia.length);
    const item = copia.splice(i, 1)[0];
    // Asegurar que cada objeto tenga campo tema
    if (!item.tema) {
      // deducir por presencia en arrays
      item.tema = banco === bancoServicios ? "servicios" :
                  banco === bancoMetodologias ? "metodologias" : (item.tema || "mix");
    }
    seleccion.push(item);
  }
  return seleccion;
}

function iniciarExamen(tipo) {
  tipoExamen = tipo;
  preguntasSeleccionadas = [];
  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = "";
  contenedor.classList.remove("oculto");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("menuExamen").classList.add("oculto");
  document.getElementById("controles").classList.remove("oculto");
  document.getElementById("btnFinalizar").classList.remove("oculto");
  document.getElementById("btnReintentar").classList.add("oculto");
  document.getElementById("btnVolverMenu").classList.remove("oculto");

  if (tipo === "servicios") {
    preguntasSeleccionadas = seleccionarAleatorioSinRepetir(
      bancoServicios.map(q => ({...q, tema: "servicios"})),
      20
    );
  } else if (tipo === "metodologias") {
    preguntasSeleccionadas = seleccionarAleatorioSinRepetir(
      bancoMetodologias.map(q => ({...q, tema: "metodologias"})),
      20
    );
  } else if (tipo === "completo") {
    // seleccionar 10 de cada banco para total 20 (si hay suficientes)
    const s = seleccionarAleatorioSinRepetir(bancoServicios.map(q => ({...q, tema: "servicios"})), 10);
    const m = seleccionarAleatorioSinRepetir(bancoMetodologias.map(q => ({...q, tema: "metodologias"})), 10);
    preguntasSeleccionadas = [...s, ...m];
    // mezclar el conjunto final
    preguntasSeleccionadas = preguntasSeleccionadas.sort(() => Math.random() - 0.5);
  } else if (tipo === "repaso") {
    // 'repaso' se maneja por revisarErroresGuardados, aquí no debería llamarse iniciarExamen
    console.warn("iniciarExamen: tipo 'repaso' no acepta selección automática.");
  }

  // renderizar preguntas seleccionadas
  preguntasSeleccionadas.forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "pregunta";
    div.style.marginBottom = "0.8rem";
    // si es examen completo, mostrar etiqueta
    const etiqueta = (tipo === "completo" || q.tema === "repaso") ? (q.tema === "servicios" ? "[Tipos]" : (q.tema === "metodologias" ? "[Metodologías]" : "[Repaso]")) : "";
    div.innerHTML = `<p>${idx + 1}. ${etiqueta} ${q.p}</p>`;
    q.r.forEach((op, j) => {
      const name = `p${idx}`;
      div.innerHTML += `<label style="display:block; margin:4px 0;"><input type="radio" name="${name}" value="${j}"> ${op}</label>`;
    });
    contenedor.appendChild(div);
  });

  // mostrar/ocultar botón repasar errores según existan errores guardados
  const errores = obtenerErroresGuardados();
  document.getElementById("btnRepasarPrevios").classList.toggle("oculto", !errores.length);

  // scroll al contenedor de preguntas
  setTimeout(() => {
    contenedor.scrollIntoView({ behavior: "smooth" });
  }, 80);
}

// --- Finalizar examen y manejo de resultados ---
function finalizarExamen() {
  const preguntas = document.querySelectorAll("#contenedorPreguntas .pregunta");
  let aciertos = 0;
  const incorrectas = [];

  preguntas.forEach((div, idx) => {
    const seleccion = div.querySelector("input[type='radio']:checked");
    const correctaIndex = preguntasSeleccionadas[idx].c;
    if (seleccion && parseInt(seleccion.value, 10) === correctaIndex) {
      aciertos++;
      div.style.background = "#eaf8ea";
    } else {
      div.style.background = "#fff2f0";
      // guardar info de la pregunta incorrecta para repaso
      incorrectas.push({
        pregunta: preguntasSeleccionadas[idx].p,
        opciones: preguntasSeleccionadas[idx].r,
        correctaIndex: preguntasSeleccionadas[idx].c,
        tema: preguntasSeleccionadas[idx].tema || tipoExamen
      });
    }
  });

  const total = preguntas.length;
  const porcentaje = total > 0 ? (aciertos / total) * 100 : 0;
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `
    <h3>Resultado</h3>
    <p>Correctas: <strong>${aciertos}/${total}</strong></p>
    <p>Incorrectas: <strong>${total - aciertos}</strong></p>
    <p>Porcentaje: <strong>${porcentaje.toFixed(0)}%</strong></p>
    <p>${porcentaje >= 80 ? "🎉 ¡Excelente! Buen dominio." : "💡 Repasa los temas y vuelve a intentarlo."}</p>
  `;

  // guardar errores en localStorage (si hay)
  if (incorrectas.length > 0) {
    guardarErrores(incorrectas);
    document.getElementById("btnRepasarPrevios").classList.remove("oculto");
  }

  // mostrar controles de reintento / volver
  document.getElementById("btnFinalizar").classList.add("oculto");
  document.getElementById("btnReintentar").classList.remove("oculto");
  document.getElementById("btnVolverMenu").classList.remove("oculto");
  resultado.scrollIntoView({ behavior: "smooth" });
}

function nuevoIntento() {
  // reinicia el mismo tipo de examen (si fue 'repaso', abrir repaso de nuevo)
  if (tipoExamen === "repaso") {
    revisarErroresGuardados();
  } else {
    iniciarExamen(tipoExamen);
  }
}

function reiniciarExamen() {
  // volver al menú principal del examen
  document.getElementById("menuExamen").classList.remove("oculto");
  document.getElementById("contenedorPreguntas").classList.add("oculto");
  document.getElementById("controles").classList.add("oculto");
  document.getElementById("btnFinalizar").classList.add("oculto");
  document.getElementById("btnReintentar").classList.add("oculto");
  document.getElementById("btnRepasarPrevios").classList.add("oculto");
  document.getElementById("btnVolverMenu").classList.add("oculto");
  document.getElementById("resultado").innerHTML = "";
  preguntasSeleccionadas = [];
  tipoExamen = "";
}

// --- Repaso inteligente: guardar/leer/repasar errores ---
function guardarErrores(nuevasIncorrectas) {
  const previo = obtenerErroresGuardados();
  const combinados = [...previo];
  nuevasIncorrectas.forEach(nq => {
    // evitar duplicados por texto de pregunta
    if (!combinados.some(e => e.pregunta === nq.pregunta)) {
      combinados.push(nq);
    }
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combinados));
  } catch (e) {
    console.warn("Error guardando en localStorage:", e);
  }
}

function obtenerErroresGuardados() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Error leyendo errores guardados:", e);
    return [];
  }
}

function revisarErroresGuardados() {
  const errores = obtenerErroresGuardados();
  if (!errores || errores.length === 0) {
    alert("No hay preguntas guardadas para repasar.");
    return;
  }

  // preparar repaso
  tipoExamen = "repaso";
  preguntasSeleccionadas = errores.map(e => ({
    p: e.pregunta,
    r: e.opciones,
    c: e.correctaIndex,
    tema: e.tema || "repaso"
  }));

  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = "";
  contenedor.classList.remove("oculto");
  document.getElementById("menuExamen").classList.add("oculto");
  document.getElementById("controles").classList.remove("oculto");
  document.getElementById("btnFinalizar").classList.remove("oculto");
  document.getElementById("btnReintentar").classList.add("oculto");
  document.getElementById("btnRepasarPrevios").classList.add("oculto");
  document.getElementById("btnVolverMenu").classList.remove("oculto");

  preguntasSeleccionadas.forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "pregunta";
    div.style.marginBottom = "0.8rem";
    div.innerHTML = `<p>${idx + 1}. [Repaso] ${q.p}</p>`;
    q.r.forEach((op, j) => {
      const name = `p${idx}`;
      div.innerHTML += `<label style="display:block; margin:4px 0;"><input type="radio" name="${name}" value="${j}"> ${op}</label>`;
    });
    contenedor.appendChild(div);
  });
}

// limpiar historial de errores (opcional)
function limpiarErroresGuardados() {
  if (confirm("¿Deseas eliminar todas las preguntas guardadas para repaso?")) {
    localStorage.removeItem(STORAGE_KEY);
    alert("Errores guardados eliminados.");
    // ocultar el botón si existe
    const btn = document.getElementById("btnRepasarPrevios");
    if (btn) btn.classList.add("oculto");
  }
}

// --- Inicialización ---
document.addEventListener("DOMContentLoaded", () => {
  // Si la sección 'examen' es visible al cargar, reiniciamos su vista
  // (normalmente mostrarSeccion('inicio') se usa al entrar)
});
