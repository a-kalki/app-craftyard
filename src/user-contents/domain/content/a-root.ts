import { AggregateRoot } from "rilata/domain";
import type { UserContent, UserContentArMeta } from "./meta";
import { fileContentValidator, thesisContentValidator } from "./v-map";
import type { DtoFieldValidator } from "rilata/validator";
import { AssertionException, type DTO, type PatchValue } from "rilata/core";
import { dtoUtility } from "rilata/utils";

const invariantValidators: Record<
  UserContent['type'],
  DtoFieldValidator<string, boolean, boolean, DTO>
> = {
  THESIS: thesisContentValidator,
  FILE: fileContentValidator
}

export class UserContentAr extends AggregateRoot<UserContentArMeta> {
  name = "UserContentAr" as const;

  constructor(attrs: UserContent) {
    // @ts-expect-error: правильный валидатор подставится в checkInvariants
    super(attrs, 'validator-stub')
  }

  getShortName(): string {
    const type = this.attrs.type === 'THESIS' ? 'Тезис: ' : 'Файл: ';
    return `${type}${this.attrs.title}`
  }

  editContent(patchAttrs: Partial<PatchValue<UserContent>>): void {
    const excludeAttrs: Array<keyof UserContent> = ['id', 'createAt', 'sectionId', 'type']
    const patch = dtoUtility.excludeAttrs(patchAttrs, excludeAttrs);
    // @ts-expect-error: ошибка типов в поле patch.type
    this.attrs = dtoUtility.applyPatch(this.getAttrs(), { ...patch, updateAt: Date.now() });
    this.checkInvariants();
  }

  getType(): UserContent['type'] {
    return this.attrs.type;
  }

  protected checkInvariants(): void {
    const invariantsValidator = invariantValidators[this.getType()];
    if (!invariantsValidator) {
      throw new AssertionException(`not finded validator: ${this.getType()}`);
    }

    const invariantsResult = invariantsValidator.validate(this.attrs);
    if (invariantsResult.isFailure()) {
      const err = `[${this.constructor.name}] не соблюдены инварианты агрегата`;
      const body = JSON.stringify({
        attrs: this.getAttrs(),
        validationResult: invariantsResult.value,
      }, null, 2);
      throw new AssertionException(`${err}\n\n${body}`);
    }
  }
}
