import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface Contribution {
  date: string | null;
  count: number;
  level: number;
}

interface FetchData {
  contributions: Contribution[];
  total: TotalContributions;
}

type TotalContributions = {
  [key: string]: number;
};

function getCurrentYear() {
  return new Date().getFullYear();
}

@customElement("github-heatmap")
export class GithubHeatmap extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .container {
      position: relative;
      display: grid;
      grid-template-columns: repeat(53, 12px);
      grid-template-rows: repeat(7, 12px);
      grid-auto-flow: column;
      gap: 2px 0.5px;
      padding: 20px 20px 20px 50px;
      margin-bottom: 15px;
      border: 1px var(--border) solid;
      border-radius: 10px 10px 0px 0px;
    }

    .days {
      position: absolute;
      top: 23px;
      left: 20px;
    }

    .days > * + * {
      margin-top: 14.5px;
    }

    .day {
      font-size: 10px;
    }

    .item {
      position: relative;
      width: 9px;
      height: 9px;
      background-color: #inherit;
      border: 1.5px var(--border) solid;
      border-radius: 2px;
    }

    .item:hover .tooltip {
      display: inline-block;
      user-select: none;
      cursor: pointer;
    }

    .tooltip {
      z-index: 10;
      display: none;
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      height: 16px;
      padding: 5px;
      background-color: #fff;
      border-radius: 5px;
      transition-delay: 200ms;
      transition: opacity 0.3s ease-in-out;
      color: black;
      font-size: 11px;
    }

    [data-level="0"] {
      background-color: #inherit;
    }

    [data-level="1"] {
      background-color: #007728;
    }

    [data-level="2"] {
      background-color: #02a232;
    }

    [data-level="3"] {
      background-color: #0ac740;
    }

    [data-level="4"] {
      background-color: #4ae168;
    }
  `;

  @property({ type: String }) username: string | null = null;
  @property({ type: Array }) contributions: Array<Contribution> = [];

  @property() year: number = getCurrentYear();

  @state() totalNumberContributions: number = 0;
  @state() tooltipTimeout: ReturnType<typeof setTimeout> | null = null;
  @state() contributionMessage: string = "loading...";

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("username")) {
      this.fetchContributions();
    }
  }

  protected firstUpdated(): void {
    this.fetchContributions();
  }

  private fetchContributions(): void {
    if (!this.username) {
      return;
    }
    try {
      fetch(
        `https://github-contributions-api.jogruber.de/v4/${this.username}?y=${this.year}`,
      )
        .then((response) => response.json())
        .then((data: FetchData) => {
          this.contributions = data.contributions;
          this.totalNumberContributions = data.total[this.year] || 0;
          this.contributionMessage = `${this.totalNumberContributions} contributions in ${this.year}`;
        });
    } catch (error) {
      this.contributionMessage = `Error ${error}`;
    }
  }

  render() {
    const totalContributions: Contribution[] = new Array(365).fill({
      date: null,
      level: 0,
      count: 0,
    });

    totalContributions.splice(
      0,
      this.contributions.length,
      ...this.contributions,
    );

    return html`
      <p>${this.contributionMessage}</p>
      <div class="container">
        <div class="days">
          <p class="day">Mon</p>
          <p class="day">Wed</p>
          <p class="day">Fri</p>
        </div>
        ${totalContributions.map((item) => {
          return html`
            <div class="item" data-level="${item.level}">
              <div class="tooltip">
                ${item.count} contributions on ${item.date}
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}
