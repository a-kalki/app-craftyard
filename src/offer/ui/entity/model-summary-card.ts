import { html, css, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { SKILL_LEVEL_TITLES } from '#app/core/constants';
import { MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
import type { FileEntryAttrs } from '#files/domain/struct/attrs';
import type { ImageGalleryDialog } from '#app/ui/entities/image-gallery-dialog';


@customElement('model-summary-card')
export class ModelSummaryCard extends BaseElement {
  @property({ type: Object }) model!: ModelAttrs | null;
  @state() protected imageFiles: FileEntryAttrs[] = [];
  @state() private currentSlideIndex: number = 0; // Для нашей карусели

  @query('image-gallery-dialog') galleryDialog!: ImageGalleryDialog;

  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      background-color: var(--sl-color-neutral-50);
      margin-top: 1rem;
    }

    .model-summary-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.8rem;
    }

    .model-summary-header h4 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--sl-color-primary-600);
    }

    .custom-carousel-container {
      position: relative;
      width: 100%;
      height: 250px; 
      margin-bottom: 1rem;
      border-radius: var(--sl-border-radius-small);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--sl-color-neutral-200);
    }

    .custom-carousel-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      cursor: zoom-in;
      display: block;
    }

    .carousel-nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 10;
      transition: background-color 0.2s;
    }

    .carousel-nav-button:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }

    .carousel-nav-button.prev {
      left: 10px;
    }

    .carousel-nav-button.next {
      right: 10px;
    }

    .carousel-pagination {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 5px;
      z-index: 10;
    }

    .pagination-dot {
      width: 8px;
      height: 8px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .pagination-dot.active {
      background-color: var(--sl-color-primary-600);
    }

    .model-summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.8rem 1.5rem;
      font-size: 0.95rem;
    }

    .model-summary-grid .label {
      font-weight: 600;
      color: var(--sl-color-neutral-700);
    }

    .tags sl-tag {
      margin-right: 0.5rem;
      margin-bottom: 0.25rem;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadImages();
  }

  protected async loadImages() {
    if (!this.model?.imageIds) return;

    const result = await this.fileApi.getFileEntries(this.model.imageIds);
    if (result.isFailure()) return;

    this.imageFiles = result.value;
    // Сбросим индекс на 0 при загрузке новых изображений
    this.currentSlideIndex = 0; 
  }

  private goToPreviousSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.imageFiles.length) % this.imageFiles.length;
  }

  private goToNextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.imageFiles.length;
  }

  private goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  private openGallery(initialImageIndex: number) {
    if (!this.galleryDialog || this.imageFiles.length === 0) return;

    const imageUrls = this.imageFiles.map(file => file.url);
    this.galleryDialog.imageUrls = imageUrls;

    this.galleryDialog.show(initialImageIndex);
  }

  render() {
    if (!this.model) {
      return html`
        <div class="model-summary-header">
          <sl-icon name="box"></sl-icon>
          <h4>Информация о модели</h4>
        </div>
        <p>Модель не найдена или загружается...</p>
      `;
    }

    const currentImageUrl = this.imageFiles[this.currentSlideIndex]?.url;
    const showNavigation = this.imageFiles.length > 1;

    return html`
      ${this.imageFiles.length > 0 ? html`
        <div class="custom-carousel-container">
          <img
            class="custom-carousel-image"
            src=${currentImageUrl}
            alt="${this.model?.title || 'Изображение модели'} ${this.currentSlideIndex + 1}"
            loading="lazy"
            @click=${() => this.openGallery(this.currentSlideIndex)}
          >

          ${showNavigation ? html`
            <sl-icon-button
              name="chevron-left"
              label="Предыдущее изображение"
              class="carousel-nav-button prev"
              @click=${this.goToPreviousSlide}
            ></sl-icon-button>
            <sl-icon-button
              name="chevron-right"
              label="Следующее изображение"
              class="carousel-nav-button next"
              @click=${this.goToNextSlide}
            ></sl-icon-button>

            <div class="carousel-pagination">
              ${this.imageFiles.map((_, index) => html`
                <div
                  class="pagination-dot ${index === this.currentSlideIndex ? 'active' : ''}"
                  @click=${() => this.goToSlide(index)}
                  aria-label="Перейти к слайду ${index + 1}"
                ></div>
              `)}
            </div>
          ` : nothing}
        </div>
      ` : nothing}

      <div class="model-summary-grid">
        <div>
          <span class="label">Категории:</span>
          <div class="tags">
            ${this.model.categories.map(cat => html`
              <sl-tag size="small" variant="primary">${MODEL_CATEGORY_TITLES[cat]}</sl-tag>
            `)}
          </div>
        </div>
        <div>
          <span class="label">Уровень сложности:</span>
          <div class="tags">
            <sl-tag size="small" variant="warning">${SKILL_LEVEL_TITLES[this.model.difficultyLevel]}</sl-tag>
          </div>
        </div>
      </div>

      <image-gallery-dialog></image-gallery-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'model-summary-card': ModelSummaryCard;
  }
}
