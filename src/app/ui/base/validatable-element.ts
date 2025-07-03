import { BaseElement } from "./base-element";
import type { ArrayLiteralFieldErrors, LiteralFieldErrors, ValidatorMap } from "node_modules/rilata/src/domain/validator/field-validator/types";
import { state } from "lit/decorators.js";
import { html } from "lit";
import type { DTO } from "rilata/core";
import { LiteralFieldValidator } from "rilata/validator";
import type { LiteralDataType } from "node_modules/rilata/src/domain/validator/rules/types";

type ValidationResult = {
  isValid: false;
  errors: string[];
} | {
  isValid: true;
  errors?: undefined,
};

export abstract class ValidatableElement<T extends DTO> extends BaseElement {
  protected abstract validatorMap: ValidatorMap<T>;

  protected errorsStyleTemplate = `
    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }
  `;

  protected abstract getFieldValue(field: keyof T): unknown;

  protected abstract setFieldValue(field: keyof T, value: unknown): void;

  @state() protected fieldErrors: Partial<Record<keyof T, string[]>> = {};

  protected createValidateHandler(field: keyof T & string) {
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

  protected validateAndUpdateField(field: keyof T & string) {
    const { isValid, errors } = this.validateField(field);
    
    if (isValid) {
      this.clearFieldError(field);
    } else {
      this.setFieldError(field, errors || []);
    }
  }

  protected getValidator(
    field: keyof T & string,
  ): LiteralFieldValidator<string, boolean, boolean, LiteralDataType> {
    const validator = this.validatorMap[field];
    if (validator instanceof LiteralFieldValidator) {
      return validator;
    }
    throw Error('finded validator not LiteralFieldValidator: ' + validator?.constructor.name)
  }

  protected validateField(field: keyof T & string): ValidationResult {
    const validator = this.getValidator(field);
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
    let result = true;
    
    (Object.keys(this.validatorMap) as Array<keyof T & string>).forEach(field => {
      const { isValid } = this.validateField(field);
      if (!isValid) result = false;
    });

    return result;
  }

  protected setFieldError(field: keyof T & string, errors: string[]): void {
    this.fieldErrors = { ...this.fieldErrors, [field]: errors };
  }

  protected clearFieldError(field: keyof T): void {
    const newErrors = { ...this.fieldErrors };
    delete newErrors[field];
    this.fieldErrors = newErrors;
  }

  protected renderFieldErrors(field: keyof T) {
    return this.fieldErrors[field]?.map(error => 
      html`<div class="error">${error}</div>`
    );
  }

  private extractErrors(
    errors: LiteralFieldErrors | ArrayLiteralFieldErrors,
    field: keyof T & string,
  ): string[] {
    if (!errors || typeof errors !== 'object') return [];

    if (this.validatorMap[field].arrayConfig.isArray) {
      const r = this.extractArrayErrors(errors as ArrayLiteralFieldErrors, field);
      return r;
    }
    
    return (errors as LiteralFieldErrors)[field].map(err => err.text);
  }

  private extractArrayErrors(errors: ArrayLiteralFieldErrors, field: keyof T & string): string[] {
    return Object.entries(errors).flatMap(([index, itemErrors]) => {
      const fieldErrors = itemErrors[field];
      if (!fieldErrors) return [];
      
      return fieldErrors.map((error: any) => (
         `Элемент ${(this.getFieldValue(field) as unknown[])[+index]}: ${error.text}`
      ));
    });
  }
}
