
const body = document.body;
const label = document.getElementById("darkmode-toggle");

label.onchange = (event) => {
  event.stopPropagation();
  const checked = event.target.checked;

  const customEvent = new CustomEvent("darkmode:toggle", {
    bubbles: true,
    detail: { checked }
  });

  label.dispatchEvent(customEvent);
};

body.addEventListener("darkmode:toggle", (event) => {
  const { checked } = event.detail;
  body.classList.toggle("dark-mode", checked);
});
