// script.js – Examen versión 5 (10 preguntas por tema, modo repaso inteligente)

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if (id === "examen") reiniciarExamen();
}

/* -------------------------
   Bancos de preguntas (10 cada uno)
-------------------------*/

// 🔹 Tipos de Servicios
const bancoServicios = [
  { p: "1. ¿Qué servicio administra los datos principales del negocio, como clientes o productos?", r: ["Servicio de Entidad", "Servicio de Tarea", "Servicio de Utilidad"], c: 0 },
  { p: "2. ¿Cuál servicio se encarga de coordinar varios servicios para ejecutar un proceso completo?", r: ["Servicio de Entidad", "Servicio de Tarea", "Servicio de Utilidad"], c: 1 },
  { p: "3. ¿Cuál servicio se usa para enviar correos electrónicos o notificaciones?", r: ["Servicio de Entidad", "Servicio de Tarea", "Servicio de Utilidad"], c: 2 },
  { p: "4. Un servicio que realiza operaciones CRUD pertenece al tipo:", r: ["Tarea", "Entidad", "Utilidad"], c: 1 },
  { p: "5. ¿Qué servicio orquesta otros servicios para cumplir una acción empresarial como procesar una compra?", r: ["Entidad", "Tarea", "Utilidad"], c: 1 },
  { p: "6. ¿Cuál de estos servicios ofrece funciones comunes como validación o encriptación?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "7. ¿Qué servicio almacena y expone la información estructurada de los datos de negocio?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "8. Un 'ServicioCliente' es un ejemplo de:", r: ["Servicio de Entidad", "Servicio de Tarea", "Servicio de Utilidad"], c: 0 },
  { p: "9. Un 'ServicioSeguridad' que maneja autenticación corresponde a:", r: ["Servicio de Entidad", "Servicio de Tarea", "Servicio de Utilidad"], c: 2 },
  { p: "10. ¿Qué servicio es menos reutilizable porque se diseña para un proceso específico?", r: ["Entidad", "Tarea", "Utilidad"], c: 1 }
];

