const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const box = document.getElementById("messages-box");
  const form = document.getElementById("send-form");

  if (!token) return (box.innerHTML = "<p>Please log in.</p>");

  loadMessages();

  async function loadMessages() {
    const res = await fetch(`${API}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const msgs = await res.json();

    if (!msgs.length) {
      box.innerHTML = "<p>No messages.</p>";
      return;
    }

    box.innerHTML = msgs.map(
      m => `
        <div class="msg">
          <p><strong>${m.from}</strong> → <strong>${m.to}</strong></p>
          <p>${m.text}</p>
          <small>${new Date(m.timestamp).toLocaleString()}</small>
        </div>
    `
    ).join("");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const to = document.getElementById("to-user").value;
    const text = document.getElementById("msg-text").value;

    await fetch(`${API}/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to, text }),
    });

    document.getElementById("msg-status").textContent = "Sent!";
    form.reset();
    loadMessages();
  });
});