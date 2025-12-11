import { LitElement, html, css } from "lit";

export class DraHeader extends LitElement {
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
    }
    nav a {
      color: inherit;
      text-decoration: none;
      font-weight: 600;
      padding: 0.4rem 0.8rem;
      border-radius: 10px;
      transition: 0.3s;
    }
    nav a:hover {
      background: var(--green, #14d972);
      color: #000;
    }
    .dark-toggle label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      font-weight: 500;
    }
  `;

  render() {
    return html`
      <header>
        <div class="header-row">
          <div class="logo">
            <a href="/app/home">
              <img src="/images/Logo.png" alt="Dra.Wave Logo" />
            </a>
          </div>

          <div class="header-center">
            <h2 class="slogan">"Where Artists Share Ideas"</h2>
            <nav>
              <ul>
                <li><a href="/app/home">Home</a></li>
                <li><a href="/upload.html">Upload</a></li>
                <li><a href="/messages.html">Messages</a></li>
                <li><a href="/profile.html">Profile</a></li>
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

  private toggleDarkMode(event: Event) {
    const checked = (event.currentTarget as HTMLInputElement).checked;
    const htmlEl = document.documentElement;
    if (checked) {
      htmlEl.classList.add("dark-mode");
    } else {
      htmlEl.classList.remove("dark-mode");
    }
  }
}