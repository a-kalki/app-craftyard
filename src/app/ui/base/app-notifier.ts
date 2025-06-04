import type { ToastMessage, ToastVariant } from "./types";

export class AppNotifier {
  private toasterEl: HTMLElement | null = null;
  private shownMessages = new Set<string>();

  info(text: string, options?: { variant?: ToastVariant; details?: unknown }) {
    this.show({
      id: Date.now(),
      text,
      variant: options?.variant ?? 'info',
      details: options?.details,
    });
  }

  error(text: string, details?: unknown) {
    this.show({
      id: Date.now(),
      text,
      variant: 'danger',
      details,
    });
  }

  private getToaster(): HTMLElement | null {
    if (!this.toasterEl) {
      this.toasterEl = document.querySelector('app-toaster');
    }
    return this.toasterEl;
  }

  private show(message: ToastMessage) {
    const key = `${message.variant}:${message.text}`;
    if (this.shownMessages.has(key)) return;

    this.shownMessages.add(key);
    setTimeout(() => this.shownMessages.delete(key), 5000);

    const el = this.getToaster();
    if (el) {
      el.dispatchEvent(
        new CustomEvent('toast-message', {
          detail: message,
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      throw Error('Toaster not found');
    }
  }
}
