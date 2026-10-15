import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/fraunces/latin-400.css";
import "@fontsource/fraunces/latin-500.css";
import {
  createIcons,
  Palmtree,
  PawPrint,
  Leaf,
  Hammer,
  Search,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Undo2,
  Volume2,
  VolumeX,
  Settings2,
  Check,
  MousePointer2,
  Move,
  RotateCcw,
  Sun,
  CloudSun,
  CloudRain,
  Moon,
  X,
  CircleHelp,
  Trash2,
  Download,
  Upload,
  Heart,
  Play,
  Pause,
  Trees,
  Compass,
  Expand,
  Save,
  Sparkles,
  ArrowLeft,
  RotateCw,
  CheckCheck,
} from "lucide";
import { IslandWorld, CATALOG, islandRadius } from "./world.js";
import "./style.css";

const iconSet = {
  Palmtree,
  PawPrint,
  Leaf,
  Hammer,
  Search,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Undo2,
  Volume2,
  VolumeX,
  Settings2,
  Check,
  MousePointer2,
  Move,
  RotateCcw,
  Sun,
  CloudSun,
  CloudRain,
  Moon,
  X,
  CircleHelp,
  Trash2,
  Download,
  Upload,
  Heart,
  Play,
  Pause,
  Trees,
  Compass,
  Expand,
  Save,
  Sparkles,
  ArrowLeft,
  RotateCw,
  CheckCheck,
};
const icon = (name, cls = "") =>
  `<i data-lucide="${name}" ${cls ? `class="${cls}"` : ""}></i>`;
const refreshIcons = () =>
  createIcons({ icons: iconSet, attrs: { "stroke-width": 1.65 } });
const $ = (s) => document.querySelector(s);
let category = "animals",
  query = "",
  selected = null,
  inspected = null,
  thumbnails = {},
  toastTimer,
  audio = null,
  soundOn = false,
  world;

