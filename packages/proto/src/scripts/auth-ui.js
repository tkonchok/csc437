//proto/src/scripts/auth-ui.js
document.addEventListener("DOMContentLoaded", () => {
  const menuBar = document.getElementById("menu-bar");
  if (!menuBar) return;

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";
  const avatar = localStorage.getItem("avatar");

  //not logged in → simple menu
  if (!token) {
    menuBar.innerHTML = `
      <nav class="menu-nav">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="login.html">Login</a></li>
          <li><a href="signup.html">Sign Up</a></li>
        </ul>
      </nav>
    `;
    return;
  }

//logged-in → full menu
let profileDisplay = "";

if (avatar && avatar !== "null" && avatar !== "") {
  profileDisplay = `<img src="${avatar}" class="menu-avatar" />`;
} else {
  profileDisplay = `<span class="menu-username">${username}</span>`;
}

menuBar.innerHTML = `
  <nav class="menu-nav">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="upload.html">Upload</a></li>
      <li><a href="messages.html">Messages</a></li>
      <li><a href="profile.html" class="menu-profile-link">${profileDisplay}</a></li>
      <li><a href="#" id="logout-link">Logout</a></li>
    </ul>
  </nav>
`;

  //logout behavior
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
      window.location.href = "index.html";
    });
  }
});