import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface Post {
  artist: string;
  title: string;
  genre: string;
  duration: string;
  imgSrc: string;
  audioSrc: string;
}

export class DraFeedElement extends LitElement {
  @property() src?: string;

  @state() posts: Array<Post> = [];
  @state() loading: boolean = true;
  @state() error: string | null = null;

  override connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  async hydrate(src: string) {
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Array<Post>;
      this.posts = json;
      this.loading = false;
    } catch (err: any) {
      console.error("Feed load failed:", err);
      this.error = "Could not load posts. Please try again later.";
      this.loading = false;
    }
  }

  override render() {
    if (this.loading) {
      return html`<p class="status">Loading posts...</p>`;
    }

    if (this.error) {
      return html`<p class="status error">${this.error}</p>`;
    }

    return html`
      <section class="feed">
        ${this.posts.map(
          (post) => html`
            <dra-post
              artist=${post.artist}
              title=${post.title}
              genre=${post.genre}
              duration=${post.duration}
              img-src=${post.imgSrc}
              audio-src=${post.audioSrc}
            ></dra-post>
          `
        )}
      </section>
    `;
  }

  static styles = css`
    .feed {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    .status {
      text-align: center;
      font-size: 1.2rem;
      color: var(--color-text);
      margin: 2rem 0;
    }
    .status.error {
      color: crimson;
    }
  `;
}
