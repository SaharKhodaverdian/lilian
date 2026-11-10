async function setupLoginModal() {
  const openLogin = document.querySelector("#open-login");

  if (!openLogin) return;

  try {
    const modalURL = new URL("../components/login-modal.html", import.meta.url);

    const response = await fetch(modalURL);

    if (!response.ok) {
      throw new Error("بارگذاری فرم ورود ناموفق بود.");
    }

    const modalHTML = await response.text();

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const loginModal = document.querySelector("#login-modal");
    const loginForm = document.querySelector("#login-form");

    openLogin.addEventListener("click", () => {
      if (loginModal.open) return;

      loginModal.showModal();
    });

    loginModal.addEventListener("click", (event) => {
      if (event.target !== loginModal) return;

      const rect = loginModal.getBoundingClientRect();

      const clickedOutside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (clickedOutside) {
        loginModal.close();
      }
    });

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  } catch (error) {
    console.error(error);
  }
}

setupLoginModal();
