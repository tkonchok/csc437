// packages/app/src/views/upload-view.ts
import { View, History } from "@calpoly/mustang";
import { html } from "lit";
import type { Model } from "../model";

export class UploadView extends View<Model> {
  constructor() {
    super("wave:model");
  }

  render() {
    return html`
      <section class="upload-page">
        <h2>Upload New Track</h2>

        <form
          class="upload-form"
          enctype="multipart/form-data"
          @submit=${this.handleSubmit}
        >
          <label>
            Title
            <input name="title" required />
          </label>

          <label>
            Genre
            <input name="genre" />
          </label>

          <label>
            Cover Image
            <input type="file" name="image" accept="image/*" />
          </label>

          <label>
            Audio File
            <input type="file" name="audio" accept="audio/*" required />
          </label>

          <button type="submit">Upload</button>
        </form>
      </section>
    `;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/audioposts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("dra_token")}`
        },
        body: data
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      alert("Upload successful!");
      History.dispatch(this, "history/navigate", {
        href: "/app/home"
      });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  }
}