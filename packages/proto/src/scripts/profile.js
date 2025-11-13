//proto/src/scripts/profile.js
const API = "http://localhost:3000";

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
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    window.location.href = "login.html";
    return;
  }

  const avatarImg = document.getElementById("profile-avatar");
  const avatarInput = document.getElementById("avatar-upload");
  const bioInput = document.getElementById("bio");
  const msgEl = document.getElementById("profile-msg");
  const form = document.getElementById("profile-form");
  const myPosts = document.getElementById("my-posts");

  // LOAD PROFILE
  async function loadProfile() {
    try {
      const res = await fetch(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to load profile");
      const user = await res.json();

      // Avatar
      if (user.avatarSrc) {
        const fullUrl = `${API}${user.avatarSrc}`;
        avatarImg.src = fullUrl;
        localStorage.setItem("avatar", fullUrl);
      }

      // Bio
      bioInput.value = user.bio || "";

    } catch (err) {
      console.error(err);
      msgEl.textContent = "Failed to load profile.";
      msgEl.style.color = "red";
    }
  }

  // LOAD USER’S POSTS
  async function loadMyPosts() {
    try {
      // FIXED: must be artist= not user=
      const res = await fetch(
        `${API}/api/posts?artist=${encodeURIComponent(username)}`
      );

      if (!res.ok) throw new Error("Failed to load posts");

      const posts = await res.json();

      if (!Array.isArray(posts) || posts.length === 0) {
        myPosts.innerHTML = "<p>You haven't uploaded any tracks yet.</p>";
        return;
      }

      //prefix API to image & audio
      myPosts.innerHTML = posts.map(
        (p) => `
          <article>
            <img src="${API + p.imgSrc}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p><strong>${p.artist}</strong></p>
            <p>${p.genre}</p>
            <audio controls>
              <source src="${API + p.audioSrc}" type="audio/mpeg" />
            </audio>
          </article>
        `
      ).join("");

    } catch (err) {
      console.error(err);
      myPosts.innerHTML = "<p>Failed to load your tracks.</p>";
    }
  }

  // SAVE BIO + AVATAR
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgEl.textContent = "";

    const tasks = [];

    //AVATAR UPLOAD
    if (avatarInput.files && avatarInput.files[0]) {
      const fd = new FormData();
      fd.append("avatar", avatarInput.files[0]);

      tasks.push(
        fetch(`${API}/profile/me/avatar`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        })
          .then((res) => res.json())
          .then((user) => {
            if (user.avatarSrc) {
              const full = `${API}${user.avatarSrc}`;
              avatarImg.src = full;
              localStorage.setItem("avatar", full);
            }
          })
      );
    }

    //BIO UPDATE
    tasks.push(
      fetch(`${API}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bio: bioInput.value })
      })
    );

    try {
      await Promise.all(tasks);
      msgEl.style.color = "lime";
      msgEl.textContent = "Profile updated!";
    } catch (err) {
      console.error(err);
      msgEl.style.color = "red";
      msgEl.textContent = "Failed to update profile.";
    }
  });
  
  loadProfile();
  loadMyPosts();
});