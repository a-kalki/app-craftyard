import { css, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { ImagesContent } from '#user-contents/domain/content/struct/images-attrs';
import { BaseContentCard } from '../base-content/content-card';
import type { EditUserContentModalDialog } from '../base-content/types';

@customElement('images-card')
export class ImagesCard extends BaseContentCard<ImagesContent> {
  static styles = [
    BaseContentCard.styles,
    css`
      .images-container {
        margin-bottom: 1rem;
      }
      .description-content {
        margin-top: 1rem;
      }
    `
  ];

  protected createEditModal(): EditUserContentModalDialog {
    return document.createElement('edit-images-modal');
  }

    // В ImagesCard, ModelImages сам занимается загрузкой URL по imageIds.
  protected async loadUrls(): Promise<void> {}

  protected async handleImageReorder(event: CustomEvent<string[]>) {
    this.content = {
      ...this.content,
      imageIds: event.detail,
    };
    await this.updateContentOnServer();
  }

  protected async handleImageAdd(event: CustomEvent<string[]>) {
    this.content = {
      ...this.content,
      imageIds: [...this.content.imageIds, ...event.detail],
    };
    await this.updateContentOnServer();
  }

  protected async handleImageDelete(event: CustomEvent<string>) {
    this.content = {
      ...this.content,
      imageIds: this.content.imageIds.filter(id => id !== event.detail),
    };
    await this.updateContentOnServer();
  }

  private async updateContentOnServer() {
    const result = await this.userContentApi.editContent(this.content);
    if (result.isFailure()) {
      this.app.error(
        `[${this.constructor.name}]: Не удалось обновить контент с изображениями.`,
        { result: result.value }
      );
      return;
    }
    this.dispatchEditedEvent();
  }

  protected renderBodyContent(): TemplateResult {
    const { description, imageIds } = this.content;
    const { ownerAttrs, canEdit } = this;

    return html`
      <div class="images-container">
        <model-images
          .ownerAttrs=${ownerAttrs}
          .imageIds=${imageIds}
          .canEdit=${canEdit}
          @reorderImages=${this.handleImageReorder}
          @addImages=${this.handleImageAdd}
          @deleteImage=${this.handleImageDelete}
        ></model-images>
      </div>

      ${description
        ? html`<div class="markdown-content description-content">${markdownUtils.parse(description)}</div>`
        : html`<slot name="description"></slot>`
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'images-card': ImagesCard;
  }
}
