import type { CraftYardResolvers } from "#app/api/resolvers";
import type { GetThesisSetContentCommand, GetThesisSetContentMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/get-content";
import { UseCase, type RequestScope } from "rilata/api";
import type { Result } from "rilata/core";

export class GetThesisSetContentUseCase extends UseCase {
  name: GetThesisSetContentMeta['name'] = 'Get Thesis Sets Content Use Case';

  inputName: GetThesisSetContentMeta['in']['name'] = 'get-thesis-sets-content';

  arName: GetThesisSetContentMeta['aRoot']['name'] = 'ThesisSetAr';

  protected resolvers!: CraftYardResolvers;

  init(resolvers: CraftYardResolvers): void {
    this.resolvers = resolvers;
  }

  execute(input: GetThesisSetContentCommand, reqScope: RequestScope): Promise<Result<unknown, unknown>> {
    const { moduleMediator } = this.resolvers.serverResolver;
    return moduleMediator.getContent(this.arName, input.attrs, reqScope.caller)
  }
}