// 🔹 Metodologías SOA
const bancoMetodologias = [
  { p: "1. ¿Qué metodología parte del análisis del negocio para definir los servicios?", r: ["Bottom-Up", "Top-Down", "Agile SOA"], c: 1 },
  { p: "2. ¿Cuál enfoque parte de los sistemas existentes para exponerlos como servicios?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "3. ¿Qué metodología combina la visión del negocio con la técnica?", r: ["Meet-in-the-Middle", "Top-Down", "Agile SOA"], c: 0 },
  { p: "4. ¿Qué metodología fue propuesta por IBM y tiene fases de Identificación, Especificación y Realización?", r: ["SOMA", "Bottom-Up", "Agile SOA"], c: 0 },
  { p: "5. ¿Qué metodología aplica principios ágiles al desarrollo de servicios?", r: ["Top-Down", "Agile SOA", "Meet-in-the-Middle"], c: 1 },
  { p: "6. ¿Cuál es la principal ventaja de Top-Down?", r: ["Menor costo", "Alineación entre negocio y TI", "Mayor rapidez inicial"], c: 1 },
  { p: "7. ¿Qué metodología se recomienda para modernizar sistemas heredados (legacy)?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "8. ¿Cuál es la metodología más formal y estructurada?", r: ["SOMA", "Agile SOA", "Meet-in-the-Middle"], c: 0 },
  { p: "9. ¿Qué metodología busca entregas rápidas mediante iteraciones cortas?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "10. ¿Cuál metodología ofrece un equilibrio entre estrategia de negocio y realidad técnica?", r: ["Bottom-Up", "Meet-in-the-Middle", "SOMA"], c: 1 }
];

/* -------------------------
   Variables globales
-------------------------*/
let tipoExamen = "";
let preguntasSeleccionadas = [];
const STORAGE_KEY = "soa_failed_questions_v5";

/* -------------------------
   Funciones principales
-------------------------*/
function iniciarExamen(tipo) {
  tipoExamen = tipo;
  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = "";
  contenedor.classList.remove("oculto");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("menuExamen").classList.add("oculto");
  document.getElementById("controles").classList.remove("oculto");

  let banco = [];
  if (tipo === "servicios") banco = bancoServicios.map(q => ({ ...q, tema: "servicios" }));
  else if (tipo === "metodologias") banco = bancoMetodologias.map(q => ({ ...q, tema: "metodologias" }));
  else if (tipo === "completo") {
    const mezclado = [...bancoServicios, ...bancoMetodologias];
    banco = seleccionarAleatorioSinRepetir(mezclado, 10);
  }

  preguntasSeleccionadas = banco;

  preguntasSeleccionadas.forEach((q, idx) => {
    const div = document.createElement("div");
    div.classList.add("pregunta");
    const etiqueta = tipo === "completo" ? (q.tema === "servicios" ? "[Tipos]" : "[Metodologías]") : "";
    div.innerHTML = `<p>${idx + 1}. ${etiqueta} ${q.p}</p>`;
    q.r.forEach((op, j) => {
      div.innerHTML += `<label style="display:block;margin:4px 0;"><input type="radio" name="p${idx}" value="${j}"> ${op}</label>`;
    });
    contenedor.appendChild(div);
  });

  const erroresGuardados = obtenerErroresGuardados();
  document.getElementById("btnRepasarPrevios").classList.toggle("oculto", !erroresGuardados.length);
}

function seleccionarAleatorioSinRepetir(banco, cantidad) {
  const copia = [...banco];
  const seleccion = [];
  while (seleccion.length < Math.min(cantidad, copia.length)) {
    const i = Math.floor(Math.random() * copia.length);
    seleccion.push(copia.splice(i, 1)[0]);
  }
  return seleccion;
}

function finalizarExamen() {
  const preguntas = document.querySelectorAll("#contenedorPreguntas .pregunta");
  let aciertos = 0;
  const incorrectas = [];

  preguntas.forEach((div, idx) => {
    const seleccionada = div.querySelector("input[type='radio']:checked");
    const correcta = preguntasSeleccionadas[idx].c;
    if (seleccionada && parseInt(seleccionada.value, 10) === correcta) {
      aciertos++;
      div.style.background = "#e9f9e9";
    } else {
      div.style.background = "#fdeaea";
      incorrectas.push({
        pregunta: preguntasSeleccionadas[idx].p,
        opciones: preguntasSeleccionadas[idx].r,
        correctaIndex: preguntasSeleccionadas[idx].c,
        tema: preguntasSeleccionadas[idx].tema
      });
    }
  });

  const total = preguntas.length;
  const porcentaje = (aciertos / total) * 100;
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `
    <h3>Resultado</h3>
    <p>✅ Correctas: <strong>${aciertos}/${total}</strong></p>
    <p>❌ Incorrectas: <strong>${total - aciertos}</strong></p>
    <p>📊 Porcentaje: <strong>${porcentaje.toFixed(0)}%</strong></p>
    <p>${porcentaje >= 80 ? "🎉 ¡Excelente dominio del tema!" : "💡 Repasa los conceptos antes de volver a intentar."}</p>
  `;

  if (incorrectas.length > 0) guardarErrores(incorrectas);
  document.getElementById("btnFinalizar").classList.add("oculto");
  document.getElementById("btnReintentar").classList.remove("oculto");
  document.getElementById("btnRepasarPrevios").classList.remove("oculto");
}

function nuevoIntento() {
  iniciarExamen(tipoExamen);
}

function reiniciarExamen() {
  document.getElementById("menuExamen").classList.remove("oculto");
  document.getElementById("contenedorPreguntas").classList.add("oculto");
  document.getElementById("controles").classList.add("oculto");
  document.getElementById("resultado").innerHTML = "";
}

/* -------------------------
   Repaso inteligente
-------------------------*/
function guardarErrores(nuevas) {
  const prev = obtenerErroresGuardados();
  const combinadas = [...prev];
  nuevas.forEach(n => {
    if (!combinadas.some(e => e.pregunta === n.pregunta)) combinadas.push(n);
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(combinadas));
}

function obtenerErroresGuardados() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function revisarErroresGuardados() {
  const errores = obtenerErroresGuardados();
  if (!errores.length) return alert("No hay preguntas guardadas para repasar.");

  tipoExamen = "repaso";
  preguntasSeleccionadas = errores;

  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = "";
  document.getElementById("menuExamen").classList.add("oculto");
  document.getElementById("controles").classList.remove("oculto");

  errores.forEach((q, idx) => {
    const div = document.createElement("div");
    div.classList.add("pregunta");
    div.innerHTML = `<p>${idx + 1}. [Repaso] ${q.pregunta}</p>`;
    q.opciones.forEach((op, j) => {
      div.innerHTML += `<label style="display:block;margin:4px 0;"><input type="radio" name="p${idx}" value="${j}"> ${op}</label>`;
    });
    contenedor.appendChild(div);
  });
}
