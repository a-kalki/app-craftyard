import { DtoFieldValidator, IsTimeStampValidationRule, LiteralFieldValidator, MinCharsCountValidationRule, PositiveNumberValidationRule, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator"
import type { UserContributionCounter, UserContributionDetails, UserContributionKey, UserContributions } from "./types"
import { TRACKING_METHODS } from "./constants"
import type { UserStatistics } from "../user/struct/attrs"

export const userContribuitionDetailsVmap: ValidatorMap<UserContributionDetails> = {
  description: new LiteralFieldValidator('description', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(20, 'Описание должно содержать не менее 20 символов'),
  ]),
  title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(3, 'Заголовок должен содержать не менее 3 символов'),
  ]),
  action: new LiteralFieldValidator('action', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(20, 'Описание действия должно содержать не менее 20 символов'),
  ]),
  icon: new LiteralFieldValidator('icon', true, { isArray: false }, 'string', []),
  condition: new LiteralFieldValidator('condition', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(20, 'Условие должно содержать не менее 20 символов'),
  ]),
  orderNumber: new LiteralFieldValidator('orderNumber', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  trackedBy: new LiteralFieldValidator('trackedBy', true, { isArray: true, mustBeFilled: true }, 'string', [
    new StringChoiceValidationRule(TRACKING_METHODS)
  ]),
  implemented: new LiteralFieldValidator('implemented', true, { isArray: false }, 'boolean', []),
}

const contribuitionCounterVmap: ValidatorMap<UserContributionCounter> = {
    count: new LiteralFieldValidator('count', true, { isArray: false }, 'number', [
      new PositiveNumberValidationRule(),
    ]),
    firstAt: new LiteralFieldValidator('firstAt', true, {isArray: false}, 'number', [
      new IsTimeStampValidationRule(),
    ]),
    lastAt: new LiteralFieldValidator('lastAt', true, {isArray: false}, 'number', [
      new IsTimeStampValidationRule(),
    ]),
}

const getContributionDetailsVMap = <K extends UserContributionKey>(c: K): DtoFieldValidator<K, false, false, UserContributionCounter> => {
  return new DtoFieldValidator(c, false, { isArray: false }, 'dto', contribuitionCounterVmap)
}

export const userContribuitionsVmap: ValidatorMap<UserContributions> = {
    NEWBIE: getContributionDetailsVMap('NEWBIE'),
    REACTOR: getContributionDetailsVMap('REACTOR'),
    WRITER: getContributionDetailsVMap('WRITER'),
    SPEAKER: getContributionDetailsVMap('SPEAKER'),
    BUYER: getContributionDetailsVMap('BUYER'),
    HOBBIST: getContributionDetailsVMap('HOBBIST'),
    PROPOSER: getContributionDetailsVMap('PROPOSER'),
    EXECUTOR: getContributionDetailsVMap('EXECUTOR'),
    MAKER: getContributionDetailsVMap('MAKER'),
    SELLER: getContributionDetailsVMap('SELLER'),
    DESIGNER: getContributionDetailsVMap('DESIGNER'),
    TRAINER: getContributionDetailsVMap('TRAINER'),
    AUTHOR: getContributionDetailsVMap('AUTHOR'),
    KEEPER: getContributionDetailsVMap('KEEPER'),
    MODERATOR: getContributionDetailsVMap('MODERATOR'),
    ORGANIZER: getContributionDetailsVMap('ORGANIZER'),
    INVESTOR: getContributionDetailsVMap('INVESTOR'),
    AMBASSADOR: getContributionDetailsVMap('AMBASSADOR'),
    REVIEWER: getContributionDetailsVMap('REVIEWER'),
    CRAFTSMAN: getContributionDetailsVMap('CRAFTSMAN'),
    FOUNDER: getContributionDetailsVMap('FOUNDER')
}


export const userStatisticsVMap: ValidatorMap<UserStatistics> = {
    contributions: new DtoFieldValidator(
      'contributions', true, { isArray: false }, 'dto', userContribuitionsVmap
    )
}
