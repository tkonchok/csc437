const API = "http://localhost:3000";

//stop multiple audios
document.addEventListener("play", (e) => {
  document.querySelectorAll("audio").forEach(a => {
    if (a !== e.target) {
      a.pause();
      a.currentTime = 0;
    }
  });
}, true);

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!id) return;

  await loadPost(id);
  await loadComments(id);

  //COMMENT SUBMIT
  document.getElementById("comment-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value;

    await fetch(`${API}/api/comments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, user: username }),
    });

    document.getElementById("comment-text").value = "";
    loadComments(id);
  });

  //COLLAB BUTTON
  document.getElementById("collab-btn").addEventListener("click", async () => {
    await fetch(`${API}/messages/collab/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Collaboration request sent!");
  });
});

/*LOAD INDIVIDUAL POST*/
async function loadPost(id) {
  const res = await fetch(`${API}/api/posts/${id}`);

  if (!res.ok) {
    document.getElementById("post-container").innerHTML = "<p>Post not found.</p>";
    return;
  }

  const p = await res.json();

  //determine static vs uploaded
  let imgSrc = p.imgSrc;
  let audioSrc = p.audioSrc;

  if (p.imgSrc.startsWith("/uploads")) imgSrc = `${API}${p.imgSrc}`;
  if (p.audioSrc.startsWith("/uploads")) audioSrc = `${API}${p.audioSrc}`;

  document.getElementById("post-container").innerHTML = `
    <article class="single-post">
      <img src="${imgSrc}" alt="${p.title}">
      <h2>${p.title}</h2>
      <p><strong>${p.artist}</strong></p>
      <p>${p.genre}</p>

      <audio controls>
        <source src="${audioSrc}">
      </audio>
    </article>
  `;
}

/*LOAD COMMENTS*/
async function loadComments(id) {
  const res = await fetch(`${API}/api/comments/${id}`, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
  const comments = await res.json();

  if (!Array.isArray(comments) || comments.length === 0) {
    document.getElementById("comments").innerHTML = "<p>No comments yet.</p>";
    return;
  }

  document.getElementById("comments").innerHTML = comments
    .map(c => `<p><strong>${c.user}:</strong> ${c.text}</p>`)
    .join("");
}