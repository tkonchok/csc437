document.addEventListener("DOMContentLoaded", () => {
  const toggleLabel = document.getElementById("darkmode-toggle");
  if (!toggleLabel) return;

  const html = document.documentElement;
  const toggle = toggleLabel.querySelector("input");

  if (!toggle) return;

  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    html.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});