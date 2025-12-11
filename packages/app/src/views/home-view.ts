import { LitElement, html, css } from "lit";

export class HomeView extends LitElement {
  static styles = css`
    .post {
      margin: 1rem auto;
      padding: 1rem;
      max-width: 800px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #fff;
    }

    .cover {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .title {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 0.4rem;
    }

    audio {
      width: 100%;
      margin-top: 0.4rem;
    }
  `;

  static properties = {
    posts: { type: Array }
  };

  constructor() {
    super();
    this.posts = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadPosts();
  }

  async loadPosts() {
  try {
    const response = await fetch("/api/audioposts_rest");
    if (!response.ok) throw new Error("Failed to load posts");
    this.posts = await response.json();
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

  renderPostCard(post) {
  return html`
    <div class="post">
      <img class="cover" src="${post.imgSrc}" alt="${post.title}" />

      <div class="title">${post.title}</div>
      <div class="artist">${post.artist}</div>

      <audio controls>
        <source src="${post.audioSrc}" type="audio/wav" />
      </audio>
    </div>
  `;
}

  render() {
    return html`
      <h2>Discover New Sounds</h2>
      <p>Explore posts created by the community.</p>

      ${this.posts.length === 0
        ? html`<p>Loading posts...</p>`
        : this.posts.map((post) => this.renderPostCard(post))}
    `;
  }
}