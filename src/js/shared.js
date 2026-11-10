import "./cart-drawer.js";
async function loadComponent(selector, filename) {
  const container = document.querySelector(selector);

  if (!container) return;

  const url = new URL(`../components/${filename}`, import.meta.url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`بارگذاری ${filename} ناموفق بود.`);
  }

  container.innerHTML = await response.text();
}

async function setupSharedComponents() {
  try {
    await loadComponent("#site-header", "header.html");
    const header = document.querySelector("#site-header");
    const nav = header.querySelector("nav");
    nav.id = "main-navigation";
    nav.setAttribute("aria-label", "فهرست اصلی");
    const search = header.querySelector('a:has(img[src*="Search.svg"])');
    search?.setAttribute("aria-label", "جستجو");
    const logo = header.querySelector('a[href="./index.html"] img');
    if (logo) logo.alt = "لیلیان — صفحه اصلی";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-menu-toggle";
    toggle.innerHTML =
      '<svg class="menu-open-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg><svg class="menu-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
    toggle.setAttribute("aria-controls", nav.id);
    const setMenu = (open) => {
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "بستن فهرست اصلی" : "باز کردن فهرست اصلی",
      );
    };
    setMenu(false);
    toggle.addEventListener("click", () =>
      setMenu(!header.classList.contains("menu-open")),
    );
    header.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) setMenu(false);
      else if (event.target.closest("#open-login, [data-open-cart]"))
        setMenu(false);
    });
    header.addEventListener("focusout", (event) => {
      if (!header.contains(event.relatedTarget)) setMenu(false);
    });
    window
      .matchMedia("(min-width:1440px)")
      .addEventListener("change", () => setMenu(false));
    nav.parentElement.parentElement.prepend(toggle);

    await import("./login-modal.js");
  } catch (error) {
    console.error(error);
  }

  try {
    await loadComponent("#site-footer", "footer.html");
  } catch (error) {
    console.error(error);
  }
}

setupSharedComponents();

// دکمه های روش ارسال
const selectButtons = document.querySelectorAll("[data-select-button]");

selectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectButtons.forEach((item) => {
      const isSelected = item === button;

      item.setAttribute("aria-pressed", String(isSelected));

      item.querySelector("img").src = isSelected
        ? "./src/images/svg/select-button=selected.svg"
        : "./src/images/svg/select-button=default.svg";
    });
  });
});

// بانک
const bankButtons = document.querySelectorAll("#payment-banks button");

bankButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bankButtons.forEach((item) => {
      const selected = item === button;

      item.querySelector("img").classList.toggle("grayscale", !selected);

      item.classList.toggle("shadow-[0_2px_4px_0_#A3A3A3]", selected);
    });
  });
});
// سوییپر
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

for (const element of document.querySelectorAll(".productSwiper")) {
  new Swiper(element, {
    slidesPerView: 1.35,
    breakpoints: {
      480: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1280: { slidesPerView: 4 },
    },
    slidesPerGroup: 1,
    spaceBetween: 24,
    speed: 500,
    loop: false,
    grabCursor: true,
    simulateTouch: true,
    watchOverflow: true,
  });
}

for (const element of document.querySelectorAll(".evening-swiper")) {
  new Swiper(element, {
    slidesPerView: 3,
    spaceBetween: 16,
    loop: true,
    speed: 1800,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    grabCursor: true,
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 12 },
      640: { slidesPerView: 2, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 16 },
    },
  });
}
