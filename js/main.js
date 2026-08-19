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

// camera book — real page-flip transition between camera spreads
const bookPages = document.getElementById("bookPages");
if (bookPages) {
  const leaves = Array.from(bookPages.children);
  const spreads = leaves.map((leaf) => leaf.querySelector(".book__spread"));
  const dots = document.querySelectorAll(".book__dot");
  const prevBtn = document.querySelector(".book__arrow--prev");
  const nextBtn = document.querySelector(".book__arrow--next");
  const FLIP_MS = 850;

  let current = 0;
  let animating = false;

  function syncHeight() {
    // leaves are absolutely positioned, so scrollHeight (not offsetHeight)
    // is what reports the spread's true content height regardless of the
    // 0-height circular constraint that position:absolute + inset:0 creates
    bookPages.style.height = spreads[current].scrollHeight + "px";
  }

  function render(flippingIndex) {
    leaves.forEach((leaf, i) => {
      const turned = i < current;
      leaf.style.transform = turned ? "rotateY(-180deg)" : "rotateY(0deg)";
      leaf.style.zIndex = turned ? i : leaves.length - i + 10;
    });
    if (flippingIndex !== undefined) leaves[flippingIndex].style.zIndex = 999;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(leaves.length - 1, index));
    if (clamped === current || animating) return;
    const flippingIndex = clamped > current ? current : clamped;
    animating = true;
    current = clamped;
    syncHeight();
    render(flippingIndex);
    window.setTimeout(() => {
      animating = false;
      render();
    }, FLIP_MS);
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

  let touchStartX = null;
  bookPages.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  bookPages.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    touchStartX = null;
  });

  window.addEventListener("resize", syncHeight);
  syncHeight();
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
