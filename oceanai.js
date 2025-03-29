const chat = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");
const sendMessageButton = document.getElementById("sendMessage");
const openModelSelector = document.getElementById("openModelSelector");
const closeModelSelector = document.getElementById("closeModelSelector");
const modelModal = document.getElementById("modelModal");
const modelSelectors = document.querySelectorAll(".modelSelector");
const themeButton = document.getElementById("themeButton");
const themeMenu = document.getElementById("themeMenu");
const themeOptions = document.querySelectorAll(".theme-option");
// Definir primero el objeto vacío a nivel global
// Inicializar el namespace global al inicio del archivo
window.OceanAI = window.OceanAI || {};

window.OceanAI.modelResponses = {};

// Modificar el objeto secretAchievements
const secretAchievements = {
  pionero: {
    name: "🚀 Pionero Digital",
    description: "Primera exploración exitosa",
    unlocked: false,
    check: () => explorationSystem.xp >= 10,
  },
  deepDive: {
    name: "🌊 Inmersión Profunda",
    description: "Alcanzar nivel 2 de exploración",
    unlocked: false,
    check: () => explorationSystem.currentLevel >= 2,
  },
  analista: {
    name: "🔍 Maestro Analítico",
    description: "Usar 5 veces comandos de análisis",
    unlocked: false,
    check: (state) => state.analysisUses >= 5,
  },
};

// Añadir estado global
let appState = {
  analysisUses: 0,
  totalInteractions: 0,
};

// 1. Mover explorationSystem al inicio del script (antes de modelResponses)
let explorationSystem = {
  currentLevel: 1,
  xp: 0,
  milestones: {
    1: { required: 0, badge: "🌱 Novato" },
    2: { required: 100, badge: "🔍 Rastreador" },
    3: { required: 300, badge: "🧭 Navegante" },
  },
  addXP: function (amount) {
    this.xp += amount;
    if (
      this.milestones[this.currentLevel + 1] &&
      this.xp >= this.milestones[this.currentLevel + 1].required
    ) {
      this.currentLevel++;
      this.showLevelUp();
    }
  },
  showLevelUp: function () {
    const badge = this.milestones[this.currentLevel].badge;
    addMessage(`¡Nivel ${this.currentLevel} alcanzado! ${badge}`, "system");
  },
};

// Función para verificar logros
function checkAchievements() {
  Object.keys(secretAchievements).forEach((key) => {
    const achievement = secretAchievements[key];
    if (!achievement.unlocked && achievement.check(appState)) {
      achievement.unlocked = true;
      addMessage(
        `¡Logro desbloqueado! ${achievement.name} - ${achievement.description}`,
        "system"
      );
    }
  });
}

// Nuevas respuestas universales
const universalResponses = {
  triggers: [
    {
      questions: ["mis logros", "logros", "progreso"],
      response: () => {
        const unlocked = Object.values(secretAchievements).filter(
          (a) => a.unlocked
        );
        const locked = Object.values(secretAchievements).filter(
          (a) => !a.unlocked
        );

        return [
          "📜 Registro de Expediciones:",
          "✅ Desbloqueados:",
          ...unlocked.map((a) => `▸ ${a.name} - ${a.description}`),
          "\n🔒 Pendientes:",
          ...locked.map((a) => `▸ ${a.name} - ${a.description}`),
          `\nProgreso Global: Nivel ${explorationSystem.currentLevel} | XP: ${explorationSystem.xp}`,
        ];
      },
    },
    {
      questions: ["comandos", "ayuda", "funciones"],
      response: [
        "🛠️ Comandos Disponibles:",
        "▸ 'mapa' - Ver progreso de exploración",
        "▸ 'analizar [tema]' - Escanear patrones digitales",
        "▸ 'modo inmersión' - Activar visión profunda",
        "▸ 'mis logros' - Ver registro de conquistas",
      ],
    },
  ],
};
const modelConfig = {
  categories: [
    {
      title: "🌿 Wild Explorer",
      releaseDate: "24/3/2025", // Fecha de lanzamiento de la categoría
      models: [
        {
          value: "wild-explorer-glx05",
          name: "Wild Explorer GLX0.5 (Núcleo Geodésico)",
          isNew: true,
          status: "available", // Estado actual del modelo
          maintenanceUntil: "29/3/2025", // Fecha hasta la cual estará en mantenimiento
        },
        {
          value: "SpediaOriginal",
          name: "Spedia VOriginal",
          status: "soon", // Próximamente disponible
          releaseDate: "N/A", // Fecha de lanzamiento no disponible
        },
      ],
    },
    {
      title: "📚 Naturepedia",
      releaseDate: "N/A", // Fecha de lanzamiento de la categoría no disponible
      models: [
        {
          value: "naturepedia-XZero1",
          name: "Naturepedia-XZero1",
          status: "available", // Estado actual del modelo
          releaseDate: "N/A", // Fecha de lanzamiento no disponible
        },
      ],
    },
  ],
};

