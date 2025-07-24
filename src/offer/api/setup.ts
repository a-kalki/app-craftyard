import { offerApiUrl } from "#offer/constants";
import type { ModuleConfig, UseCase } from "rilata/api";
import type { CraftYardResolvers } from "#app/api/resolvers";
import type { PerformCheckerService } from "#app/api/perform-checker-service";
import type { ContentDelivererService } from "#app/api/content-deliverer-service";
import { GetOfferUseCase } from "./use-cases/get-offer.uc";
import { GetWorkshopOffersUseCase } from "./use-cases/get-workshop-offers.uc";
import { GetMasterOffersUseCase } from "./use-cases/get-master-offers.uc";
import { AddOfferUseCase } from "./use-cases/add-offer.uc";
import { EditOfferUseCase } from "./use-cases/edit-offer.uc";
import { DeleteOfferUseCase } from "./use-cases/delete-offer.uc";
import { GetOffersUseCase } from "./use-cases/get-offers.uc";

export const offerModuleConfig: ModuleConfig = {
    moduleUrls: [offerApiUrl]
}

export const offerModuleUseCases: UseCase[] = [
  new GetOfferUseCase(),
  new GetOffersUseCase(),
  new GetWorkshopOffersUseCase(),
  new GetMasterOffersUseCase(),
  new AddOfferUseCase(),
  new EditOfferUseCase(),
  new DeleteOfferUseCase(),
]

export const offerModulePermissionCheckers: PerformCheckerService<CraftYardResolvers>[] = [
]

export const offerModuleContentDeliverer: ContentDelivererService<CraftYardResolvers>[] = [
]
