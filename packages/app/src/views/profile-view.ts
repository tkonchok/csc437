import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { apiFetch } from "../services/api";

interface Profile {
  username: string;
  userType?: string;
  avatarSrc?: string;
  bio?: string;
}

interface Post {
  _id?: string;
  title?: string;
  audioSrc?: string;
  imgSrc?: string;
}

export class ProfileView extends View {
  static properties = {
    profile: { state: true },
    posts: { state: true }
  };

  profile: Profile | null = null;
  posts: Post[] = [];

  static styles = css`
    section.profile {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 12px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .avatar {
      border-radius: 50%;
      width: 180px;
      height: 180px;
      object-fit: cover;
      margin-bottom: 0.5rem;
      border: 3px solid #14d972;
    }

    form {
      margin: 1rem 0;
    }

    textarea {
      width: 100%;
      min-height: 100px;
      resize: vertical;
    }

    input[type="file"] {
      display: block;
      margin: 0.5rem auto;
    }

    button {
      margin-top: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: 8px;
      border: none;
      background: #14d972;
      font-weight: 600;
      cursor: pointer;
    }

    ul.posts {
      list-style: none;
      padding: 0;
      margin: 1rem 0 0;
      text-align: left;
    }

    ul.posts li {
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #ddd;
    }
  `;

  constructor() {
    super("wave:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadAll();
  }

  private async loadAll() {
    await Promise.all([this.loadProfile(), this.loadPosts()]);
  }

  private async loadProfile() {
    try {
      const data = await apiFetch("/profile/me");
      this.profile = data as Profile;
    } catch (err) {
      console.error("Profile load error:", err);
      this.profile = null;
    }
  }

  private async loadPosts() {
    try {
      const data = await apiFetch("/profile/me/posts");
      this.posts = Array.isArray(data) ? (data as Post[]) : [];
    } catch (err) {
      console.error("Post load error:", err);
      this.posts = [];
    }
  }

  async saveBio(event: Event) {
    event.preventDefault();
    const textarea = this.renderRoot.querySelector("#bio") as HTMLTextAreaElement | null;
    const bio = textarea?.value ?? "";

    try {
      const updated = await apiFetch("/profile/me", {
        method: "PUT",
        body: JSON.stringify({ bio })
      });

      this.profile = updated as Profile;
      alert("Bio updated!");
    } catch (err) {
      console.error("Bio update error:", err);
      alert("Bio update failed.");
    }
  }

  async uploadAvatar(event: Event) {
    event.preventDefault();
    const input = this.renderRoot.querySelector("#avatar") as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      alert("Select a file first!");
      return;
    }

    const form = new FormData();
    form.append("avatar", file);

    try {
      const updated = await apiFetch("/profile/me/avatar", {
        method: "POST",
        body: form
      });

      //Update + force image refresh (cache bust)
      const p = updated as Profile;
      this.profile = {
        ...p,
        avatarSrc: p.avatarSrc ? `${p.avatarSrc}?t=${Date.now()}` : ""
      };

      alert("Avatar updated!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Avatar upload failed.");
    }
  }

  render() {
    if (!this.profile) return html`<p>Loading profile...</p>`;

    const avatar = this.profile.avatarSrc || "/images/default-avatar.png";

    return html`
      <section class="profile">
        <!--Title should be username-->
        <h2>${this.profile.username}</h2>

        <img class="avatar" src="${avatar}" alt="avatar" />

        <form @submit=${this.uploadAvatar}>
          <input id="avatar" type="file" name="avatar" accept="image/*" />
          <button type="submit">Upload Avatar</button>
        </form>

        <h3>About you</h3>
        <form @submit=${this.saveBio}>
          <textarea id="bio">${this.profile.bio || ""}</textarea>
          <button type="submit">Save Bio</button>
        </form>

        <h3>Your Tracks</h3>
        ${this.posts.length === 0
          ? html`<p>You haven't uploaded any tracks yet.</p>`
          : html`
              <ul class="posts">
                ${this.posts.map(
                  (p) => html`
                    <li>
                      <strong>${p.title || "(untitled)"}</strong><br />
                      ${p.audioSrc
                        ? html`<audio controls src="${p.audioSrc}"></audio>`
                        : html`<em>No audio</em>`}
                    </li>
                  `
                )}
              </ul>
            `}
      </section>
    `;
  }
}