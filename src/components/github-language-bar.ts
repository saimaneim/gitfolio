import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { LanguageRecord } from "@/components/github-profile-content";
import { languageColors } from "@/styles/language-colors";

@customElement("github-language-bar")
export class GithubLanguageBar extends LitElement {
  static styles = css`
    .lang-bar {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      padding-top: 0px;
      margin-bottom: 32px;
    }

    .lang-bar h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .lang-segments {
      display: flex;
      border-radius: 4px;
      overflow: hidden;
      height: 8px;
      margin-bottom: 12px;
      gap: 2px;
    }
    .lang-segment {
      border-radius: 3px;
      transition: opacity 0.15s;
    }
    .lang-segment:hover {
      opacity: 0.75;
      cursor: pointer;
    }
    .lang-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .lang-list-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .lang-list-item strong {
      color: var(--text);
    }

    .lang-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0px;
    }
    ${languageColors}
  `;

  @property({ type: Object }) languages: LanguageRecord | undefined;

  render() {
    if (!this.languages || Object.keys(this.languages).length === 0) {
      return html`<div>Loading languages...</div>`;
    }

    const total = Object.values(this.languages).reduce((a, b) => a + b, 0);
    const sortedLangs = Object.entries(this.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    return html`
      <div class="lang-bar">
        <h3>Most used languages</h3>
        <div class="lang-segments">
          ${sortedLangs.map(([lang, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return html`
              <div
                class="lang-segment"
                style="width: ${percentage}%;"
                data-lang="${lang}"
                title="${lang} ${percentage}%"
              ></div>
            `;
          })}
        </div>
        <div class="lang-list">
          ${sortedLangs.map(([lang, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return html`
              <div class="lang-list-item">
                <span class="lang-dot" data-lang="${lang}"></span
                ><strong>${lang}</strong> ${percentage}%
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}
