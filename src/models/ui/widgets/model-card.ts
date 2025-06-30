import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
import { SKILL_LEVEL_TITLES } from '#app/domain/constants';
import { costUtils } from '#app/domain/utils/cost/cost-utils';

@customElement('model-card')
export class ModelCardWidget extends BaseElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    sl-card {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    .preview {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }

    .content {
      padding: 1rem;
    }

    .title {
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .description {
      font-size: 0.95rem;
      color: var(--sl-color-neutral-700);
      margin-bottom: 1rem;
    }

    .tags-row {
      display: flex;
      gap: 1rem;
    }

    .categories {
      flex: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .difficulty {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem 1rem;
    }

    sl-button {
      white-space: nowrap;
    }
  `;

  @property({ type: Object })
  model!: ModelAttrs;

  @state()
  private previewUrl = '';

  connectedCallback(): void {
    super.connectedCallback();
    this.loadPreview();
  }

  async loadPreview(): Promise<void> {
    const imageId = this.model.imageIds[0];
    if (!imageId) return;

    const getResult = await this.fileApi.getFile(imageId);
    if (getResult.isFailure()) return;
    this.previewUrl = getResult.value.url;
  }

  render() {
    const categories = this.model.categories.map(cat => MODEL_CATEGORY_TITLES[cat]);

    return html`
      <sl-card>
        ${this.previewUrl
          ? html`<img slot="image" class="preview" src=${this.previewUrl} alt="preview" />`
          : ''}

        <div class="content">
          <div class="title">${this.model.title}</div>
          <div class="description">${this.model.description}</div>
          <div class="tags-row">
            <div class="categories">
              ${categories.map(cat => html`<sl-tag size="small" variant="primary">${cat}</sl-tag>`)}
            </div>
            <div class="difficulty">
              <sl-tag size="small" variant="warning">${SKILL_LEVEL_TITLES[this.model.difficultyLevel]}</sl-tag>
            </div>
          </div>
        </div>

        <div class="footer">
          <sl-button size="small" variant="primary" @click=${this.navigateToDetails}>
            Подробнее
          </sl-button>
          <span><strong>${costUtils.costToString(this.model.costPerAccess)}</strong></span>
        </div>
      </sl-card>
    `;
  }

  private navigateToDetails() {
    this.app.router.navigate(`/models/${this.model.id}`);
  }
}

