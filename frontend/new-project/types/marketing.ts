//all TypeScript interfaces

//  LOCATION 
export interface LocationData {
  city: string;
  venue?: string;
  country?: string;
}

//  FORM TYPES 
export interface FormData {
  eventName: string;
  eventTheme: string;
  targetAudience: string;
  duration: string;
  location: LocationData;
  eventDate: string; // datetime-local raw value; converted to ISO on submit
  additionalInfo: string;
}

// Required field keys for validation (flat — matches input name= attributes)
export type ErrorState = {
  eventName: boolean;
  eventTheme: boolean;
  targetAudience: boolean;
  duration: boolean;
  locationCity: boolean;
  eventDate: boolean;
};

export type TouchedState = ErrorState;

//  MARKETING PLAN TYPES 
export interface WeeklyPost {
  day: string;
  type: string;
  platform: string;
  contentDescription: string;
  caption: string;
  hashtags: string;
}

export interface WeeklyContent {
  week: string;
  theme: string;
  posts: WeeklyPost[];
}

export interface MarketingPlan {
  summary: string;
  channels: {
    name: string;
    priority: string;
    strategy: string;
    contentTypes: string[];
  }[];
  timeline: {
    phase: string;
    duration: string;
    focus: string;
    tasks: string[];
  }[];
  budgetAllocation: {
    category: string;
    percentage: number;
    description: string;
  }[];
  contentIdeas: { type: string; idea: string; platform: string }[];
  keyMessages: string[];
  successMetrics: string[];
  quickWins: string[];
  weeklyContentCalendar?: WeeklyContent[];
}

export interface ApiResult {
  marketingPlan: MarketingPlan;
  event: EventData;
}

export interface EventData {
  eventName: string;
  eventDate: string;
  location: LocationData | string;
  eventTheme?: string;
  duration?: string;
}
