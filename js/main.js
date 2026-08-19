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

// camera book — swipeable/scrollable spread carousel
const bookPages = document.getElementById("bookPages");
if (bookPages) {
  const spreads = Array.from(bookPages.children);
  const dots = document.querySelectorAll(".book__dot");
  const prevBtn = document.querySelector(".book__arrow--prev");
  const nextBtn = document.querySelector(".book__arrow--next");

  function currentIndex() {
    let closest = 0;
    let smallestDiff = Infinity;
    spreads.forEach((spread, i) => {
      const diff = Math.abs(spread.offsetLeft - bookPages.scrollLeft);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closest = i;
      }
    });
    return closest;
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(spreads.length - 1, index));
    bookPages.scrollTo({ left: spreads[clamped].offsetLeft, behavior: "smooth" });
  }

  function updateDots() {
    const idx = currentIndex();
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === idx));
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(currentIndex() - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(currentIndex() + 1));

  let scrollTimer;
  bookPages.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(updateDots, 100);
  });
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
