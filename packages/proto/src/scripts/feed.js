const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", loadFeed);

//allow only 1 audio to play at a time & reset previous audio
document.addEventListener(
  "play",
  function (e) {
    const audios = document.querySelectorAll("audio");
    audios.forEach((audio) => {
      if (audio !== e.target) {
        audio.pause();
        audio.currentTime = 0;  
      }
    });
  },
  true
);

async function loadFeed() {
  const feed = document.getElementById("feed");

  try {
    //FETCH POSTS FROM MONGODB ONLY
    const res = await fetch(`${API}/api/posts`);
    let posts = await res.json();

    posts = posts.map((p) => {
  let imgSrc = p.imgSrc;
  let audioSrc = p.audioSrc;

  //if the file path starts with /images or /audio
  if (imgSrc.startsWith("/images")) {
    imgSrc = `${API}/public${imgSrc}`;
  }
  if (audioSrc.startsWith("/audio")) {
    audioSrc = `${API}/public${audioSrc}`;
  }

  //if uploaded via server → should start with /uploads already
  if (imgSrc.startsWith("/uploads")) {
    imgSrc = `${API}${p.imgSrc}`;
  }
  if (audioSrc.startsWith("/uploads")) {
    audioSrc = `${API}${p.audioSrc}`;
  }

  return {
    ...p,
    imgSrc,
    audioSrc,
  };
});
    //render
    feed.innerHTML = posts
      .map(
        (p) => `
        <div class="post-card" data-id="${p._id}">
          <article>
            <img src="${p.imgSrc}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p><strong>${p.artist}</strong></p>
            <p>${p.genre}</p>
            <audio controls>
              <source src="${p.audioSrc}" type="audio/mpeg" />
            </audio>
          </article>
        </div>
      `
      )
      .join("");

    //click handler
    document.querySelectorAll(".post-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.tagName === "AUDIO" || e.target.tagName === "SOURCE") return;

        const id = card.getAttribute("data-id");
        if (id) window.location.href = `post.html?id=${id}`;
      });
    });
  } catch (err) {
    console.error("Feed load error:", err);
    feed.innerHTML = `<p style="color:red;">Failed to load posts.</p>`;
  }
}