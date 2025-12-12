//src/components/dra-header.ts
console.log("DRA-HEADER LOADED FROM:", import.meta.url);
import { LitElement, html, css } from "lit";
import { apiFetch } from "../services/api";

type HeaderUser = {
  username: string;
  avatarSrc?: string;
};

export class DraHeader extends LitElement {
  static properties = {
    user: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
    }
    header {
      background: var(--bg-header, #14d972);
      color: var(--text-header, #000);
      border-bottom: 2px solid var(--green, #14d972);
      padding: 1rem 2rem;
    }
    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .logo img {
      height: 60px;
    }
    .header-center {
      flex: 1;
      text-align: center;
    }
    .slogan {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    nav ul {
      list-style: none;
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 0;
      margin: 0;
      align-items: center;
    }
    nav a {
      color: inherit;
      text-decoration: none;
      font-weight: 600;
      padding: 0.4rem 0.8rem;
      border-radius: 10px;
      transition: 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    nav a:hover {
      background: var(--green, #14d972);
      color: #000;
    }

    /* ✅ avatar in nav */
    .nav-avatar {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      object-fit: cover;
      border: 2px solid var(--green, #14d972);
      display: block;
    }

    .dark-toggle label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      font-weight: 500;
    }
  `;

  user: HeaderUser | undefined = undefined;

  async connectedCallback() {
    super.connectedCallback();

    const username = localStorage.getItem("dra_username") || "";
    const token = localStorage.getItem("dra_token") || localStorage.getItem("mu:auth:jwt") || "";

    if (!username || !token) {
      this.user = undefined;
      return;
    }

    // ✅ load avatarSrc from backend
    try {
      const profile = (await apiFetch("/profile/me")) as any;
      this.user = {
        username: profile?.username ?? username,
        avatarSrc: profile?.avatarSrc ?? ""
      };
    } catch {
      // fallback to username only
      this.user = { username };
    }
  }

  render() {
    const u = this.user;
    const loggedIn = !!u;
    const username = u?.username;
    const avatarSrc = u?.avatarSrc || "";

    // cache-bust avatar so header updates immediately after upload
    const avatarUrl = avatarSrc ? `${avatarSrc}?t=${Date.now()}` : "";

    return html`
      <header>
        <div class="header-row">
          <div class="logo">
            <a href="/app/home" data-navigation>
              <img src="/images/Logo.png" alt="DraWave Logo" />
            </a>
          </div>

          <div class="header-center">
            <h2 class="slogan">"Where Artists Share Ideas"</h2>

            <nav>
              <ul>
                <li><a href="/app/home" data-navigation>Home</a></li>

                ${loggedIn
                  ? html`
                      <li><a href="/app/upload" data-navigation>Upload</a></li>
                      <li><a href="/app/messages" data-navigation>Messages</a></li>

                      <!-- ✅ avatar link OR username link -->
                      <li>
                        <a href="/app/profile/${username}" data-navigation>
                          ${avatarUrl
                            ? html`<img class="nav-avatar" src="${avatarUrl}" alt="avatar" />`
                            : html`${username}`}
                        </a>
                      </li>

                      <li>
                        <a href="/app/login" @click=${this.logout} data-navigation>
                          Logout
                        </a>
                      </li>
                    `
                  : html`
                      <li><a href="/app/login" data-navigation>Sign In</a></li>
                      <li><a href="/app/signup" data-navigation>Sign Up</a></li>
                    `}
              </ul>
            </nav>
          </div>

          <div class="dark-toggle">
            <label>
              <input type="checkbox" @change=${this.toggleDarkMode} />
              Dark Mode
            </label>
          </div>
        </div>
      </header>
    `;
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    localStorage.removeItem("dra_token");
    localStorage.removeItem("dra_username");
    localStorage.removeItem("mu:auth:jwt");
    window.location.assign("/app/login");
  }

  toggleDarkMode(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    document.documentElement.classList.toggle("dark-mode", checked);
  }
}