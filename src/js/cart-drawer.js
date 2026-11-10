import cartHTML from "../components/cart-drawer.html?raw";

// ساخت کامپوننت
document.body.insertAdjacentHTML("beforeend", cartHTML);

const drawer = document.querySelector("#cart-drawer");
const itemsContainer = drawer.querySelector("#cart-items");
const totalElement = drawer.querySelector("#cart-total");
const checkoutButton = drawer.querySelector("#cart-checkout");
const messageElement = drawer.querySelector("#cart-message");

const storageKey = "lilian-cart";
let cart = [];
let previousOverflow = "";

// خواندن سبد ذخیره‌شده
try {
  const savedCart = JSON.parse(localStorage.getItem(storageKey) || "[]");

  if (Array.isArray(savedCart)) {
    cart = savedCart.filter(
      (item) =>
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        typeof item.size === "string" &&
        typeof item.color === "string" &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 99,
    );
  }
} catch {
  cart = [];
}

function formatNumber(value) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatPrice(value) {
  return `${formatNumber(value)} تومان`;
}

function updateCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch {
    // اگر ذخیره‌سازی در دسترس نباشد، سبد همچنان کار می‌کند.
  }

  renderCart();
}

// باز کردن سبد
export function openCart() {
  if (drawer.open) return;

  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";

  drawer.showModal();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!reducedMotion) {
    drawer.animate(
      [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
      {
        duration: 250,
        easing: "ease-out",
      },
    );
  }
}

// افزودن محصول از هر صفحه
export function addToCart(product) {
  const existingItem = cart.find(
    (item) =>
      item.id === product.id &&
      item.size === product.size &&
      item.color === product.color,
  );

  if (existingItem) {
    existingItem.quantity = Math.min(
      99,
      existingItem.quantity + product.quantity,
    );
  } else {
    cart.push({
      ...product,
      quantity: Math.max(1, Math.min(99, product.quantity)),
    });
  }

  updateCart();
  openCart();
}

// نمایش محصولات
function renderCart() {
  itemsContainer.replaceChildren();
  messageElement.textContent = "";

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.className = "py-10 text-center";
    emptyMessage.textContent = "سبد خرید شما خالی است.";

    itemsContainer.append(emptyMessage);
  }

  cart.forEach((item, index) => {
    const row = document.createElement("article");

    row.className =
      "grid grid-cols-[96px_minmax(0,1fr)_20px] gap-3 border-b border-[#CCCCCC] py-5";

    row.innerHTML = `
      <img
        alt=""
        class="h-33 w-24 object-cover"
      >

      <div class="flex min-w-0 flex-col gap-2">
        <h3 class="text-xs font-bold"></h3>

        <p class="text-[11px] text-[#777777]"></p>

        <div
          class="mt-auto flex flex-wrap items-center justify-between gap-2"
        >
          <div
            dir="ltr"
            class="flex items-center border border-[#AAAAAA]"
          >
            <button
              type="button"
              data-action="increase"
              aria-label="افزایش تعداد"
              class="h-6 w-6 cursor-pointer disabled:cursor-default disabled:opacity-40"
            >
              +
            </button>

            <output class="min-w-5 text-center"></output>

            <button
              type="button"
              data-action="decrease"
              aria-label="کاهش تعداد"
              class="h-6 w-6 cursor-pointer"
            >
              −
            </button>
          </div>

          <strong
            data-item-price
            class="text-[11px] text-[#D71F1F]"
          ></strong>
        </div>
      </div>

      <button
        type="button"
        data-action="remove"
        aria-label="حذف محصول"
        class="cursor-pointer self-start text-lg leading-none text-[#777777]"
      >
        ×
      </button>
    `;

    const image = row.querySelector("img");

    // فقط تصویرهای همین سایت نمایش داده شوند.
    try {
      const imageURL = new URL(item.image, location.href);

      if (imageURL.origin === location.origin) {
        image.src = imageURL.href;
      }
    } catch {
      // آدرس نامعتبر نادیده گرفته می‌شود.
    }

    image.alt = item.name;

    row.querySelector("h3").textContent = item.name;

    row.querySelector("p").textContent =
      `سایز: ${item.size} | رنگ: ${item.color}`;

    row.querySelector("output").textContent = formatNumber(item.quantity);

    row.querySelector("[data-item-price]").textContent = formatPrice(
      item.price * item.quantity,
    );

    row.querySelector('[data-action="increase"]').disabled =
      item.quantity >= 99;

    row.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const action = button.dataset.action;

      if (action === "increase") {
        item.quantity = Math.min(99, item.quantity + 1);
      }

      if (action === "decrease") {
        item.quantity -= 1;
      }

      if (action === "remove" || item.quantity === 0) {
        cart.splice(index, 1);
      }

      updateCart();

      // حفظ فوکوس بعد از بازسازی لیست
      const nextRow =
        itemsContainer.children[
          Math.min(index, itemsContainer.children.length - 1)
        ];

      const nextButton = nextRow?.querySelector(`[data-action="${action}"]`);

      (nextButton || drawer.querySelector("[data-close-cart]")).focus();
    });

    itemsContainer.append(row);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  totalElement.textContent = formatPrice(total);
  checkoutButton.disabled = cart.length === 0;
}

// بستن با دکمه‌های بالای سبد
drawer.querySelectorAll("[data-close-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    drawer.close();
  });
});

// بستن با کلیک بیرون سبد
drawer.addEventListener("click", (event) => {
  if (event.target !== drawer) return;

  const rect = drawer.getBoundingClientRect();

  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    drawer.close();
  }
});

// فعال شدن مجدد اسکرول؛ شامل بستن با Escape هم می‌شود.
drawer.addEventListener("close", () => {
  document.documentElement.style.overflow = previousOverflow;
});

// اتصال آیکون سبد.
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-cart]");

  if (!trigger) return;

  event.preventDefault();
  openCart();
});

// رفتن از سبد کشویی به صفحه سبد خرید
checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) return;

  window.location.href = "./cart.html";
});

renderCart();
