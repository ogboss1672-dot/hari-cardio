/* ============================================================
   Heart Disease Prediction System – Main JavaScript
   Custom cursor · Particles · Scroll · Form · Firebase
   ============================================================ */

// ═══════════════════════════════════════════════════════════
// 🔥 FIREBASE CONFIGURATION
// ═══════════════════════════════════════════════════════════
// TODO: Replace with YOUR Firebase project config
const firebaseConfig = {
  apiKey:            "AIzaSyDZ3CKkMVRFqQv5jjEZHtxB9v5Pni3wUb4",
  authDomain:        "disease-prediction-ff405.firebaseapp.com",
  projectId:         "disease-prediction-ff405",
  storageBucket:     "disease-prediction-ff405.firebasestorage.app",
  messagingSenderId: "418439774812",
  appId:             "1:418439774812:web:80e2cdf2e2dddfd2405c99",
  measurementId:     "G-P1QHLX0YHS"
};

let db = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log("✅ Firebase connected");
} catch (e) {
  console.warn("⚠️ Firebase not configured – history will not persist.", e.message);
}

// ═══════════════════════════════════════════════════════════
// INIT LUCIDE ICONS
// ═══════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  // ── Populate user info in navbar from session ──
  const sessionUser = JSON.parse(sessionStorage.getItem("cardio_user") || "null");
  if (sessionUser) {
    const navAvatar   = document.getElementById("nav-avatar");
    const navUsername  = document.getElementById("nav-username");
    if (navAvatar)  navAvatar.textContent  = (sessionUser.name || "U").charAt(0).toUpperCase();
    if (navUsername) navUsername.textContent = sessionUser.name || sessionUser.email || "User";
  }

  // ── Logout handlers ──
  function doLogout() {
    sessionStorage.removeItem("cardio_user");
    try { firebase.auth().signOut(); } catch(e) {}
    window.location.href = "login.html";
  }
  const logoutDesktop = document.getElementById("btn-logout-desktop");
  const logoutMobile  = document.getElementById("btn-logout-mobile");
  if (logoutDesktop) logoutDesktop.addEventListener("click", doLogout);
  if (logoutMobile)  logoutMobile.addEventListener("click", doLogout);
});

// ═══════════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════════
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 700);
  }, 2800);
});

// ═══════════════════════════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════════════════════════
const cursor = document.getElementById("custom-cursor");
let cursorX = 0, cursorY = 0, currentX = 0, currentY = 0;

document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  currentX += (cursorX - currentX) * 0.15;
  currentY += (cursorY - currentY) * 0.15;
  cursor.style.left = currentX + "px";
  cursor.style.top  = currentY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on interactive elements
document.querySelectorAll("a, button, input, select, .glass-card, .feature-card").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
});

// ═══════════════════════════════════════════════════════════
// FLOATING PARTICLES
// ═══════════════════════════════════════════════════════════
function createParticles() {
  const container = document.getElementById("particles-container");
  const count = Math.min(25, Math.floor(window.innerWidth / 60));

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    const size = Math.random() * 120 + 40; // 40–160px
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const dx = (Math.random() - 0.5) * 300;
    const dy = (Math.random() - 0.5) * 300;
    const dur = Math.random() * 20 + 15; // 15–35s
    const delay = Math.random() * -30;
    const scaleEnd = Math.random() * 0.5 + 0.5;

    p.style.width  = size + "px";
    p.style.height = size + "px";
    p.style.left   = startX + "%";
    p.style.top    = startY + "%";
    p.style.setProperty("--dx", dx + "px");
    p.style.setProperty("--dy", dy + "px");
    p.style.setProperty("--scale-end", scaleEnd);
    p.style.animationDuration = dur + "s";
    p.style.animationDelay    = delay + "s";

    container.appendChild(p);
  }
}
createParticles();

// ═══════════════════════════════════════════════════════════
// SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════════════════
const progressBar = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  const scrollTop    = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress     = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = progress + "%";
});

// ═══════════════════════════════════════════════════════════
// STICKY NAVBAR GLASS ON SCROLL
// ═══════════════════════════════════════════════════════════
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ═══════════════════════════════════════════════════════════
// MOBILE MENU TOGGLE
// ═══════════════════════════════════════════════════════════
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  const expanded = mobileMenu.classList.toggle("hidden");
  menuToggle.setAttribute("aria-expanded", !mobileMenu.classList.contains("hidden"));
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

// ═══════════════════════════════════════════════════════════
// BACK TO TOP BUTTON
// ═══════════════════════════════════════════════════════════
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ═══════════════════════════════════════════════════════════
// SCROLL REVEAL (IntersectionObserver)
// ═══════════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Respect animation-delay set via inline style
        const delay = entry.target.style.animationDelay || "0s";
        const delayMs = parseFloat(delay) * 1000;
        setTimeout(() => entry.target.classList.add("visible"), Math.max(0, delayMs));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal, .reveal-card").forEach((el) => {
  revealObserver.observe(el);
});

