import { ContentDelivererService } from "#app/api/content-deliverer-service";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { ModelArMeta } from "#models/domain/meta";
import type { ThesisSetArMeta } from "#user-contents/domain/thesis-set/meta";
import type { GetThesisSetContentMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/get-content";
import type { DomainResult } from "rilata/api";
import type { GetContentPayload, NotContentToDeliveryError } from "rilata/api-server";
import { type Caller, type AnonymousUser, success, type Result, type DTO, failure } from "rilata/core";

export class ThesisSetContentDeliverer extends ContentDelivererService<CraftYardResolvers> {
  abstractArName: ThesisSetArMeta['name'] = 'ThesisSetAr';

  ownerArName: ModelArMeta['name'] = 'ModelAr';

  async getContent(
    payload: GetContentPayload, caller: Exclude<Caller, AnonymousUser>
  ): Promise<Result<NotContentToDeliveryError, DTO>> {
    if (payload.ownerAggregateAttrs.context === 'additional-info') {
      return this.getAdditionalInfoContent(payload);
    }

    const msg = `[${this.constructor.name}]: no founded content deliverer.`;
    this.serverResolver.logger.warning(msg, { payload });
    return this.notContent(msg);
  }

  protected async getAdditionalInfoContent(
    payload: GetContentPayload,
  ): Promise<DomainResult<GetThesisSetContentMeta>> {
    if (payload.contentType === 'make-thesis') {
      return this.notContent();
    }
    if (payload.contentType === 'make-thesis-set') {
      return success({
        title: 'Введите заголовок раздела модели. Вы можете использовать синтаксис **markdown**.'
      });
    }
    if (payload.contentType === 'empty-container') {
      return success({
        title: 'Добавьте раздел чтобы рассказать о модели больше',
        body: 'Введите дополнительную информацию помогающую в принятии решения об изготовлении данного изделия. Как правило это информация о:\n- инструментах;\n- материалах.\n\nМожно разделить информацию для новичков и продвинутых добавиви два раздела.',
      });
    }
    const msg = `[${this.constructor.name}]: no founded content deliverer.`;
    this.serverResolver.logger.warning(msg, { payload })
    return this.notContent(msg);
  }

  protected notContent(description?: string): Result<NotContentToDeliveryError, never> {
      return failure({
        name: 'NotContentToDeliveryError',
        description: description ?? 'Use default content',
        type: 'domain-error',
      })
  }
}
