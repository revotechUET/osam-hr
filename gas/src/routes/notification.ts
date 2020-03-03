import { Department } from '../@types/department';
import { User } from '../@types/user';
import { User_Department } from '../@types/user_department';

import { Notification } from '../@types/notification';

import { uuid } from '../utils';

import { db } from '../db';

global.getNotifications = getNotifications;
global.addNotification = addNotification;
global.updateNotification = updateNotification;
global.deleteNotification = deleteNotification;
global.sendNotification = sendNotification;

global._getAllUsers = _getAllUsers;
global._getUsersFromIds = _getUsersFromIds;
global._getUsersFromDepts = _getUsersFromDepts;


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
function _getAllUsers() {
  let users = db.from<User>('user').getDataJSON();
  Logger.log('getAll:' + JSON.stringify(users));
  return users;
}
function _getUsersFromDepts(selected) {
  let joint = db.join<User_Department, User>('user_department', 'user', 'idUser', 'user').setType('inner');
  let results = joint.toJSON();
  results = results.filter(r => selected.includes(r.idDepartment)).map(r => r.user);

  Logger.log(JSON.stringify(selected));
  Logger.log(JSON.stringify(results));
  return results;
}
function _getUsersFromIds(selected) {
  let usrs = _getAllUsers();
  Logger.log(JSON.stringify(selected));
  let result = usrs.filter(u => selected.includes(u.id));
  Logger.log(JSON.stringify(result));
  return result;
}

function doSendNotification(notification) {
  let {title, content, receipient} = notification;
  receipient = JSON.parse(receipient);
  let {type, selected} = receipient;
  let users;
  if (type === 'all') {
    users = _getAllUsers();
  }
  else if (type === 'department') {
    users = _getUsersFromDepts(selected)
  }
  else if (type === 'staff') {
    users = _getUsersFromIds(selected)
  }

  MailApp.sendEmail({
    to: users.map(u => u.email).join(','),
    subject: notification.title,
    htmlBody: notification.content,
    noReply: true,
  });
  notification.status = 'sent';
  return updateNotification(notification);
}
function sendNotification({ sendTime, ...notification }) {
  if (sendTime) {
    Logger.log("create trigger");
  }
  else {
    return doSendNotification(notification);
  }
  return "Ok";
}
