import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("github-avatar")
export class githubAvatar extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .avatar-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      background: var(--bg-alt);
      border: 2px solid var(--border);
    }
    .avatar-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  `;

  @property({ type: String }) username: string | null = null;
  @property({ type: Number }) height: number = 32;
  @property({ type: Number }) width: number = 32;

  render() {
    return html`
      <div
        class="avatar-wrap"
        style="width: ${this.width}px; height: ${this.height}px;"
      >
        <img
          src="https://github.com/${this.username}.png"
          alt="${this.username}"
        />
      </div>
    `;
  }
}
