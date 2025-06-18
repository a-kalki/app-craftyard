export class KeyboardUtils {
  isActionKey(event: KeyboardEvent): boolean {
    return ['Enter', ' '].includes(event.key);
  }

  isEscape(event: KeyboardEvent): boolean {
    return event.key === 'Escape';
  }

  isArrowLeft(event: KeyboardEvent): boolean {
    return event.key === 'ArrowLeft';
  }
}

export const keyboardUtils = new KeyboardUtils();
