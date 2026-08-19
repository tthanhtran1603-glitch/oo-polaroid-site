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

  const isMobile = () => window.matchMedia("(max-width: 640px)").matches;

  let current = 0;
  let subpage = 0; // 0 = photos, 1 = info — only meaningful on mobile, where the two are separate flippable pages
  let animating = false;

  function renderOuter(flippingIndex) {
    leaves.forEach((leaf, i) => {
      const turned = i < current;
      leaf.style.transform = turned ? "rotateY(-180deg)" : "rotateY(0deg)";
      leaf.style.zIndex = turned ? i : leaves.length - i + 10;
    });
    if (flippingIndex !== undefined) leaves[flippingIndex].style.zIndex = 999;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  }

  function renderInner() {
    spreads[current].classList.toggle("is-showing-info", subpage === 1);
  }

  function goToCamera(index, startSubpage) {
    const clamped = Math.max(0, Math.min(leaves.length - 1, index));
    if (clamped === current) {
      subpage = startSubpage;
      renderInner();
      return;
    }
    if (animating) return;
    const flippingIndex = clamped > current ? current : clamped;
    animating = true;
    current = clamped;
    subpage = startSubpage;
    renderInner();
    renderOuter(flippingIndex);
    window.setTimeout(() => {
      animating = false;
      renderOuter();
    }, FLIP_MS);
  }

  function stepForward() {
    if (isMobile() && subpage === 0) {
      subpage = 1;
      renderInner();
    } else {
      goToCamera(current + 1, 0);
    }
  }

  function stepBackward() {
    if (isMobile() && subpage === 1) {
      subpage = 0;
      renderInner();
    } else {
      goToCamera(current - 1, isMobile() ? 1 : 0);
    }
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => goToCamera(i, 0)));
  if (prevBtn) prevBtn.addEventListener("click", stepBackward);
  if (nextBtn) nextBtn.addEventListener("click", stepForward);

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
    if (Math.abs(dx) > 40) (dx < 0 ? stepForward() : stepBackward());
    touchStartX = null;
  });

  renderOuter();
  renderInner();
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
