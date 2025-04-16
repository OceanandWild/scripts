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
// Variables globales
let avatarMenu = null;
let avatarButton = null;
let avatarMenuOpen = false;

// Función segura para obtener elementos
function getSafeElement(id) {
  const el = document.getElementById(id);
  if (!el) console.error(`Elemento #${id} no encontrado`);
  return el;
}

// Inicialización segura
function initAvatarSystem() {
  avatarMenu = getSafeElement("avatarMenu");
  avatarButton = getSafeElement("avatarButton");
  
  if (!avatarMenu || !avatarButton) return false;

  // Estado inicial
  avatarMenu.style.display = "none";
  
  // Event listeners
  avatarButton.addEventListener("click", toggleAvatarMenu);
  
  document.querySelectorAll(".avatar-option").forEach(btn => {
    btn.addEventListener("click", (e) => {
      avatarCustomizer.updateAvatar(e.target.textContent);
      hideAvatarMenu();
    });
  });

  return true;
}


// 2. Función para obtener el menú de avatar de forma segura
function getAvatarMenu() {
  if (!avatarMenu) {
    avatarMenu = document.getElementById("avatarMenu");
  }
  return avatarMenu;
}
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
      releaseDate: "24/3/2025",
      models: [
        {
          value: "wild-explorer-glx05",
          name: "Wild Explorer GLX0.5 (Núcleo Geodésico)",
          isNew: true,
          status: "available",
          maintenanceUntil: "29/3/2025",
        },
        {
          value: "SpediaOriginal",
          name: "Spedia VOriginal",
          status: "soon",
          releaseDate: "30/4/2025", // Fecha futura
          isNew: false
        },
      ],
    },
    {
      title: "📚 Naturepedia",
      releaseDate: "N/A",
      models: [
        {
          value: "naturepedia-XZero1",
          name: "Naturepedia-XZero1",
          status: "available",
          releaseDate: "N/A",
          isNew: false
        },
      ],
    },
    {
      title: "🌱 Ecoxion",
      releaseDate: "15/4/2025",
      models: [
        {
          value: "ecoxion-aprilgx",
          name: "Ecoxion-AprilGX",
          isNew: true,
          status: "available",
        }
      ]
    }
  ]
};


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
        questions: ["Llanura de Serengeti", "Serengeti"],
        response: [
          "Te resumo la llanura del Serengeti, no te preocupes en cambiar de pagina:",
          "La llanura del Serengeti es famosa por la Gran Migración, donde millones de ñus, cebras y gacelas se desplazan en busca de agua y pasto.",
          "Este ecosistema es hogar de los 'Cinco Grandes': león, elefante, leopardo, rinoceronte y búfalo.",
          "Los depredadores como guepardos y hienas juegan un papel clave en el equilibrio ecológico de la región.",
          "El Serengeti es un destino de safari icónico y un modelo de conservación de la fauna africana.",
        ],
      },
    ],
  },
  "ecoxion-aprilgx": {
    triggers: [
      {
        questions: ["hola", "extensiones", "recomendaciones"],
        response: [
          "🌱 ¡Hola! Soy Ecoxion-AprilGX, tu asistente ecológico digital.",
          "Claro, te puedo recomendar algunas extensiones a instalar, a la fecha del 16 de Abril de 2025 tengo estas, recuerda que voy a tratar de recopilar informacion actualizada lo mas antes posible:",
          "▸ Modo Zen: Esto relaja el header y ayuda mucho a la mejora visual de Ecoxion",
          "▸ Modo Oscuro: Altamente recomendable, los ojos te lo van a agradecer 🥳",
        ]
      },
      {
        questions: ["que es ecoxion", "acerca de"],
        response: [
          "🌍 Ecoxion es un navegador web con conciencia ecológica",
          "💚 Diseñado para minimizar el consumo de energía y recursos",
          "🌿 Incluye funciones de sostenibilidad y bienestar digital",
          "📱 Optimizado para dispositivos móviles y de bajo consumo"
        ]
      }
    ],
    default: [
      "🌱 Por favor reformula tu pregunta en términos de sostenibilidad digital",
      "💡 Prueba preguntando sobre 'extensiones recomendadas' o 'consejos ecológicos'"
    ]
  },
};

