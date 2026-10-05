// ===============================
// WebOS
// ===============================

let zIndex = 100;
let windowCount = 0;

const windows = {};

const appInfo = {
  explorer: {
    title: "File Explorer",
    icon: "📁"
  },

  notepad: {
    title: "Notepad",
    icon: "📝"
  },

  calculator: {
    title: "Calculator",
    icon: "🧮"
  },

  settings: {
    title: "Settings",
    icon: "⚙️"
  },

  about: {
    title: "About WebOS",
    icon: "💻"
  }
};


// ===============================
// Start Menu
// ===============================

const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");

startButton.addEventListener("click", () => {
  startMenu.classList.toggle("hidden");
});

document.addEventListener("click", (event) => {
  if (
    !startMenu.contains(event.target) &&
    !startButton.contains(event.target)
  ) {
    startMenu.classList.add("hidden");
  }
});


// ===============================
// Open applications
// ===============================

document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => {
    openApp(button.dataset.app);
    startMenu.classList.add("hidden");
  });
});


function openApp(appName) {

  // If application already exists, focus it
  if (windows[appName]) {

    if (windows[appName].classList.contains("minimized")) {
      windows[appName].classList.remove("minimized");
    }

    focusWindow(windows[appName]);

    return;
  }

  createWindow(appName);
}


// ===============================
// Create Window
// ===============================

function createWindow(appName) {

  const info = appInfo[appName];

  if (!info) return;

  const win = document.createElement("div");

  win.className = "os-window";

  win.dataset.app = appName;

  windowCount++;

  const offset = Math.min(windowCount * 25, 150);

  win.style.left = `${150 + offset}px`;
  win.style.top = `${70 + offset}px`;

  win.innerHTML = `
    <div class="window-titlebar">

      <div class="window-title">
        <span>${info.icon}</span>
        <span>${info.title}</span>
      </div>

      <div class="window-controls">

        <button class="window-control minimize">
          ─
        </button>

        <button class="window-control maximize">
          □
        </button>

        <button class="window-control close">
          ×
        </button>

      </div>

    </div>

    <div class="window-content">
      ${getAppContent(appName)}
    </div>
  `;

  document.getElementById("window-area").appendChild(win);

  windows[appName] = win;

  setupWindow(win);

  createTaskbarButton(appName);

  focusWindow(win);

  notify(
    info.title,
    `${info.title} opened`
  );
}


// ===============================
// App content
// ===============================

function getAppContent(appName) {

  switch (appName) {

    case "explorer":
      return explorerApp();

    case "notepad":
      return notepadApp();

    case "calculator":
      return calculatorApp();

    case "settings":
      return settingsApp();

    case "about":
      return aboutApp();

    default:
      return "<p>Application not found.</p>";
  }
}


// ===============================
// File Explorer
// ===============================

function explorerApp() {

  return `
    <div class="file-manager">

      <aside class="sidebar">

        <button>🏠 Home</button>
        <button>⭐ Favorites</button>
        <button>📄 Documents</button>
        <button>🖼️ Pictures</button>
        <button>🎵 Music</button>
        <button>🎬 Videos</button>
        <button>⬇️ Downloads</button>

      </aside>

      <div class="files-area">

        <div class="files-toolbar">

          <button onclick="notify('Files', 'New folder created')">
            ＋ New Folder
          </button>

          <button onclick="notify('Files', 'Refresh complete')">
            ↻ Refresh
          </button>

        </div>

        <div class="file-grid">

          <div class="file-item">
            <span class="file-icon">📁</span>
            Documents
          </div>

          <div class="file-item">
            <span class="file-icon">📁</span>
            Pictures
          </div>

          <div class="file-item">
            <span class="file-icon">📁</span>
            Music
          </div>

          <div class="file-item">
            <span class="file-icon">📁</span>
            Downloads
          </div>

          <div class="file-item">
            <span class="file-icon">📄</span>
            Welcome.txt
          </div>

          <div class="file-item">
            <span class="file-icon">📄</span>
            Readme.md
          </div>

        </div>

      </div>

    </div>
  `;
}