$("#app").innerHTML = `
  <aside class="sidebar" aria-label="Creation catalog">
    <div class="sidebar-header">
      <a class="brand" href="./" aria-label="Isola home"><span class="brand-mark">${icon("palmtree")}</span><span>isola<span class="brand-dot">.</span></span></a>
      <button class="icon-button sidebar-close" aria-label="Close catalog">${icon("x")}</button>
      <span class="brand-caption">a world of your own</span>
    </div>
    <div class="sidebar-intro"><h1>Your world,<br>your rules.</h1><p>A little island. Endless possibilities.</p></div>
    <nav class="catalog-tabs" aria-label="Object categories">
      <button data-category="animals" class="active" aria-pressed="true">${icon("paw-print")}<span>Animals</span></button>
      <button data-category="nature" aria-pressed="false">${icon("leaf")}<span>Nature</span></button>
      <button data-category="build" aria-pressed="false">${icon("hammer")}<span>Build</span></button>
    </nav>
    <label class="search-box">${icon("search")}<input id="catalog-search" type="search" placeholder="Find your next island friend…" autocomplete="off" aria-label="Search catalog"><kbd>/</kbd></label>
    <div class="catalog-heading"><h2 id="catalog-title">A little more life</h2><span id="catalog-count">8 animals</span></div>
    <div class="catalog-scroll"><div class="catalog-grid" id="catalog"></div><p class="catalog-empty" hidden>No island friends found.<br>Try a different search.</p>
      <div class="catalog-hint">${icon("mouse-pointer-2")}<p>Pick a friend, then click<br>anywhere on your island.</p></div>
    </div>
    <div class="sidebar-footer"><div class="ecosystem"><span class="ecosystem-symbol">${icon("sprout")}</span><div><strong>A happy little ecosystem</strong><span>Good things grow together.</span></div><span class="status-dot"></span></div>
      <div class="island-stats"><span>${icon("paw-print")}<b id="animal-count">15</b> animals</span><span>${icon("trees")}<b id="tree-count">0</b> trees</span></div>
      <button class="help-link" id="help-button">${icon("circle-help")}<span>A little help getting started</span><kbd>?</kbd></button>
    </div>
  </aside>
  <main class="playground">
    <div id="world"></div>
    <header class="world-header">
      <div class="world-name"><span class="island-avatar">${icon("palmtree")}</span><div><h2>Crescent Cove</h2><p><span class="status-dot"></span><span id="save-status">Your own little world</span></p></div></div>
      <div class="header-actions"><button class="icon-button" id="undo" title="Undo (Ctrl+Z)" aria-label="Undo last change">${icon("undo-2")}</button><button class="icon-button" id="sound" title="Turn on island sounds" aria-label="Turn on island sounds" aria-pressed="false">${icon("volume-x")}</button><button class="icon-button" id="settings" aria-label="World settings" aria-expanded="false">${icon("settings-2")}</button><span class="action-divider"></span><button class="save-button" id="save">${icon("save")}<span>Save island</span></button></div>
    </header>
    <div class="world-message"><span class="little-line"></span><p>Slow down.<br>Let a little wild in.</p><span>There’s no wrong way to play.</span></div>
    <div class="weather-wrap"><button class="weather-badge" id="weather" aria-label="Weather and time" aria-expanded="false"><span class="weather-icon">${icon("sun")}</span><span><b id="weather-name">A little sunshine</b><small id="time-label">Day 1 · 10:00 AM</small></span>${icon("chevron-down")}</button></div>
    <div class="weather-panel floating-panel" id="weather-panel" hidden><div class="panel-heading"><h3>Set the mood</h3><button class="mini-button" data-close="weather-panel" aria-label="Close weather settings">${icon("x")}</button></div><p>A change of weather, a whole new world.</p><div class="weather-options"><button data-weather="sunny" class="active">${icon("sun")}Sunny</button><button data-weather="cloudy">${icon("cloud-sun")}Cloudy</button><button data-weather="rainy">${icon("cloud-rain")}Rainy</button></div><button id="night" class="setting-toggle">${icon("moon")}<span>Under the stars</span><span class="switch" role="switch" aria-checked="false"></span></button><div class="speed-setting"><span>Island pace</span><div><button data-speed="1" class="active">1×</button><button data-speed="2">2×</button><button data-speed="4">4×</button></div></div></div>
    <div class="settings-panel floating-panel" id="settings-panel" hidden><div class="panel-heading"><h3>Your island</h3><button class="mini-button" data-close="settings-panel" aria-label="Close settings">${icon("x")}</button></div><p>Keep a little piece of paradise.</p><button id="export-world" class="menu-action">${icon("download")}Download world${icon("arrow-up-right")}</button><button id="import-world" class="menu-action">${icon("upload")}Open a saved world${icon("chevron-right")}</button><button id="reset-world" class="menu-action danger">${icon("rotate-ccw")}Start a fresh island${icon("chevron-right")}</button><span class="local-note">Your island saves automatically on this device.</span><input type="file" id="import-file" accept="application/json,.json" hidden></div>
    <div class="inspector floating-panel" id="inspector" hidden></div>
    <div class="placement-label" id="placement-label" hidden>${icon("plus")}<span></span><button id="rotate-placement" title="Rotate (R)" aria-label="Rotate object">${icon("rotate-cw")}</button><button id="cancel-placement" title="Cancel (Escape)" aria-label="Cancel placement">${icon("x")}</button></div>
    <div class="bottom-left"><span class="sandbox-badge"><span class="status-dot"></span>Sandbox mode<span class="infinity">∞</span></span><span class="camera-hint">${icon("move")}Drag to explore<span>·</span>Scroll to zoom</span></div>
    <div class="bottom-controls"><div class="toolbox" role="toolbar" aria-label="Island tools"><button class="tool active" data-tool="explore" aria-pressed="true" title="Explore (1)">${icon("mouse-pointer-2")}<span>Explore</span><kbd>1</kbd></button><button class="tool" data-tool="place" aria-pressed="false" title="Place (2)">${icon("plus")}<span>Place</span><kbd>2</kbd></button><button class="tool" data-tool="remove" aria-pressed="false" title="Remove (3)">${icon("trash-2")}<span>Remove</span><kbd>3</kbd></button><span class="tool-divider"></span><button class="pause-tool" id="pause" aria-label="Pause wildlife" title="Pause wildlife (Space)">${icon("pause")}</button></div><span class="toolbar-caption" id="toolbar-caption">A little imagination goes a long way.</span></div>
    <div class="map-area"><button class="compass" id="reset-camera" aria-label="Reset camera" title="Reset view"><span>N</span>${icon("compass")}</button><div class="minimap"><canvas id="minimap" width="220" height="160" aria-label="Live overhead island map"></canvas><span>CRESCENT COVE</span><span class="map-corner"></span></div></div>
    <div class="zoom-control"><button id="zoom-in" aria-label="Zoom in">${icon("plus")}</button><span></span><button id="zoom-out" aria-label="Zoom out">${icon("minus")}</button><span></span><button id="fit-view" aria-label="Fit island to view">${icon("expand")}</button></div>
    <button class="mobile-catalog" id="mobile-catalog">${icon("paw-print")}<span>Make it yours</span>${icon("plus")}</button>
    <div class="toast" id="toast" role="status" aria-live="polite" hidden>${icon("check")}<span></span></div>
    <div class="loading" id="loading"><span class="brand-mark">${icon("palmtree")}</span><h2>A little world is waking up.</h2><span class="loading-line"></span></div>
  </main>
  <dialog id="help-dialog"><button class="dialog-close icon-button" aria-label="Close help">${icon("x")}</button><span class="dialog-mark">${icon("palmtree")}</span><h2>Make yourself at home.</h2><p>This is your little island. Fill it with life,<br>follow your curiosity, and take your time.</p><div class="help-steps"><div>${icon("paw-print")}<span><b>Bring your world to life</b>Pick an animal, plant, or building. Click the island to place it. Press R to rotate.</span></div><div>${icon("move")}<span><b>Find a new perspective</b>Drag to orbit. Right-drag to pan. Scroll or pinch to get a closer look.</span></div><div>${icon("heart")}<span><b>Get to know the neighbors</b>Choose Explore, then click an animal to meet and feed it.</span></div><div>${icon("save")}<span><b>Keep your little paradise</b>Your world saves here automatically. Download a copy in Settings to take it with you.</span></div></div><div class="shortcuts"><span><kbd>1</kbd> Explore</span><span><kbd>2</kbd> Place</span><span><kbd>3</kbd> Remove</span><span><kbd>Space</kbd> Pause</span></div><button class="primary-button" id="start-playing">Let’s make something ${icon("arrow-up-right")}</button></dialog>
  <dialog id="reset-dialog"><span class="dialog-mark">${icon("rotate-ccw")}</span><h2>A fresh beginning?</h2><p>This replaces your current island. Download a copy first if you’d like to keep it.</p><div class="dialog-actions"><button class="secondary-button" id="cancel-reset">Keep this island</button><button class="primary-button" id="confirm-reset">Start fresh</button></div></dialog>
`;

