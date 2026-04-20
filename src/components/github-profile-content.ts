import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@/components/github-popular-repos";
import "@/components/github-language-bar";
import "@/components/github-heatmap";
import "@/components/github-events";
import type { Repo } from "@/components/github-popular-repos";
import { githubFetch } from "@/lib/api";

export type LanguageRecord = Record<string, number>;

@customElement("github-profile-content")
export class GithubProfileContent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .section-title a {
      font-size: 13px;
      font-weight: 400;
      color: var(--text-link);
      text-decoration: none;
    }
    .section-title a:hover {
      text-decoration: underline;
    }
  `;

  @property() username: string = "";
  @state() repos: Repo[] = [];
  @state() languages: LanguageRecord = {};

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("username")) {
      this.getRepos();
    }
  }

  protected async firstUpdated() {
    await this.getRepos();
  }

  async getRepos() {
    if (!this.username) return;
    const response = await githubFetch(
      `/users/${this.username}/repos?sort=stars&per_page=4`,
    );

    const data: Repo[] = await response.json();
    const languages = await Promise.all(
      data.map((repo) =>
        githubFetch(`/repos/${this.username}/${repo.name}/languages`),
      ),
    );
    const languagesData = await Promise.all(
      languages.map((language) => language.json()),
    );
    data.forEach((repo, index) => {
      repo.languages = languagesData[index];
    });

    const totalLanguages: LanguageRecord = {};
    languagesData.forEach((langRecord) => {
      Object.entries(langRecord).forEach(([lang, count]) => {
        totalLanguages[lang] = (totalLanguages[lang] || 0) + (count as number);
      });
    });

    this.languages = totalLanguages;
    this.repos = [...data];
  }

  render() {
    return html`
      <main class="main">
        <div class="section-title">
          <span>Popular Repositories</span>

          <a href="#">Customize your pins</a>
        </div>
        <github-popular-repos
          .repos=${this.repos}
          .username=${this.username}
        ></github-popular-repos>

        <github-language-bar .languages=${this.languages}></github-language-bar>

        <github-heatmap username=${this.username} year="2026"></github-heatmap>

        <github-events username=${this.username}></github-events>
      </main>
    `;
  }
}
