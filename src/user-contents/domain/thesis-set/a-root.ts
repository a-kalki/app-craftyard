import type { DeletingIsNotPermittedError, EditingIsNotPermittedError } from "#app/domain/errors";
import type { ThesisSetArMeta } from "#user-contents/domain/thesis-set/meta";
import type { Thesis, ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";
import { thesisSetValidator } from "#user-contents/domain/thesis-set/v-map";
import { failure, success, type Result } from "rilata/core";
import { AggregateRoot } from "rilata/domain";
import type { AddThesisCommand } from "./struct/thesis/add";
import type { EditThesisCommand } from "./struct/thesis/edit";

export class ThesisSetAr extends AggregateRoot<ThesisSetArMeta> {
    name = "ThesisSetAr" as const;

    constructor(attrs: ThesisSetAttrs) {
      super(attrs, thesisSetValidator)
    }

    getShortName(): string {
      return this.attrs.title;
    }

    addThesis(thesis: Thesis): void {
      this.attrs.theses.push(thesis);
      this.checkInvariants();
    }

    editThesis(
      patchAttrs: EditThesisCommand['attrs']['thesis'],
    ): Result<EditingIsNotPermittedError, undefined> {
      const thesisIndex = this.attrs.theses.findIndex((thesis) => thesis.id === patchAttrs.id);

      if (thesisIndex === -1) {
        return failure({
          name: 'EditingIsNotPermittedError',
          description: `Не найден тезис с id: ${patchAttrs.id}`,
          type: 'domain-error',
        });
      }

      const oldThesis = this.attrs.theses[thesisIndex];
      const updatedThesis: Thesis = { ...oldThesis, ...patchAttrs, updateAt: Date.now() };
      this.attrs.theses[thesisIndex] = updatedThesis;

      this.checkInvariants();
      return success(undefined);
    }

    deleteThesis(thesisId: string): Result<DeletingIsNotPermittedError, undefined> {
      const initialLength = this.attrs.theses.length;
      this.attrs.theses = this.attrs.theses.filter(thesis => thesis.id !== thesisId);

      if (this.attrs.theses.length === initialLength) {
        return failure({
          name: 'DeletingIsNotPermittedError',
          description: `Тезис с id: ${thesisId} не найден для удаления.`,
          type: 'domain-error',
      });
    }

    this.checkInvariants();
    return success(undefined);
  }
}
