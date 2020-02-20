import uniqid from 'uniqid';
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
  return db.from('user').query.where('email', email).toJSON(1)[0];
}