// ===============================
// Notepad
// ===============================

function notepadApp() {

  return `
    <div class="notepad">

      <div class="notepad-toolbar">

        <button onclick="saveNote()">
          💾 Save
        </button>

        <button onclick="clearNote()">
          🗑 Clear
        </button>

        <button onclick="notify('Notepad', 'Your text is stored in this session')">
          ℹ Info
        </button>

      </div>

      <textarea
        id="notepad-text"
        placeholder="Start typing..."
      ></textarea>

    </div>
  `;
}


function saveNote() {

  const textarea = document.getElementById("notepad-text");

  if (!textarea) return;

  localStorage.setItem(
    "webos-note",
    textarea.value
  );

  notify(
    "Notepad",
    "Note saved successfully"
  );
}


function clearNote() {

  const textarea = document.getElementById("notepad-text");

  if (textarea) {
    textarea.value = "";
  }
}


// Restore note after opening
document.addEventListener("click", () => {

  setTimeout(() => {

    const textarea = document.getElementById("notepad-text");

    if (
      textarea &&
      textarea.value === "" &&
      localStorage.getItem("webos-note")
    ) {
      textarea.value =
        localStorage.getItem("webos-note");
    }

  }, 100);

});


// ===============================
// Calculator
// ===============================

function calculatorApp() {

  return `
    <div class="calculator">

      <input
        id="calc-display"
        class="calc-display"
        type="text"
        value="0"
        readonly
      >

      <div class="calc-buttons">

        <button onclick="calcClear()">C</button>
        <button onclick="calcInput('(')">(</button>
        <button onclick="calcInput(')')">)</button>
        <button class="operator" onclick="calcInput('/')">÷</button>

        <button onclick="calcInput('7')">7</button>
        <button onclick="calcInput('8')">8</button>
        <button onclick="calcInput('9')">9</button>
        <button class="operator" onclick="calcInput('*')">×</button>

        <button onclick="calcInput('4')">4</button>
        <button onclick="calcInput('5')">5</button>
        <button onclick="calcInput('6')">6</button>
        <button class="operator" onclick="calcInput('-')">−</button>

        <button onclick="calcInput('1')">1</button>
        <button onclick="calcInput('2')">2</button>
        <button onclick="calcInput('3')">3</button>
        <button class="operator" onclick="calcInput('+')">+</button>

        <button onclick="calcInput('0')">0</button>
        <button onclick="calcInput('.')">.</button>
        <button onclick="calcBackspace()">⌫</button>
        <button class="operator" onclick="calcResult()">=</button>

      </div>

    </div>
  `;
}


function getCalcDisplay() {
  return document.getElementById("calc-display");
}


function calcInput(value) {

  const display = getCalcDisplay();

  if (!display) return;

  if (display.value === "0") {
    display.value = value;
  } else {
    display.value += value;
  }
}


function calcClear() {

  const display = getCalcDisplay();

  if (display) {
    display.value = "0";
  }
}


function calcBackspace() {

  const display = getCalcDisplay();

  if (!display) return;

  display.value =
    display.value.slice(0, -1) || "0";
}


function calcResult() {

  const display = getCalcDisplay();

  if (!display) return;

  try {

    // Basic calculator expression validation
    if (!/^[0-9+\-*/().\s]+$/.test(display.value)) {
      throw new Error();
    }

    display.value =
      Function(`"use strict"; return (${display.value})`)();

  } catch {

    display.value = "Error";

    setTimeout(calcClear, 800);
  }
}


// ===============================
// Settings
// ===============================