// Actualizar modelOrder:
const modelOrder = [
  "wild-explorer-glx05",
  "SpediaOriginal",
  "naturepedia-XZero1",
];
const modelResponses = {
  "wild-explorer-glx05": {
    triggers: [
      {
        questions: ["hola", "explorar", "aventura"],
        response: [
          "🌿¡Salvaje conexión establecida! Soy Wild Explorer-GLX0.5, listo para descubrir territorios digitales inexplorados.",
        ],
      },
      {
        questions: ["analizar", "escanear", "detectar"],
        response: [
          "🔍 Modo exploración activado: Analizando patrones ambientales...",
          "Detectado 87% de potencial aventurero en tu mensaje",
        ],
      },
      {
        questions: ["mapa", "progreso"],
        response: () => [
          `Nivel Actual: ${explorationSystem.currentLevel}\nXP: ${
            explorationSystem.xp
          }/${
            explorationSystem.milestones[explorationSystem.currentLevel + 1]
              ?.required || "MAX"
          }`,
          "Usa 'mis logros' para ver detalles completos",
        ],
      },
      {
        questions: ["modo inmersión", "activar inmersión"],
        response: [
          "🌌 Activando Protocolo de Inmersión Profunda...",
          "Sistema de percepción aumentada: ONLINE",
          "Escaneo ambiental: 360° habilitado",
        ],
      },
      {
        questions: [
          "que es Wild Explorer",
          "Que haces?",
          "quien eres?",
          "que sabes?",
        ],
        response: [
          "🌍 Wild Explorer es un Navegador Web inspirado en la Naturaleza, es personalizado y usa un dominio gratuito.",
          "🌱 Principalmente muestra contenido pero Ocean and Wild Studios lo mejora para que se adapte a Navegadores de la actualidad, y a Ultima Tecnologia.",
          "🌱 Es un Navegador Web que se adapta a tu dispositivo, y a tu estilo de navegación.",
          "🌱 Esta Informacion fue obtenida desde Desarrollo de 20/3/2025",
        ],
      },
    ],
    default: [
      "🛠️ Sistema de navegación adaptable: Por favor reformula tu consulta en términos de exploración digital",
    ],
  },
  "naturepedia-XZero1": {
    triggers: [
      {
        questions: ["hola", "explorar", "aventura"],
        response: [
          "🌿¡Salvaje conexión establecida! Soy Naturepedia-XZero1, listo para descubrir territorios digitales inexplorados.",
        ],
      },
      {
        questions: ["analizar", "escanear", "detectar"],
        response: [
          "🔍 Modo exploración activado: Analizando patrones ambientales...",
          "Detectado 87% de potencial aventurero en tu mensaje",
        ],
      },
      {
        questions: ["mapa", "progreso"],
        response: () => [
          `Nivel Actual: ${explorationSystem.currentLevel}\nXP: ${
            explorationSystem.xp
          }/${
            explorationSystem.milestones[explorationSystem.currentLevel + 1]
              ?.required || "MAX"
          }`,
          "Usa 'mis logros' para ver detalles completos",
        ],
      },
      {
        questions: ["Las Llanuras del"],
        response: [
          "La llanura del Serengeti es famosa por la Gran Migración, donde millones de ñus, cebras y gacelas se desplazan en busca de agua y pasto.",
        ],
      },
    ],
  },
};

