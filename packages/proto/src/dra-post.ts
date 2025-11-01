import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

export class DraPostElement extends LitElement {
  @property({ attribute: "img-src" }) imgSrc?: string;
  @property() artist?: string;
  @property({ attribute: "title" }) trackTitle?: string;
  @property() genre?: string;
  @property() duration?: string;
  @property({ attribute: "audio-src" }) audioSrc?: string;

  override render() {
    return html`
      <article>
        <h3>${this.artist}</h3>
        <img src=${this.imgSrc} alt="Album cover" />
        <audio controls>
          <source src=${this.audioSrc} type="audio/mpeg" />
        </audio>
        <div class="track-details">
          <p><strong>Track:</strong> ${this.trackTitle}</p>
          <p><strong>Genre:</strong> ${this.genre}</p>
          <p><strong>Duration:</strong> ${this.duration}</p>
        </div>
        <p>
          <a href="locked.html">Collaborate</a> |
          <a href="locked.html">Feedback</a>
        </p>
      </article>
    `;
  }

  static styles = [
    reset.styles,
    css`
      article {
        background-color: var(--color-background-card);
        color: var(--color-text);
        padding: 1rem;
        border-radius: 1rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        text-align: center;
      }
      img {
        width: 100%;
        border-radius: 0.5rem;
      }
      audio {
        width: 100%;
        margin-top: 0.5rem;
      }
    `
  ];
}
