import { addToCart } from "./cart-drawer.js";

const form = document.querySelector("#purchase");
const quantityElement = form.querySelector("#quantity");

const sizeButtons = document.querySelectorAll(".size-choice");
const colorButtons = document.querySelectorAll(".color-choice");

const quantityButtons = form.querySelectorAll('[dir="ltr"] button');

const increaseButton = quantityButtons[0];
const decreaseButton = quantityButtons[1];

let selectedSize = "";
let selectedColor = "";
let quantity = 1;

// پیام انتخاب سایز و رنگ
const feedback = document.createElement("p");

feedback.setAttribute("role", "status");
feedback.className = "mt-2 text-xs text-red-600";

form.append(feedback);

// انتخاب سایز
sizeButtons.forEach((button) => {
  button.type = "button";

  // متن دکمه را می‌خوانیم چون data-sizeهای فایل فعلی تکراری‌اند.
  const size = button.textContent.trim();

  button.dataset.size = size;
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    selectedSize = size;

    sizeButtons.forEach((item) => {
      const isSelected = item === button;

      item.setAttribute("aria-pressed", String(isSelected));

      item.classList.toggle("ring-2", isSelected);
      item.classList.toggle("ring-[#3D3D3D]", isSelected);
    });

    feedback.textContent = "";
  });
});

// ترتیب رنگ‌ها مطابق HTML فعلی صفحه است.
const colors = ["مشکی", "خردلی"];

// انتخاب رنگ
colorButtons.forEach((button, index) => {
  button.type = "button";
  button.setAttribute("aria-label", colors[index]);
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    selectedColor = colors[index];

    colorButtons.forEach((item) => {
      const isSelected = item === button;

      item.setAttribute("aria-pressed", String(isSelected));

      item.classList.toggle("ring-2", isSelected);
      item.classList.toggle("ring-offset-2", isSelected);
      item.classList.toggle("ring-[#3D3D3D]", isSelected);
    });

    feedback.textContent = "";
  });
});

function updateQuantity() {
  quantityElement.textContent = new Intl.NumberFormat("fa-IR").format(quantity);

  increaseButton.disabled = quantity >= 99;
  decreaseButton.disabled = quantity <= 1;
}

// جلوگیری از ارسال فرم با دکمه‌های تعداد
increaseButton.type = "button";
decreaseButton.type = "button";

increaseButton.setAttribute("aria-label", "افزایش تعداد");
decreaseButton.setAttribute("aria-label", "کاهش تعداد");

increaseButton.addEventListener("click", () => {
  quantity = Math.min(99, quantity + 1);
  updateQuantity();
});

decreaseButton.addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateQuantity();
});

// افزودن محصول
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedSize || !selectedColor) {
    feedback.textContent = "لطفاً سایز و رنگ را انتخاب کنید.";

    if (!selectedSize) {
      sizeButtons[0].focus();
    } else {
      colorButtons[0].focus();
    }

    return;
  }

  feedback.textContent = "";

  addToCart({
    id: "coat-I",
    name: "کت بلند پشمی",
    price: 3800000,
    image: new URL("../images/shopping-page/I/1.png", import.meta.url).href,
    size: selectedSize,
    color: selectedColor,
    quantity,
  });
});

updateQuantity();