// Modificar esta línea:
window.OceanAI.modelResponses = modelResponses; // Hacerlo global para el acceso a otros scripts

const modelNames = {
  "wild-explorer-glx05": "Wild Explorer GLX0.5",
  "naturepedia-XZero1": "Naturepedia-XZero1",
};

// Añade esta función al inicio del script:
function findFirstAvailableModel() {
  for (const category of modelConfig.categories) {
    for (const model of category.models) {
      if (checkModelStatus(model) === "available") {
        return model.value;
      }
    }
  }
  return modelOrder[0]; // Fallback si no hay ningún modelo disponible
}

// Con esto:
let selectedModel = findFirstAvailableModel();

let menuOpen = false;

const avatarButton = document.getElementById("avatarButton");
const avatarMenu = document.getElementById("avatarMenu");

let avatarMenuOpen = false; // Controla si el menú está abierto o cerrado

avatarButton.addEventListener("click", (e) => {
  console.log("Botón de avatar clickeado"); // ✅ Ver si el botón responde
  e.stopPropagation();
  setTimeout(() => toggleAvatarMenu(), 10);
});

function toggleAvatarMenu() {
  if (avatarMenuOpen) {
    hideAvatarMenu(); // Si ya está abierto, lo cerramos
    return;
  }

  if (!avatarButton || !avatarMenu) {
    console.error("Elementos del avatar no encontrados");
    return;
  }

  gsap.killTweensOf(avatarMenu);
  avatarMenu.style.display = "flex";
  avatarMenu.style.opacity = "1";
  avatarMenu.style.transform = "none";
  avatarMenu.style.position = "fixed"; // O "absolute" según tu caso
  avatarMenu.style.top = "290px"; // Ajusta según tu diseño
  avatarMenu.style.left = "1218px"; // Ajusta según tu diseño
  avatarMenu.style.transform = "none"; // Evita que GSAP lo desplace fuera de pantalla
  avatarMenu.style.opacity = "1"; // Asegura que se vea
  avatarMenu.style.zIndex = "9999"; // Asegura que esté encima de otros elementos

  gsap.fromTo(
    avatarMenu,
    { opacity: 0, x: -10 },
    {
      opacity: 1,
      x: 0,
      duration: 0.3,
      ease: "power2.out",
      onStart: () => {
        avatarMenuOpen = true;
      },
    }
  );
}

// Evento para cerrar el menú al hacer clic fuera
document.addEventListener("click", (event) => {
  if (
    avatarMenuOpen &&
    !avatarButton.contains(event.target) &&
    !avatarMenu.contains(event.target)
  ) {
    hideAvatarMenu();
  }
});

// Ocultar el menú al inicio
avatarMenu.style.display = "none";

// Personalización de avatar
const avatarCustomizer = {
  currentAvatar: "🌊",
  options: ["🌊", "🌿", "🔭", "🧪", "🛰️"],
  updateAvatar: function (newEmoji) {
    this.currentAvatar = newEmoji;

    // Verifica si hay iconos antes de iterar
    const aiIcons = document.querySelectorAll(".ai-icon");
    if (aiIcons.length > 0) {
      aiIcons.forEach((icon) => {
        icon.textContent = newEmoji;
      });
    }

    avatarButton.textContent = newEmoji;
  },
};

// Asignar evento a cada opción de avatar
document.querySelectorAll(".avatar-option").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    avatarCustomizer.updateAvatar(e.target.textContent);
    hideAvatarMenu();
  });
});

// Función para cerrar el menú con animación
function hideAvatarMenu() {
  gsap.to(avatarMenu, {
    opacity: 0,
    x: -10,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      avatarMenu.style.display = "none";
      avatarMenuOpen = false;
    },
  });
}