// Modificar esta línea:
window.OceanAI.modelResponses = modelResponses; // Hacerlo global para el acceso a otros scripts

// En modelOrder, añade el nuevo modelo:
const modelOrder = [
  "wild-explorer-glx05",
  "SpediaOriginal",
  "naturepedia-XZero1",
  "ecoxion-aprilgx"
];

// En modelNames, añade el nombre para mostrar:
const modelNames = {
  "wild-explorer-glx05": "Wild Explorer GLX0.5",
  "naturepedia-XZero1": "Naturepedia-XZero1",
  "ecoxion-aprilgx": "Ecoxion-AprilGX"
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





// 3. Función para inicializar el menú de avatar
function initAvatarMenu() {
  avatarMenu = document.getElementById("avatarMenu");
  avatarButton = document.getElementById("avatarButton");

  if (!avatarMenu || !avatarButton) {
    console.error("Elementos del avatar no encontrados");
    return false;
  }

  // Configurar estado inicial
  avatarMenu.style.display = "none";
  avatarMenuOpen = false;

  // Event listeners
  avatarButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleAvatarMenu();
  });

  document.querySelectorAll(".avatar-option").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      avatarCustomizer.updateAvatar(e.target.textContent);
      hideAvatarMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (avatarMenuOpen && !event.target.closest("#avatarMenu") && !event.target.closest("#avatarButton")) {
      hideAvatarMenu();
    }
  });

  return true;
}

window.addEventListener("DOMContentLoaded", initAvatarMenu);



// 4. Función para mostrar/ocultar el menú
function toggleAvatarMenu() {
  const menu = getAvatarMenu();
  if (!menu || !avatarButton) return;

  if (avatarMenuOpen) {
    hideAvatarMenu();
    return;
  }

    // Animación segura
    if (typeof gsap !== "undefined" && avatarMenu) {
      gsap.killTweensOf(avatarMenu);
      avatarMenu.style.display = "flex";
      
      gsap.fromTo(avatarMenu, 
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3,
          onStart: () => avatarMenuOpen = true
        }
      );
    }
  

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

// Versión robusta de hide
function hideAvatarMenu() {
  if (!avatarMenu || !avatarMenuOpen) return;

  if (typeof gsap !== "undefined") {
    gsap.to(avatarMenu, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        if (avatarMenu) {
          avatarMenu.style.display = "none";
          avatarMenuOpen = false;
        }
      }
    });
  } else {
    // Fallback si GSAP no está cargado
    avatarMenu.style.display = "none";
    avatarMenuOpen = false;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  if (initAvatarSystem()) {
    console.log("Sistema de avatar listo");
  } else {
    console.error("Error al inicializar el avatar");
  }
});

// 6. Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Primero verificar que los elementos existen
  if (!document.getElementById("avatarMenu") || !document.getElementById("avatarButton")) {
    console.error("Elementos HTML del avatar no encontrados");
    return;
  }

  // Luego inicializar
  if (initAvatarMenu()) {
    console.log("Avatar menu inicializado correctamente");
  } else {
    console.error("Error al inicializar el avatar menu");
  }
});

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
  initModelSlider(); // Asegura que se generan las opciones antes de abrir el modal
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

  let modelId = typeof selectedModel === "string" ? selectedModel : selectedModel?.value || "";
  const displayName = modelNames[modelId] || modelId.replace(/-/g, " ");
  document.getElementById("currentModelName").textContent = displayName;

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
  const availableModels = getAllAvailableModelsFull();
  const currentIndex = availableModels.indexOf(selectedModel);
  const nextIndex = (currentIndex + 1) % availableModels.length;
  selectedModel = availableModels[nextIndex];
  updateModelSelection();
});