// A sprout is deliberately drawn as part of the same compact stroke icon set.
const sprout = $('[data-lucide="sprout"]');
if (sprout)
  sprout.outerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-8M12 14C5 14 4 9 4 5c5 0 8 2 8 9ZM12 11c0-6 4-8 8-8 0 5-2 8-8 8ZM7 20h10"/></svg>';
refreshIcons();

function toast(message) {
  $("#toast span").textContent = message;
  $("#toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 3600);
}
function setStats(stats) {
  $("#animal-count").textContent = stats.animals;
  $("#tree-count").textContent = stats.trees;
}
function updateMode(mode, type) {
  document.querySelectorAll("[data-tool]").forEach((b) => {
    b.classList.toggle("active", b.dataset.tool === mode);
    b.setAttribute("aria-pressed", b.dataset.tool === mode);
  });
  $("#placement-label").hidden = mode === "explore";
  if (mode === "place" && type) {
    selected = type;
    $("#placement-label > span").textContent =
      `Placing ${world.item(type).name.toLowerCase()}`;
    $("#rotate-placement").hidden = false;
    $("#toolbar-caption").textContent =
      "Click the island to place · R to rotate · Esc to finish";
  } else if (mode === "remove") {
    $("#placement-label > span").textContent = "Click an object to remove it";
    $("#rotate-placement").hidden = true;
    $("#toolbar-caption").textContent = "Click to remove · Ctrl + Z to undo";
  } else {
    $("#toolbar-caption").textContent = "A little imagination goes a long way.";
  }
  document.querySelectorAll(".catalog-card").forEach((b) => {
    const active = mode === "place" && b.dataset.item === type;
    b.classList.toggle("selected", active);
    b.setAttribute("aria-pressed", active);
  });
  $("#inspector").hidden = true;
}
function updateWeather(weather, night) {
  const names = {
    sunny: "A little sunshine",
    cloudy: "Soft skies ahead",
    rainy: "A little rain, a lot of life",
  };
  $("#weather-name").textContent = night ? "Under the stars" : names[weather];
  $("#time-label").textContent = night ? "Day 1 · 9:00 PM" : "Day 1 · 10:00 AM";
  $(".weather-icon").innerHTML = icon(
    night
      ? "moon"
      : weather === "sunny"
        ? "sun"
        : weather === "cloudy"
          ? "cloud-sun"
          : "cloud-rain",
  );
  document
    .querySelectorAll("[data-weather]")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.weather === weather),
    );
  $("#night .switch").classList.toggle("on", night);
  $("#night .switch").setAttribute("aria-checked", night);
  $(".playground").classList.toggle("night", night);
  refreshIcons();
}
function drawMinimap(entities, camera) {
  const c = $("#minimap"),
    ctx = c.getContext("2d"),
    w = c.width,
    h = c.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#c0ddcf";
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h / 2 + 5);
  ctx.scale(3.6, 3.6);
  ctx.rotate(-0.22);
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const a = (i / 100) * Math.PI * 2,
      r = islandRadius(a);
    const x = Math.cos(a) * r,
      z = Math.sin(a) * r * 0.87;
    if (i === 0) ctx.moveTo(x, z);
    else ctx.lineTo(x, z);
  }
  ctx.fillStyle = "#eee2b8";
  ctx.fill();
  ctx.save();
  ctx.scale(0.89, 0.89);
  ctx.fillStyle = "#a3b77d";
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#8fa374";
  ctx.beginPath();
  ctx.ellipse(-1, -5, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9ccbb9";
  ctx.beginPath();
  ctx.ellipse(7, 3, 2.5, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const e of entities) {
    if (e.animal) {
      ctx.fillStyle = "#f7f3d9";
      ctx.beginPath();
      ctx.arc(
        e.model.position.x,
        e.model.position.z * 0.87,
        0.3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    } else if (["pine", "palm", "oak"].includes(e.type)) {
      ctx.fillStyle = "#5f8358";
      ctx.beginPath();
      ctx.arc(
        e.model.position.x,
        e.model.position.z * 0.87,
        0.43,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    } else if (e.type === "cabin") {
      ctx.fillStyle = "#a78158";
      ctx.fillRect(e.x - 1, e.z - 1, 2, 1.6);
    }
  }
  ctx.restore();
}
function renderCatalog() {
  const items = CATALOG[category].filter((x) =>
    `${x.name} ${x.note}`.toLowerCase().includes(query.toLowerCase()),
  );
  const labels = {
    animals: [
      "A little more life",
      "animals",
      "Find your next island friend…",
      "Pick a friend, then click<br>anywhere on your island.",
    ],
    nature: [
      "Let good things grow",
      "objects",
      "Find a little greenery…",
      "Pick something green, then<br>find its place on your island.",
    ],
    build: [
      "Make yourself at home",
      "objects",
      "Find a place to call home…",
      "Pick a little something, then<br>make room on your island.",
    ],
  };
  const [heading, noun, placeholder, hint] = labels[category];
  $("#catalog-title").textContent = heading;
  $("#catalog-count").textContent = `${items.length} ${noun}`;
  $("#catalog-search").placeholder = placeholder;
  $(".catalog-hint p").innerHTML = hint;
  $("#catalog").innerHTML = items
    .map(
      (item) =>
        `<button class="catalog-card ${world?.mode === "place" && selected === item.id ? "selected" : ""}" data-item="${item.id}" aria-label="Place ${item.name}" aria-pressed="${world?.mode === "place" && selected === item.id}" title="${item.note}"><span class="card-art"><img src="${thumbnails[item.id] ?? ""}" alt="" draggable="false"><span class="card-add">${icon("plus")}</span></span><span class="card-name">${item.name}</span><span class="card-kind">${category === "animals" ? "Wildlife" : category === "nature" ? "Nature" : "Island living"}</span></button>`,
    )
    .join("");
  $(".catalog-empty").hidden = items.length > 0;
  refreshIcons();
  document.querySelectorAll("[data-item]").forEach((b) =>
    b.addEventListener("click", () => {
      selected = b.dataset.item;
      world.setMode("place", selected);
      if (innerWidth <= 760) closeCatalog();
    }),
  );
}
function closeCatalog() {
  if (innerWidth <= 760) $("#world canvas")?.focus({ preventScroll: true });
  $(".sidebar").classList.remove("mobile-open");
}
function inspect(entity) {
  inspected = entity;
  const item = world.item(entity.type),
    panel = $("#inspector");
  panel.innerHTML = `<button class="mini-button inspector-close" aria-label="Close object details">${icon("x")}</button><img src="${thumbnails[entity.type]}" alt=""><div class="inspector-description"><h3>${item.name}</h3><p>${item.note}</p>${entity.animal ? `<div class="animal-mood"><span class="status-dot"></span>${entity.fed ? "Happy & well-fed" : "Happy & exploring"}</div><button class="feed-button" id="feed">${icon("heart")}${entity.fed ? "Give a little more love" : "Offer a little snack"}</button>` : `<span class="object-note">Made at home on Crescent Cove.</span>`}</div>`;
  panel.hidden = false;
  refreshIcons();
  $(".inspector-close").addEventListener("click", () => (panel.hidden = true));
  $("#feed")?.addEventListener("click", () => {
    world.feed(entity);
    inspect(entity);
    toast(`${item.name} loved that. A happy little neighbor!`);
  });
}

try {
  world = new IslandWorld($("#world"), {
    toast,
    stats: setStats,
    mode: updateMode,
    weather: updateWeather,
    minimap: drawMinimap,
    inspect,
    closeInspect: () => ($("#inspector").hidden = true),
    dirty: () =>
      ($("#save-status").textContent = "A little change, a little magic"),
    saved: () => {
      $("#save-status").textContent = "All your little changes, saved";
      $("#save").classList.add("saved");
      setTimeout(() => $("#save").classList.remove("saved"), 1600);
    },
    placed: (entity) => {
      toast(`${world.item(entity.type).name} added. Make yourself at home.`);
    },
  });
  // Accessible to functional smoke tests without relying on WebGL pixel recognition.
  window.isola = world;
  thumbnails = world.thumbnails();
  renderCatalog();
  setStats(world.stats());
  setTimeout(() => {
    $("#loading").classList.add("loaded");
    setTimeout(() => $("#loading").remove(), 700);
  }, 450);
} catch (error) {
  console.error(error);
  $("#loading").innerHTML =
    `<span class="brand-mark">${icon("palmtree")}</span><h2>Your island needs a little more room.</h2><p>WebGL couldn’t start. Enable hardware acceleration<br>in your browser and reload to step onto your island.</p><button class="primary-button" id="reload">Try again</button>`;
  $("#reload").addEventListener("click", () => location.reload());
  refreshIcons();
}

document.querySelectorAll("[data-category]").forEach((b) =>
  b.addEventListener("click", () => {
    category = b.dataset.category;
    query = "";
    $("#catalog-search").value = "";
    document.querySelectorAll("[data-category]").forEach((t) => {
      t.classList.toggle("active", t === b);
      t.setAttribute("aria-pressed", t === b);
    });
    renderCatalog();
  }),
);
$("#catalog-search").addEventListener("input", (e) => {
  query = e.target.value;
  renderCatalog();
});
document.querySelectorAll("[data-tool]").forEach((b) =>
  b.addEventListener("click", () => {
    if (!world) return;
    if (b.dataset.tool === "place") {
      if (!selected) {
        selected = CATALOG[category][0].id;
      }
      world.setMode("place", selected);
    } else world.setMode(b.dataset.tool);
  }),
);
$("#undo").addEventListener("click", () => world?.undo());
$("#save").addEventListener("click", () => world?.save());
$("#cancel-placement").addEventListener("click", () =>
  world.setMode("explore"),
);
$("#rotate-placement").addEventListener("click", () => {
  world.placementRotation += Math.PI / 4;
  toast("Turned 45° · Click to place");
});
$("#zoom-in").addEventListener("click", () => world?.zoom(1));
$("#zoom-out").addEventListener("click", () => world?.zoom(-1));
$("#fit-view").addEventListener("click", () => world?.resetCamera());
$("#reset-camera").addEventListener("click", () => world?.resetCamera());
function togglePause() {
  if (!world) return;
  world.paused = !world.paused;
  $("#pause").innerHTML = icon(world.paused ? "play" : "pause");
  $("#pause").setAttribute(
    "aria-label",
    world.paused ? "Resume wildlife" : "Pause wildlife",
  );
  $("#pause").classList.toggle("is-paused", world.paused);
  refreshIcons();
  toast(
    world.paused
      ? "A moment of stillness. Island paused."
      : "And the little world goes on.",
  );
}
$("#pause").addEventListener("click", togglePause);
function togglePanel(id, button) {
  const open = $(`#${id}`).hidden;
  document
    .querySelectorAll(".floating-panel")
    .forEach((p) => (p.hidden = true));
  $("#weather").setAttribute("aria-expanded", "false");
  $("#settings").setAttribute("aria-expanded", "false");
  $(`#${id}`).hidden = !open;
  $(button).setAttribute("aria-expanded", open);
}
$("#weather").addEventListener("click", () =>
  togglePanel("weather-panel", "#weather"),
);
$("#settings").addEventListener("click", () =>
  togglePanel("settings-panel", "#settings"),
);
document.querySelectorAll("[data-close]").forEach((b) =>
  b.addEventListener("click", () => {
    const id = b.dataset.close;
    $(`#${id}`).hidden = true;
    $(id === "weather-panel" ? "#weather" : "#settings").setAttribute(
      "aria-expanded",
      "false",
    );
  }),
);
document.querySelectorAll("[data-weather]").forEach((b) =>
  b.addEventListener("click", () => {
    world.setWeather(b.dataset.weather);
    world.changed();
  }),
);
$("#night").addEventListener("click", () => {
  world.setNight(!world.night);
  world.changed();
});
document.querySelectorAll("[data-speed]").forEach((b) =>
  b.addEventListener("click", () => {
    world.speed = Number(b.dataset.speed);
    document
      .querySelectorAll("[data-speed]")
      .forEach((x) => x.classList.toggle("active", x === b));
  }),
);
$("#export-world").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(world.snapshot(), null, 2)], {
      type: "application/json",
    }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "crescent-cove.isola.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast("A little piece of paradise, ready to keep.");
});
$("#import-world").addEventListener("click", () => $("#import-file").click());
$("#import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1024 * 1024)
      throw new Error(
        "This world file is too large. Choose an Isola file under 1 MB.",
      );
    const data = world.validate(JSON.parse(await file.text()));
    world.load(data);
    world.save(false);
    $("#settings-panel").hidden = true;
    toast("Welcome back. Your island is right here.");
  } catch (err) {
    toast(
      err instanceof SyntaxError
        ? "That file couldn’t be read. Choose a downloaded Isola JSON world."
        : err.message,
    );
  }
  e.target.value = "";
});
$("#reset-world").addEventListener("click", () => {
  $("#settings-panel").hidden = true;
  $("#reset-dialog").showModal();
});
$("#cancel-reset").addEventListener("click", () => $("#reset-dialog").close());
$("#confirm-reset").addEventListener("click", () => {
  world.reset();
  $("#reset-dialog").close();
  toast("A fresh island. A new little beginning.");
});
$("#help-button").addEventListener("click", () =>
  $("#help-dialog").showModal(),
);
$(".dialog-close").addEventListener("click", () => $("#help-dialog").close());
$("#start-playing").addEventListener("click", () => $("#help-dialog").close());
document.querySelectorAll("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  }),
);
$("#mobile-catalog").addEventListener("click", () =>
  $(".sidebar").classList.add("mobile-open"),
);
$(".sidebar-close").addEventListener("click", () => closeCatalog());

