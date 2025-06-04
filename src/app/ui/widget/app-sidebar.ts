import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { RootItem } from '../base/types';
import { BaseElement } from '../base/base-element';

@customElement('app-sidebar')
export class AppSidebarWidget extends BaseElement {
  @property({ type: Array }) items: RootItem[] = [];
  @property({ type: String }) activeItem?: string;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      background: var(--sl-color-neutral-100);
      color: var(--sl-color-neutral-900);
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
      margin: 0;
      border-right: 1px solid var(--sl-color-neutral-200);
    }

    sl-button {
      --sl-button-background-color: transparent;
      --sl-button-color: var(--sl-color-neutral-900);
      --sl-button-border-radius: 0;
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      transition: background 0.2s;
      width: 100%;
    }

    sl-button:hover {
      background: var(--sl-color-primary-100);
    }

    sl-button[active] {
      background: var(--sl-color-primary-200);
      font-weight: bold;
    }
  `;

  private unsubscribe!: () => void;

  connectedCallback() {
    super.connectedCallback();
    if (!this.activeItem && this.items.length > 0) {
      this.activeItem = this.items[this.items.length - 1].name;
    }

    this.unsubscribe = this.app.router.subscribe(() => {
      const path = this.app.router.getPath();
      this.items.forEach(item => {
        if(`/${item.name}` === path) {
          this.activeItem = item.name;
        }
      })
    })
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  render() {
    return html`
      ${this.items.map(
        item => html`
          <sl-button
            ?active=${item.name === this.activeItem}
            @click=${(e: MouseEvent) => this.select(e, item)}
          >
            <sl-icon slot="prefix" name=${item.icon} style="margin-right: 0.5rem;"></sl-icon>
            ${item.title}
          </sl-button>
        `
      )}
    `;
  }

  private select(e: MouseEvent, item: RootItem) {
    e.preventDefault();
    this.activeItem = item.name;
    this.app.router.navigate(`/${item.name}`);
  }
}
