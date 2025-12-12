// src/views/login-view.ts
import { View } from "@calpoly/mustang";
import { html } from "lit";
import type { Model, Msg } from "../model";

export class LoginView extends View<Model, Msg> {
  constructor() {
    super("wave:model");
  }

  render() {
    return html`
      <section class="login">
        <h2>Sign In</h2>

        <form @submit=${this.handleSubmit}>
          <label>
            Username
            <input name="username" required />
          </label>

          <label>
            Password
            <input name="password" type="password" required />
          </label>

          <button type="submit">Sign In</button>
        </form>
      </section>
    `;
  }

  private async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const username = (data.get("username") as string | null)?.trim();
    const password = (data.get("password") as string | null) || "";

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        alert("Login failed (wrong username or password).");
        return;
      }

      const { token } = (await res.json()) as { token: string };

      // ✅ Store token + username for the rest of the app
      localStorage.setItem("dra_token", token);
      localStorage.setItem("dra_username", username);

      // Optionally clear old Mustang token if it exists
      localStorage.removeItem("mu:auth:jwt");

      // ✅ Hard redirect so header re-runs connectedCallback
      window.location.assign("/app/home");
    } catch (err) {
      console.error("Login error:", err);
      alert("Error logging in. Is the server running on :3000?");
    }
  }
}