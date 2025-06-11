export type AppUser = {
  id: string;
  name: string;
  support?: {
    isModerator?: boolean,
  }
}

export type JwtUser = {
  userId: string,
  support: {
    isModerator: boolean,
  }
}

export type TrackingMethod = 'BOT' | 'APP' | 'MANUAL' | 'BOTH';

export type ContributionDetails = {
  title: string;
  description: string;
  action: string;
  icon: string;
  condition: string;
  trackedBy: TrackingMethod;
  implemented: boolean;
}

export type ContributionKey =
  | 'REACTOR'
  | 'WRITER'
  | 'SPEAKER'
  | 'BUYER'
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
