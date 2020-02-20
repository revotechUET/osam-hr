import uniqid from 'uniqid';
import { Checking } from './@types/checking';
import { User } from './@types/user';
import { db } from './db';

export function isValid(object) {
  if (Array.isArray(object)) {
    return object[0] && isValid(object[0]);
  }
  return Object.keys(object).length > 1;
}

export function dateString(date: Date = new Date()) {
  if (!date) return null
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  return Utilities.formatDate(date, "GMT", "yyyy-MM-dd'T'00:00:00'Z'");
}

export function uuid(prefix?: string, suffix?: string) {
  return uniqid(prefix, suffix);
}


export function googleUser(email?: string) {
  email = email || Session.getActiveUser().getEmail();
  return AdminDirectory.Users.get(email);
}

export function userInfo(email?: string): User {
  email = email || Session.getActiveUser().getEmail();
  return db.from('user').query.where('email', email).toJSON()[0];
}


export function calculatePoint(checking: Checking, setting) {
  const checkin = new Date(checking.checkinTime);
  const checkout = new Date(checking.checkoutTime);
  const [y, m, d, dow] = [checkin.getFullYear(), checkin.getMonth(), checkin.getDate(), checkin.getDay()];
  const morningStart = new Date(setting.morningStart);
  morningStart.setFullYear(y, m, d);
  const morningEnd = new Date(setting.morningEnd);
  morningEnd.setFullYear(y, m, d);
  const afternoonStart = new Date(setting.afternoonStart);
  afternoonStart.setFullYear(y, m, d);
  const afternoonEnd = new Date(setting.afternoonEnd);
  afternoonEnd.setFullYear(y, m, d);
  let late: number, early: number, total: number;
  switch (setting.workDays[dow]) {
    case 0: // off
      break;
    case 1: // morning only
      late = Math.min(0, +checkin - +morningStart);
      early = Math.min(0, +morningEnd - +checkout);
      total = +morningEnd - +morningStart;
      break;
    case 2: // afternoon only
      late = Math.min(0, +checkin - +afternoonStart);
      early = Math.min(0, +afternoonEnd - +checkout);
      total = +afternoonEnd - +afternoonStart;
      break;
    case 3:
    default:
      late = Math.min(0, +checkin - +morningStart);
      early = Math.min(0, +afternoonEnd - +checkout);
      total = +afternoonEnd - +morningStart;
      break;
  }
  const point = (total - late - early) / total;
  return +point.toFixed(1);
}