document.getElementById("prevModel").addEventListener("click", () => {
  const availableModels = getAllAvailableModelsFull();
  const currentIndex = availableModels.indexOf(selectedModel);
  const prevIndex =
    (currentIndex - 1 + availableModels.length) % availableModels.length;
  selectedModel = availableModels[prevIndex];
  updateModelSelection();
});

function getAllAvailableModelsFull() {
  const available = [];
  modelConfig.categories.forEach((category) => {
    category.models.forEach((model) => {
      if (checkModelStatus(model) === "available") {
        available.push({ ...model, categoryTitle: category.title });
      }
    });
  });
  return available;
}


// Variables para el slider
let currentSliderPage = 0;
let totalSliderPages = 0;
const categoriesPerPage = 2; // Mostrar 2 categorías por página

// Función para inicializar el slider
function initModelSlider() {
  const sliderContainer = document.querySelector('.model-pages');
  if (!sliderContainer) return;

  // Limpiar contenedor
  sliderContainer.innerHTML = '';

  // Calcular total de páginas
  totalSliderPages = Math.ceil(modelConfig.categories.length / categoriesPerPage);

  // Crear páginas
  for (let i = 0; i < totalSliderPages; i++) {
    const page = document.createElement('div');
    page.className = 'model-page';
    page.style.display = i === 0 ? 'flex' : 'none'; // Mostrar solo la primera página
    sliderContainer.appendChild(page);
  }

  // Llenar páginas con categorías
  updateSliderContent();
  updateSliderNavigation();
}

// Función para actualizar el contenido del slider
function updateSliderContent() {
  const pages = document.querySelectorAll('.model-page');
  if (!pages) return;

  // Limpiar páginas
  pages.forEach(page => page.innerHTML = '');

  // Agregar categorías a cada página
  for (let i = 0; i < totalSliderPages; i++) {
    const startIdx = i * categoriesPerPage;
    const endIdx = startIdx + categoriesPerPage;
    const pageCategories = modelConfig.categories.slice(startIdx, endIdx);

    pageCategories.forEach(category => {
      const categoryCard = createCategoryCard(category);
      pages[i].appendChild(categoryCard);
    });
  }
}


function createSimpleModelCard(model) {
  const card = document.createElement('div');
  card.className = 'category-card';

  const title = document.createElement('h3');
  title.textContent = model.categoryTitle + ' - ' + model.name;

  const select = document.createElement('button');
  select.textContent = 'Seleccionar';
  select.className = 'model-selector';
  select.addEventListener('click', () => {
    selectedModel = model.value;
    updateModelSelection();
  });

  card.appendChild(title);
  card.appendChild(select);

  return card;
}


// Función para crear una tarjeta de categoría
function createCategoryCard(category) {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category-card';
  
  const title = document.createElement('h3');
  title.textContent = category.title;
  categoryDiv.appendChild(title);
  
  const select = document.createElement('select');
  select.className = 'model-selector';
  
  // Opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = `Selecciona un modelo ${category.title}`;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  
  // Agregar modelos disponibles
  category.models.forEach(model => {
    if (checkModelStatus(model) === 'available') {
      const option = document.createElement('option');
      option.value = model.value;
      option.textContent = model.name;
      if (model.value === selectedModel) {
        option.selected = true;
        defaultOption.selected = false;
      }
      select.appendChild(option);
    }
  });
  
  select.addEventListener('change', function(e) {
    if (e.target.value) {
      selectedModel = e.target.value;
      updateModelSelection();
    }
  });
  
  categoryDiv.appendChild(select);
  return categoryDiv;
}


function createModelCard(model) {
  const card = document.createElement('div');
  card.className = 'model-card';
  
  const isAvailable = checkModelStatus(model) === 'available';
  const isCurrent = selectedModel === model.value;
  
  card.innerHTML = `
    <h3>${model.name}</h3>
    ${model.description ? `<p>${model.description}</p>` : ''}
    <select class="model-selector">
      <option value="${model.value}" ${!isAvailable ? 'disabled' : ''} ${isCurrent ? 'selected' : ''}>
        ${isAvailable ? 'Seleccionar' : 'No disponible'}
      </option>
    </select>
  `;
  
  return card;
}

