//proto/src/scripts/auth.js
const API = "http://localhost:3000";

//SIGNUP
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userTypeEl = document.getElementById("userType");
    const userType = userTypeEl ? userTypeEl.value : "artist";

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, userType }),
    });

    const msg = document.getElementById("signup-msg");
    const data = await res.json();

    if (res.ok) {
      msg.style.color = "lime";
      msg.textContent = "Account created! Redirecting...";
      setTimeout(() => (window.location.href = "login.html"), 800);
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Error";
    }
  });
}

//LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const msg = document.getElementById("login-msg");
    const data = await res.json();

    if (res.ok) {
      msg.style.color = "lime";
      msg.textContent = "Login successful!";
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      setTimeout(() => (window.location.href = "index.html"), 600);
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Login failed";
    }
  });
}