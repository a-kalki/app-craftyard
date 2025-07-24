import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { BaseElement } from '../../../app/ui/base/base-element';

@customElement('models-list')
export class ModelsWidget extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
    }

    .models-list-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .grid {
      display: grid;
      gap: 16px;
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    @media (min-width: 1150px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (min-width: 900px) and (max-width: 899px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 650px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }

    model-card {
      width: 100%;
      min-width: 0;
    }
  `;

  @state()
  private models: ModelAttrs[] = [];

  async connectedCallback() {
    super.connectedCallback();
    const result = await this.modelApi.getModels({});
    if (result.isFailure()) {
      this.app.error('Не удалось загрузить модели. Попробуйте позже.', { details: { result: result.value } });
      return;
    }
    this.models = result.value;
  }

  render() {
    return html`
      <div class="models-list-wrapper"> <div class="grid">
          ${this.models.map(model => html`<model-card .model=${model}></model-card>`)}
        </div>
      </div>
    `;
  }
}
