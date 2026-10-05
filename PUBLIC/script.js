const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const dashboardSection = document.getElementById("dashboardSection");

// =============================
// SHOW LOGIN
// =============================

function showLogin() {
  loginSection.classList.remove("hidden");
  registerSection.classList.add("hidden");
  dashboardSection.classList.add("hidden");
}

// =============================
// SHOW REGISTER
// =============================

function showRegister() {
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
  dashboardSection.classList.add("hidden");
}

// =============================
// REGISTER
// =============================

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();

    const email = document.getElementById("registerEmail").value.trim();

    const password = document.getElementById("registerPassword").value;

    const message = document.getElementById("registerMessage");

    try {
      const response = await fetch("/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      message.textContent = data.message;

      if (response.ok) {
        message.style.color = "#4ade80";

        document.getElementById("registerForm").reset();

        setTimeout(() => {
          showLogin();
        }, 1200);
      } else {
        message.style.color = "#f87171";
      }
    } catch (error) {
      console.error(error);

      message.textContent = "Unable to connect to server.";

      message.style.color = "#f87171";
    }
  });

// =============================
// LOGIN
// =============================

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("loginMessage");

    try {
      const response = await fetch("/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      message.textContent = data.message;

      if (response.ok) {
        message.style.color = "#4ade80";

        document.getElementById("userName").textContent = data.user.name;

        document.getElementById("userEmail").textContent = data.user.email;

        setTimeout(() => {
          loginSection.classList.add("hidden");
          registerSection.classList.add("hidden");
          dashboardSection.classList.remove("hidden");
        }, 500);
      } else {
        message.style.color = "#f87171";
      }
    } catch (error) {
      console.error(error);

      message.textContent = "Unable to connect to server.";

      message.style.color = "#f87171";
    }
  });

// =============================
// LOGOUT
// =============================

function logout() {
  document.getElementById("loginForm").reset();

  document.getElementById("loginMessage").textContent = "";

  showLogin();
}
