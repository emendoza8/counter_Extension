// --- State ---
let count = 0;
let lastKey = "";
let repeatCount = 0;
let lastKeyTime = 0;

const maxDelay = 600; // ms between presses

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

// --- Animation ---
function animate() {
  overlay.classList.add("pop");
  setTimeout(() => overlay.classList.remove("pop"), 150);
}

// --- Load initial count ---
chrome.storage.local.get(["vvvCount"], (result) => {
  count = result.vvvCount || 0;
  updateDisplay();
});

// --- Sync across tabs ---
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.vvvCount) {
    count = changes.vvvCount.newValue;
    updateDisplay();
  }
});

// --- Key listener (RELIABLE VERSION) ---
window.addEventListener("keydown", (e) => {
  const now = Date.now();
  const key = e.key.toLowerCase();

  // Only letters
  if (!/^[a-z]$/.test(key)) return;

  // Reset if too slow
  if (now - lastKeyTime > maxDelay) {
    repeatCount = 0;
    lastKey = "";
  }

  lastKeyTime = now;

  // Track repeats
  if (key === lastKey) {
    repeatCount++;
  } else {
    lastKey = key;
    repeatCount = 1;
  }

  // --- TRIGGERS ---
  if (repeatCount === 3) {
    if (key === "i") {
      count++;
    } else if (key === "d") {
      count--;
    } else if (key === "r") {
      count = 0;
    } else {
      return;
    }

    updateDisplay();
    saveCount();
    animate();

    // Reset so holding key doesn't spam infinitely
    repeatCount = 0;
    lastKey = "";
  }
});