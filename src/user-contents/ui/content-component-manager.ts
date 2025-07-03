import { html, type TemplateResult } from "lit";
import type { ContentTypes, UserContent } from "#user-contents/domain/content/meta";
import type { ThesisContent } from "#user-contents/domain/content/struct/thesis-attrs";
import type { FileContent } from "#user-contents/domain/content/struct/file-attrs";
import type { AddUserContentModalDialog } from "./entities/base-content/types";
import type { CyOwnerAggregateAttrs } from "#app/domain/types";

/**
 * ContentComponentManager - Сервис без состояния для рендеринга компонентов контента.
 * Он предоставляет методы для генерации Lit HTML шаблонов для различных типов контента.
 */
export class ContentComponentManager {

  private getIconForType(type: ContentTypes): string {
    const icons: Record<ContentTypes, string> = {
      THESIS: 'file-earmark-text',
      PDF: 'file-earmark-pdf',
      VIDEO: 'camera-video',
    };
    return icons[type];
  }

  /**
   * Рендерит секцию кнопок для добавления нового контента,
   * включая кнопку быстрого действия и выпадающий список для других типов.
   *
   * @param handleAddByType - Callback-функция, вызываемая при выборе типа контента.
   * @param lastUsedContentType - Последний использованный тип контента для иконки быстрой кнопки.
   * @returns Lit TemplateResult для кнопок добавления контента.
   */
  public renderAddContentControls(
    lastUsedContentType: ContentTypes,
    handleAddByType: (type: ContentTypes) => void,
  ): TemplateResult {
    return html`
      <sl-button-group>
        <sl-tooltip content="Добавить ${this.getTooltipTextForType(lastUsedContentType)}" placement="bottom">
          <sl-button
            class="action-btn"
            size="small"
            @click=${() => handleAddByType(lastUsedContentType)}
            @contextmenu=${(e: Event) => e.preventDefault()}
          >
            <sl-icon name=${this.getIconForType(lastUsedContentType)}></sl-icon>
          </sl-button>
        </sl-tooltip>

        <sl-dropdown>
          <sl-button
            slot="trigger"
            class="action-btn"
            size="small"
            caret
            @contextmenu=${(e: Event) => e.preventDefault()}
          >
            <sl-icon name="three-dots"></sl-icon> </sl-button>

          <sl-menu>
            <sl-menu-item @click=${() => handleAddByType('THESIS')}>
              <sl-icon slot="prefix" name="file-earmark-text"></sl-icon>
              Тезис
            </sl-menu-item>
            <sl-menu-item @click=${() => handleAddByType('PDF')}>
              <sl-icon slot="prefix" name="file-earmark-pdf"></sl-icon>
              Файл
            </sl-menu-item>
            <sl-menu-item @click=${() => handleAddByType('VIDEO')}>
              <sl-icon slot="prefix" name="camera-video"></sl-icon>
              Видео
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </sl-button-group>
    `;
  }

  private getTooltipTextForType(type: ContentTypes): string {
    switch (type) {
      case 'THESIS': return 'тезис';
      case 'PDF': return 'файл';
      case 'VIDEO': return 'видео';
      default: return 'контент';
    }
  }

  public getAddContentModal(
    type: ContentTypes,
  ): AddUserContentModalDialog {
    if (type === 'THESIS') {
      return document.createElement('add-thesis-modal');
    } else if (type === 'PDF') {
      return document.createElement('add-pdf-modal');
    } else if (type === 'VIDEO') {
      return document.createElement('add-video-modal');
    }
    throw Error('not implement add modal for type: ' + type);
  }

  /**
   * Рендерит конкретный компонент контента в зависимости от его типа.
   *
   * @param content - Объект контента (UserContent).
   * @param canEdit - Флаг, указывающий, можно ли редактировать контент.
   * @param loadContentsCallback - Callback-функция для обновления списка контента после изменений.
   * @returns Lit TemplateResult для соответствующего компонента контента.
   */
  public renderContent(
    content: UserContent,
    ownerAttrs: CyOwnerAggregateAttrs,
    canEdit: boolean,
    loadContentsCallback: (forceRefresh?: boolean) => Promise<void>
  ): TemplateResult {
    switch (this.getContentType(content)) {
      case 'THESIS':
        return this.renderThesisContent(content as ThesisContent, ownerAttrs, canEdit, loadContentsCallback);
      case 'PDF':
        return this.renderPdfContent(content as FileContent, ownerAttrs, canEdit, loadContentsCallback);
      case 'VIDEO':
        return this.renderVideoContent(content as FileContent, ownerAttrs, canEdit, loadContentsCallback);
      default:
        return html``;
    }
  }

  private renderThesisContent(
    thesis: ThesisContent,
    ownerAttrs: CyOwnerAggregateAttrs,
    canEdit: boolean,
    loadContentsCallback: (forceRefresh?: boolean) => Promise<void>
  ): TemplateResult {
    return html`
      <thesis-card
        .content=${thesis}
        .canEdit=${canEdit}
        .ownerAttrs=${ownerAttrs}
        @content-edited=${() => loadContentsCallback(true)}
        @content-deleted=${() => loadContentsCallback(true)}
      ></thesis-card>
    `;
  }

  private renderPdfContent(
    fileContent: FileContent,
    ownerAttrs: CyOwnerAggregateAttrs,
    canEdit: boolean,
    loadContentsCallback: (forceRefresh?: boolean) => Promise<void>
): TemplateResult {
    return html`
      <pdf-card
        .content=${fileContent}
        .canEdit=${canEdit}
        .ownerAttrs=${ownerAttrs}
        @content-edited=${() => loadContentsCallback(true)}
        @content-deleted=${() => loadContentsCallback(true)}
      ></pdf-card>
    `;
  }

  private renderVideoContent(
    fileContent: FileContent,
    ownerAttrs: CyOwnerAggregateAttrs,
    canEdit: boolean,
    loadContentsCallback: (forceRefresh?: boolean) => Promise<void>
  ): TemplateResult {
    return html`
      <video-card
        .content=${fileContent}
        .canEdit=${canEdit}
        .ownerAttrs=${ownerAttrs}
        @content-edited=${() => loadContentsCallback(true)}
        @content-deleted=${() => loadContentsCallback(true)}
      ></video-card>
    `;
  }

  private getContentType(content: UserContent): ContentTypes {
    if (content.type === 'THESIS') return 'THESIS';
    if (this.isFileContent(content)) {
      return content.fileType;
    }
    throw Error(`not correct content type: ` + JSON.stringify(content, null, 2));
  }

  private isFileContent(c: UserContent): c is FileContent {
    return c.type === 'FILE';
  }
}
