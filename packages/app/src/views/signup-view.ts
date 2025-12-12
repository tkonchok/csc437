import { View } from "@calpoly/mustang";
import { html } from "lit";
import type { Model, Msg } from "../model";

export class SignupView extends View<Model, Msg> {
  constructor() {
    super("wave:model");
  }

  render() {
    return html`
      <section class="signup">
        <h2>Create Account</h2>

        <form @submit=${this.handleSubmit}>
          <label>Username</label>
          <input name="username" required />

          <label>Password</label>
          <input name="password" type="password" required />

          <label>User Type</label>
          <select name="userType" required>
            <option value="artist">Artist</option>
            <option value="curator">Curator</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>

        <p><a href="/app/login" data-navigation>Already have an account?</a></p>
      </section>
    `;
  }

  private async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    const username = data.get("username");
    const password = data.get("password");
    const userType = data.get("userType");

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, userType })
      });

      if (!res.ok) {
        const msg = await res.text();
        alert("Signup failed: " + msg);
        return;
      }

      alert("Account created successfully! Please log in.");
      window.location.assign("/app/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Unexpected error during signup.");
    }
  }
}