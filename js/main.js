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

// camera detail modals
document.querySelectorAll(".deck-card").forEach((btn) =>
  btn.addEventListener("click", () => {
    const modal = document.getElementById(btn.dataset.modal);
    if (modal) modal.showModal();
  })
);

document.querySelectorAll(".camera-modal").forEach((modal) => {
  modal.querySelector(".camera-modal__close").addEventListener("click", () => modal.close());
  // click on the backdrop (outside the modal box) closes it
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
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
