import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

type AudioPost = {
  _id?: string;
  artist: string;
  title: string;
  genre: string;
  imgSrc: string;
  audioSrc: string;
};

export class DraFeedElement extends LitElement {
  @property() src = "";
  @state() posts: AudioPost[] = [];
  @state() loading = true;
  @state() error: string | null = null;

  override connectedCallback() {
    super.connectedCallback();
    if (this.src) this.loadFeed();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("src") && this.src) {
      this.loadFeed();
    }
  }

  private async loadFeed() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      this.posts = Array.isArray(json) ? json : [];
    } catch (err) {
      console.error("Feed load failed:", err);
      this.error = "Unable to load posts.";
    } finally {
      this.loading = false;
    }
  }

  override render() {
    if (this.loading) return html`<p>Loading posts...</p>`;
    if (this.error) return html`<p class="error">${this.error}</p>`;
    if (!this.posts.length) return html`<p>No posts yet.</p>`;

    return html`
      <section class="feed">
        ${this.posts.map(
          (p) => html`
            <dra-post
              title=${p.title}
              artist=${p.artist}
              genre=${p.genre}
              img-src=${p.imgSrc || ""}
              audio-src=${p.audioSrc || ""}
              post-id=${p._id || ""}
            ></dra-post>
          `
        )}
      </section>
    `;
  }

  static styles = css`
    .feed {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 2rem;
      justify-content: start;
    }
    .error { color: crimson; text-align: center; }
  `;
}

customElements.define("dra-feed", DraFeedElement);