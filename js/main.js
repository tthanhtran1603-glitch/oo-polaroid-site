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

// camera folders — click a folder to open its popup with photos + pricing
const folders = document.querySelectorAll(".folder");
const popups = document.querySelectorAll(".camera-popup");

function openPopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closePopup(popup) {
  popup.classList.remove("is-open");
  if (!document.querySelector(".camera-popup.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

folders.forEach((folder) =>
  folder.addEventListener("click", () => openPopup(folder.dataset.popup))
);

popups.forEach((popup) => {
  const closeBtn = popup.querySelector(".camera-popup__close");
  if (closeBtn) closeBtn.addEventListener("click", () => closePopup(popup));
  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup(popup);
  });
  const sampleLink = popup.querySelector(".camera-popup__samplelink");
  if (sampleLink) sampleLink.addEventListener("click", () => closePopup(popup));
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const openPopupEl = document.querySelector(".camera-popup.is-open");
  if (openPopupEl) closePopup(openPopupEl);
});

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
