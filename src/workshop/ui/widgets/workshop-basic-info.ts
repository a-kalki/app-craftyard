import type { CustomContent } from "#app/domain/types";
import { BaseElement } from "#app/ui/base/base-element";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('workshop-basic-info')
export class WorkshopBasicInfo extends BaseElement {
  static styles = css`
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: .6rem;
    }
  `;

  @property({ type: Array })
  customContent?: CustomContent[];

  render() {
    if (!this.customContent || this.customContent.length === 0) {
      return html``;
    }

    return html`
      <div class="info-grid">
        ${this.customContent.map(content => html`
          <custom-content-block .content=${content}></custom-content-block>
        `)}
      </div>
    `;
  }
}
