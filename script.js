// script.js - Examen versión 4 con 50 preguntas por tema y modo repaso inteligente

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if (id === "examen") reiniciarExamen();
}

/* -------------------------
   Bancos de preguntas (50 cada uno)
   Cada objeto: { p: "pregunta", r: ["op1","op2","op3"], c: indexCorrecta }
   -------------------------*/

// BANCO: Tipos de Servicios (50 preguntas)
const bancoServicios = [
  { p: "1. ¿Qué servicio se encarga principalmente de almacenar y exponer datos del negocio?", r: ["Servicio de Tarea", "Servicio de Entidad", "Servicio de Utilidad"], c: 1 },
  { p: "2. ¿Cuál servicio se usa para enviar correos o mensajería?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "3. ¿Qué servicio orquesta varios servicios para completar un proceso?", r: ["Servicio de Tarea", "Servicio de Entidad", "Servicio de Utilidad"], c: 0 },
  { p: "4. ¿Qué servicio suele implementar operaciones CRUD?", r: ["Entidad", "Utilidad", "Tarea"], c: 0 },
  { p: "5. ¿Cuál es más reutilizable entre los siguientes?", r: ["Servicio de Tarea", "Servicio de Entidad", "Servicio de Utilidad"], c: 2 },
  { p: "6. ¿Qué servicio es más probable que contenga lógica de negocio compleja para procesos completos?", r: ["Entidad", "Utilidad", "Tarea"], c: 2 },
  { p: "7. Un 'ServicioCliente' es un ejemplo de:", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "8. Un 'ServicioNotificaciones' suele ser:", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "9. ¿Qué servicio valida información y coordina llamadas a inventario, pago y notificación?", r: ["Utilidad", "Tarea", "Entidad"], c: 1 },
  { p: "10. ¿Cuál servicio se asocia con operaciones que no dependen del dominio del negocio?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "11. ¿Qué servicio sería responsable de exponer la información de un pedido (leer, actualizar)?", r: ["Servicio de Entidad", "Servicio de Utilidad", "Servicio de Tarea"], c: 0 },
  { p: "12. ¿Cuál servicio normalmente no gestiona almacenamiento directo de datos?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "13. ¿Qué tipo de servicio se diseñaría para enviar un SMS de confirmación?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "14. ¿Qué servicio es el más adecuado para encapsular reglas de negocio complejas de un proceso?", r: ["Tarea", "Entidad", "Utilidad"], c: 0 },
  { p: "15. ¿Cuál servicio debe ser lo más independiente y reutilizable posible?", r: ["Tarea", "Entidad", "Utilidad"], c: 2 },
  { p: "16. ¿Qué servicio es responsable de exponer APIs para CRUD sobre clientes?", r: ["Servicio de Tarea", "Servicio de Entidad", "Servicio de Utilidad"], c: 1 },
  { p: "17. ¿Cuál de estos no es un ejemplo típico de servicio de utilidad?", r: ["Envío de correo", "Gestión de clientes", "Autenticación"], c: 1 },
  { p: "18. ¿Qué servicio es el más indicado para coordinar un proceso de 'devolución de pedido'?", r: ["Entidad", "Utilidad", "Tarea"], c: 2 },
  { p: "19. ¿Qué servicio se debería versionar con cuidado porque otros dependen de su contrato de datos?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "20. ¿Qué servicio se piensa primero cuando se requiere 'buscar productos' en la plataforma?", r: ["Servicio de Entidad", "Servicio de Utilidad", "Servicio de Tarea"], c: 0 },
  { p: "21. ¿Qué servicio es el responsable de auditar acciones y registrar eventos (ej. logs)?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "22. ¿Qué servicio debería ser independiente de la lógica de presentación (UI)?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "23. ¿Qué servicio es el más apropiado para encapsular llamadas a un gateway de pagos?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "24. Si necesitas combinar información de cliente e inventario para completar una orden, ¿qué servicio coordina eso?", r: ["Entidad", "Tarea", "Utilidad"], c: 1 },
  { p: "25. ¿Qué servicio probablemente implementa validaciones técnicas (formato de correo, longitud de contraseña)?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "26. ¿Qué tipo de servicio tendría mayor probabilidad de cambiar si cambia la regla de negocio global?", r: ["Entidad", "Tarea", "Utilidad"], c: 1 },
  { p: "27. ¿Qué servicio suele definirse para exponer modelos de datos (por ejemplo: ClienteDTO)?", r: ["Entidad", "Utilidad", "Tarea"], c: 0 },
  { p: "28. ¿Qué servicio es ideal para reutilizar en múltiples procesos empresariales?", r: ["Tarea", "Entidad", "Utilidad"], c: 2 },
  { p: "29. ¿Qué servicio es más vertical (orientado a un proceso específico)?", r: ["Entidad", "Utilidad", "Tarea"], c: 2 },
  { p: "30. ¿Qué servicio usarías para centralizar la gestión de sesiones y tokens?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "31. Un servicio diseñado para exponer únicamente operaciones de lectura (consultas) sobre pedidos sería:", r: ["Servicio de Entidad", "Servicio de Utilidad", "Servicio de Tarea"], c: 0 },
  { p: "32. ¿Qué servicio es el punto natural para instrumentación y métricas técnicas?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "33. Si necesitas una función que convierta formatos (JSON→XML), ¿qué servicio crearías?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "34. ¿Qué servicio es menos probable que cambie cuando cambian procesos de negocio específicos?", r: ["Tarea", "Entidad", "Utilidad"], c: 2 },
  { p: "35. ¿Qué servicio se diseña pensando en transaccionalidad entre varios pasos de negocio?", r: ["Entidad", "Tarea", "Utilidad"], c: 1 },
  { p: "36. ¿Qué servicio sería responsable de exponer la lógica para calcular descuentos?", r: ["Entidad", "Tarea", "Utilidad"], c: 1 },
  { p: "37. ¿Qué servicio se recomienda documentar con contratos E/R porque es usado por muchos consumidores?", r: ["Entidad", "Utilidad", "Tarea"], c: 0 },
  { p: "38. ¿Qué servicio es más propenso a recibir SLAs (acuerdos de nivel de servicio) por parte de la organización?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "39. ¿Cuál servicio es el ideal para empaquetar funcionalidades transversales (logging, caching)?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "40. ¿Qué servicio debería exponer endpoints para crear y actualizar información de productos?", r: ["Servicio de Tarea", "Servicio de Entidad", "Servicio de Utilidad"], c: 1 },
  { p: "41. ¿Qué servicio necesitarías si quieres centralizar la validación de tarjetas de crédito?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "42. ¿Qué servicio es el más correcto para enviar notificaciones de marketing?", r: ["Entidad", "Tarea", "Utilidad"], c: 2 },
  { p: "43. ¿Qué servicio normalmente no gestiona la orquestación entre varios servicios?", r: ["Servicio de Tarea", "Servicio de Entidad", "Servicio de Utilidad"], c: 1 },
  { p: "44. ¿Qué servicio tiene la responsabilidad de mantener la integridad de los datos de negocio?", r: ["Entidad", "Utilidad", "Tarea"], c: 0 },
  { p: "45. ¿Qué servicio se ocupa de formatear y generar reportes (PDF) para usuarios?", r: ["Tarea", "Entidad", "Utilidad"], c: 2 },
  { p: "46. ¿Qué tipo de servicio es el más adecuado para normalizar datos entre distintos sistemas?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "47. ¿Qué servicio usarías para llevar el control de stock y cantidades disponibles?", r: ["Entidad", "Tarea", "Utilidad"], c: 0 },
  { p: "48. ¿Qué servicio suele exponer operaciones que no dependen de la UI ni del cliente específico?", r: ["Entidad", "Utilidad", "Tarea"], c: 1 },
  { p: "49. ¿Qué servicio sería el controlador principal de un flujo 'Compra Express'?", r: ["Entidad", "Tarea", "Utilidad"], c: 1 },
  { p: "50. ¿Cuál es la función principal de un servicio de entidad?", r: ["Coordinar procesos", "Administrar datos del negocio", "Proveer utilidades técnicas"], c: 1 }
];

// BANCO: Metodologías SOA (50 preguntas)
const bancoMetodologias = [
  { p: "1. ¿Qué metodología parte del análisis de procesos de negocio para diseñar servicios?", r: ["Bottom-Up", "Top-Down", "Agile"], c: 1 },
  { p: "2. ¿Qué metodología aprovecha sistemas existentes para exponer funciones como servicios?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "3. ¿Cuál enfoque busca combinar la visión del negocio con los sistemas actuales?", r: ["Meet-in-the-Middle", "Top-Down", "Bottom-Up"], c: 0 },
  { p: "4. ¿Qué metodología es propuesta y documentada por IBM (SOMA)?", r: ["Agile SOA", "SOMA", "Top-Down"], c: 1 },
  { p: "5. ¿Cuál metodología incorpora Sprints y entregas frecuentes?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 0 },
  { p: "6. ¿Qué ventaja se asocia a Top-Down?", r: ["Menor costo inicial", "Alineación TI-negocio", "Desarrollo más rápido"], c: 1 },
  { p: "7. ¿Qué desventaja se suele asociar a Bottom-Up?", r: ["Menor alineación con negocio", "Mayor análisis", "Entrega lenta"], c: 0 },
  { p: "8. ¿Qué metodología se usa frecuentemente cuando hay muchos sistemas legacy?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 1 },
  { p: "9. ¿Qué metodología es más formal y con fases definidas de identificación y especificación?", r: ["SOMA", "Agile SOA", "Meet-in-the-Middle"], c: 0 },
  { p: "10. ¿Qué enfoque permite iterar y adaptar servicios conforme se aprende del producto?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 2 },
  { p: "11. ¿Qué metodología equilibra la visión de negocio y la realidad técnica?", r: ["Meet-in-the-Middle", "SOMA", "Bottom-Up"], c: 0 },
  { p: "12. ¿Cuál es una desventaja típica de SOMA?", r: ["Es demasiado informal", "Es costosa y compleja", "No considera gobernanza"], c: 1 },
  { p: "13. ¿Qué metodología recomendarías para una startup que necesita avance rápido?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "14. ¿Qué metodología se enfoca en identificar servicios desde el negocio y definir contratos primero?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 0 },
  { p: "15. ¿Qué metodología prioriza aprovechar componentes ya escritos en sistemas actuales?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "16. ¿Cuál enfoque requiere mayor coordinación entre equipos técnicos y de negocio?", r: ["Bottom-Up", "Meet-in-the-Middle", "SOMA"], c: 1 },
  { p: "17. ¿Cuál metodología incluye fases de Identificación, Especificación y Realización?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 1 },
  { p: "18. ¿Qué enfoque es más rápido para obtener resultados pero puede sacrificar estandarización?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "19. ¿Qué ventaja trae Meet-in-the-Middle?", r: ["Total formalidad", "Equilibrio entre negocio y técnica", "Menor necesidad de coordinación"], c: 1 },
  { p: "20. ¿Qué metodología es mejor cuando se necesita gobernanza estricta y control?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 1 },
  { p: "21. ¿Qué método permite la reutilización inmediata de funciones existentes?", r: ["Top-Down", "Bottom-Up", "Meet-in-the-Middle"], c: 1 },
  { p: "22. ¿Qué técnica ayuda a reducir riesgo técnico en la transición a SOA?", r: ["Solo Top-Down", "Bottom-Up y Meet-in-the-Middle", "Solo Agile SOA"], c: 1 },
  { p: "23. ¿Qué metodología favorece documentación y modelado riguroso?", r: ["SOMA", "Agile SOA", "Bottom-Up"], c: 0 },
  { p: "24. ¿Cuál es una desventaja de aplicar solo Agile SOA sin planificación general?", r: ["Fuerte gobernanza", "Poca visión global", "Alto costo inicial"], c: 1 },
  { p: "25. ¿Qué metodología es más recomendable cuando la organización quiere alinear por completo TI con procesos estratégicos?", r: ["Bottom-Up", "Top-Down", "Agile SOA"], c: 1 },
  { p: "26. ¿Cuál enfoque facilita la modernización sin grandes reescrituras inmediatas?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "27. ¿Qué enfoque suele necesitar más tiempo para planificar pero dota de mayor uniformidad?", r: ["Bottom-Up", "Top-Down", "Agile SOA"], c: 1 },
  { p: "28. ¿Qué metodología combina iteración rápida con orientación a servicios reutilizables?", r: ["SOMA", "Agile SOA", "Bottom-Up"], c: 1 },
  { p: "29. ¿Qué ventaja ofrece aplicar Meet-in-the-Middle en grandes organizaciones?", r: ["Ignorar sistemas heredados", "Integrar visión y realidad técnica", "Eliminar gobernanza"], c: 1 },
  { p: "30. ¿Qué metodología es más adecuada en proyectos donde la arquitectura debe ser robusta y regulada (ej. gobierno)?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 1 },
  { p: "31. ¿Qué enfoque es más probable que defina primero los contratos (APIs) antes de implementar servicios?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 0 },
  { p: "32. ¿Qué metodología parte de hacer pequeñas entregas y aprender del feedback?", r: ["Top-Down", "Meet-in-the-Middle", "Agile SOA"], c: 2 },
  { p: "33. ¿Cuál puede ser un indicador de que se está aplicando Bottom-Up?", r: ["Se diseñan servicios desde procesos", "Se exponen APIs de sistemas legacy", "Se usan sprints cortos"], c: 1 },
  { p: "34. ¿Qué metodología es la más estructurada y con mayor foco en modelado?", r: ["SOMA", "Agile SOA", "Bottom-Up"], c: 0 },
  { p: "35. ¿Qué enfoque requiere mayor participación de analistas de negocio al inicio?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 0 },
  { p: "36. ¿Qué metodología facilita crear servicios que sean consumidos por varias áreas sin redesarrollar?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 0 },
  { p: "37. ¿Qué desventaja tiene Top-Down en entornos con sistemas legacy muy rígidos?", r: ["Facilita reutilización", "Puede ser costoso y lento", "Es demasiado ágil"], c: 1 },
  { p: "38. ¿Qué combina la identificación de servicios con la reutilización de componentes existentes?", r: ["Solo Top-Down", "Meet-in-the-Middle", "Solo Bottom-Up"], c: 1 },
  { p: "39. ¿Cuál metodología exige mayor gobernanza para controlar versiones y contratos?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 1 },
  { p: "40. ¿Cuál metodología puede provocar duplicidad de servicios si no hay coordinación?", r: ["Top-Down", "Bottom-Up", "SOMA"], c: 1 },
  { p: "41. ¿En qué metodología la entrega continua y la retroalimentación del usuario son claves?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "42. ¿Qué enfoque es más recomendable cuando la organización no tiene una arquitectura definida y necesita orden?", r: ["Agile SOA", "Top-Down", "Bottom-Up"], c: 1 },
  { p: "43. ¿Qué metodología prioriza la identificación de servicios reutilizables antes de la implementación?", r: ["Bottom-Up", "Top-Down", "Agile SOA"], c: 1 },
  { p: "44. ¿Qué enfoque exige más recursos iniciales (análisis, modelado) para un diseño integral?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 0 },
  { p: "45. ¿Qué ventaja ofrece Agile SOA en entornos cloud?", r: ["Menos entregas", "Mayor velocidad y adaptabilidad", "Más burocracia"], c: 1 },
  { p: "46. ¿Qué metodología es más adecuada cuando existe una gran deuda técnica y se quiere avanzar rápido?", r: ["Top-Down", "Bottom-Up", "Agile SOA"], c: 2 },
  { p: "47. ¿Cuál enfoque es más difícil de coordinar si hay muchos equipos autónomos?", r: ["Meet-in-the-Middle", "Top-Down", "Bottom-Up"], c: 0 },
  { p: "48. ¿Qué metodología recomienda definir fases claras de identificación y especificación de servicios?", r: ["Agile SOA", "SOMA", "Bottom-Up"], c: 1 },
  { p: "49. ¿Qué metodología puede necesitar una gobernanza menos rígida para no frenar la velocidad?", r: ["SOMA", "Agile SOA", "Top-Down"], c: 1 },
  { p: "50. Si quieres una mezcla práctica: identificar procesos importantes y aprovechar sistemas existentes, ¿qué metodología eliges?", r: ["Bottom-Up", "Top-Down", "Meet-in-the-Middle"], c: 2 }
];

/* -------------------------
   Variables globales y utilidades
   -------------------------*/
let tipoExamen = "";
let preguntasSeleccionadas = []; // array de objetos {q:..., r:[...], c:..., tema: 'servicios'|'metodologias'}
const STORAGE_KEY = "soa_failed_questions_v4"; // key para errores guardados

/* -------------------------
   Funciones de examen
   -------------------------*/

function iniciarExamen(tipo) {
  tipoExamen = tipo;
  const contenedor = document.getElementById("contenedorPreguntas");
  contenedor.innerHTML = "";
  contenedor.classList.remove("oculto");
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("menuExamen").classList.add("oculto");

  // mostrar controles
  document.getElementById("controles").classList.remove("oculto");
  document.getElementById("btnFinalizar").classList.remove("oculto");
  document.getElementById("btnReintentar").classList.add("oculto");
  document.getElementById("btnRepasarPrevios").classList.add("oculto");
  document.getElementById("btnVolverMenu").classList.remove("oculto");

  // Determinar banco
  let banco = [];
  if (tipo === "servicios") {
    banco = bancoServicios.map(q => ({...q, tema: "servicios"}));
  } else if (tipo === "metodologias") {
    banco = bancoMetodologias.map(q => ({...q, tema: "metodologias"}));
  } else if (tipo === "completo") {
    // mezclar 25 y 25 de cada banco si hay suficientes, o mezclar todo
    banco = [
      ...bancoServicios.map(q => ({...q, tema: "servicios"})),
      ...bancoMetodologias.map(q => ({...q, tema: "metodologias"}))
    ];
  }

  // seleccionar aleatoriamente 50 preguntas (o todas si el banco es exactamente 50)
  preguntasSeleccionadas = seleccionarAleatorioSinRepetir(banco, 50);

  // renderizar preguntas
  preguntasSeleccionadas.forEach((q, idx) => {
    const div = document.createElement("div");
    div.classList.add("pregunta");
    div.style.marginBottom = "0.8rem";
    // mostrar etiqueta de tema cuando examen es 'completo'
    let cabecera = `${idx + 1}. ${q.p}`;
    if (tipo === "completo") {
      const etiqueta = q.tema === "servicios" ? "[Tipos]" : "[Metodologías]";
      cabecera = `${idx + 1}. ${etiqueta} ${q.p}`;
    }
    div.innerHTML = `<p>${cabecera}</p>`;
    q.r.forEach((op, j) => {
      // name debe ser único por pregunta
      div.innerHTML += `<label style="display:block; margin:4px 0;"><input type="radio" name="p${idx}" value="${j}"> ${op}</label>`;
    });
    contenedor.appendChild(div);
  });

  // mostrar si hay errores previos guardados (para permitir acceso directo)
  const erroresGuardados = obtenerErroresGuardados();
  if (erroresGuardados && erroresGuardados.length > 0) {
    document.getElementById("btnRepasarPrevios").classList.remove("oculto");
  } else {
    document.getElementById("btnRepasarPrevios").classList.add("oculto");
  }

  // desplazar la vista al contenedor de preguntas
  setTimeout(() => {
    contenedor.scrollIntoView({ behavior: "smooth" });
  }, 150);
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
      // marcar visualmente correcto (opcional: no obligatorio)
      div.style.background = "#eef9ee";
    } else {
      // incorrecta o sin respuesta
      incorrectas.push({
        pregunta: preguntasSeleccionadas[idx].p,
        opciones: preguntasSeleccionadas[idx].r,
        correctaIndex: preguntasSeleccionadas[idx].c,
        tema: preguntasSeleccionadas[idx].tema || tipoExamen
      });
      div.style.background = "#fff6f6";
    }
  });

  // calcular resumen
  const total = preguntas.length;
  const porcentaje = (aciertos / total) * 100;
  const resultado = document.getElementById("resultado");
  resultado.innerHTML = `
    <h3>Resultado</h3>
    <p>Correctas: <strong>${aciertos}/${total}</strong></p>
    <p>Incorrectas: <strong>${total - aciertos}</strong></p>
    <p>Porcentaje: <strong>${porcentaje.toFixed(0)}%</strong></p>
    <p>${porcentaje >= 80 ? "🎉 ¡Excelente! Dominio del tema." : "💡 Sigue repasando. Enfócate en las preguntas falladas."}</p>
  `;

  // guardar preguntas incorrectas en localStorage (repaso inteligente)
  if (incorrectas.length > 0) {
    guardarErrores(incorrectas);
    document.getElementById("btnRepasarPrevios").classList.remove("oculto");
  }

  // mostrar botones
  document.getElementById("btnFinalizar").classList.add("oculto");
  document.getElementById("btnReintentar").classList.remove("oculto");
  document.getElementById("btnVolverMenu").classList.remove("oculto");
  // desplazar a resultado
  resultado.scrollIntoView({ behavior: "smooth" });
}

function nuevoIntento() {
  // reinicia el mismo tipo de examen
  iniciarExamen(tipoExamen);
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

/* -------------------------
   Repaso inteligente (errores guardados)
   -------------------------*/

function guardarErrores(nuevasIncorrectas) {
  // Recuperar errores previos
  const prev = obtenerErroresGuardados() || [];
  // Evitar duplicados por texto de pregunta (simple)
  const combinados = [...prev];
  nuevasIncorrectas.forEach(nq => {
    const existe = combinados.some(e => e.pregunta === nq.pregunta);
    if (!existe) combinados.push(nq);
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combinados));
  } catch (e) {
    console.warn("No se pudo guardar errores en localStorage:", e);
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

  // Preparar el entorno de examen para repasar solo las preguntas falladas
  tipoExamen = "repaso";
  preguntasSeleccionadas = errores.map(e => ({
    p: e.pregunta,
    r: e.opciones,
    c: e.correctaIndex,
    tema: e.tema || "repaso"
  }));

  // renderizar
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
    div.classList.add("pregunta");
    div.style.marginBottom = "0.8rem";
    div.innerHTML = `<p>${idx + 1}. [Repaso] ${q.p}</p>`;
    q.r.forEach((op, j) => {
      div.innerHTML += `<label style="display:block; margin:4px 0;"><input type="radio" name="p${idx}" value="${j}"> ${op}</label>`;
    });
    contenedor.appendChild(div);
  });

  document.getElementById("btnRepasarPrevios").classList.add("oculto");
}

/* -------------------------
   Extra: limpiar errores guardados (opcional)
   -------------------------*/
function limpiarErroresGuardados() {
  if (confirm("¿Deseas eliminar todas las preguntas guardadas para repaso?")) {
    localStorage.removeItem(STORAGE_KEY);
    alert("Errores guardados eliminados.");
    // ocultar botón si estamos en examen
    const btn = document.getElementById("btnRepasarPrevios");
    if (btn) btn.classList.add("oculto");
  }
}

/* -------------------------
   Inicialización: cuando el usuario carga la página
   -------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // nada especial en carga; menú de examen se muestra al abrir sección
});
