document.getElementById("year").textContent = new Date().getFullYear();

// mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// retro TV — power it on, then flip through cameras like changing channels
const tv = document.querySelector(".tv");
const tvScreen = document.getElementById("tvScreen");
if (tv && tvScreen) {
  const channels = Array.from(document.querySelectorAll(".tv__channel"));
  const lights = Array.from(document.querySelectorAll(".tv__light"));
  const powerBtn = document.getElementById("tvPowerBtn");
  const channelBtn = document.getElementById("tvChannelBtn");

  let isOn = false;
  let channelIndex = 0;

  function flicker() {
    tvScreen.classList.remove("is-flickering");
    void tvScreen.offsetWidth; // restart the CSS animation on repeat clicks
    tvScreen.classList.add("is-flickering");
  }

  function render() {
    tv.classList.toggle("is-on", isOn);
    if (powerBtn) powerBtn.classList.toggle("is-on", isOn);
    channels.forEach((ch, i) => ch.classList.toggle("is-active", isOn && i === channelIndex));
    lights.forEach((light, i) => light.classList.toggle("is-lit", isOn && i === channelIndex));
  }

  if (powerBtn) {
    powerBtn.addEventListener("click", () => {
      isOn = !isOn;
      flicker();
      render();
    });
  }

  if (channelBtn) {
    channelBtn.addEventListener("click", () => {
      if (!isOn) return;
      channelIndex = (channelIndex + 1) % channels.length;
      flicker();
      render();
    });
  }

  render();
}

// site-wide language toggle (EN / VI)
const langButtons = document.querySelectorAll(".lang-toggle__btn");
const translatable = document.querySelectorAll("[data-vi]");

function setLanguage(lang) {
  translatable.forEach((el) => {
    if (el.dataset.enText === undefined) el.dataset.enText = el.textContent;
    el.textContent = lang === "vi" ? el.dataset.vi : el.dataset.enText;
  });

  document.documentElement.lang = lang;
  langButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));

  try {
    localStorage.setItem("oo_lang", lang);
  } catch (e) {
    /* localStorage unavailable — language just won't persist across visits */
  }
}

langButtons.forEach((btn) =>
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang))
);

let savedLang = null;
try {
  savedLang = localStorage.getItem("oo_lang");
} catch (e) {
  /* localStorage unavailable */
}
if (savedLang === "vi") setLanguage("vi");