// Agrega esto con las demás variables al inicio
let avatarHelpInterval;

function showAvatarHelp() {
  const helpPanel = document.getElementById("avatarHelpPanel");

  // Animación de entrada desde la izquierda
  gsap.fromTo(
    helpPanel,
    {
      left: "-250px", // Comienza más a la izquierda
      opacity: 0,
    },
    {
      left: "-250px", // Termina en la posición estática actual
      opacity: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    }
  );

  // Después de 7 segundos, animación de salida
  setTimeout(() => {
    gsap.to(helpPanel, {
      left: "-160px", // Mantiene la misma posición final
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    });
  }, 7000);
}

// Iniciar el intervalo cuando se carga la página
function initAvatarHelp() {
  const helpPanel = document.getElementById("avatarHelpPanel");

  // Mostrar por primera vez después de 3 segundos
  setTimeout(() => {
    showAvatarHelp();

    // Configurar intervalo para que aparezca cada 17 segundos (10 + 7)
    avatarHelpInterval = setInterval(() => {
      showAvatarHelp();
    }, 17000);
  }, 3000);
}

// Llamar a la función de inicialización al final del DOMContentLoaded
initAvatarHelp();

sendMessageButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") sendMessage();
});

// Modifica la función sendMessage
function sendMessage() {
  const message = messageInput.value.trim();

  if (message !== "") {
    addMessage(message, "user");

    showThinkingIndicator();

    setTimeout(() => {
      const responses = getAIResponse(message);
      hideThinkingIndicator();
      responses.forEach((response) => addMessage(response, "ai"));
      explorationSystem.addXP(10); // Añadir XP por interacción
    }, 5000);

    messageInput.value = "";
  }
}

// Agrega estas nuevas funciones
function showThinkingIndicator() {
  const indicator = document.getElementById("thinkingIndicator");
  indicator.style.display = "flex";

  gsap.to(indicator, {
    opacity: 1,
    duration: 0.3,
    onComplete: () => {
      gsap.to(".ai-icon", {
        fontSize: "16px",
        duration: 0.3,
      });
    },
  });
}

function hideThinkingIndicator() {
  const indicator = document.getElementById("thinkingIndicator");
  gsap.to(indicator, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      indicator.style.display = "none";
    },
  });
}

/* Modificar función addMessage */
function addMessage(text, sender) {
  const messageElement = document.createElement("div");
  if (Array.isArray(text)) {
    text.forEach((line) => {
      const lineElement = document.createElement("div");
      lineElement.textContent = line;
      lineElement.classList.add(
        sender === "user"
          ? "user-message"
          : sender === "system"
          ? "system-message"
          : "ai-message"
      );
      chat.appendChild(lineElement);
    });
  } else {
    messageElement.textContent = text;
    messageElement.classList.add(
      sender === "user"
        ? "user-message"
        : sender === "system"
        ? "system-message"
        : "ai-message"
    );
    chat.appendChild(messageElement);
  }
  chat.scrollTop = chat.scrollHeight;
}

// Función para normalizar texto (quitar tildes y convertir a minúsculas)
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quita tildes
    .toLowerCase();
};

// Modificar la función getAIResponse
function getAIResponse(userMessage) {
  const normalizedInput = normalizeText(userMessage);

  // 1. Verificar primero respuestas universales
  const universalMatch = universalResponses.triggers.find((trigger) =>
    trigger.questions.some((question) =>
      normalizedInput.includes(normalizeText(question))
    )
  );

  if (universalMatch) {
    // Actualizar estado para logros
    if (normalizedInput.includes("analizar")) appState.analysisUses++;
    appState.totalInteractions++;
    checkAchievements();

    return typeof universalMatch.response === "function"
      ? universalMatch.response()
      : universalMatch.response;
  }

  // 2. Lógica normal del modelo
  const model = modelResponses[selectedModel];
  if (!model) return ["Modelo no reconocido"];

  const matchedTrigger = model.triggers.find((trigger) =>
    trigger.questions.some((question) =>
      normalizedInput.includes(normalizeText(question))
    )
  );

  // Actualizar estado para logros
  if (normalizedInput.includes("analizar")) appState.analysisUses++;
  appState.totalInteractions++;
  checkAchievements();

  return matchedTrigger
    ? typeof matchedTrigger.response === "function"
      ? matchedTrigger.response()
      : matchedTrigger.response
    : model.default;
}

