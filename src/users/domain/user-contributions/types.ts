export type TrackingMethod = 'BOT' | 'APP' | 'MANUAL' | 'BOTH';

export type UserContributionDetails = {
  title: string;
  description: string;
  action: string;
  icon: string;
  condition: string;
  trackedBy: TrackingMethod[];
  orderNumber: number;
  implemented: boolean;
}

export type UserContributionKey =
  | 'NEWBIE'
  | 'REACTOR'
  | 'WRITER'
  | 'SPEAKER'
  | 'BUYER'
  | 'HOBBIST'
  | 'PROPOSER'
  | 'EXECUTOR'
  | 'MAKER'
  | 'SELLER'
  | 'DESIGNER'
  | 'TRAINER'
  | 'AUTHOR'
  | 'KEEPER'
  | 'MODERATOR'
  | 'ORGANIZER'
  | 'INVESTOR'
  | 'AMBASSADOR'
  | 'REVIEWER'
  | 'CRAFTSMAN'
  | 'FOUNDER';

export type UserContributionCounter = {
  count: number;
  firstAt: number;
  lastAt: number;
};

export type UserContributions = {[key in UserContributionKey]?: UserContributionCounter};
