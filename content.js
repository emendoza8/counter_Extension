// --- State ---
let buffer = "";
let count = 0;
let lastKeyTime = 0;

const trigger = "vvv";
const resetTrigger = "rrr";
const maxDelay = 500; // ms between key presses (adjust if needed)

// --- Load saved count ---
count = parseInt(localStorage.getItem("vvvCount")) || 0;

// --- Create overlay ---
const overlay = document.createElement("div");
overlay.id = "vvv-overlay";
overlay.innerText = `Count: ${count}`;
document.body.appendChild(overlay);

// --- Update display + persist ---
function updateDisplay() {
  overlay.innerText = `Count: ${count}`;
  localStorage.setItem("vvvCount", count);
}

// --- Animation ---
function animate() {
  overlay.classList.add("pop");
  setTimeout(() => overlay.classList.remove("pop"), 150);
}

// --- Key listener (IMPROVED) ---
window.addEventListener("keydown", (e) => {
  const now = Date.now();
  const key = e.key.toLowerCase();

  // Only track letters
  if (!/^[a-z]$/.test(key)) return;

  // Reset buffer if too slow
  if (now - lastKeyTime > maxDelay) {
    buffer = "";
  }

  lastKeyTime = now;

  // Append key (handles repeated keys like "vvv")
  buffer += key;

  // Keep buffer length under control
  if (buffer.length > trigger.length) {
    buffer = buffer.slice(-trigger.length);
  }

  // --- Trigger: Increment ---
  if (buffer === trigger) {
    count++;
    updateDisplay();
    animate();
    buffer = "";
  }

  // --- Trigger: Reset ---
  if (buffer === resetTrigger) {
    count = 0;
    updateDisplay();
    animate();
    buffer = "";
  }
});let buffer = "";
let count = 0;
let lastKeyTime = 0;

const trigger = "vvv";
const resetTrigger = "rrr";
const maxDelay = 400; // milliseconds between keys

// Load saved count
count = parseInt(localStorage.getItem("vvvCount")) || 0;

// Create overlay
const overlay = document.createElement("div");
overlay.id = "vvv-overlay";
overlay.innerText = `Count: ${count}`;
document.body.appendChild(overlay);

// Update + persist
function updateDisplay() {
  overlay.innerText = `Count: ${count}`;
  localStorage.setItem("vvvCount", count);
}

// Listen for ALL key presses (including inputs)
window.addEventListener("keydown", (e) => {
  const now = Date.now();

  // If too slow, reset buffer
  if (now - lastKeyTime > maxDelay) {
    buffer = "";
  }

  lastKeyTime = now;

  const key = e.key.toLowerCase();

  // Only track letters
  if (!/^[a-z]$/.test(key)) return;

  buffer += key;

  // Keep buffer size small
  if (buffer.length > trigger.length) {
    buffer = buffer.slice(-trigger.length);
  }

  // Increment
  if (buffer === trigger) {
    count++;
    updateDisplay();

    animate();
    buffer = "";
  }

  // Reset
  if (buffer === resetTrigger) {
    count = 0;
    updateDisplay();

    animate();
    buffer = "";
  }
});

// Simple animation
function animate() {
  overlay.classList.add("pop");
  setTimeout(() => overlay.classList.remove("pop"), 150);
}
