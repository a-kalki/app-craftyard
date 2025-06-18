import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { ToastMessage } from '../base/types';

@customElement('app-toaster')
export class AppToaster extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 16px;
      right: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 10000;
    }
  `;

  @state()
  private messages: ToastMessage[];

  private timers = new Map<number, number>();
  
  constructor() {
    super();
    this.messages = []; // ✅ теперь инициализация не мешает реактивности
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('toast-message', this.handleMessage as EventListener);
  }

  disconnectedCallback() {
    this.removeEventListener('toast-message', this.handleMessage as EventListener);
    super.disconnectedCallback();
  }

  private handleMessage(e: CustomEvent<ToastMessage>): void {
    const msg = e.detail;
    this.messages = [...this.messages, msg];
    this.startTimer(msg.id);
  };

  private startTimer(id: number) {
    // Очистить старый таймер, если был
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
    }
    const timer = window.setTimeout(() => {
      this.removeMessage(id);
    }, 5000);
    this.timers.set(id, timer);
  }

  private removeMessage(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
    }
  }

  render() {
    return html`
      ${this.messages.map(msg => {
        let detailContent: string | null = null;

        if (msg.details instanceof Error) {
          const { name, message, stack } = msg.details;
          detailContent = JSON.stringify({ name, message, stack }, null, 2);
        } else if (typeof msg.details === 'string' && msg.details.trim()) {
          detailContent = msg.details;
        } else if (
          typeof msg.details === 'object' &&
          msg.details !== null &&
          Object.keys(msg.details).length > 0
        ) {
          detailContent = JSON.stringify(msg.details, null, 2);
        }

        return html`
          <sl-alert 
            open 
            closable 
            variant=${msg.variant}
            style="max-width: 90vw; word-break: break-word;"
          >
            <div style="white-space: pre-wrap; word-break: break-word;">
              <strong>${msg.text}</strong>
            </div>
            ${detailContent
              ? html`
                  <sl-details 
                    summary="Показать подробности" 
                    style="margin-top: 0.5rem"
                    @sl-show=${() => this.onDetailsToggle(msg.id, true)}
                    @sl-hide=${() => this.onDetailsToggle(msg.id, false)}
                    <div style="
                      max-height: 40vh; 
                      max-width: 90vw; 
                      overflow: auto; 
                      background: #f9f9f9; 
                      padding: 4px; 
                      border-radius: 4px;
                    ">
                      <pre style="
                        white-space: pre; 
                        font-size: 0.8rem; 
                        overflow-x: auto; 
                        overflow-wrap: normal;
                        word-break: normal;
                      ">
                    ${detailContent}
                      </pre>
                    </div>
                  </sl-details>
                `
              : ''}
          </sl-alert>
        `;
      })}
    `;
  }

  private onDetailsToggle(id: number, opened: boolean) {
    if (opened) {
      // отменяем удаление
      if (this.timers.has(id)) {
        clearTimeout(this.timers.get(id));
      }
    } else {
      // запускаем таймер заново
      this.startTimer(id);
    }
  }
}

