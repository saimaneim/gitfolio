import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { LanguageRecord } from "@/components/github-profile-content";
import { GITHUB_ICONS } from "@/lib/utils";
import { languageColors } from "@/styles/language-colors";

export interface Repo {
  name: string;
  language: string;
  languages: LanguageRecord;
  description: string;
  stargazers_count: number;
}

@customElement("github-popular-repos")
export class GithubPopularRepos extends LitElement {
  static styles = css`
    .popular-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 32px;
    }

    .repo-card {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: border-color 0.15s;
      text-decoration: none;
    }
    .repo-card:hover {
      border-color: var(--border-hover);
    }

    .repo-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .repo-card-header svg {
      width: 16px;
      height: 16px;
      fill: var(--text-muted);
      flex-shrink: 0;
    }
    .repo-card-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-link);
    }
    .repo-card-visibility {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1px 7px;
      margin-left: auto;
    }

    .repo-card-desc {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
      flex: 1;
    }

    .repo-card-meta {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .repo-card-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .lang-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 0px;
    }

    .lang-dot + strong {
      color: var(--text);
    }

    ${languageColors}
  `;

  @property({ type: Array }) repos: Repo[] = [];

  render() {
    return html`
      <div class="popular-grid">
        ${this.repos.length === 0
          ? html`<p>No repos found</p>`
          : this.repos.map((repo) => {
              return html`<a class="repo-card" href="#">
                <div class="repo-card-header">
                  <svg
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    data-view-component="true"
                    class="octicon octicon-repo mr-1 tmp-mr-1 color-fg-muted"
                  >
                    <path d="${GITHUB_ICONS.repo}"></path>
                  </svg>
                  <span class="repo-card-name">${repo.name}</span>
                  <span class="repo-card-visibility">Public</span>
                </div>
                <div class="repo-card-desc">${repo.description}</div>
                <div class="repo-card-meta">
                  ${Object.keys(repo.languages).length > 0
                    ? html`<span style="display: flex; gap: 8px;">
                        ${Object.keys(repo.languages).map(
                          (language) =>
                            html`<span class="lang-dot" data-lang="${language}">
                              </span>
                              <strong>${language}</strong> `,
                        )}
                      </span>`
                    : ""}
                  <span>⭐ ${repo.stargazers_count}</span>
                </div>
              </a>`;
            })}
      </div>
    `;
  }
}
