import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

const API_BASE = "http://localhost:3000";
const CLIENT_BASE = "http://localhost:5173";

export class DraPostElement extends LitElement {
  @property({ attribute: "img-src" }) imgSrc = "";
  @property({ attribute: "audio-src" }) audioSrc = "";
  @property() title = "";
  @property() artist = "";
  @property() genre = "";
  @property({ attribute: "post-id" }) postId?: string; // for click-through if you want later

  private resolveUrl(path: string) {
    if (!path) return "";
    // uploads live on the server
    if (path.startsWith("/uploads/")) return `${API_BASE}${path}`;
    // everything in proto/public is served by vite at / (root)
    return `${CLIENT_BASE}${path}`;
  }

  override render() {
    const img = this.resolveUrl(this.imgSrc);
    const audio = this.resolveUrl(this.audioSrc);

    return html`
      <article>
        ${img ? html`<img src=${img} alt="Cover for ${this.title}" />` : null}
        <h3>${this.title}</h3>
        <p><strong>${this.artist}</strong></p>
        <p>${this.genre}</p>
        ${audio
          ? html`
              <audio controls>
                <source src=${audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            `
          : null}
      </article>
    `;
  }

  static styles = css`
    article {
      background-color: var(--color-background-card);
      color: var(--color-text-default);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 1rem;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: transform .2s ease;
    }
    article:hover { transform: scale(1.02); }
    img {
      width: 100%;
      border-radius: .5rem;
      margin-bottom: .5rem;
      object-fit: cover;
    }
    h3 { margin: .3rem 0; font-weight: 700; }
    p { margin: .2rem 0; }
    audio { width: 100%; margin-top: .5rem; }
  `;
}

customElements.define("dra-post", DraPostElement);