// ═══════════════════════════════════════════════════════════
// COUNTER ANIMATION (Hero Stats)
// ═══════════════════════════════════════════════════════════
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".counter").forEach((el) => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ═══════════════════════════════════════════════════════════
// TYPING EFFECT
// ═══════════════════════════════════════════════════════════
const typingPhrases = [
  "Powered by Random Forest with 200 decision trees.",
  "Analyse 5 key health metrics instantly.",
  "Get your cardiovascular risk score in seconds.",
  "Your data stored securely with Firebase.",
  "Built with Flask, Scikit-Learn & Love ❤️",
];

let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById("typing-text");

function typeEffect() {
  const current = typingPhrases[phraseIdx];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % typingPhrases.length;
      setTimeout(typeEffect, 400);
      return;
    }
    setTimeout(typeEffect, 30);
  } else {
    typingEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
    setTimeout(typeEffect, 55);
  }
}
setTimeout(typeEffect, 3200); // start after loader

// ═══════════════════════════════════════════════════════════
// DARK / LIGHT THEME TOGGLE
// ═══════════════════════════════════════════════════════════
function applyTheme(light) {
  document.documentElement.classList.toggle("light", light);
  document.querySelectorAll(".theme-icon-sun").forEach(e => e.classList.toggle("hidden", light));
  document.querySelectorAll(".theme-icon-moon").forEach(e => e.classList.toggle("hidden", !light));
  localStorage.setItem("theme", light ? "light" : "dark");
}

// Restore saved preference
if (localStorage.getItem("theme") === "light") applyTheme(true);

document.getElementById("theme-toggle-desktop").addEventListener("click", () => {
  applyTheme(!document.documentElement.classList.contains("light"));
});
document.getElementById("theme-toggle-mobile").addEventListener("click", () => {
  applyTheme(!document.documentElement.classList.contains("light"));
});

// ═══════════════════════════════════════════════════════════
// FORM VALIDATION + SUBMISSION
// ═══════════════════════════════════════════════════════════
const form       = document.getElementById("prediction-form");
const btnPredict = document.getElementById("btn-predict");
const btnText    = document.getElementById("btn-predict-text");
const btnSpinner = document.getElementById("btn-predict-spinner");

// Validation rules
const rules = {
  age:             { el: "inp-age",  err: "err-age",  min: 1,  max: 120, label: "Age" },
  blood_pressure:  { el: "inp-bp",   err: "err-bp",   min: 50, max: 300, label: "Blood Pressure" },
  cholesterol:     { el: "inp-chol", err: "err-chol", min: 50, max: 600, label: "Cholesterol" },
  heart_rate:      { el: "inp-hr",   err: "err-hr",   min: 30, max: 250, label: "Heart Rate" },
  chest_pain_type: { el: "inp-cp",   err: "err-cp",   min: 0,  max: 3,   label: "Chest Pain Type" },
};

function validateForm() {
  let valid = true;
  for (const [key, rule] of Object.entries(rules)) {
    const input  = document.getElementById(rule.el);
    const errEl  = document.getElementById(rule.err);
    const val    = input.value.trim();

    if (val === "") {
      errEl.textContent = `${rule.label} is required`;
      input.classList.add("error");
      valid = false;
    } else if (Number(val) < rule.min || Number(val) > rule.max) {
      errEl.textContent = `Must be ${rule.min}–${rule.max}`;
      input.classList.add("error");
      valid = false;
    } else {
      errEl.textContent = "";
      input.classList.remove("error");
    }
  }
  return valid;
}

// Clear errors on input
Object.values(rules).forEach(rule => {
  const input = document.getElementById(rule.el);
  input.addEventListener("input", () => {
    document.getElementById(rule.err).textContent = "";
    input.classList.remove("error");
  });
});

// Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Show loading
  btnPredict.disabled = true;
  btnText.textContent = "Analysing...";
  btnSpinner.classList.remove("hidden");

  const payload = {
    age:             Number(document.getElementById("inp-age").value),
    blood_pressure:  Number(document.getElementById("inp-bp").value),
    cholesterol:     Number(document.getElementById("inp-chol").value),
    heart_rate:      Number(document.getElementById("inp-hr").value),
    chest_pain_type: Number(document.getElementById("inp-cp").value),
  };

  try {
    const res  = await fetch("/api/predict", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showResult(data, payload);
      await saveToFirebase(payload, data);
      loadHistory();
    } else {
      alert("Prediction failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Could not reach the server. Is Flask running?");
  } finally {
    btnPredict.disabled = false;
    btnText.textContent = "Analyze Risk";
    btnSpinner.classList.add("hidden");
  }
});

// Reset
form.addEventListener("reset", () => {
  Object.values(rules).forEach(rule => {
    document.getElementById(rule.err).textContent = "";
    document.getElementById(rule.el).classList.remove("error");
  });
  document.getElementById("result-section").classList.add("hidden");
});