function settingsApp() {

  return `
    <div class="settings">

      <div class="setting-card">

        <h3>🎨 Appearance</h3>

        <p>
          Customize the look and accent color of WebOS.
        </p>

        <div class="color-buttons">

          <button
            class="color-button blue"
            onclick="setAccent('#4f8cff')">
          </button>

          <button
            class="color-button purple"
            onclick="setAccent('#9b5cff')">
          </button>

          <button
            class="color-button green"
            onclick="setAccent('#2dbb78')">
          </button>

          <button
            class="color-button orange"
            onclick="setAccent('#f59e0b')">
          </button>

        </div>

      </div>

      <div class="setting-card">

        <h3>🌙 Theme</h3>

        <p>
          Switch between light and dark mode.
        </p>

        <button
          onclick="toggleTheme()"
          style="
            padding:10px 15px;
            border-radius:7px;
            background:var(--accent);
            color:white;
          "
        >
          Toggle Theme
        </button>

      </div>

      <div class="setting-card">

        <h3>💾 Storage</h3>

        <p>
          Browser local storage is being used for application data.
        </p>

      </div>

    </div>
  `;
}


// ===============================
// About
// ===============================

function aboutApp() {

  return `
    <div class="about">

      <div class="logo">💻</div>

      <h1>WebOS</h1>

      <p>
        A browser-based operating system interface.
      </p>

      <p>
        Version 1.0
      </p>

      <p>
        Built with HTML, CSS and JavaScript.
      </p>

    </div>
  `;
}


// ===============================
// Window controls
// ===============================

function setupWindow(win) {

  const titlebar =
    win.querySelector(".window-titlebar");

  const close =
    win.querySelector(".close");

  const minimize =
    win.querySelector(".minimize");

  const maximize =
    win.querySelector(".maximize");


  close.addEventListener("click", () => {

    const appName = win.dataset.app;

    win.remove();

    delete windows[appName];

    removeTaskbarButton(appName);

  });


  minimize.addEventListener("click", () => {

    win.classList.add("minimized");

    win.style.display = "none";

  });


  maximize.addEventListener("click", () => {

    win.classList.toggle("maximized");

  });


  win.addEventListener("mousedown", () => {

    focusWindow(win);

  });


  makeDraggable(
    win,
    titlebar
  );
}


// ===============================
// Focus window
// ===============================

function focusWindow(win) {

  zIndex++;

  win.style.zIndex = zIndex;

  document
    .querySelectorAll(".taskbar-app")
    .forEach(button => {

      button.classList.remove("active");

    });

  const button =
    document.querySelector(
      `.taskbar-app[data-app="${win.dataset.app}"]`
    );

  if (button) {
    button.classList.add("active");
  }
}


// ===============================
// Drag windows
// ===============================

function makeDraggable(win, handle) {

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;


  handle.addEventListener("mousedown", event => {

    if (
      event.target.closest(".window-controls")
    ) {
      return;
    }

    if (
      win.classList.contains("maximized")
    ) {
      return;
    }

    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    startLeft = win.offsetLeft;
    startTop = win.offsetTop;

    focusWindow(win);

    event.preventDefault();
  });


  document.addEventListener("mousemove", event => {

    if (!dragging) return;

    let newLeft =
      startLeft +
      event.clientX -
      startX;

    let newTop =
      startTop +
      event.clientY -
      startY;


    newLeft = Math.max(
      0,
      Math.min(
        window.innerWidth - 100,
        newLeft
      )
    );


    newTop = Math.max(
      0,
      Math.min(
        window.innerHeight - 100,
        newTop
      )
    );


    win.style.left =
      `${newLeft}px`;

    win.style.top =
      `${newTop}px`;
  });


  document.addEventListener("mouseup", () => {

    dragging = false;

  });
}


// ===============================
// Taskbar applications
// ===============================

function createTaskbarButton(appName) {

  const info = appInfo[appName];

  const button =
    document.createElement("button");

  button.className = "taskbar-app";

  button.dataset.app = appName;

  button.innerHTML =
    `${info.icon} ${info.title}`;

  button.addEventListener("click", () => {

    const win = windows[appName];

    if (!win) return;

    if (
      win.style.display === "none"
    ) {

      win.style.display = "flex";

      win.classList.remove("minimized");

      focusWindow(win);

      return;
    }

    if (
      parseInt(win.style.zIndex) === zIndex
    ) {

      win.style.display = "none";

      return;
    }

    focusWindow(win);

  });


  document
    .getElementById("taskbar-apps")
    .appendChild(button);
}


