function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if (id === "examen") reiniciarExamen();
}

let tipoExamen = "";
let preguntasSeleccionadas = [];

const bancoServicios = [
  { p: "¿Qué es un servicio de tarea?", r: ["Gestiona datos del negocio", "Orquesta varios servicios para ejecutar un proceso", "Proporciona funciones técnicas comunes"], c: 1 },
  { p: "¿Cuál de los siguientes es un ejemplo de servicio de entidad?", r: ["ServicioNotificaciones", "ServicioCliente", "ServicioCheckout"], c: 1 },
  { p: "¿Qué tipo de servicio realiza operaciones CRUD?", r: ["Utilidad", "Tarea", "Entidad"], c: 2 },
  { p: "¿Qué servicio tiene la mayor reutilización?", r: ["Tarea", "Entidad", "Utilidad"], c: 2 },
  { p: "¿Qué servicio envía un correo de confirmación?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "¿Qué caracteriza a un servicio de tarea?", r: ["Alta reutilización", "Orquesta varios servicios", "Funciones técnicas simples"], c: 1 },
  { p: "¿Qué servicio maneja datos del cliente?", r: ["Entidad", "Utilidad", "Tarea"], c: 0 },
  { p: "¿Qué servicio ejecuta un flujo completo como 'procesar pedido'?", r: ["Tarea", "Entidad", "Utilidad"], c: 0 },
  { p: "¿Qué servicio valida usuarios o envía SMS?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "¿Qué servicio representa la información del negocio?", r: ["Entidad", "Utilidad", "Tarea"], c: 0 }
];

const bancoMetodologias = [
  { p: "¿Qué metodología parte del negocio hacia la tecnología?", r: ["Bottom-Up", "Top-Down", "Agile SOA"], c: 1 },
  { p: "¿Cuál metodología comienza con sistemas existentes?", r: ["Top-Down", "Bottom-Up", "Meet-in-the-Middle"], c: 1 },
  { p: "¿Qué metodología combina Top-Down y Bottom-Up?", r: ["Meet-in-the-Middle", "SOMA", "Agile SOA"], c: 0 },
  { p: "¿Qué metodología fue desarrollada por IBM?", r: ["Agile SOA", "SOMA", "Top-Down"], c: 1 },
  { p: "¿Qué metodología integra Scrum?", r: ["Agile SOA", "Top-Down", "Meet-in-the-Middle"], c: 0 },
  { p: "¿Qué ventaja tiene Top-Down?", r: ["Aprovecha sistemas existentes", "Alinea TI con el negocio", "Es la más rápida"], c: 1 },
  { p: "¿Qué desventaja tiene Bottom-Up?", r: ["Requiere mucho análisis", "Menor alineación con negocio", "Es costosa"], c: 1 },
  { p: "¿Qué ventaja tiene Meet-in-the-Middle?", r: ["Equilibra negocio y técnica", "Muy formal", "Barata"], c: 0 },
  { p: "¿Qué ventaja tiene Agile SOA?", r: ["Mayor velocidad y flexibilidad", "Mayor formalidad", "Curva de aprendizaje alta"], c: 0 },
  { p: "¿Qué fase pertenece a SOMA?", r: ["Identificación de servicios", "Sprints ágiles", "Integración de APIs"], c: 0 }
];

function iniciarExamen(tipo) {
  tipoExamen = tipo;
  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = "";
  contenedor.classList.remove("oculto");
  document.getElementById("btnFinalizar").classList.remove("oculto");
  document.getElementById("menuExamen").classList.add("oculto");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("btnReintentar").classList.add("oculto");

  let banco = [];
  if (tipo === "servicios") banco = bancoServicios;
  else if (tipo === "metodologias") banco = bancoMetodologias;
  else banco = [...bancoServicios.slice(0, 5), ...bancoMetodologias.slice(0, 5)];

  preguntasSeleccionadas = [];
  while (preguntasSeleccionadas.length < 5) {
    const i = Math.floor(Math.random() * banco.length);
    if (!preguntasSeleccionadas.includes(banco[i])) preguntasSeleccionadas.push(banco[i]);
  }

  preguntasSeleccionadas.forEach((q, idx) => {
    const div = document.createElement("div");
    div.classList.add("pregunta");
    div.innerHTML = `<p>${idx + 1}. ${q.p}</p>`;
    q.r.forEach((op, j) => {
      div.innerHTML += `<label><input type="radio" name="p${idx}" value="${j}"> ${op}</label>`;
    });
    contenedor.appendChild(div);
  });
}

function finalizarExamen() {
  let aciertos = 0;
  const preguntas = document.querySelectorAll("#contenedorPreguntas .pregunta");
  preguntas.forEach((div, idx) => {
    const seleccionada = div.querySelector("input[type='radio']:checked");
    if (seleccionada && parseInt(seleccionada.value) === preguntasSeleccionadas[idx].c) {
      aciertos++;
    }
  });

  const porcentaje = (aciertos / preguntas.length) * 100;
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `
    <h3>Resultado:</h3>
    <p>Obtuviste <strong>${aciertos}/${preguntas.length}</strong> (${porcentaje.toFixed(0)}%)</p>
    ${porcentaje >= 80 ? "🎉 ¡Excelente!" : "💡 Repasa el tema y vuelve a intentarlo."}
  `;

  document.getElementById("btnReintentar").classList.remove("oculto");
}

function nuevoIntento() {
  iniciarExamen(tipoExamen);
}

function reiniciarExamen() {
  document.getElementById("menuExamen").classList.remove("oculto");
  document.getElementById("contenedorPreguntas").classList.add("oculto");
  document.getElementById("btnFinalizar").classList.add("oculto");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("btnReintentar").classList.add("oculto");
}
