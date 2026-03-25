// --- State ---
let count = 0;
let lastKey = "";
let repeatCount = 0;
let lastKeyTime = 0;

const maxDelay = 600;

// --- Drag state ---
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// --- Create overlay ---
const overlay = document.createElement("div");
overlay.id = "vvv-overlay";
overlay.innerText = "Count: loading...";
document.body.appendChild(overlay);

// --- Update display ---
function updateDisplay() {
  overlay.innerText = `Count: ${count}`;
}

// --- Save count globally ---
function saveCount() {
  chrome.storage.local.set({ vvvCount: count });
}

// --- Save position ---
function savePosition(x, y) {
  chrome.storage.local.set({ overlayX: x, overlayY: y });
}

// --- Animation ---
function animate() {
  overlay.classList.add("pop");
  setTimeout(() => overlay.classList.remove("pop"), 150);
}

// --- Load initial state ---
chrome.storage.local.get(["vvvCount", "overlayX", "overlayY"], (result) => {
  count = result.vvvCount || 0;
  updateDisplay();

  // Restore position if exists
  if (result.overlayX !== undefined && result.overlayY !== undefined) {
    overlay.style.left = result.overlayX + "px";
    overlay.style.top = result.overlayY + "px";
    overlay.style.right = "auto";
  }
});

// --- Sync across tabs ---
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.vvvCount) {
      count = changes.vvvCount.newValue;
      updateDisplay();
    }
    if (changes.overlayX && changes.overlayY) {
      overlay.style.left = changes.overlayX.newValue + "px";
      overlay.style.top = changes.overlayY.newValue + "px";
      overlay.style.right = "auto";
    }
  }
});

// --- Drag handlers ---
overlay.addEventListener("mousedown", (e) => {
  isDragging = true;

  const rect = overlay.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  overlay.style.cursor = "grabbing";
  overlay.style.pointerEvents = "auto"; // enable interaction while dragging
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;

  overlay.style.left = x + "px";
  overlay.style.top = y + "px";
  overlay.style.right = "auto";
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;

  isDragging = false;
  overlay.style.cursor = "grab";

  const rect = overlay.getBoundingClientRect();
  savePosition(rect.left, rect.top);
});

// --- Key listener ---
window.addEventListener("keydown", (e) => {
  const now = Date.now();
  const key = e.key.toLowerCase();

  if (!/^[a-z]$/.test(key)) return;

  if (now - lastKeyTime > maxDelay) {
    repeatCount = 0;
    lastKey = "";
  }

  lastKeyTime = now;

  if (key === lastKey) {
    repeatCount++;
  } else {
    lastKey = key;
    repeatCount = 1;
  }

  if (repeatCount === 3) {
    if (key === "i") count++;
    else if (key === "d") count--;
    else if (key === "r") count = 0;
    else return;

    updateDisplay();
    saveCount();
    animate();

    repeatCount = 0;
    lastKey = "";
  }
});