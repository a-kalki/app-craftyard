import { css, html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { markdownUtils } from '#app/ui/utils/markdown';
import type { FileContent } from '#user-contents/domain/content/struct/file-attrs';
import { BaseContentCard } from '../base-content/content-card';
import type { EditUserContentModalDialog } from '../base-content/types';

import '#user-contents/ui/entities/video/edit-video-content';


@customElement('video-card')
export class VideoCard extends BaseContentCard<FileContent> {
  static styles = [
    BaseContentCard.styles,
    css`
      .video-container {
        position: relative;
        margin-bottom: 1rem;
        background-color: var(--sl-color-neutral-50);
        border: 1px solid var(--sl-color-neutral-200);
        border-radius: var(--sl-border-radius-medium);
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 150px;
        width: 100%; /* Убедимся, что контейнер занимает всю ширину */
        box-sizing: border-box; /* Для корректного расчета padding/border */
      }
      
      .video-thumbnail {
        width: 100%;
        height: auto;
        display: block;
        border-radius: var(--sl-border-radius-medium);
        cursor: pointer;
        object-fit: contain;
        max-height: 300px;
      }
      
      .play-icon-overlay { /* Изменено имя класса для ясности */
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        color: white;
        text-shadow: 0 0 10px rgba(0,0,0,0.5);
        pointer-events: none;
      }
      
      .video-player {
        width: 100%;
        height: auto;
        display: block;
        border-radius: var(--sl-border-radius-medium);
        max-height: 400px;
      }

      .placeholder-icon {
        font-size: 3rem;
        color: var(--sl-color-neutral-400);
      }
    `
  ];

  protected createEditModal(): EditUserContentModalDialog {
    return document.createElement('edit-video-modal');
  }

  // Переопределяем renderButtons, чтобы добавить кнопку "Play"
  protected renderButtons(): TemplateResult {
    return html`
      ${this.fileUrl && !this.isPlaying ? html`
        <sl-tooltip content="Воспроизвести видео" placement="bottom">
          <sl-button
            class="action-btn"
            size="small"
            variant="primary"
            @click=${this.playContent}
            @contextmenu=${(e: Event) => e.preventDefault()}
          >
            <sl-icon name="play"></sl-icon>
          </sl-button>
        </sl-tooltip>
      ` : ''}

      ${this.isPlaying ? html`
        <sl-tooltip content="Остановить воспроизведение" placement="bottom">
          <sl-button
            class="action-btn"
            size="small"
            variant="warning"
            @click=${this.stopContent}
            @contextmenu=${(e: Event) => e.preventDefault()}
          >
            <sl-icon name="stop"></sl-icon>
          </sl-button>
        </sl-tooltip>
      ` : ''}
      ${super.renderButtons()}
    `;
  }

  protected renderBodyContent(): TemplateResult {
    const { description } = this.content;
    return html`
      <div class="video-container">
        ${this.isPlaying && this.fileUrl ? html`
          <video controls class="video-player" src=${this.fileUrl} autoplay @ended=${this.stopContent}>
            Ваш браузер не поддерживает видео тег.
          </video>
        ` : html`
          ${this.thumbUrl ? html`
            <img
              src=${this.thumbUrl}
              alt="Video thumbnail"
              class="video-thumbnail"
              @click=${this.playContent}
            >
            <div class="play-icon-overlay">
              <sl-icon name="play-circle"></sl-icon>
            </div>
          ` : html`
            <sl-icon name="camera-video" class="placeholder-icon" @click=${this.playContent}></sl-icon>
          `}
        `}
      </div>

      ${description
        ? html`<div class="markdown-content">${markdownUtils.parse(description)}</div>`
        : html`<slot name="description"></slot>`
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'video-card': VideoCard;
  }
}
