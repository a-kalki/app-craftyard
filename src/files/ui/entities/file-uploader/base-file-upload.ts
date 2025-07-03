import { html, css, type TemplateResult, type CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import type { UploadFileInput } from '#files/domain/struct/upload-file/contract';
import type { CyOwnerAggregateAttrs } from '#app/domain/types';

/**
 * Абстрактный базовый класс для компонентов загрузки одиночного файла.
 * Позволяет выбирать файл с диска и отображает его URL после успешной загрузки.
 * URL поле ввода всегда в режиме "только чтение".
 * Диспатчит событие 'file-loaded' после успешной загрузки файла.
 * Добавлена кнопка для очистки URL, если он установлен.
 */
export abstract class BaseFileUpload extends BaseElement {
  static styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .wrapper {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .input-column {
      flex: 1;
      min-width: 200px;
    }
    .preview {
      max-width: 64px;
      max-height: 64px;
      border: 1px solid var(--sl-color-gray-200);
      border-radius: var(--sl-border-radius-medium);
      object-fit: contain;
    }
  `;

  @property({ type: Object }) ownerAttrs!: CyOwnerAggregateAttrs;
  @property({ type: String }) fileId?: string; // id файла
  @property({ type: String }) label: string = 'URL файла'; // Метка для поля ввода
  @property({ type: String }) fileAccept: string = '*/*'; // Типы файлов, которые принимает input (например, 'image/*', 'application/pdf')
  @property({ type: String }) uploadIcon: string = 'upload'; // Иконка для кнопки загрузки с диска
  @property({ type: Boolean }) clearable: boolean = true; // NEW: Разрешает показывать кнопку очистки

  protected fileInput: Ref<HTMLInputElement> = createRef();
  @state() protected isUploading = false;

  @state() protected url?: string;

  connectedCallback(): void {
    super.connectedCallback();
    this.loadFile();
  }

  protected async loadFile(): Promise<void> {
    if (!this.fileId) return;
    const getResult = await this.fileApi.getFileEntry(this.fileId);
    if (getResult.isFailure()) {
      this.app.error('Не удалось загрузить файл: ', { fileId: this.fileId });
      return;
    }
    this.url = getResult.value.url;
  }

  /**
   * Абстрактный метод для предварительной обработки файла (например, сжатие изображений).
   * Должен быть реализован в дочерних классах.
   * @param file Исходный файл.
   * @returns Обработанный файл или Promise<File>.
   */
  protected abstract processFileBeforeUpload(file: File): Promise<File | null>;

  /**
   * Абстрактный метод для рендеринга превью.
   * Должен быть реализован в дочерних классах.
   */
  protected abstract renderPreview(): TemplateResult | null;

  render() {
    if (!this.ownerAttrs) return '';

    return html`
      <div class="wrapper">
        <div class="input-column">
          <sl-input
            label=${this.label}
            .value=${this.fileId ?? ''}
            ?disabled=${this.isUploading}
            readonly
          >
            <sl-icon-button
              slot="suffix"
              name=${this.uploadIcon}
              label="Загрузить с диска"
              ?disabled=${this.isUploading}
              @click=${() => this.fileInput.value?.click()}
            ></sl-icon-button>
            ${this.fileId && this.clearable
              ? html`
                <sl-icon-button
                  slot="suffix"
                  name="trash"
                  variant="danger"
                  label="Удалить"
                  ?disabled=${this.isUploading}
                  @click=${this.handleClearUrl}
                  style="margin-inline-start: var(--sl-spacing-x-small);"
                ></sl-icon-button>
                `
              : null}
          </sl-input>
        </div>
        ${this.renderPreview()}
      </div>
      <input
        type="file"
        accept=${this.fileAccept}
        hidden
        @change=${this.handleFileSelected}
        ${ref(this.fileInput)}
      >
    `;
  }

  // Единый обработчик для диспатча события после успешной загрузки файла
  protected dispatchFileLoaded(): void {
    this.dispatchEvent(new CustomEvent<{ url?: string, id?: string }>(
      'file-id-changed',
      {
        detail: { url: this.url, id: this.fileId },
        bubbles: true,
        composed: true,
      }
    ));
  }

  /**
   * NEW: Обработчик для кнопки очистки URL.
   * Очищает текущий URL и диспатчит событие file-loaded.
   */
  private async handleClearUrl(): Promise<void> {
    if (this.isUploading) return;

    this.fileId = undefined;
    this.url = undefined;
    this.dispatchFileLoaded();
  }

  protected async handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.isUploading = true;
    try {
      const processedFile = await this.processFileBeforeUpload(file);
      if (!processedFile) {
        this.isUploading = false;
        this.app.error('Обработка файла отменена или не удалась.');
        return;
      }

      const uploadInput: UploadFileInput = {
        ...this.ownerAttrs,
        file: processedFile,
      };

      const result = await this.fileApi.uploadFile(uploadInput);

      if (result.isFailure()) {
        this.app.error(`[${this.constructor.name}]: не удалось загрузить файл.`, {
          ownerAttrs: this.ownerAttrs,
          file: { size: processedFile.size, type: processedFile.type, name: processedFile.name }
        });
        return;
      }
      this.fileId = result.value.id;
      this.url = result.value.url;
      this.dispatchFileLoaded();
    } catch (err) {
      this.app.error('Ошибка при обработке файла', { err });
    } finally {
      this.isUploading = false;
    }
  }
}
