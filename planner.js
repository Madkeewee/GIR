"use strict";

const objectives = [
  ["R1", "Oil Refinery 1", "#ffb473"], ["R2", "Oil Refinery 2", "#f79b72"],
  ["R3", "Oil Refinery 3", "#e9cd70"], ["R4", "Oil Refinery 4", "#c9da78"],
  ["R5", "Oil Refinery 5", "#e3ace8"], ["R6", "Oil Refinery 6", "#f39cb4"],
  ["H", "Hospital standby", "#a8df9c"], ["M", "Military standby", "#ff9991"]
];
const duties = [
  "★ Primary alloy-ball carrier", "★ Backup alloy-ball carrier", "Carrier escort", "Carrier escort"
];
const form = document.querySelector("#roster");
const status = document.querySelector("#planner-status");
const plan = document.querySelector("#plan");
const message = document.querySelector("#plan-text");
const copyStatus = document.querySelector("#copy-status");
const format = new Intl.NumberFormat(undefined, {notation: "compact", maximumFractionDigits: 2});
const teamPicker = document.querySelector("#bgb-team");
const addPlayer = document.querySelector("#add-player");
const starterCount = document.querySelector("#starter-count");
const storageStatus = document.querySelector("#roster-storage-status");
const storageKey = "gir-bgb-roster-v1";
const rows = [];
let team = "A";

function addField(parent, title, placeholder) {
  const label = document.createElement("label");
  label.textContent = title;
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 60;
  input.placeholder = placeholder;
  label.append(input);
  parent.append(label);
  return input;
}

function addRosterRow({name = "", cp = "", A = false, B = false} = {}) {
  const row = document.createElement("div");
  row.className = "roster-row";
  document.querySelector("#players").append(row);
  const player = {
    name: addField(row, "Player name", "In-game name"),
    cp: addField(row, "CP", "e.g. 350M"),
    selected: {A, B}
  };
  player.name.value = name;
  player.cp.value = cp;
  const controls = document.createElement("div");
  controls.className = "roster-controls";
  const label = document.createElement("label");
  const starter = document.createElement("input");
  starter.type = "checkbox";
  starter.checked = player.selected[team];
  player.starter = starter;
  label.append(starter, "Starter");
  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Remove";
  controls.append(label, remove);
  row.append(controls);
  starter.addEventListener("input", () => { player.selected[team] = starter.checked; });
  remove.addEventListener("click", () => {
    const name = player.name.value.trim();
    if (name && !window.confirm(`Remove ${name} from the roster and both teams?`)) return;
    const index = rows.indexOf(player);
    rows.splice(index, 1);
    row.remove();
    (rows[index]?.name ?? rows[index - 1]?.name ?? addPlayer)?.focus();
    rosterChanged();
  });
  rows.push(player);
  return player;
}

function loadRoster() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(stored?.players) && stored.players.every(player =>
      typeof player?.name === "string" && typeof player.cp === "string" &&
      typeof player.A === "boolean" && typeof player.B === "boolean")) {
      team = stored.team === "B" ? "B" : "A";
      return stored.players;
    }
  } catch {
    if (storageStatus) storageStatus.textContent = "Saved roster could not be loaded.";
  }
  return Array.from({length: 20}, () => ({A: true}));
}

function showStarterCount() {
  if (starterCount) starterCount.textContent = `Team ${team} · ${rows.filter(row => row.selected[team]).length} / 20 starters`;
}

function rosterChanged() {
  plan.hidden = true;
  status.textContent = "";
  showStarterCount();
  try {
    const players = rows.map(row => ({ name: row.name.value, cp: row.cp.value, ...row.selected }));
    localStorage.setItem(storageKey, JSON.stringify({team, players}));
    if (storageStatus) storageStatus.textContent = "";
  } catch {
    if (storageStatus) storageStatus.textContent = "This browser could not save the roster. Keep the page open to retain your edits.";
  }
}

loadRoster().forEach(addRosterRow);
if (teamPicker) teamPicker.value = team;
showStarterCount();
teamPicker?.addEventListener("change", () => {
  team = teamPicker.value;
  rows.forEach(row => { row.starter.checked = row.selected[team]; });
  rosterChanged();
});
addPlayer?.addEventListener("click", () => {
  addRosterRow().name.focus();
  rosterChanged();
});
document.querySelector("#clear-starters")?.addEventListener("click", () => {
  rows.forEach(row => {
    row.selected[team] = false;
    row.starter.checked = false;
  });
  rosterChanged();
});

