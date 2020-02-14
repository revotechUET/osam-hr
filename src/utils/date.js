import DateFormat from 'date-format';

export function dateFormat(date, format = 'dd/MM/yyyy') {
  if (!date) return null;
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  return DateFormat(format, date)
}

export function getFirstDayOfMonth() {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return now;
}
export default class Utils {
}
