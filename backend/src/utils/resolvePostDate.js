export function resolvePostDate(eventDateOnly, weekLabel, dayLabel, totalWeeks) {
  const dayMap = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };

  const weekNum = parseInt((weekLabel || '').replace(/\D/g, ''), 10) || 1;
  const weekOffset = (typeof totalWeeks === 'number' && totalWeeks > 0)
    ? Math.max(0, totalWeeks - weekNum)
    : weekNum;

  const event = new Date(eventDateOnly);
  const baseDate = new Date(event);
  baseDate.setDate(baseDate.getDate() - weekOffset * 7);

  const baseDow = baseDate.getDay();
  const diffToMonday = baseDow === 0 ? -6 : 1 - baseDow;
  baseDate.setDate(baseDate.getDate() + diffToMonday);

  const dayOffset = dayMap[(dayLabel || 'monday').toLowerCase()] ?? 0;
  baseDate.setDate(baseDate.getDate() + dayOffset);

  return baseDate.toISOString().split('T')[0];
}
