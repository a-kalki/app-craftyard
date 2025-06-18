import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import { modelsApi } from '../models-api';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { ModelPolicy } from '#models/domain/policy';

@customElement('model-details')
export class ModelDetailsWidget extends BaseElement {
  static routingAttrs = {
    pattern: '/models/:modelId',
    tag: 'model-details',
  };

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 16px auto;
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .title {
      font-size: 1.8rem;
      font-weight: 700;
    }

    .main-section {
      margin-bottom: 2rem;
    }

    .description {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .middle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .tags sl-tag {
      margin-right: 0.5rem;
    }

    .bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .column h4 {
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    ul {
      padding-left: 1.2rem;
      margin: 0;
    }

    li {
      margin-bottom: 0.25rem;
    }
  `;

  @state() private model: ModelAttrs | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadModel();
  }

  private async loadModel() {
    const modelId = this.getModelId();
    const result = await modelsApi.getModel(modelId);

    if (result.isFailure()) {
      this.app.error('Не удалось загрузить модель', { result, modelId });
      return;
    }

    this.model = result.value;
  }

  private getModelId(): string {
    return this.app.router.getParams().modelId;
  }

  private get canEdit(): boolean {
    const currentUser = this.app.getState().currentUser;
    return this.model ? new ModelPolicy(currentUser).canEdit(this.model) : false;
  }

  private async handleAddImages(imageIds: string[]) {
    const modelId = this.getModelId();
    const result = await modelsApi.addModelImages(modelId, imageIds);
    if (result.isFailure()) {
      this.app.error('Ошибка обновления модели с новыми изображениями', { result, imageIds });
      return;
    }

    this.model = { ...this.model!, imageIds: [...this.model!.imageIds, ...imageIds] };
  }

  private async handleRemoveImage(imageId: string) {
    const modelId = this.getModelId();
    const result = await modelsApi.deleteImage(modelId, imageId);
    if (result.isFailure()) {
      this.app.error('Ошибка удаления изображения', { result, imageId });
      return;
    }
    this.model = { ...this.model!, imageIds: this.model!.imageIds.filter(id => id !== imageId) };
  }

  render() {
    if (!this.model) {
      return html`<sl-spinner label="Загрузка..." style="width:48px; height:48px;"></sl-spinner>`;
    }

    const {
      title, imageIds: images, description, categories, difficultyLevel,
      estimatedTime, pricePerAccess, materialsList, toolsRequired,
    } = this.model;

    return html`
      <div class="header">
        <div class="title">${title}</div>
      </div>

      <model-images
        .imageIds=${images}
        .canEdit=${this.canEdit}
        @add-images=${(e: CustomEvent) => this.handleAddImages(e.detail.imageIds)}
        @delete-image=${(e: CustomEvent) => this.handleRemoveImage(e.detail.imageId)}>
      </model-images>

      <div class="main-section">
        <div class="description">${description}</div>

        <div class="middle">
          <div>
            <div><strong>Категория:</strong></div>
            <div class="tags">
              ${categories.map(cat => html`<sl-tag size="small" variant="primary">${cat}</sl-tag>`)}
            </div>
            <div style="margin-top: 0.75rem;"><strong>Уровень:</strong></div>
            <div class="tags">
              <sl-tag size="small" variant="warning">${difficultyLevel}</sl-tag>
            </div>
          </div>
          <div>
            <div><strong>Время изготовления:</strong></div>
            <div class="tags">
              <sl-tag size="small" variant="neutral">${estimatedTime}</sl-tag>
            </div>
            <div style="margin-top: 0.75rem;"><strong>Цена за доступ:</strong></div>
            <div class="tags">
              <sl-tag size="small" variant="success">${pricePerAccess} ₸</sl-tag>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="column">
            <h4>Инструменты</h4>
            <ul>
              ${toolsRequired.map(tool => html`<li>${tool}</li>`)}
            </ul>
          </div>
          <div class="column">
            <h4>Материалы</h4>
            <ul>
              ${materialsList.map(mat => html`<li>${mat}</li>`)}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}
