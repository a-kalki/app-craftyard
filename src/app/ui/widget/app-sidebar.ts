import { html, css, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SidebarItem } from '../base/types';
import { BaseElement } from '../base/base-element';

@customElement('app-sidebar')
export class AppSidebarWidget extends BaseElement {
  @property({ type: Array }) items: SidebarItem[] = [];
  @property({ type: String }) activeItem?: string;
  @property({ type: Boolean }) isMobile = false;
  @property({ type: Function }) closeSidebar = () => {};

  static styles = css`
    :host {
      display: block;
      width: 250px;
      border-right: 1px solid var(--sl-color-neutral-200);
      padding: 0.5rem;
      box-sizing: border-box;
      overscroll-behavior: contain;
      font-family: var(--sl-font-sans);
    }

    .sidebar-item {
      margin-bottom: 0.5rem;
    }

    .sidebar-item a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--sl-border-radius-small);
      color: var(--sl-color-neutral-900);
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
    }

    .sidebar-item a:hover {
      background: var(--sl-color-primary-100);
    }

    .sidebar-item a[selected] {
      background: var(--sl-color-primary-200);
      font-weight: bold;
    }

    .sidebar-children {
      margin-left: 1rem;
      border-left: 2px solid var(--sl-color-neutral-200);
      padding-left: 0.5rem;
      margin-top: 0.25rem;
    }

    .sidebar-item a.active {
      background: var(--sl-color-primary-100);
      font-weight: bold;
    }

    @media (max-width: 768px) {
      :host {
        width: 100%;
        border-right: none;
      }
    }
  `;

  private unsubscribe!: () => void;

  connectedCallback() {
    super.connectedCallback();

    this.setActiveByPath();
    this.unsubscribe = this.app.router.subscribe(() => this.setActiveByPath());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  render() {
    return html`
      <nav class="sidebar">
        ${this.renderItems(this.items)}
      </nav>
    `;
  }

  private renderItems(items: SidebarItem[]): TemplateResult[] {
    return items.map(item => {
      const isActive = this.activeItem === item.name;

      return html`
        <div class="sidebar-item">
          <a
            href=${item.url}
            class=${isActive ? 'active' : ''}
            @click=${(e: MouseEvent) => this.handleSelect(e, item)}
          >
            <sl-icon name=${item.icon}></sl-icon>
            <span>${item.title}</span>
          </a>

          ${item.children?.length
            ? html`<div class="sidebar-children">
                ${this.renderItems(item.children)}
              </div>`
            : null}
        </div>
      `;
    });
  }

  private handleSelect(event: MouseEvent, item: SidebarItem) {
    event.preventDefault();
    this.activeItem = item.name;
    this.app.router.navigate(item.url);
    
    // Закрываем sidebar в мобильном режиме
    if (this.isMobile) {
      this.closeSidebar();
    }
  }

  private setActiveByPath(): void {
    const path = this.app.router.getPath();

    const findActive = (items: SidebarItem[]): string | undefined => {
      for (const item of items) {
        if (path.startsWith(item.url)) return item.name;
        if (item.children) {
          const found = findActive(item.children);
          if (found) return found;
        }
      }
    };

    const foundName = findActive(this.items);
    if (foundName) this.activeItem = foundName;
  };
}