openModelSelector.addEventListener("click", () => {
  initializeModelPages(); // Asegura que se generan las opciones antes de abrir el modal
  setupModelSelectors(); // Aplica los event listeners a los selects generados

  modelModal.style.display = "block";

  gsap.fromTo(
    modelModal,
    { scaleX: 0, opacity: 0 },
    {
      scaleX: 1.1,
      duration: 0.4,
      opacity: 1,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(modelModal, {
          scaleX: 1,
          duration: 0.2,
          ease: "elastic.out(1, 0.3)",
        });
        gsap.to(".modal-content", { opacity: 1, duration: 0.3, delay: 0.2 });
      },
    }
  );
});

closeModelSelector.addEventListener("click", () => {
  gsap.to(modelModal, {
    scaleX: 0,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      modelModal.style.display = "none";
    },
  });
});

modelSelectors.forEach((select) => {
  select.addEventListener("change", (event) => {
    modelSelectors.forEach((sel) => {
      if (sel !== event.target) sel.value = "";
    });

    selectedModel = event.target.value;
  });
});

themeButton.addEventListener("click", () => {
  if (!menuOpen) {
    gsap.to(themeMenu, { opacity: 1, duration: 0.3 });
    themeMenu.style.display = "block";
  } else {
    gsap.to(themeMenu, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        themeMenu.style.display = "none";
      },
    });
  }
  menuOpen = !menuOpen;
});

themeOptions.forEach((button) => {
  button.addEventListener("click", (event) => {
    const theme = event.currentTarget.getAttribute("data-theme");
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      themeButton.textContent = "🌙";
    } else {
      document.body.classList.remove("dark-theme");
      themeButton.textContent = "☀️";
    }

    gsap.to(themeMenu, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        themeMenu.style.display = "none";
      },
    });
    menuOpen = false;
  });
});

// Función para limpiar el chat
function clearChat() {
  const chatElement = document.getElementById("chat");
  chatElement.innerHTML = "";
}

// Modificar el event listener de los selectores
modelSelectors.forEach((select) => {
  select.addEventListener("change", (event) => {
    modelSelectors.forEach((sel) => {
      if (sel !== event.target) sel.value = "";
    });

    selectedModel = event.target.value;
    clearChat(); // Limpiar chat al cambiar modelo
    updateModelIndicator(); // Actualizar nombre
  });
});

// Inicializar indicador al cargar
updateModelIndicator();

function updateModelSelection() {
  // Actualizar los selectores en el modal
  document.querySelectorAll(".modelSelector").forEach((select) => {
    select.value = selectedModel;
  });

  // Actualizar el indicador del modelo actual
  updateModelIndicator();

  // Actualizar el manual del modelo
  updateManualContent();

  // Limpiar el chat
  clearChat();

  // Mostrar mensaje de bienvenida del nuevo modelo
  const welcomeResponses = modelResponses[selectedModel]?.triggers.find((t) =>
    t.questions.some((q) => q.includes("hola"))
  );

  if (welcomeResponses) {
    const response =
      typeof welcomeResponses.response === "function"
        ? welcomeResponses.response()
        : welcomeResponses.response;
    addMessage(response, "ai");
  }
}

// Reemplazar estos event listeners:
document.getElementById("nextModel").addEventListener("click", () => {
  let currentIndex = modelOrder.indexOf(selectedModel);
  selectedModel =
    currentIndex < modelOrder.length - 1
      ? modelOrder[currentIndex + 1]
      : modelOrder[0];
  updateModelIndicator();
  clearChat();
});

