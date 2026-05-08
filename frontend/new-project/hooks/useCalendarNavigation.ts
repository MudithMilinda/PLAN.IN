import { useState } from 'react';
import { toNoon } from '@/utils/calendarHelpers';

export function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const prevMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1));
  const goToday = () => setCurrentDate(new Date());

  const selectDate = (date: Date) => setSelectedDate(toNoon(date));

  return { currentDate, selectedDate, setCurrentDate, setSelectedDate, prevMonth, nextMonth, goToday, selectDate };
}
