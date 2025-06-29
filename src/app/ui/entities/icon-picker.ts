import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('icon-picker')
export class IconPicker extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .help-text {
      font-size: var(--sl-font-size-x-small);
      color: var(--sl-color-gray-500);
      margin-top: var(--sl-spacing-2x-small);
    }

    .icon-preview {
      display: inline-flex;
      align-items: center;
      margin-left: var(--sl-spacing-small);
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ type: String }) label = 'Иконка';
  @property({ type: String }) placeholder = 'Например: star-fill';
  @property({ type: String }) helpText = 'Введите имя иконки из списка Bootstrap Icons';
  @property({ type: String }) helpLink = 'https://shoelace.style/components/icon#default-icons';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;

  @query('sl-input') input!: HTMLInputElement;

  render() {
    return html`
      <sl-input
        name=${ifDefined(this.name)}
        label=${this.label}
        ?disabled=${this.disabled}
        value=${this.value}
        placeholder=${this.placeholder}
        @sl-change=${this.handleChange}
        ?required=${this.required}
      >
        ${this.value ? html`
          <div class="icon-preview" slot="suffix">
            <sl-icon 
              name=${this.value}
              @sl-load=${() => this.handleIconUpdated(true)}
              @sl-error=${() => this.handleIconUpdated(false)}
            ></sl-icon>
          </div>
        ` : ''}
      </sl-input>

      <div class="help-text">
        ${this.helpText} (<a href=${this.helpLink} target="_blank">список иконок</a>)
      </div>
    `;
  }

  private handleChange(e: CustomEvent) {
    const newValue = (e.target as HTMLInputElement).value;
    this.value = newValue;
    this.dispatchEvent(new CustomEvent('sl-change', { detail: { value: newValue } }));
  }

  private handleIconUpdated(isValid: boolean) {
    const event = new CustomEvent('icon-updated', {
      bubbles: true,
      composed: true,
      detail: { name: this.value, isValid }
    });
    this.dispatchEvent(event);
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'icon-picker': IconPicker;
  }
}
