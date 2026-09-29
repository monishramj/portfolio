const DAY = 86400000;

export function buildCalendar(data, now = new Date()) {
  if (!Array.isArray(data?.contributions)) throw new Error('Missing contribution data');
  const end = now.toISOString().slice(0, 10);
  const start = new Date(Date.parse(end) - 364 * DAY).toISOString().slice(0, 10);
  const days = data.contributions.filter(day =>
    day && /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
    Number.isFinite(Date.parse(day.date)) &&
    Number.isInteger(day.count) && day.count >= 0 &&
    Number.isInteger(day.level) && day.level >= 0 && day.level <= 4 &&
    day.date >= start && day.date <= end
  ).sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) throw new Error('No recent contribution data');
  const cells = [...Array(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).fill(null), ...days];
  const months = [];
  let previousMonth;
  for (let i = 0; i < cells.length; i += 7) {
    const day = cells.slice(i, i + 7).find(Boolean);
    const month = day?.date.slice(0, 7);
    if (month && month !== previousMonth) {
      if (months.length && i / 7 - months.at(-1).week < 3) months.pop();
      months.push({ week: i / 7, label: new Date(`${day.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) });
      previousMonth = month;
    }
  }
  return { cells, months, total: days.reduce((sum, day) => sum + day.count, 0) };
}