function startAudio() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate),
    channel = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < channel.length; i++) {
    last = (last + Math.random() * 0.02 - 0.01) * 0.99;
    channel[i] = last * 3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 650;
  const gain = ctx.createGain();
  gain.gain.value = 0.12;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
  return ctx;
}
$("#sound").addEventListener("click", async () => {
  try {
    if (!audio) audio = startAudio();
    soundOn = !soundOn;
    if (soundOn) await audio.resume();
    else await audio.suspend();
    $("#sound").innerHTML = icon(soundOn ? "volume-2" : "volume-x");
    $("#sound").setAttribute("aria-pressed", soundOn);
    $("#sound").setAttribute(
      "aria-label",
      soundOn ? "Turn off island sounds" : "Turn on island sounds",
    );
    $("#sound").title = soundOn
      ? "Turn off island sounds"
      : "Turn on island sounds";
    refreshIcons();
    toast(
      soundOn ? "A little ocean, just for you." : "Island sounds turned off.",
    );
  } catch {
    toast("Sounds aren’t available in this browser.");
  }
});

document.addEventListener("keydown", (e) => {
  if (!world || e.target.matches("input,textarea") || $("dialog[open]")) return;
  if (e.key === "Escape") {
    world.setMode("explore");
    closeCatalog();
    document
      .querySelectorAll(".floating-panel")
      .forEach((p) => (p.hidden = true));
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    world.undo();
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "1") world.setMode("explore");
  if (e.key === "2")
    world.setMode("place", selected ?? CATALOG[category][0].id);
  if (e.key === "3") world.setMode("remove");
  if (e.key === " " && !e.target.matches("button")) {
    e.preventDefault();
    togglePause();
  }
  if (e.key === "?") $("#help-dialog").showModal();
  if (e.key === "/" && !e.target.matches("button")) {
    e.preventDefault();
    $("#catalog-search").focus();
  }
  if (e.key.toLowerCase() === "r" && world.mode === "place")
    $("#rotate-placement").click();
  if (e.key === "+" || e.key === "=") world.zoom(1);
  if (e.key === "-") world.zoom(-1);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) world?.save(false);
});
window.addEventListener("beforeunload", () => world?.save(false));
