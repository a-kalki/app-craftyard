import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import type { ThesisContent } from '#user-contents/domain/content/struct/thesis-attrs';
import { markdownUtils } from '../utils/markdown';

@customElement('user-skill-tag')
export class UserSkillTag extends BaseElement {
  static styles = css`
    :host {
      display: inline-block;
      margin: 2px;
      --sl-tag-padding-x: var(--sl-spacing-medium);
      --sl-tag-padding-y: var(--sl-spacing-x-small);
    }

    sl-tag {
      cursor: pointer;
      transform-origin: center;
      will-change: transform;
      filter: none;
      animation: gentlePulse 10s ease infinite;
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      font-weight: var(--sl-font-weight-semibold);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    sl-tag:hover {
      filter: none;
      transform: scale(1.05);
      box-shadow: var(--sl-shadow-small);
      animation: none;
    }

    sl-tag:active {
      transform: scale(0.98);
      transition-duration: 0.1s;
    }

    @keyframes gentlePulse {
      0%, 90%, 100% {
        transform: scale(1);
      }
      95% {
        transform: scale(1.05);
      }
    }
  `;

  @property({ type: Object })
  content!: ThesisContent;

  private renderMarkdown(markdownText: string | undefined, className: string = '') {
    if (!markdownText) return nothing;
    return html`<div class=${className}>${markdownUtils.parseInline(markdownText)}</div>`;
  }

  private async showSkillDetails() {
    if (!this.content) {
      console.warn('ThesisContent is not provided to user-skill-tag.');
      return;
    }

    const iconName = this.content.icon ?? 'brilliance';

    const dialogTitle = html`
      <div style="
        display: flex;
        align-items: center;
        gap: 0.5em;
        font-size: var(--sl-font-size-x-large);
        font-weight: var(--sl-font-weight-semibold);
      ">
        ${iconName ? html`<sl-icon name="${iconName}"></sl-icon>` : nothing}
        <strong>Навык:</strong> ${this.content.title}
      </div>
    `;

    const dialogContent = html`
      ${this.renderMarkdown(this.content.body, 'markdown-content')}
      ${this.content.footer
        ? html`
            <br><u>${this.renderMarkdown(this.content.footer, 'markdown-footer-content')}</u>
          `
        : nothing
      }
    `;

    await this.app.showDialog({
      title: dialogTitle,
      content: dialogContent,
      confirmText: 'Закрыть',
      confirmVariant: 'primary',
    });
  }

  render() {
    if (!this.content) {
      return html``;
    }
    
    const icon = this.content.icon;

    return html`
      <sl-tag
        size="small"
        variant="primary" 
        pill
        @click=${this.showSkillDetails}
      >
        ${icon ? html`<sl-icon name=${icon}></sl-icon>&nbsp;|&nbsp;` : nothing}
        <span>${this.content.title}</span>
      </sl-tag>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-skill-tag': UserSkillTag;
  }
}
