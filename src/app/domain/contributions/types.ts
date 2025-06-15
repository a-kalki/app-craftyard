export type TrackingMethod = 'BOT' | 'APP' | 'MANUAL' | 'BOTH';

export type ContributionDetails = {
  title: string;
  description: string;
  action: string;
  icon: string;
  condition: string;
  trackedBy: TrackingMethod[];
  orderNumber: number;
  implemented: boolean;
}

export type ContributionKey =
  | 'NEWBIE'
  | 'REACTOR'
  | 'WRITER'
  | 'SPEAKER'
  | 'BUYER'
  | 'HOBBIST'
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
  | 'WORKSHOP_CREATOR';

export type ContributionCounter = {
  count: number;
  firstAt: number;
  lastAt: number;
};

export type Contributions = {[key in ContributionKey]?: ContributionCounter};