function readPower(input) {
  const match = input.trim().match(/^(\d+|\d{1,3}(?:,\d{3})+)(?:\.(\d+))?\s*([kmbgt])?$/i);
  if (!match) return NaN;
  const [, whole, fraction, suffix] = match;
  const scale = {k: 1e3, m: 1e6, b: 1e9, g: 1e9, t: 1e12};
  const cp = Number(whole.replaceAll(",", "") + (fraction ? "." + fraction : "")) * (scale[suffix?.toLowerCase()] ?? 1);
  return Number.isFinite(cp) && cp > 0 && cp <= 1e12 ? Math.round(cp) || NaN : NaN;
}

function assign(players) {
  const ranked = [...players].sort((a, b) => b.cp - a.cp || a.name.localeCompare(b.name));
  const floaters = ranked.slice(0, 4);
  const defenders = ranked.slice(4);
  // Pair the strongest remaining player with the weakest to even out combined CP.
  const pairs = objectives.map((_, index) => [
    defenders[index], defenders[defenders.length - 1 - index]
  ]);
  return {pairs, floaters};
}

function card([marker, title, color], lines, summary) {
  const article = document.createElement("article");
  article.style.setProperty("--assignment-color", color);
  const heading = document.createElement("h3");
  const badge = document.createElement("span");
  badge.className = "bgb-marker";
  badge.textContent = marker;
  heading.append(badge, title);
  const detail = document.createElement("p");
  detail.textContent = summary;
  const list = document.createElement("ul");
  lines.forEach((line, index) => {
    const item = document.createElement("li");
    if (marker === "F" && index < 2) item.className = "bgb-carrier";
    item.textContent = line;
    list.append(item);
  });
  article.append(heading, detail, list);
  return article;
}

const open = document.querySelector("#open-bgb");
open?.addEventListener("click", () => {
  const panel = document.querySelector("#bgb");
  panel.hidden = !panel.hidden;
  open.setAttribute("aria-expanded", String(!panel.hidden));
});

form.addEventListener("input", event => {
  if (event.target !== teamPicker) rosterChanged();
});
form.addEventListener("submit", event => {
  event.preventDefault();
  const names = new Set();
  const starters = rows.filter(row => row.selected[team]);
  if (starters.length !== 20) {
    status.textContent = `Select exactly 20 starters for Team ${team}. You selected ${starters.length}.`;
    return;
  }
  const players = [];
  for (const [index, row] of starters.entries()) {
    const name = row.name.value.trim();
    const cp = readPower(row.cp.value);
    if (!name || names.has(name.toLowerCase()) || !Number.isFinite(cp)) {
      status.textContent = `Starter ${index + 1} needs a unique name and positive CP. Example: 350M.`;
      (!name || names.has(name.toLowerCase()) ? row.name : row.cp).focus();
      return;
    }
    names.add(name.toLowerCase());
    players.push({name, cp});
  }
  const {pairs, floaters} = assign(players);
  const label = player => `${player.name} (${format.format(player.cp)} CP)`;
  const floatLines = floaters.map((player, index) => `Floater ${index + 1} · ${label(player)} — ${duties[index]}`);
  const cards = pairs.map((members, index) => {
    const cp = members[0].cp + members[1].cp;
    const timing = index < 6 ? "Hold refinery" : "Stage nearby until it opens";
    return card(objectives[index], members.map(label), `${timing} · ${format.format(cp)} CP`);
  });
  cards.push(card(["F", "Floaters", "#a3d6ff"], floatLines, "Stage near the Rare Earth Factory."));
  document.querySelector("#squads").replaceChildren(...cards);
  message.value = [
    `GIR BGB PLAN · Team ${team} · Lower-left start`,
    ...pairs.map((members, index) => {
      const [marker, title] = objectives[index];
      return `${marker} | ${title}: ${members.map(label).join(", ")}`;
    }),
    "F | Floaters",
    ...floatLines,
    "Hospital and Military pairs stage nearby and wait for their objectives to open. Floaters stage before alloy spawns. Floaters 3 and 4 escort the active carrier to HQ."
  ].join("\n");
  plan.hidden = false;
  status.textContent = `Assigned all 20 Team ${team} starters.`;
  copyStatus.textContent = "";
});

document.querySelector("#copy-plan").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    copyStatus.textContent = "Copied. Paste the plan into alliance chat.";
  } catch {
    message.focus();
    message.select();
    copyStatus.textContent = "Plan selected. Use your device’s Copy command.";
  }
});