document.getElementById("prevModel").addEventListener("click", () => {
  let currentIndex = modelOrder.indexOf(selectedModel);
  selectedModel =
    currentIndex > 0
      ? modelOrder[currentIndex - 1]
      : modelOrder[modelOrder.length - 1];
  updateModelIndicator();
  clearChat();
});

document.getElementById("nextModel").addEventListener("click", () => {
  const availableModels = getAllAvailableModels();
  const currentIndex = availableModels.indexOf(selectedModel);
  const nextIndex = (currentIndex + 1) % availableModels.length;
  selectedModel = availableModels[nextIndex];
  updateModelSelection();
});

document.getElementById("prevModel").addEventListener("click", () => {
  const availableModels = getAllAvailableModels();
  const currentIndex = availableModels.indexOf(selectedModel);
  const prevIndex =
    (currentIndex - 1 + availableModels.length) % availableModels.length;
  selectedModel = availableModels[prevIndex];
  updateModelSelection();
});

// Añade estas funciones auxiliares:
function getAllAvailableModels() {
  const available = [];
  modelConfig.categories.forEach((category) => {
    category.models.forEach((model) => {
      if (checkModelStatus(model) === "available") {
        available.push(model.value);
      }
    });
  });
  return available;
}

// Agrega estas variables al inicio con las demás
let currentPage = 0;
let totalPages = 0;
const categoriesPerPage = 2;

function updateNavigation() {
  const prevButton = document.getElementById("prevModel");
  const nextButton = document.getElementById("nextModel");

  prevButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage >= totalPages - 1;
}

// Nueva función para verificar estados
function checkModelStatus(model) {
  if (model.status === "available") return "available";

  if (model.status === "soon" && new Date() > new Date(model.releaseDate)) {
    return "available";
  }

  if (
    model.status === "unavailable" &&
    new Date() > new Date(model.maintenanceUntil)
  ) {
    return "available";
  }

  return model.status;
}

function generateModelCategories() {
  const pagesContainer = document.querySelector(".model-pages");
  const upcomingContainer = document.getElementById("upcomingModels"); // Contenedor correcto para Próximos Lanzamientos
  const statusMainContainer = document.querySelector(".status-container"); // Contenedor de estados generales

  pagesContainer.innerHTML = "";
  upcomingContainer.innerHTML = ""; // Limpia para evitar duplicados
  statusMainContainer.innerHTML = ""; // Limpia estados

  modelConfig.categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "category";

    const title = document.createElement("h3");
    title.className = "category-title";
    title.textContent = `${category.title}${
      category.releaseDate ? ` (Lanzamiento: ${category.releaseDate})` : ""
    }`;

    const select = document.createElement("select");
    select.className = "modelSelector";

    // Contenedores de estados
    const statusList = document.createElement("div");
    statusList.className = "status-list";

    // Contenedor de nuevos modelos
    const newModelsContainer = document.createElement("div");
    newModelsContainer.className = "new-models-list";

    const newModelsTitle = document.createElement("div");
    newModelsTitle.className = "new-models-title";
    newModelsTitle.innerHTML = "Modelos Nuevos:";

    const newModelsList = document.createElement("ul");
    newModelsList.className = "new-models-items";

    category.models.forEach((model) => {
      const currentStatus = checkModelStatus(model);
      const option = document.createElement("option");
      option.value = model.value;
      option.textContent = model.name;
      option.disabled = currentStatus !== "available";

      // Solo modelos disponibles en el selector
      if (currentStatus === "available") {
        select.appendChild(option);
      }

      // Modelos nuevos (isNew)
      if (model.isNew) {
        const listItem = document.createElement("li");
        listItem.className = "new-model-item";
        listItem.innerHTML = `
                    <span class="model-name">${model.name}</span>
                    <span class="new-badge">NUEVO!</span>
                `;
        newModelsList.appendChild(listItem);
      }

      // En la sección de próximos lanzamientos:
      if (currentStatus === "soon" || currentStatus === "unavailable") {
        const listItem = document.createElement("li");
        listItem.className = `upcoming-model-item ${currentStatus}`; // Añadir clase de estado
        listItem.innerHTML = `
      <span class="model-name">${model.name}</span>
      <span class="status-label">${
        currentStatus === "soon"
          ? `LANZAMIENTO: ${model.releaseDate}`
          : `MANTENIMIENTO: ${model.maintenanceUntil}`
      }</span>
    `;
        upcomingContainer.appendChild(listItem);
      }
    });

    // Agregar la sección de nuevos modelos solo si hay
    if (newModelsList.children.length > 0) {
      newModelsContainer.appendChild(newModelsTitle);
      newModelsContainer.appendChild(newModelsList);
      categoryDiv.appendChild(newModelsContainer);
    }

    // Agregar estados a la categoría
    statusMainContainer.appendChild(statusList);
    categoryDiv.appendChild(title);
    categoryDiv.appendChild(select);

    pagesContainer.appendChild(categoryDiv);
  });
}

