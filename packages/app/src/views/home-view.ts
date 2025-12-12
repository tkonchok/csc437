// app/src/views/home-view.ts
import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";

import type { Model, AudioPost } from "../model";
import type { Msg } from "../messages";

export class HomeView extends View<Model, Msg> {
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
      margin-bottom: 0.25rem;
    }

    .artist {
      font-size: 0.95rem;
      color: #666;
      margin-bottom: 0.75rem;
    }

    audio {
      width: 100%;
      margin-top: 0.4rem;
    }
  `;

  constructor() {
    // "wave:model" must match provides="wave:model" on <mu-store>
    super("wave:model");
  }

  get posts() {
  return this.model.posts ?? [];
  }

  connectedCallback() {
    super.connectedCallback();
    // Ask the store to fetch posts
    this.dispatchMessage(["posts/request", {}]);
  }

  private renderPostCard(post: AudioPost) {
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
    const posts = this.posts ?? [];

    if (posts.length === 0) {
      return html`
        <h2>Discover New Sounds</h2>
        <p>Loading posts...</p>
      `;
    }

    return html`
      <h2>Discover New Sounds</h2>
      <p>Explore posts created by the community.</p>
      ${posts.map((p) => this.renderPostCard(p))}
    `;
  }
}