import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { githubFetch } from "@/lib/api";
import { getDaysAgo, getEventIcon } from "@/lib/utils";

interface Repo {
  name: string;
  url: string;
}

interface Event {
  type: string;
  repo: Repo;
  created_at: string;
  payload: {
    action?: string;
    issue?: {
      number: number;
      title: string;
      html_url: string;
    };
    label?: {
      name: string;
    };
    pull_request?: {
      title: string;
      html_url: string;
    };
    ref?: string;
    ref_type?: string;
    description?: string;
  };
}

@customElement("github-events")
export class GithubEvents extends LitElement {
  @property({ type: String }) username: string | null = null;
  @property({ type: Array }) events: Event[] = [];

  static styles = css`
    :host {
      display: block;
    }

    .activity-section {
      margin-bottom: 32px;
    }

    .activity-item {
      display: flex;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
      align-items: flex-start;
    }
    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-alt);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .activity-icon svg {
      width: 16px;
      height: 16px;
      fill: var(--text-muted);
    }

    .activity-body {
      flex: 1;
    }
    .activity-body p {
      font-size: 14px;
      color: var(--text);
      line-height: 1.5;
      margin: 0;
    }
    .activity-body p a {
      color: var(--text-link);
      text-decoration: none;
      font-weight: 500;
    }
    .activity-body p a:hover {
      text-decoration: underline;
    }
    .activity-body time {
      font-size: 12px;
      color: var(--text-muted);
      display: block;
      margin-top: 2px;
    }
  `;

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("username")) {
      this.getEvents();
    }
  }

  protected firstUpdated(): void {
    this.getEvents();
  }

  async getEvents() {
    if (!this.username) return;
    const response = await githubFetch(
      `/users/${this.username}/events?per_page=5`,
    );
    const data = await response.json();
    this.events = data;
  }

  private renderEventIcon(event: Event) {
    const path = getEventIcon(event.type);
    return html`<svg viewBox="0 0 16 16"><path d="${path}" /></svg>`;
  }

  private renderEventContent(event: Event) {
    const repoName = event.repo.name;
    const repoUrl = `https://github.com/${repoName}`;

    switch (event.type) {
      case "PushEvent": {
        const branch = event.payload.ref?.replace("refs/heads/", "");
        return html`Pushed to ${branch ? html`<code>${branch}</code>` : ""} at
          <a href="${repoUrl}">${repoName}</a>`;
      }
      case "IssuesEvent": {
        const issue = event.payload.issue;
        const action = event.payload.action;
        const label = event.payload.label?.name;
        return html`
          ${
            action === "opened"
              ? "Opened"
              : html`Added <code>${label}</code> to`
          }
          issue <a href="${issue?.html_url}">${issue?.title}</a> in
          <a href="${repoUrl}">${repoName}</a>
        `;
      }
      case "CreateEvent":
        return html`Created ${event.payload.ref_type}
          ${event.payload.ref ? html`<code>${event.payload.ref}</code>` : ""} in
          <a href="${repoUrl}">${repoName}</a>`;
      case "PullRequestEvent": {
        const pr = event.payload.pull_request;
        const action = event.payload.action;
        return html`
          ${action === "opened" ? "Opened" : "Merged"} pull request
          <a href="${pr?.html_url}">${pr?.title}</a> in
          <a href="${repoUrl}">${repoName}</a>
        `;
      }
      case "IssueCommentEvent": {
        const issue = event.payload.issue;
        return html`
          Commented on issue <a href="${issue?.html_url}">${issue?.title}</a> in
          <a href="${repoUrl}">${repoName}</a>
        `;
      }
      case "DeleteEvent": {
        return html`Deleted ${event.payload.ref_type}
          <code>${event.payload.ref}</code> in
          <a href="${repoUrl}">${repoName}</a>`;
      }
      default:
        console.log(event);
        return html`Performed activity in <a href="${repoUrl}">${repoName}</a>`;
    }
  }

  render() {
    return html`<div>
      <div class="section-title">
        <span
          >${
            this.events.length > 0 ? "Recent activity" : "No recent activity"
          }</span
        >
      </div>

      ${this.events.map((event) => {
        return html` <div class="activity-item">
          <div class="activity-icon">${this.renderEventIcon(event)}</div>
          <div class="activity-body">
            <p>${this.renderEventContent(event)}</p>
            <time>${getDaysAgo(event.created_at)}</time>
          </div>
        </div>`;
      })}
    </div>`;
  }
}
