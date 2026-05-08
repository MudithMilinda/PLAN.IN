import { CalendarDay, CalendarEvent } from '@/types/calendar';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CALENDARS = [
  { id: 'my-calendar', name: 'My calendar', color: 'bg-yellow-500', icon: '📅' },
  { id: 'work', name: 'Work', color: 'bg-teal-500', icon: '💼' },
  { id: 'fun', name: 'Fun', color: 'bg-green-500', icon: '⭐' },
  { id: 'family', name: 'Family', color: 'bg-purple-500', icon: '🐕' },
  { id: 'important', name: 'Important', color: 'bg-red-500', icon: '🎈' },
  { id: 'selected', name: 'Selected events', color: 'bg-gray-400', icon: '📋' },
];

export function isToday(date: Date) {
  const t = new Date();
  return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
}

export function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

export function toNoon(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
}

export function getDaysInMonth(date: Date): CalendarDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDow = firstDay.getDay() - 1;
  if (startDow === -1) startDow = 6;

  const days: CalendarDay[] = [];
  for (let i = 0; i < startDow; i++) {
    days.push({
      date: new Date(year, month, -startDow + i + 1).getDate(),
      isCurrentMonth: false,
      fullDate: new Date(year, month, -startDow + i + 1),
    });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: i, isCurrentMonth: true, fullDate: new Date(year, month, i) });
  }

  for (let i = 1; days.length < 42; i++) {
    days.push({ date: i, isCurrentMonth: false, fullDate: new Date(year, month + 1, i) });
  }

  return days;
}

export function getOverlapEvent(newEvent: { startTime: string; endTime: string; allDay: boolean }, selectedDate: Date | null, events: CalendarEvent[]) {
  if (!selectedDate || !newEvent.startTime || newEvent.allDay) return null;

  const dayEvs = events.filter((e) => sameDay(new Date(e.date), selectedDate) && !e.allDay);
  const [sh, sm] = newEvent.startTime.split(':').map(Number);
  const [eh, em] = newEvent.endTime.split(':').map(Number);
  const ns = sh * 60 + sm;
  const ne = eh * 60 + em;

  for (const ev of dayEvs) {
    const [esh, esm] = ev.startTime.split(':').map(Number);
    const [eeh, eem] = ev.endTime.split(':').map(Number);
    const es = esh * 60 + esm;
    const ee = eeh * 60 + eem;
    if ((ns >= es && ns < ee) || (ne > es && ne <= ee) || (ns <= es && ne >= ee)) return ev;
  }

  return null;
}
