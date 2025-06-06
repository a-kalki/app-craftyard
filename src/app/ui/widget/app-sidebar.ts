import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { RootItem } from '../base/types';
import { BaseElement } from '../base/base-element';

@customElement('app-sidebar')
export class AppSidebarWidget extends BaseElement {
  @property({ type: Array }) items: RootItem[] = [];
  @property({ type: String }) activeItem?: string;
  @property({ type: Boolean }) isMobile = false;
  @property({ type: Function }) closeSidebar = () => {};

  static styles = css`
    sl-tree {
      padding: 0.5rem;
    }

    sl-tree-item::part(base) {
      padding: 0.75rem;
      border-radius: var(--sl-border-radius-small);
      transition: background 0.2s;
    }

    sl-tree-item[selected]::part(base) {
      background: var(--sl-color-primary-200);
      font-weight: bold;
    }

    sl-tree-item:not([selected]):hover::part(base) {
      background: var(--sl-color-primary-100);
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
      <sl-tree>
        ${this.items.map(
          item => html`
            <sl-tree-item
              ?selected=${item.name === this.activeItem}
              @click=${(e: MouseEvent) => this.handleSelect(e, item)}
            >
              <sl-icon name=${item.icon}></sl-icon>
              ${item.title}
            </sl-tree-item>
          `
        )}
      </sl-tree>
    `;
  }

  private handleSelect(event: MouseEvent, item: RootItem) {
    event.preventDefault();
    this.activeItem = item.name;
    this.app.router.navigate(`/${item.name}`);
    
    // Закрываем sidebar в мобильном режиме
    if (this.isMobile) {
      this.closeSidebar();
    }
  }
}
