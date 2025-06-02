import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import type { App } from '../base/app';

@customElement('app-page')
export class AppPage extends LitElement {
  @property({ type: Object })
  app!: App;

  @state()
  private sidebarVisible = false;

  private observer?: ResizeObserver;

  static styles = css`
    :host {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100vh;
      width: 100vw;
    }

    main {
      display: grid;
      grid-template-columns: 250px 1fr;
      height: 100%;
      padding-top: 56px; /* отступ под фиксированную шапку */
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
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
  }

  render() {
    const state = this.app.getState();

    return html`
      <app-header
        .isMobile=${state.isMobile}
        @toggle-sidebar=${() => (this.sidebarVisible = !this.sidebarVisible)}
      ></app-header>

      <main class=${state.isMobile ? 'mobile' : ''}>
        ${!state.isMobile
          ? html`<app-sidebar .items=${this.app.getSidebarItems()}></app-sidebar>`
          : null}

        <div id="content">
          <slot></slot>
        </div>
      </main>

      <sl-drawer
        placement="start"
        ?open=${this.sidebarVisible}
        @sl-after-hide=${() => (this.sidebarVisible = false)}
      >
        <app-sidebar .items=${this.app.getSidebarItems()}></app-sidebar>
      </sl-drawer>
    `;
  }

  public getContentElement(): HTMLElement | null {
    return this.renderRoot.querySelector('#content');
  }
}
