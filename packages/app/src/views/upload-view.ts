import { View, Auth } from "@calpoly/mustang";
import { html } from "lit";
import { Model, Msg } from "../model";

export class UploadView extends View<Model, Msg> {
  constructor() {
    super("wave:model");
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await Auth.fetch("/api/audioposts", {
        method: "POST",
        body: data
      });

      if (!res.ok) {
        console.error(await res.text());
        alert("Upload failed.");
        return;
      }

      alert("Track uploaded!");
      form.reset();
      window.location.href = "/app/home";
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  }

  render() {
    return html`
      <section class="upload-page">
        <div class="upload-card">
          <h2>Upload New Track</h2>

          <form class="upload-form" @submit=${this.handleSubmit}>
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
              <input
                type="file"
                name="coverImage"
                accept="image/*"
              />
            </label>

            <label>
              Audio File
              <input
                type="file"
                name="audioFile"
                accept="audio/*"
                required
              />
            </label>

            <button type="submit">Upload</button>
          </form>
        </div>
      </section>
    `;
  }
}