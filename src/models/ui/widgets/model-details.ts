import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ModelPolicy } from '#models/domain/policy';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { BaseElement } from '#app/ui/base/base-element';

@customElement('model-details')
export class ModelDetails extends BaseElement {
  @state() modelId: string;

  @state() private model: ModelAttrs | null = null;
  @state() private canEdit = false;

  constructor() {
    super();
    this.modelId = this.app.router.getParams().modelId
  }

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

  connectedCallback() {
    super.connectedCallback();
    this.loadModel();
  }

  private async loadModel() {
    const result = await this.modelApi.getModel(this.modelId);
    if (result.isFailure()) {
      this.app.error('Не удалось загрузить модель', { result, modelId: this.modelId });
      return;
    }
    this.model = result.value;
    this.canEdit = new ModelPolicy(this.app.getState().currentUser).canEdit(this.model);
  }

  private handleAddImages(event: CustomEvent<string[]>) {
    this.modelApi.addModelImages(this.modelId, event.detail)
      .then(result => {
        if (result.isFailure()) {
          this.app.error('Ошибка обновления модели с новыми изображениями', { 
            result, 
            ids: event.detail 
          });
        } else {
          this.model = { 
            ...this.model!, 
            imageIds: [...this.model!.imageIds, ...event.detail] 
          };
          this.requestUpdate();
        }
      });
  }

  private handleRemoveImage(event: CustomEvent<string>) {
    this.modelApi.deleteImage(this.modelId, event.detail)
      .then(result => {
        if (result.isFailure()) {
          this.app.error('Ошибка удаления изображения', { 
            result, 
            id: event.detail 
          });
        } else {
          this.model = {
            ...this.model!,
            imageIds: this.model!.imageIds.filter(id => id !== event.detail)
          };
          this.requestUpdate();
        }
      });
  }

  private async handleReorderImages(event: CustomEvent<string[]>) {
    const pendingReorder = event.detail;
    const result = await this.modelApi.reorderModelImages(this.modelId, pendingReorder!);
    if (result.isFailure()) {
      this.app.error('Ошибка изменения порядка изображений', { 
        result, 
        ids: pendingReorder 
      });
      return;
    }
    this.model = {
      ...this.model!,
      imageIds: [...pendingReorder] 
    };
    this.requestUpdate();
  }

  render() {
    if (!this.model) {
      return html`
        <sl-spinner style="width:48px; height:48px;"></sl-spinner>
        <span>Загрузка...</span>
      `;
    }

    return html`
      <div class="model-details">
        <div class="header">
          <h1 class="title">${this.model.title}</h1>
        </div>

        <model-images
          .imageIds=${this.model.imageIds}
          .canEdit=${this.canEdit}
          @addImages=${this.handleAddImages}
          @deleteImage=${this.handleRemoveImage}
          @reorderImages=${this.handleReorderImages}
        ></model-images>

        <div class="main-section">
          <p class="description">${this.model.description}</p>
          <div class="middle">
            <div>
              <strong>Категория:</strong>
              ${this.model.categories.map(cat => html`
                <sl-tag size="small" variant="primary">${cat}</sl-tag>
              `)}
              <strong>Уровень:</strong>
              <sl-tag size="small" variant="warning">${this.model.difficultyLevel}</sl-tag>
            </div>
            <div>
              <strong>Время изготовления:</strong>
              <sl-tag size="small" variant="neutral">${this.model.estimatedTime}</sl-tag>
              <strong>Цена за доступ:</strong>
              <sl-tag size="small" variant="success">${this.model.pricePerAccess} ₸</sl-tag>
            </div>
          </div>

          <div class="bottom">
            <div class="column">
              <h4>Инструменты</h4>
              <ul>
                ${this.model.toolsRequired.map(t => html`<li>${t}</li>`)}
              </ul>
            </div>
            <div class="column">
              <h4>Материалы</h4>
              <ul>
                ${this.model.materialsList.map(m => html`<li>${m}</li>`)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
