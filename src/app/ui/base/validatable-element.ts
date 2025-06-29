import type { LiteralFieldValidator } from "rilata/validator";
import { BaseElement } from "./base-element";
import type { ArrayLiteralFieldErrors, LiteralFieldErrors } from "node_modules/rilata/src/domain/validator/field-validator/types";
import { state } from "lit/decorators.js";
import { html } from "lit";

type ValidationResult = {
  isValid: false;
  errors: string[];
} | {
  isValid: true;
  errors?: undefined,
};

export abstract class ValidatableElement<T extends string> extends BaseElement {
  protected abstract validatorMap: Record<
    T, 
    LiteralFieldValidator<T, boolean, boolean, any>
  >;

  protected errorsStyleTemplate = `
    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }
  `;

  protected abstract getFieldValue(field: T): unknown;

  protected abstract setFieldValue(field: T, value: unknown): void;

  @state() protected fieldErrors: Partial<Record<T, string[]>> = {};

  protected createValidateHandler(field: T) {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value =
        target.type === 'checkbox'
          ? target.checked
          : target.type === 'number'
            ? target.value ? Number(target.value) : undefined
            : target.value ? target.value : undefined;
      this.setFieldValue(field, value);
      this.validateAndUpdateField(field);
    };
  }

  protected validateAndUpdateField(field: T) {
    const { isValid, errors } = this.validateField(field);
    
    if (isValid) {
      this.clearFieldError(field);
    } else {
      this.setFieldError(field, errors || []);
    }
  }

  protected validateField(field: T): ValidationResult {
    const validator = this.validatorMap[field];
    if (!validator) throw Error(`Validator not found for ${field}`);

    const value = this.getFieldValue(field);
    const result = validator.validate(value);
    
    if (result.isFailure()) {
      const errors = this.extractErrors(result.value, field);
      return { isValid: false, errors };
    }

    return { isValid: true };
  }

  protected validateAll(): boolean {
    let isValid = true;
    
    (Object.keys(this.validatorMap) as T[]).forEach(field => {
      const { isValid: fieldValid } = this.validateField(field);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  }

  protected setFieldError(field: T, errors: string[]): void {
    this.fieldErrors = { ...this.fieldErrors, [field]: errors };
  }

  protected clearFieldError(field: T): void {
    const newErrors = { ...this.fieldErrors };
    delete newErrors[field];
    this.fieldErrors = newErrors;
  }

  protected renderFieldErrors(field: T) {
    return this.fieldErrors[field]?.map(error => 
      html`<div class="error">${error}</div>`
    );
  }

  private extractErrors(
    errors: LiteralFieldErrors | ArrayLiteralFieldErrors,
    field: T,
  ): string[] {
    if (!errors || typeof errors !== 'object') return [];

    if (this.validatorMap[field].arrayConfig.isArray) {
      const r = this.extractArrayErrors(errors as ArrayLiteralFieldErrors, field);
      return r;
    }
    
    return (errors as LiteralFieldErrors)[field].map(err => err.text);
  }

  private extractArrayErrors(errors: ArrayLiteralFieldErrors, field: T): string[] {
    return Object.entries(errors).flatMap(([index, itemErrors]) => {
      const fieldErrors = itemErrors[field];
      if (!fieldErrors) return [];
      
      return fieldErrors.map((error: any) => (
         `Элемент ${(this.getFieldValue(field) as unknown[])[+index]}: ${error.text}`
      ));
    });
  }
}
