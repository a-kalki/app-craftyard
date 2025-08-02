import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';

@customElement('app-page')
export class AppPage extends BaseElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      justify-content: stretch;
      align-items: center;
      background: var(--app-background, white);
    }

    .container {
      display: grid;
      grid-template-rows: auto 1fr;
      max-width: 1200px;
      width: 100%;
      height: 100%;
    }

    main {
      display: grid;
      grid-template-columns: 250px 1fr;
      padding-top: 56px;
      min-width: 0;
      overflow-x: hidden;
    }

    #content {
      width: 100%;
      max-width: none;
      min-width: 0;
      overflow: hidden;
    }

    app-sidebar {
      height: calc(100vh - 56px);
      overflow-y: auto;
      position: sticky;
      top: 56px;
      background: var(--app-background, white);
      z-index: 10;
    }

    main.mobile {
      grid-template-columns: 1fr;
      min-width: 0;
    }

    sl-drawer::part(base) {
      top: 56px !important;
      height: calc(100% - 48px) !important;
      min-width: 0;
    }

    @media (max-width: 768px) {
      
      app-sidebar {
        position: static;
        height: auto;
      }
    }
  `;

  @state()
  private sidebarVisible = false;

  @state()
  private currentTag: string | null = null;

  private unsubscribeRouter?: () => void;

  connectedCallback(): void {
    super.connectedCallback();

    // Changed to arrow function to preserve 'this' context
    window.addEventListener('app-is-mobile-changed', this.handlerIsMobileChanged);
    this.unsubscribeRouter = this.app.router.subscribe(this.handleUrlChanged.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener('app-is-mobile-changed', this.handlerIsMobileChanged)
    this.unsubscribeRouter?.();
  }

  protected handlerIsMobileChanged = (): void => {
    this.requestUpdate();
  };

  render() {
    const appState = this.app.appState;

    return html`
      <div class="container">
        <app-header
          .isMobile=${appState.isMobile}
          @toggle-sidebar=${() => (this.sidebarVisible = !this.sidebarVisible)}
        ></app-header>

        <main class=${appState.isMobile ? 'mobile' : ''}>
          ${!appState.isMobile
            ? html`<app-sidebar 
                  .items=${this.app.getRootItems()}
                  .closeSidebar=${() => (this.sidebarVisible = false)}
                  .isMobile=${appState.isMobile}
                ></app-sidebar>`
            : null}

          <div id="content">
            ${this.renderContent()}
          </div>
        </main>

        <sl-drawer
          placement="start"
          ?open=${this.sidebarVisible}
          @sl-after-hide=${() => (this.sidebarVisible = false)}
        >
          <app-sidebar 
            .items=${this.app.getRootItems()}
            .closeSidebar=${() => (this.sidebarVisible = false)}
            .isMobile=${appState.isMobile}
          ></app-sidebar>
        </sl-drawer>
      </div>
    `;
  }

  private renderContent() {
    if (!this.currentTag || this.currentTag === '404 page') {
      return staticHtml`<content-not-found></content-not-found>`;
    }

    const tag = this.currentTag;
    if (!customElements.get(tag)) {
      return staticHtml`<internal-error>internal error</internal-error>`;
    }

    const tagStatic = unsafeStatic(tag);
    return staticHtml`<${tagStatic}></${tagStatic}>`;
  }

  private handleUrlChanged(): void {
    const url = this.app.router.getPath();
    // url авторизации не должен рендерится приложением
    // для этого url будет перерисовано вся страница приложения
    if (url === '/login') return;
    const entry = this.app.router.getEntry();
    this.currentTag = entry ? entry.tag : '404 page';
  }
}
