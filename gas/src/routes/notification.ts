import { Department } from '../@types/department';
import { User } from '../@types/user';
import { User_Department } from '../@types/user_department';

import { Notification } from '../@types/notification';

import { uuid } from '../utils';

import { db } from '../db';

import { getTrigger, handleTriggered, setupTriggerArguments } from '../triggers';
global.getNotifications = getNotifications;
global.addNotification = addNotification;
global.updateNotification = updateNotification;
global.deleteNotification = deleteNotification;
global.sendEmailNotif = sendEmailNotif;
global.scheduleNotification = scheduleNotification;
global.getMyNotifications = getMyNotifications;
global.getMyNotificationBody = getMyNotificationBody;

global.checkMail = checkMail;

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
    receipient, status:'draft', sendDate: ''
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
    subject: `[hr][notice]${notification.title}`,
    htmlBody: notification.content,
    noReply: true,
  });
  notification.status = 'sent';
  notification.sendDate = new Date().toISOString();
  return updateNotification(notification);
}
function scheduleNotification(evt) {
  var notification = handleTriggered(evt.triggerUid);
  doSendNotification(notification);
}
function sendEmailNotif({ id, sendTime }) {
  //return {notification, sendTime};
  let notification = db.from<Notification>('notification').query.where('id', id).toJSON();
  if (!notification) return "error";
  if (!isNaN(Date.parse(sendTime))) {
    Logger.log("create trigger");
    let trigger = getTrigger('scheduleNotification', new Date(sendTime));
    setupTriggerArguments(trigger, [notification], false);
  }
  else {
    return doSendNotification(notification);
  }
  return "Ok";
}

function checkMail() {
  const messageCount = 20;
  const scriptCache = CacheService.getScriptCache();
  let inboxThreads = GmailApp.getInboxThreads(0, messageCount);
  let messages = [];
  for (let i = 0; i < inboxThreads.length; i++) {
    let msg = inboxThreads[i].getMessages()[0];
    let subject = msg.getSubject();
    //if (subject.substr(0, '[hr]'.length) === '[hr]') {
      messages.push({
        messageId: msg.getId(),
        subject: subject,
        date: msg.getDate(),
        unread: msg.isUnread()
      });
    //}
  }
  let messagesStr = JSON.stringify(messages);
  Logger.log("Check mails: " + messagesStr);
  scriptCache.put('MAILS', messagesStr);
  return "Ok";
}

function getMyNotifications({messageCount = 10}) {
  const scriptCache = CacheService.getScriptCache();
  const mails = scriptCache.get('MAILS');
  if (mails) return JSON.parse(mails);
  else return [];
}

function getMyNotificationBody({messageId}) {
  let message = GmailApp.getMessageById(messageId);
  return message.getBody();
}