function navigateSlider(direction) {
  const pages = document.querySelectorAll(".model-page");
  if (!pages || pages.length === 0) return;

  const newPage = direction === "next" ? currentSliderPage + 1 : currentSliderPage - 1;
  
  // Verificar límites
  if (newPage < 0 || newPage >= pages.length) return;

  // Animación segura
  if (typeof gsap !== "undefined") {
    gsap.to(pages[currentSliderPage], {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        pages[currentSliderPage].style.display = "none";
        currentSliderPage = newPage;
        
        if (pages[currentSliderPage]) {
          pages[currentSliderPage].style.display = "flex";
          gsap.fromTo(pages[currentSliderPage], 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3 }
          );
        }
        updateSliderNavigation();
      }
    });
  }
}


// Función para actualizar la navegación del slider
function updateSliderNavigation() {
  const prevBtn = document.getElementById('prevModel');
  const nextBtn = document.getElementById('nextModel');
  
  prevBtn.disabled = currentSliderPage === 0;
  nextBtn.disabled = currentSliderPage >= totalSliderPages - 1;
}


// Event listeners para los botones
document.getElementById('prevModel').addEventListener('click', () => navigateSlider('prev'));
document.getElementById('nextModel').addEventListener('click', () => navigateSlider('next'));


function updatePageContent() {
  const pages = document.querySelectorAll(".model-page");
  pages.forEach((page, pageIndex) => {
    page.innerHTML = ""; // Limpiar antes de agregar contenido

    const startIdx = pageIndex * categoriesPerPage;
    const endIdx = startIdx + categoriesPerPage;
    const pageCategories = modelConfig.categories.slice(startIdx, endIdx);

    pageCategories.forEach(category => {
      const categoryDiv = createCategoryElement(category);
      page.appendChild(categoryDiv);
    });
  });
}

// Función para crear el selector de modelos por categoría
function createCategorySelector(category) {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category-selector';

  // Título de la categoría
  const title = document.createElement('h3');
  title.className = 'category-title';
  title.textContent = category.title;
  categoryDiv.appendChild(title);

  // Selector de modelos
  const select = document.createElement('select');
  select.className = 'model-selector';
  
  // Opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = `Selecciona un modelo ${category.title}`;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  // Agregar modelos disponibles
  category.models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.value;
    option.textContent = model.name;
    option.disabled = checkModelStatus(model) !== 'available';
    
    // Marcar como seleccionado si es el modelo actual
    if (model.value === selectedModel) {
      option.selected = true;
      defaultOption.selected = false;
    }
    
    select.appendChild(option);
  });

  // Evento para cambiar de modelo
  select.addEventListener('change', function() {
    if (this.value) {
      selectedModel = this.value;
      updateModelIndicator();
      // Opcional: Mostrar mensaje de bienvenida del modelo
      showModelWelcomeMessage();
    }
  });

  categoryDiv.appendChild(select);
  return categoryDiv;
}

// Función para mostrar mensaje de bienvenida del modelo
function showModelWelcomeMessage() {
  const welcomeResponses = modelResponses[selectedModel]?.triggers.find(t => 
    t.questions.some(q => q.includes('hola'))
  );
  
  if (welcomeResponses) {
    const response = typeof welcomeResponses.response === 'function'
      ? welcomeResponses.response()
      : welcomeResponses.response;
    addMessage(response, 'ai');
  }
}

