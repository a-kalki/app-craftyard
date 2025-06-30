import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ModelPolicy } from '#models/domain/policy';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { BaseElement } from '#app/ui/base/base-element';
import { SKILL_LEVEL_TITLES } from '#app/domain/constants';
import { MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
import type { ModelArMeta } from '#models/domain/meta';
import { costUtils } from '#app/domain/utils/cost/cost-utils';
import type { OwnerAggregateAttrs } from 'rilata/core';

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

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
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
    this.canEdit = new ModelPolicy(this.app.getState().currentUser, this.model).canEdit();
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

  private async openEditModelModal() {
    const modal = document.createElement('edit-model-modal');
    document.body.appendChild(modal);

    const result = await modal.show(this.model!);
    if (result === 'success') {
      await this.loadModel();
    }
  }

  render() {
    if (!this.model) {
      return html`
        <sl-spinner style="width:48px; height:48px;"></sl-spinner>
        <span>Загрузка...</span>
      `;
    }

    const modelName: ModelArMeta['name'] = 'ModelAr';
    const ownerAttrs: OwnerAggregateAttrs = {
      ownerId: this.model.id,
      ownerName: modelName,
      context: 'additional-info',
      access: 'public'
    }
    const modelPolicy = new ModelPolicy(this.app.getState().currentUser, this.model);

    return html`
      <div class="model-details">
        <div class="section-header">
          <h2>Описание модели</h2>
          ${this.canEdit ? html`
            <sl-icon-button
              name="pencil"
              label="Редактировать"
              @click=${this.openEditModelModal}
            ></sl-icon-button>
          ` : ''}
        </div>

        <model-images
          .ownerAttrs=${ownerAttrs}
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
              <strong>Категория:</strong></br>
              ${this.model.categories.map(cat => html`
                <sl-tag size="small" variant="primary">${MODEL_CATEGORY_TITLES[cat]}</sl-tag>
              `)}</br></br>
              <strong>Уровень:</strong></br>
              <sl-tag size="small" variant="warning">${SKILL_LEVEL_TITLES[this.model.difficultyLevel]}</sl-tag>
            </div>
            <div>
              <strong>Время изготовления:</strong></br>
              <sl-tag size="small" variant="neutral">${this.model.estimatedTime}</sl-tag></br></br>
              <strong>Цена за доступ:</strong></br>
              <sl-tag size="small" variant="success">${costUtils.costToString(this.model.costPerAccess)}</sl-tag>
            </div>
          </div>

          <user-content-container
            .ownerAttrs=${ownerAttrs}
            .canEdit=${modelPolicy.canEditUserContent(ownerAttrs)}
          ></user-content-container>
        </div>
      </div>
    `;
  }
}

 declare global {
   interface HTMLElementTagNameMap {
     'model-details': ModelDetails;
   }
 }
