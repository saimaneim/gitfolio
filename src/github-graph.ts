import { LitElement, html, css } from "lit";
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

@customElement("github-graph")
export class GithubGraph extends LitElement {
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
      gap: 2.5px 1px;
      padding: 20px 20px 20px 50px;
      border: 1px #fff solid;
      border-radius: 10px 10px 0px 0px;
    }

    .days {
      position: absolute;
      top: 23px;
      left: 20px;
    }

    .days > * + * {
      margin-top: 14px;
    }

    .day {
      font-size: 12px;
    }

    .item {
      width: 9px;
      height: 9px;
      background-color: #inherit;
      border: 1.5px #fff solid;
      border-radius: 2px;
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
  @property() contributions: Array<Contribution> = [];
  @property() year: number = 2026;

  @state() totalNumberContributions: number = 0;
  @state() tooltipTimeout: ReturnType<typeof setTimeout> | null = null;

  firstUpdated(): void {
    if (!this.username) {
      return;
    }

    fetch(
      `https://github-contributions-api.jogruber.de/v4/${this.username}?y=${this.year}`,
    )
      .then((response) => response.json())
      .then((data: FetchData) => {
        this.contributions = data.contributions;
        this.totalNumberContributions = data.total[this.year];
      });
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
      <p>${this.totalNumberContributions} contributions in ${this.year}</p>
      <div class="container">
        <div class="days">
          <p class="day">Mon</p>
          <p class="day">Wed</p>
          <p class="day">Fri</p>
        </div>
        ${totalContributions.map((item) => {
          return html`<div
            @mouseenter=${() => this.handleMouseEnter(item.date!)}
            @mouseleave=${this.handleMouseLeave}
            class="item"
            data-level="${item.level}"
          />`;
        })}
      </div>
    `;
  }

  private handleMouseEnter(date: string) {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    this.tooltipTimeout = setTimeout(() => {
      console.log(date);
    }, 500);
  }

  private handleMouseLeave() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = null;
    }
  }
}
