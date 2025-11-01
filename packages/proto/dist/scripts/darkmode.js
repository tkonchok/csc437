// packages/proto/public/scripts/darkmode.js

const body = document.body;
const label = document.getElementById("darkmode-toggle");

// Relay the built-in "change" event as our own custom event
label.onchange = (event) => {
  event.stopPropagation();
  const checked = event.target.checked;

  const customEvent = new CustomEvent("darkmode:toggle", {
    bubbles: true,
    detail: { checked }
  });

  label.dispatchEvent(customEvent);
};

// Listen for the custom event on <body>
body.addEventListener("darkmode:toggle", (event) => {
  const { checked } = event.detail;
  body.classList.toggle("dark-mode", checked);
});
