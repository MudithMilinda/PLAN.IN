export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  allDay: boolean;
  calendar: string;
  participants: string;
  location: string;
  description: string;
  category: string;
  googleEventId?: string;
  isContentPost?: boolean;
  rawPostId?: string;
  platform?: string;
  postType?: string;
  caption?: string;
  hashtags?: string;
  weekLabel?: string;
  weekTheme?: string;
}

export interface BackendEvent {
  id: string;
  event_name: string;
  event_date: string;
  location: string;
  event_theme: string;
  google_event_id?: string;
}

export interface BackendContentPost {
  id: string;
  post_date: string;
  week_label: string;
  week_theme: string;
  platform: string;
  post_type: string;
  content_description: string;
  caption: string;
  hashtags: string;
  google_event_id?: string;
  event_name?: string | null;
}

export interface NewEventData {
  title: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  calendar: string;
  participants: string;
  location: string;
  description: string;
  category: string;
}

export interface ContentPostEdit {
  id: string;
  platform: string;
  postType: string;
  caption: string;
  hashtags: string;
  contentDescription: string;
  postDate: string;
  weekLabel: string;
  weekTheme: string;
}

export interface SyncMessage {
  type: "success" | "error";
  text: string;
}

export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

export interface CalendarDef {
  id: string;
  name: string;
  color: string;
  icon: string;
}
