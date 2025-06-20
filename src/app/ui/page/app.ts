import { html, css, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import type { RoutableComponent } from '../base/types';

@customElement('app-page')
export class AppPage extends BaseElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      justify-content: stretch;
      align-items: center; /* центрируем по горизонтали */
      background: var(--app-background, white);
    }

    .container {
      display: grid;
      grid-template-rows: auto 1fr;
      max-width: 1200px; /* ограничение ширины */
      width: 100%;
      height: 100%;
    }

    main {
      display: grid;
      grid-template-columns: 250px 1fr;
      height: 100%;
      padding-top: 56px; /* отступ под фиксированную шапку */
    }

    #content {
      width: 100%;
      max-width: none; /* Убираем возможные ограничения */
    }

    main.mobile {
      grid-template-columns: 1fr;
    }

    sl-drawer::part(base) {
      top: 56px !important;
      height: calc(100% - 48px) !important;
    }

    @media (max-width: 768px) {
      main {
        grid-template-columns: 1fr;
      }
    }
  `;

  @state()
  private sidebarVisible = false;

  @state()
  private routableComponent: RoutableComponent | null = null;

  private observer?: ResizeObserver;

  private unsubscribeRouter?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const isMobile = width < 768;
        const currentState = this.app.getState();
        if (currentState.isMobile !== isMobile) {
          this.app.setMobileState(isMobile);
          this.requestUpdate();
        }
      }
    });
    this.observer.observe(document.body);

    this.unsubscribeRouter = this.app.router.subscribe(this.handleUrlChanged.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.unsubscribeRouter?.();
  }

  render() {
    const state = this.app.getState();
    const component = this.routableComponent;

    return html`
      <div class="container">
        <app-header
          .isMobile=${state.isMobile}
          @toggle-sidebar=${() => (this.sidebarVisible = !this.sidebarVisible)}
        ></app-header>

        <main class=${state.isMobile ? 'mobile' : ''}>
          ${!state.isMobile
            ? html`<app-sidebar 
                  .items=${this.app.getRootItems()}
                  .closeSidebar=${() => (this.sidebarVisible = false)}
                  .isMobile=${state.isMobile}
                ></app-sidebar>`
            : null}

          <div id="content">
            ${!component
              ? html`<sl-spinner>Загрузка приложения...</sl-spinner>`
              : component.type === 'wc'
                ? html`<app-content>${this.renderCustomComponent(component.tag)}</app-content>`
                : html`<app-content .svelteComponentTag=${component.tag}></app-content>`
            }
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
            .isMobile=${state.isMobile}
          ></app-sidebar>
        </sl-drawer>
      </div>
    `;
  }

  private renderCustomComponent(tag: string): TemplateResult {
    if (!customElements.get(tag)) {
      return staticHtml`<internal-error>internal error: unknown tag - "${tag}"</internal-error>`;
    }

    const tagStatic = unsafeStatic(tag);
    return staticHtml`<${tagStatic}></${tagStatic}>`;
  }

  private handleUrlChanged(): void {
    const entry = this.app.router.getEntry();
    if (!entry) {
      this.routableComponent = {
        type: 'wc',
        tag: 'content-not-found',
        pattern: 'page 404'
      }
      return;
    }
    const { matcher, ...routableComponent } = entry;
    this.routableComponent = routableComponent;
  }
}
