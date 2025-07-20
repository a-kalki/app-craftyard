import { html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';

@customElement('image-gallery-dialog')
export class ImageGalleryDialog extends BaseElement {
  @property({ type: Array }) imageUrls: string[] = [];
  @property({ type: Number }) initialIndex: number = 0;

  @state() protected currentImageIndex: number = 0;
  @state() protected isOpen: boolean = false;

  static styles = css`
    .gallery-dialog::part(body) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        overflow: hidden;
    }
    .gallery-dialog::part(header) {
        display: none;
    }
    .gallery-dialog::part(close-button) {
        font-size: 1.5rem;
        color: var(--sl-color-neutral-0);
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: var(--sl-border-radius-circle);
        padding: 0.25rem;
        top: 15px;
        right: 15px;
        z-index: 20;
    }

    .gallery-content {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 200px;
        background-color: var(--sl-color-neutral-900);
    }

    .gallery-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
        user-select: none;
    }

    .gallery-nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        font-size: 2.5rem;
        color: var(--sl-color-neutral-0);
        background-color: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: var(--sl-border-radius-circle);
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .gallery-nav-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    .gallery-nav-button.prev {
        left: 15px;
    }

    .gallery-nav-button.next {
        right: 15px;
    }
  `;

  public show(initialIndex: number = 0) {
    if (this.imageUrls.length === 0) {
      return;
    }
    
    // Проверка и корректировка индекса
    const safeIndex = Math.max(0, Math.min(initialIndex, this.imageUrls.length - 1));
    this.currentImageIndex = safeIndex;
    this.isOpen = true;
  }

  public hide() {
    this.isOpen = false;
  }

  private handleDialogHide() {
    this.isOpen = false;
  }

  private goToPreviousImage() {
    if (this.imageUrls.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
  }

  private goToNextImage() {
    if (this.imageUrls.length === 0) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.imageUrls.length;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.isOpen) return;
    if (event.key === 'ArrowLeft') {
      this.goToPreviousImage();
    } else if (event.key === 'ArrowRight') {
      this.goToNextImage();
    } else if (event.key === 'Escape') {
      this.hide();
    }
  };


  render() {
    const currentImageUrl = this.imageUrls[this.currentImageIndex];
    const showNavButtons = this.imageUrls.length > 1;

    return html`
      <sl-dialog 
        .open=${this.isOpen} 
        @sl-hide=${this.handleDialogHide} 
        class="gallery-dialog"
        no-header
      >
        ${currentImageUrl ? html`
            <div class="gallery-content">
                <img 
                    class="gallery-image" 
                    src=${currentImageUrl} 
                    alt="Image ${this.currentImageIndex + 1} of ${this.imageUrls.length}"
                >
                ${showNavButtons ? html`
                    <sl-button 
                        variant="text" 
                        size="large" 
                        class="gallery-nav-button prev" 
                        @click=${this.goToPreviousImage}
                        pill
                        aria-label="Previous image"
                    >
                        <sl-icon name="chevron-left"></sl-icon>
                    </sl-button>
                    <sl-button 
                        variant="text" 
                        size="large" 
                        class="gallery-nav-button next" 
                        @click=${this.goToNextImage}
                        pill
                        aria-label="Next image"
                    >
                        <sl-icon name="chevron-right"></sl-icon>
                    </sl-button>
                ` : nothing}
            </div>
        ` : html`<p>No image to display.</p>`}
      </sl-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'image-gallery-dialog': ImageGalleryDialog;
  }
}
