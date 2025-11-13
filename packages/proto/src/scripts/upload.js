//proto/src/scripts/upload.js
const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  if (!form) return;

  const msg = document.getElementById("upload-msg");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    window.location.href = "login.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    msg.style.color = "white";

    const fd = new FormData(form);
    fd.append("artist", username);

    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        msg.style.color = "red";
        msg.textContent = data.error || "Upload failed.";
        return;
      }

      msg.style.color = "lime";
      msg.textContent = "Upload successful!";
      form.reset();


    } catch (err) {
      console.error(err);
      msg.style.color = "red";
      msg.textContent = "Unexpected error.";
    }
  });
});