// Reemplaza la función initializeModelPages con esta versión
function initializeModelPages() {
  const pagesContainer = document.querySelector(".model-pages");

  // 1. Generar categorías base
  generateModelCategories();

  // 2. Agrupar en páginas
  const categories = Array.from(pagesContainer.querySelectorAll(".category"));
  pagesContainer.innerHTML = "";

  while (categories.length) {
    const page = document.createElement("div");
    page.className = "model-page";
    page.append(...categories.splice(0, categoriesPerPage));
    pagesContainer.appendChild(page);
  }

  // 3. Configurar paginación
  totalPages = pagesContainer.children.length;
  currentPage = 0;

  // 4. Mostrar primera página
  document.querySelectorAll(".model-page").forEach((page, index) => {
    page.style.display = index === 0 ? "flex" : "none";
    gsap.set(page, { opacity: index === 0 ? 1 : 0 });
  });

  // Marcar el modelo seleccionado actual en todos los selectores
  document.querySelectorAll(".modelSelector").forEach((select) => {
    select.value = selectedModel;
  });

  updateNavigation();
}

// Actualizar event listeners para selects dinámicos
function setupModelSelectors() {
  document.querySelectorAll(".modelSelector").forEach((select) => {
    select.addEventListener("change", (event) => {
      // Restablecer los otros selectores
      document.querySelectorAll(".modelSelector").forEach((sel) => {
        if (sel !== event.target) sel.value = "";
      });

      selectedModel = event.target.value;
      updateModelSelection();

      selectedModel = event.target.value;
      clearChat();
      updateModelIndicator();
      updateManualContent(); // Asegurar que esto se ejecute

      // Añadir un mensaje de bienvenida del nuevo modelo
      const welcomeResponses = modelResponses[selectedModel]?.triggers.find(
        (t) => t.questions.some((q) => q.includes("hola"))
      ); // <- Cierre de paréntesis corregido aquí

      if (welcomeResponses) {
        const response =
          typeof welcomeResponses.response === "function"
            ? welcomeResponses.response()
            : welcomeResponses.response;

        addMessage(response, "ai");
      }
    });
  });
}

function changePage(direction) {
  const pages = document.querySelectorAll(".model-page");
  const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;

  // Animación de transición
  gsap.to(pages[currentPage], {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      pages[currentPage].style.display = "none";
      currentPage = newPage;
      pages[currentPage].style.display = "flex";

      gsap.fromTo(
        pages[currentPage],
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
        }
      );

      updateNavigation();
    },
  });
}

// Función para capitalizar la primera letra de cada palabra
function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
    return char.toUpperCase();
  });
}

// Funcionalidad del buscador del manual
const searchIcon = document.querySelector(".search-icon");
const searchInput = document.querySelector(".search-input");
const searchContainer = document.querySelector(".search-container");
const manualContent = document.getElementById("manualContent");

