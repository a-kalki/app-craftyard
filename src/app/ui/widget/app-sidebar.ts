import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { RootItem } from '../base/types';
import { WithContextElement } from '../base/base-element';

@customElement('app-sidebar')
export class AppSidebarWidget extends WithContextElement {
  @property({ type: Array }) items: RootItem[] = [];
  @property({ type: String }) activeItem?: string;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      background: #444;
      color: white;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    button {
      background: none;
      color: inherit;
      border: none;
      padding: 1rem;
      text-align: left;
      cursor: pointer;
      width: 100%;
      border-bottom: 1px solid #555;
      transition: background 0.2s;
    }

    button:hover {
      background: #555;
    }

    button.active {
      background: #666;
      font-weight: bold;
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    this.items.forEach(item => {
      item.urlPatterns.forEach(pattern => {
        this.app.router.registerPattern(pattern);
      });
    });

    if (!this.activeItem && this.items.length > 0) {
      this.activeItem = this.items[0].root;
    }
  }

  render() {
    return html`
      ${this.items.map(
        item => html`
          <button
            class=${item.root === this.activeItem ? 'active' : ''}
            @click=${() => this.select(item)}
          >
            ${item.title}
          </button>
        `
      )}
    `;
  }

  private select(item: RootItem) {
    this.activeItem = item.root;
    this.app.router.navigate(item.root);
  }
}