// ═══════════════════════════════════════════════════════════
// DISPLAY RESULT
// ═══════════════════════════════════════════════════════════
function showResult(data, input) {
  const section    = document.getElementById("result-section");
  const card       = document.getElementById("result-card");
  const iconWrap   = document.getElementById("result-icon-wrap");
  const title      = document.getElementById("result-title");
  const subtitle   = document.getElementById("result-subtitle");
  const scoreEl    = document.getElementById("result-score");
  const progressEl = document.getElementById("result-progress");

  section.classList.remove("hidden");
  section.scrollIntoView({ behavior: "smooth", block: "center" });

  // Remove previous glows
  card.classList.remove("glow-high", "glow-medium", "glow-low");

  // Apply risk-specific styles
  const risk = data.risk_level;
  if (risk === "High") {
    card.classList.add("glow-high");
    iconWrap.className = "w-20 h-20 rounded-full flex items-center justify-center bg-red-500/20";
    title.textContent = "⚠️ High Risk Detected";
    subtitle.textContent = "Consult a cardiologist immediately for a thorough evaluation.";
    progressEl.className = "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-red-600 to-red-400";
  } else if (risk === "Medium") {
    card.classList.add("glow-medium");
    iconWrap.className = "w-20 h-20 rounded-full flex items-center justify-center bg-amber-500/20";
    title.textContent = "⚡ Moderate Risk";
    subtitle.textContent = "Consider lifestyle changes and schedule a checkup.";
    progressEl.className = "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-amber-500 to-yellow-400";
  } else {
    card.classList.add("glow-low");
    iconWrap.className = "w-20 h-20 rounded-full flex items-center justify-center bg-green-500/20";
    title.textContent = "✅ Low Risk";
    subtitle.textContent = "Great news! Keep maintaining a healthy lifestyle.";
    progressEl.className = "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-green-500 to-emerald-400";
  }

  // Animate confidence score
  animateScore(scoreEl, data.probability);

  // Animate progress bar
  setTimeout(() => { progressEl.style.width = data.probability + "%"; }, 100);

  // Factor bars
  const factors = data.factors;
  animateBar("factor-age",  "factor-age-val",  factors.age);
  animateBar("factor-bp",   "factor-bp-val",   factors.blood_pressure);
  animateBar("factor-chol", "factor-chol-val",  factors.cholesterol);
  animateBar("factor-hr",   "factor-hr-val",    factors.heart_rate);
  animateBar("factor-cp",   "factor-cp-val",    factors.chest_pain);
}

function animateScore(el, target) {
  const duration = 1500;
  const start    = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (eased * target).toFixed(1) + "%";
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function animateBar(barId, valId, target) {
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);
  setTimeout(() => {
    bar.style.width = target + "%";
    val.textContent = target + "%";
  }, 200);
}

// ═══════════════════════════════════════════════════════════
// 🔥 FIREBASE – SAVE & LOAD HISTORY
// ═══════════════════════════════════════════════════════════
async function saveToFirebase(input, result) {
  if (!db) return;
  try {
    const sessionUser = JSON.parse(sessionStorage.getItem("cardio_user") || "null");
    await db.collection("predictions").add({
      ...input,
      prediction:  result.prediction,
      probability: result.probability,
      risk_level:  result.risk_level,
      uid:         sessionUser ? sessionUser.uid : null,
      userEmail:   sessionUser ? sessionUser.email : null,
      timestamp:   firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.log("Saved to Firestore");
  } catch (e) {
    console.warn("Firestore save failed:", e.message);
  }
}

async function loadHistory() {
  if (!db) return;
  const container = document.getElementById("history-list");

  try {
    const snapshot = await db.collection("predictions")
      .orderBy("timestamp", "desc")
      .limit(9)
      .get();

    if (snapshot.empty) return;

    container.innerHTML = "";
    snapshot.forEach(doc => {
      const d = doc.data();
      const ts = d.timestamp ? new Date(d.timestamp.seconds * 1000).toLocaleString() : "Just now";
      const badgeClass = d.risk_level === "High" ? "high" : d.risk_level === "Medium" ? "medium" : "low";

      container.innerHTML += `
        <div class="history-card reveal-card visible">
          <div class="flex items-center justify-between mb-3">
            <span class="history-badge ${badgeClass}">${d.risk_level} Risk</span>
            <span class="text-xs text-white/30">${ts}</span>
          </div>
          <div class="text-2xl font-bold mb-1">${d.probability.toFixed(1)}%</div>
          <p class="text-white/40 text-xs">Age ${d.age} · BP ${d.blood_pressure} · Chol ${d.cholesterol} · HR ${d.heart_rate}</p>
        </div>
      `;
    });
  } catch (e) {
    console.warn("⚠️ Firestore read failed:", e.message);
  }
}

// Load history on page load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(loadHistory, 3500); // after loader
});
