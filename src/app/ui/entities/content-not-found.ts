import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('content-not-found')
export class Page404 extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      text-align: center;
    }

    h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.5rem;
      color: #666;
    }
  `;

  render() {
    return html`
      <h1>404 - Страница не найдена</h1>

      <slot></slot>
    `;
  }
}
