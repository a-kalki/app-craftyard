import {
    DtoFieldValidator,
  LiteralFieldValidator, MaxNumberValidationRule, MinCharsCountValidationRule, MinDateStampValidationRule,
  PositiveNumberValidationRule, StringChoiceValidationRule, UuidField, type ValidatorMap,
} from "rilata/validator";
import type { CommissionStrategy, IndividualCommission, SubscriptionPlan, WorkshopAbout, WorkshopAttrs, WorkshopMembership, WorkshopRoom, WorkstationAttrs } from "./struct/attrs";
import { commissionStrategyTypes, individualCommissionTypes, workshopPrivelegyTypes } from "./constants";
import { getUserIdValidator } from "#app/domain/user/v-map";
import { customContentVmap } from "#app/domain/v-map";

const workshopAbout: ValidatorMap<WorkshopAbout> = {
  logo: new LiteralFieldValidator('logo', false, { isArray: false }, 'string', []),
  location: new LiteralFieldValidator('location', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Местоположение должно содержать не менее 5 символов'),
  ]),
  customContent: new DtoFieldValidator('customContent', false, { isArray: true }, 'dto', customContentVmap),
}

const subsriptionPlanVmap: ValidatorMap<SubscriptionPlan> = {
  id: new LiteralFieldValidator('id', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Идентификатор подписки должен содержать не менее 5 символов'),
  ]),
  title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Название подписки должно содержать не менее 5 символов'),
  ]),
  description: new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Описание подписки должно содержать не менее 10 символов'),
  ]),
  durationDays: new LiteralFieldValidator('durationDays', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  price: new LiteralFieldValidator('price', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ])
}

const commissionStrategyVmap: ValidatorMap<CommissionStrategy> = {
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(commissionStrategyTypes)
  ]),
  productCommissionPercent: new LiteralFieldValidator('productCommissionPercent', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
    new MaxNumberValidationRule(100),
  ]),
  programCommissionPercent: new LiteralFieldValidator('programCommissionPercent', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
    new MaxNumberValidationRule(100),
  ]),
}

const IndividualCommissionVmap: ValidatorMap<IndividualCommission> = {
  id: new UuidField('id'),
  userId: getUserIdValidator('userId', true, { isArray: false }),
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(individualCommissionTypes)
  ]),
  appliedByStaffId: getUserIdValidator('appliedByStaffId', true, { isArray: false }),
  reason: new LiteralFieldValidator('reason', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Причина должна содержать не менее 10 символов'),
  ]),
  productCommissionPercent: new LiteralFieldValidator('productCommissionPercent', false, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
    new MaxNumberValidationRule(100),
  ]),
  programCommissionPercent: new LiteralFieldValidator('programCommissionPercent', false, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
    new MaxNumberValidationRule(100),
  ]),
  issuedAt: new LiteralFieldValidator('issuedAt', true, { isArray: false }, 'number', [
    new MinDateStampValidationRule(new Date('2025-01-01')),
  ]),
  validUntil: new LiteralFieldValidator('validUntil', true, { isArray: false }, 'number', [
    new MinDateStampValidationRule(new Date('2025-01-01')),
  ]),
}

const workstationVmap: ValidatorMap<WorkstationAttrs> = {
  id: new UuidField('id'),
  title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Название рабочего места должно содержать не менее 5 символов'),
  ]),
  description: new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Описание рабочего места должно содержать не менее 10 символов'),
  ]),
}

const workshopRoomVmap: ValidatorMap<WorkshopRoom> = {
  id: new UuidField('id'),
  title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Название комнаты должно содержать не менее 5 символов'),
  ]),
  description: new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Описание комнаты должно содержать не менее 10 символов'),
  ]),
  machineList: new LiteralFieldValidator('machineList', true, { isArray: true }, 'string', [
    new MinCharsCountValidationRule(3, 'Название машины должно содержать не менее 3 символов'),
  ]),
  workstations: new DtoFieldValidator('workstations', true, { isArray: true }, 'dto', workstationVmap)
}

const workshopMembershipVmap: ValidatorMap<WorkshopMembership> = {
  id: new UuidField('id'),
  userId: getUserIdValidator('userId', true, { isArray: false }),
  workshopId: new UuidField('workshopId'),
  role: new LiteralFieldValidator('role', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(3, 'Роль должна содержать не менее 3 символов'),
  ]),
  joinedAt: new LiteralFieldValidator('joinedAt', true, { isArray: false }, 'number', [
    new MinDateStampValidationRule(new Date('2025-01-01')),
  ]),
  leftAt: new LiteralFieldValidator('leftAt', false, { isArray: false }, 'number', [
    new MinDateStampValidationRule(new Date('2025-01-01')),
  ]),
  privileges: new LiteralFieldValidator('privileges', true, { isArray: true }, 'string', [
    new StringChoiceValidationRule(workshopPrivelegyTypes),
  ])
}

export const workshopVmap: ValidatorMap<WorkshopAttrs> = {
    id: new UuidField('id'),
    title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(5, 'Название мастерской должно содержать не менее 5 символов'),
    ]),
    description: new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
        new MinCharsCountValidationRule(10, 'Описание мастерской должно содержать не менее 10 символов'),
    ]),
    about: new DtoFieldValidator('about', true, { isArray: false }, 'dto', workshopAbout),
    subscriptionPlans: new DtoFieldValidator('subscriptionPlans', true, { isArray: true }, 'dto', subsriptionPlanVmap),
    commissionStrategy: new DtoFieldValidator('commissionStrategy', true, { isArray: false }, 'dto', commissionStrategyVmap),
    individualCommissions: new DtoFieldValidator('individualCommissions', true, { isArray: true }, 'dto', IndividualCommissionVmap),
    rooms: new DtoFieldValidator('rooms', true, { isArray: true }, 'dto', workshopRoomVmap),
    memberships: new DtoFieldValidator('memberships', true, { isArray: true }, 'dto', workshopMembershipVmap),
}

export const workshopValidator = new DtoFieldValidator(
  'workshop', true, { isArray: false }, 'dto', workshopVmap,
)