function removeTaskbarButton(appName) {

  const button =
    document.querySelector(
      `.taskbar-app[data-app="${appName}"]`
    );

  if (button) {
    button.remove();
  }
}


// ===============================
// Theme
// ===============================

const themeButton =
  document.getElementById("theme-button");


themeButton.addEventListener(
  "click",
  toggleTheme
);


function toggleTheme() {

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "webos-dark",
    dark
  );

  themeButton.textContent =
    dark ? "🌙" : "☀️";
}


if (
  localStorage.getItem("webos-dark") === "true"
) {
  document.body.classList.add("dark");
  themeButton.textContent = "🌙";
}


function setAccent(color) {

  document.documentElement.style
    .setProperty("--accent", color);

  document.documentElement.style
    .setProperty("--accent-hover", color);

  localStorage.setItem(
    "webos-accent",
    color
  );

  notify(
    "Appearance",
    "Accent color updated"
  );
}


const savedAccent =
  localStorage.getItem("webos-accent");

if (savedAccent) {

  document.documentElement.style
    .setProperty("--accent", savedAccent);

  document.documentElement.style
    .setProperty("--accent-hover", savedAccent);
}


// ===============================
// Clock
// ===============================

function updateClock() {

  const now = new Date();

  let hours =
    now.getHours();

  const minutes =
    String(now.getMinutes())
      .padStart(2, "0");

  const seconds =
    String(now.getSeconds())
      .padStart(2, "0");

  const ampm =
    hours >= 12 ? "PM" : "AM";

  hours =
    hours % 12 || 12;

  document.getElementById("time")
    .textContent =
      `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;


  const date =
    String(now.getDate()).padStart(2, "0")
    + "/" +
    String(now.getMonth() + 1).padStart(2, "0")
    + "/" +
    now.getFullYear();

  document.getElementById("date")
    .textContent = date;
}


updateClock();

setInterval(updateClock, 1000);


// ===============================
// Notifications
// ===============================

let notificationTimer;


function notify(title, message) {

  const notification =
    document.getElementById("notification");

  document.getElementById(
    "notification-title"
  ).textContent = title;

  document.getElementById(
    "notification-message"
  ).textContent = message;


  notification.classList.add("show");


  clearTimeout(notificationTimer);

  notificationTimer =
    setTimeout(() => {

      notification.classList.remove("show");

    }, 3000);
}


// ===============================
// Search
// ===============================

const search =
  document.getElementById("app-search");


search.addEventListener(
  "input",
  () => {

    const query =
      search.value.toLowerCase();

    document
      .querySelectorAll(".start-app")
      .forEach(app => {

        const text =
          app.textContent.toLowerCase();

        app.style.display =
          text.includes(query)
            ? "flex"
            : "none";

      });
  }
);


// ===============================
// Power button
// ===============================

document
  .getElementById("power-button")
  .addEventListener("click", () => {

    const desktop =
      document.getElementById("desktop");

    desktop.style.transition =
      "opacity .5s";

    desktop.style.opacity = "0";

    setTimeout(() => {

      desktop.innerHTML = `
        <div style="
          position:absolute;
          inset:0;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-direction:column;
          color:white;
          background:#090c14;
          text-align:center;
        ">

          <div style="font-size:70px">
            💻
          </div>

          <h1>WebOS</h1>

          <p style="margin:10px;opacity:.7">
            System is powered off.
          </p>

          <button
            onclick="location.reload()"
            style="
              margin-top:20px;
              padding:12px 20px;
              border:0;
              border-radius:8px;
              background:#4f8cff;
              color:white;
              cursor:pointer;
            "
          >
            Restart
          </button>

        </div>
      `;

      desktop.style.opacity = "1";

    }, 500);

  });


// ===============================
// Welcome notification
// ===============================

setTimeout(() => {

  notify(
    "Welcome to WebOS",
    "Your web desktop is ready."
  );

}, 800);