function showCurrentPage() {
  const categories = document.querySelectorAll(".category");
  const startIdx = currentPageAI * categoriesPerPage;
  const endIdx = startIdx + categoriesPerPage;

  categories.forEach((category, index) => {
    if (index >= startIdx && index < endIdx) {
      category.style.display = "flex";
      gsap.fromTo(category, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    } else {
      category.style.display = "none";
    }
  });
}




function updateNavigation() {
  const prevButton = document.getElementById("prevModel");
  const nextButton = document.getElementById("nextModel");

  prevButton.disabled = currentPageAI === 0;
  nextButton.disabled = currentPageAI >= totalPages - 1;
}



// Obtener modelo por ID
function getModelById(modelId) {
  for (const category of modelConfig.categories) {
    const found = category.models.find(m => m.value === modelId);
    if (found) return found;
  }
  return null;
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

  // Procesar todos los modelos para encontrar los próximos
  let hasUpcomingModels = false;

  modelConfig.categories.forEach(category => {
    category.models.forEach(model => {
      const status = checkModelStatus(model);
      
      if (status === "soon" || status === "unavailable") {
        hasUpcomingModels = true;
        
        const item = document.createElement("div");
        item.className = `upcoming-model-item ${status}`;
        
        item.innerHTML = `
          <span class="model-name">${model.name}</span>
          <span class="status-indicator">
            ${status === "soon" 
              ? `🚀 Lanzamiento: ${model.releaseDate || "Próximamente"}` 
              : `🔧 Mantenimiento hasta: ${model.maintenanceUntil}`}
          </span>
        `;
        
        upcomingContainer.appendChild(item);
      }
    });
  });

  const upcomingModels = [];

    
  // Eliminar duplicados
  const uniqueUpcomingModels = upcomingModels.filter(
    (model, index, self) => index === self.findIndex(m => m.value === model.value)
  );

    // Mostrar en el contenedor
    if (uniqueUpcomingModels.length > 0) {
      uniqueUpcomingModels.forEach(model => {
        const item = document.createElement('div');
        item.className = `upcoming-model-item ${checkModelStatus(model)}`;
        
        item.innerHTML = `
          <div class="upcoming-model-info">
            <span class="model-name">${model.name}</span>
            <span class="model-category">${model.category}</span>
          </div>
          <span class="status-indicator">
            ${checkModelStatus(model) === 'soon' 
              ? `🚀 Lanzamiento: ${model.releaseDate || "Próximamente"}` 
              : `🔧 Mantenimiento hasta: ${model.maintenanceUntil}`}
          </span>
        `;
        
        upcomingContainer.appendChild(item);
      });
    } else {
      upcomingContainer.innerHTML = `
      `;
    }
    

  // Mostrar mensaje si no hay próximos lanzamientos
  if (!hasUpcomingModels) {
    upcomingContainer.innerHTML = `
      <div class="no-upcoming-models">
        No hay modelos próximos a lanzarse
      </div>
    `;
  }


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



function setupModelSelectors() {
  document.querySelectorAll('.model-selector').forEach(select => {
    select.addEventListener('change', function(e) {
      selectedModel = e.target.value;
      updateModelIndicator();
      
      // Opcional: Mostrar mensaje de bienvenida del nuevo modelo
      const welcomeResponses = modelResponses[selectedModel]?.triggers.find(t => 
        t.questions.some(q => q.includes('hola'))
      );
      
      if (welcomeResponses) {
        const response = typeof welcomeResponses.response === 'function'
          ? welcomeResponses.response()
          : welcomeResponses.response;
        addMessage(response, 'ai');
      }
    });
  });
}


function changePage(direction) {
  const newPage = direction === "next" ? currentPageAI + 1 : currentPageAI - 1;

  if (newPage >= 0 && newPage < totalPages) {
    const pages = document.querySelectorAll(".model-page");
    
    // Animación de salida
    gsap.to(pages[currentPageAI], {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        pages[currentPageAI].style.display = "none";
        currentPageAI = newPage;
        pages[currentPageAI].style.display = "flex";
        
        // Animación de entrada
        gsap.fromTo(pages[currentPageAI], 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
        
        updateNavigation();
      }
    });
  }
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
  const modelNameElement = document.getElementById("currentModelName");
  const manualNameElement = document.getElementById("modelManualName");

  let modelId = typeof selectedModel === "string" ? selectedModel : selectedModel?.value || "";
  const displayName = modelNames[modelId] || modelId.replace(/-/g, " ");
  document.getElementById("currentModelName").textContent = displayName;

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
