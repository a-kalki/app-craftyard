import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import type { CustomContent } from '#app/domain/types';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true
});

@customElement('custom-content-block')
export class CustomContentBlock extends LitElement {
  static styles = css`
    .content-block {
      margin-bottom: .6rem;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
      box-shadow: var(--sl-shadow-small);
    }
    .content-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }
    .content-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--sl-color-neutral-800);
    }
    .markdown-content {
      color: var(--sl-color-neutral-800);
      line-height: 1.6;
    }
    .markdown-content p {
      margin: 0.5rem 0;
    }
    .markdown-content strong {
      font-weight: 600;
      color: var(--sl-color-neutral-900);
    }
    .markdown-content a {
      color: var(--sl-color-primary-700);
      text-decoration: none;
    }
    .markdown-content a:hover {
      text-decoration: underline;
    }
    .markdown-content ul {
      padding-left: 1.25rem;
      margin: 0.5rem 0;
    }
    .markdown-content li {
      margin-bottom: 0.25rem;
    }
    .markdown-content h1,
    .markdown-content h2,
    .markdown-content h3,
    .markdown-content h4,
    .markdown-content h5,
    .markdown-content h6 {
      color: var(--sl-color-primary-800);
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
    .contact-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
      color: var(--sl-color-primary-700);
      text-decoration: none;
    }
    .contact-link:hover {
      text-decoration: underline;
    }
  `;

  @property({ type: Boolean })
  isCollapsible?: boolean;

  @property({ type: Object })
  content?: CustomContent;

  @state()
  private _parsedContentHtml: string = '';

  protected async willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('content') && this.content?.contentType === 'markdown') {
      try {
        this._parsedContentHtml = await marked.parse(this.content.content) as string;
      } catch (e) {
        console.error('Ошибка при разборе Markdown:', e);
        this._parsedContentHtml = `<p>Ошибка при отображении контента Markdown.</p>`;
      }
    }
    super.willUpdate(changedProperties);
  }

  render() {
    if (!this.content) return html``;

    const contentToRender = html`
      ${this.content.icon ? html`<sl-icon name=${this.content.icon}></sl-icon>` : ''}
      <h3 class="content-title">${this.content.title}</h3>
    `;

    return html`
      <div class="content-block">
        ${this.isCollapsible ? html`
          <sl-details>
            <div slot="summary" class="content-header">${contentToRender}</div>
            ${this.renderContent(this.content)}
          </sl-details>
        ` : html`
          <div class="content-header">${contentToRender}</div>
          ${this.renderContent(this.content)}
        `}
      </div>
    `;
  }

  private renderContent(content: CustomContent) {
    switch (content.contentType) {
      case 'contacts':
        return this.renderContacts(content.content);
      case 'html':
        return html`<div class="markdown-content">${unsafeHTML(content.content)}</div>`;
      case 'list':
        return html`<ul>${content.content.split('\n').map(item => html`<li>${item.trim()}</li>`)}</ul>`;
      case 'markdown':
        return html`<div class="markdown-content">${unsafeHTML(this._parsedContentHtml)}</div>`;
      default:
        return html`<p class="markdown-content">${content.content}</p>`;
    }
  }

  renderContacts(contactsData: string) {
    const contacts = contactsData.split('\n').map(line => {
      const [type, value] = line.split(':');
      return { type: type ? type.trim() : '', value: value ? value.trim() : '' };
    }).filter(contact => contact.type && contact.value);

    return html`
      <div class="markdown-content">
        ${contacts.map(contact => {
          switch (contact.type) {
            case 'phone':
              return html`
                <a href="tel:${contact.value}" class="contact-link">
                  <sl-icon name="telephone"></sl-icon> ${contact.value}
                </a>`;
            case 'telegram':
              return html`
                <a href="https://t.me/${contact.value.replace('@', '')}" 
                  target="_blank" class="contact-link">
                  <sl-icon name="send"></sl-icon> ${contact.value}
                </a>`;
            case 'telegram-group':
              return html`
                <a href="https://t.me/${contact.value.replace('@', '')}" 
                  target="_blank" class="contact-link">
                  <sl-icon name="people"></sl-icon> ${contact.value}
                </a>`;
            default:
              return html`<p>${contact.value}</p>`;
          }
        })}
      </div>
    `;
  }
}
