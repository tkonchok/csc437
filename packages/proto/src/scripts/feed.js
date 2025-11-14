const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", loadFeed);

//stop multiple audios playing
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
    const res = await fetch(`${API}/api/posts`);
    let posts = await res.json();

    //map static/DB file paths to actual URLs
    posts = posts.map((p) => {
      let imgSrc = p.imgSrc;
      let audioSrc = p.audioSrc;

      //static files
      if (imgSrc.startsWith("/images")) {
        imgSrc = `${API}${imgSrc}`;
      }
      if (audioSrc.startsWith("/audio")) {
        audioSrc = `${API}${audioSrc}`;
      }

      //Uploaded files (in /uploads)
      if (imgSrc.startsWith("/uploads")) {
        imgSrc = `${API}${imgSrc}`;
      }
      if (audioSrc.startsWith("/uploads")) {
        audioSrc = `${API}${audioSrc}`;
      }

      return {
        ...p,
        imgSrc,
        audioSrc,
      };
    });

    //render posts
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

    //click handler → go to post page
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