import uniqid from 'uniqid';
import { Checking } from './@types/checking';
import { User } from './@types/user';
import { db } from './db';

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
  let user = db.from('user').query.where('email', email).toJSON(1)[0];
  return user;
}

export function removeAccent(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