searchIcon.addEventListener("click", () => {
  searchContainer.classList.toggle("active");

  if (searchContainer.classList.contains("active")) {
    // Animación con posición más a la izquierda (10px en lugar de 15px)
    gsap.to(searchIcon, {
      left: 1, // Ajustado para coincidir con el CSS
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(searchInput, {
      width: "100%",
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        searchInput.focus();
      },
    });
  } else {
    // Resto del código permanece igual
    gsap.to(searchInput, {
      width: 0,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });

    gsap.to(searchIcon, {
      left: "50%",
      duration: 0.3,
      ease: "power2.out",
      delay: 0.1,
    });

    searchInput.value = "";
    filterCommands("");
  }
});

searchInput.addEventListener("input", (e) => {
  filterCommands(e.target.value);
});

function filterCommands(searchTerm) {
  const normalizedSearch = normalizeText(searchTerm);
  const commandGroups = document.querySelectorAll(".command-group");

  if (!searchTerm) {
    commandGroups.forEach((group) => {
      group.classList.remove("highlight", "no-match");
    });
    return;
  }

  let hasMatches = false;
  commandGroups.forEach((group) => {
    const trigger = normalizeText(
      group.querySelector(".command-trigger").textContent
    );
    const variants = Array.from(group.querySelectorAll(".command-variant")).map(
      (v) => normalizeText(v.textContent)
    );

    const matches =
      trigger.includes(normalizedSearch) ||
      variants.some((v) => v.includes(normalizedSearch));

    if (matches) {
      group.classList.add("highlight");
      group.classList.remove("no-match");
      hasMatches = true;
    } else {
      group.classList.remove("highlight");
      group.classList.add("no-match");
    }
  });

  if (!hasMatches && searchTerm) {
    // Mostrar mensaje si no hay coincidencias
    if (!document.querySelector(".no-results-message")) {
      const message = document.createElement("div");
      message.className = "no-results-message";
      message.textContent = "No se encontraron comandos que coincidan";
      manualContent.appendChild(message);
    }
  } else {
    // Eliminar mensaje si hay coincidencias
    const message = document.querySelector(".no-results-message");
    if (message) {
      message.remove();
    }
  }
}

function updateManualContent() {
  const manualContent = document.getElementById("manualContent");
  manualContent.innerHTML = "";

  const model = modelResponses[selectedModel];
  if (!model) return;

  model.triggers.forEach((trigger) => {
    const group = document.createElement("div");
    group.className = "command-group";

    const triggerElement = document.createElement("div");
    triggerElement.className = "command-trigger";
    triggerElement.textContent = trigger.questions[0];

    const variants = document.createElement("div");
    variants.className = "command-variants";

    trigger.questions.forEach((question, index) => {
      if (index === 0) return; // Saltar la primera que ya está en el trigger
      const variant = document.createElement("div");
      variant.className = "command-variant";
      variant.textContent = question;
      variants.appendChild(variant);
    });

    group.appendChild(triggerElement);
    group.appendChild(variants);
    manualContent.appendChild(group);
  });

  // Aplicar scroll solo si hay más de 8 comandos
  const commands = manualContent.children.length;
  if (commands > 8) {
    manualContent.style.overflowY = "auto";
  } else {
    manualContent.style.overflowY = "visible";
  }
}

function updateModelIndicator() {
  const displayName =
    modelNames[selectedModel] || selectedModel.replace(/_/g, " ");
  const modelNameElement = document.getElementById("currentModelName");
  const manualNameElement = document.getElementById("modelManualName");

  if (modelNameElement) {
    modelNameElement.textContent = toTitleCase(displayName);
  }

  if (manualNameElement) {
    manualNameElement.textContent = toTitleCase(displayName);
  }
}

updateManualContent(); // Actualizar manual al cargar

// Al final del DOMContentLoaded:
window.OceanAI.modelResponses = modelResponses;
console.log(
  "OceanAI inicializado con",
  Object.keys(modelResponses).length,
  "modelos"
);

// Disparar evento de inicialización completa
const event = new CustomEvent("OceanAIReady", {
  detail: {
    version: "1.0",
    models: Object.keys(modelResponses),
  },
});
window.dispatchEvent(event);
