import { Department } from '../@types/department';
import { User } from '../@types/user';
import { Notification } from '../@types/notification';

import { uuid } from '../utils';

import { db } from '../db';

global.getNotifications = getNotifications;
global.addNotification = addNotification;
global.updateNotification = updateNotification;
global.deleteNotification = deleteNotification;

function getNotifications() {
  return db.from<Notification>('notification').query.toJSON();
}
function addNotification({title, content, type, receipient}) {
  let id = uuid();
  return db.from<Notification>('notification').insert({
    id, title, content, type, 
    date: new Date().toISOString(),
    receipient, status:'draft'
  });
}
function updateNotification(notification: Notification) {
  const ok = db.from<Notification>('notification').update(notification.id, notification);
  return ok;
}
function deleteNotification({id}) {
  return db.from<Notification>('notification').delete(id);
}
