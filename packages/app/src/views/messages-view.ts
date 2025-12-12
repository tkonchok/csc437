import { View } from "@calpoly/mustang";
import { html } from "lit";
import { Model, Msg } from "../model";
import { apiFetch } from "../services/api";

interface Message {
  _id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
}

export class MessagesView extends View<Model, Msg> {
  static properties = {
    messages: { state: true }
  };

  messages: Message[] = [];

  constructor() {
    super("wave:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadMessages();
  }

  private async loadMessages() {
    try {
      const data = await apiFetch("/messages");
      this.messages = (data as Message[]) || [];
    } catch (err) {
      console.error("Load messages error:", err);
    }
  }

  private async handleSend(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const to = String(fd.get("to") ?? "");
    const text = String(fd.get("text") ?? "");

    if (!to || !text) return;

    try {
      await apiFetch("/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, text })
      });

      form.reset();
      await this.loadMessages();
    } catch (err) {
      console.error("Send message error:", err);
      alert("Could not send message.");
    }
  }

  render() {
    return html`
      <section class="messages-page">
        <div class="messages-card">
          <h2>Messages</h2>

          <section class="messages-inbox">
            <h3>Your Inbox</h3>

            ${this.messages.length === 0
              ? html`<p>No messages.</p>`
              : html`
                  <ul>
                    ${this.messages.map(
                      (m) => html`
                        <li>
                          <div class="msg-meta">
                            <span class="msg-from">${m.from}</span>
                            <span class="msg-arrow">→</span>
                            <span class="msg-to">${m.to}</span>
                            <span class="msg-time">
                              ${new Date(m.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div class="msg-text">${m.text}</div>
                        </li>
                      `
                    )}
                  </ul>
                `}
          </section>

          <section class="messages-send">
            <h3>Send Message</h3>

            <form class="messages-form" @submit=${this.handleSend}>
              <label>
                To (username)
                <input name="to" required />
              </label>

              <label>
                Message
                <textarea name="text" rows="3" required></textarea>
              </label>

              <button type="submit">Send</button>
            </form>
          </section>
        </div>
      </section>
    `;
  }
}