import { type TemplateResult } from 'lit';
import { render } from 'lit-html';

type DialogContent = string | HTMLElement | TemplateResult;

export type DialogOptions = {
    title: DialogContent;
    content: DialogContent;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'primary' | 'default' | 'success' | 'danger' | 'warning' | 'text';
    cancelVariant?: 'primary' | 'default' | 'success' | 'danger' | 'warning' | 'text';
  }

export class AppDialog {
  private dialog: HTMLDialogElement & { show: () => void; hide: () => void } & HTMLElement;
  private confirmBtn!: HTMLElement;
  private cancelBtn?: HTMLElement;
  private footer!: HTMLElement;

  constructor() {
    this.dialog = this.getOrCreateDialog();
  }

  async show(options: DialogOptions): Promise<boolean> {
    this.clearDialog();
    this.renderTitle(options.title);
    this.renderContent(options.content);
    this.renderFooter(
      options.confirmText ?? 'Ок',
      options.cancelText,
      options.confirmVariant ?? 'primary',
      options.cancelVariant ?? 'default'
    );

    this.dialog.show();

    return new Promise((resolve) => {
      this.confirmBtn.onclick = () => {
        this.dialog.hide();
        resolve(true);
      };

      this.dialog.addEventListener(
        'sl-hide',
        () => resolve(false),
        { once: true }
      );

      if (this.cancelBtn) {
        this.cancelBtn.onclick = () => {
          this.dialog.hide();
          resolve(false);
        };
      }
    });
  }

  private getOrCreateDialog() {
    let dialog = document.getElementById('app-dialog') as typeof this.dialog | null;
    if (!dialog) {
      throw Error('App dialog not found');
    }
    return dialog;
  }

  private clearDialog() {
    this.dialog.innerHTML = '';
  }

  private renderTitle(title: DialogContent) {
    const labelContainer = document.createElement('div');
    labelContainer.slot = 'label';

    if (typeof title === 'string') {
      labelContainer.textContent = title;
    } else if (title instanceof HTMLElement) {
      labelContainer.appendChild(title);
    } else {
      requestAnimationFrame(() => render(title, labelContainer));
    }

    this.dialog.appendChild(labelContainer);
  }

  private renderContent(content: DialogContent) {
    if (typeof content === 'string') {
      const container = document.createElement('div');
      container.innerHTML = content;
      this.dialog.appendChild(container);
    } else if (content instanceof HTMLElement) {
      this.dialog.appendChild(content);
    } else {
      const container = document.createElement('div');
      render(content, container);
      this.dialog.appendChild(container);
    }
  }

  private renderFooter(
    confirmText: string,
    cancelText?: string,
    confirmVariant: string = 'primary',
    cancelVariant: string = 'default'
  ) {
    this.footer = document.createElement('div');
    this.footer.slot = 'footer';
    this.footer.style.display = 'flex';
    this.footer.style.justifyContent = cancelText ? 'space-between' : 'flex-end';
    this.footer.style.gap = '0.5rem';

    if (cancelText) {
      this.cancelBtn = document.createElement('sl-button');
      (this.cancelBtn as any).variant = cancelVariant;
      this.cancelBtn.innerText = cancelText;
      this.footer.appendChild(this.cancelBtn);
    } else {
      this.cancelBtn = undefined;
    }

    this.confirmBtn = document.createElement('sl-button');
    (this.confirmBtn as any).variant = confirmVariant;
    this.confirmBtn.innerText = confirmText;
    this.footer.appendChild(this.confirmBtn);

    this.dialog.appendChild(this.footer);  }
}

