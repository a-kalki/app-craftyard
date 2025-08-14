import { html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
import { SKILL_LEVEL_TITLES } from '#app/core/constants';
import { costUtils } from '#app/core/utils/cost/cost-utils';
import type { FileEntryAttrs } from '#files/domain/struct/attrs';
import type { ImageGalleryDialog } from '#app/ui/entities/image-gallery-dialog';

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
      cursor: zoom-in;
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

  @state()
  private imageFiles: FileEntryAttrs[] = [];

  @query('image-gallery-dialog')
  private galleryDialog!: ImageGalleryDialog;

  connectedCallback(): void {
    super.connectedCallback();
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    if (!this.model.imageIds?.length) return;

    const getResult = await this.fileApi.getFileEntries(this.model.imageIds);
    if (getResult.isFailure()) return;
    
    this.imageFiles = getResult.value;
    this.previewUrl = this.imageFiles[0]?.url || '';
  }

  private openGallery() {
    if (!this.galleryDialog || this.imageFiles.length === 0) return;

    const imageUrls = this.imageFiles.map(file => file.url);
    this.galleryDialog.imageUrls = imageUrls;
    this.galleryDialog.show(0);
  }

  render() {
    const categories = this.model.categories.map(cat => MODEL_CATEGORY_TITLES[cat]);

    return html`
      <sl-card>
        ${this.previewUrl
          ? html`<img 
                slot="image" 
                class="preview" 
                src=${this.previewUrl} 
                alt="preview" 
                @click=${this.openGallery}
              />`
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
          <span><strong>${costUtils.toString(this.model.cost)}</strong></span>
        </div>
      </sl-card>

      <image-gallery-dialog></image-gallery-dialog>
    `;
  }

  private navigateToDetails() {
    this.app.router.navigate(`/models/${this.model.id}`);
  }
}
