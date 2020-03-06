import uniqid from 'uniqid';
import { Checking } from './@types/checking';
import { User } from './@types/user';
import { db } from './db';

import newTemplate from './email-templates/new-leave-request.html';
import approveTmpl from './email-templates/approve-leave-request.html';
import rejectTmpl from './email-templates/reject-leave-request.html';
import deleteTmpl from './email-templates/delete-leave-request.html';
import responseTmpl from './email-templates/response-checking-request.html';
import notificationTmpl from './email-templates/notification.html';

const templates = {
  new: newTemplate, approve: approveTmpl,
  delete: deleteTmpl, reject: rejectTmpl,
  response: responseTmpl, notification: notificationTmpl
}

const subjectTemplates = {
  new: '[hr][leave-new] <?= requester ?> gửi yêu cầu nghỉ',
  approve: '[hr][leave-approved] <?= approver ?> chấp nhận yêu cầu nghỉ',
  delete: '[hr][leave-deleted] <?= approver ?> huỷ yêu cầu nghỉ',
  reject: '[hr][leave-rejected] <?= approver ?> từ chối yêu cầu nghỉ',
  response: '[hr][checking-response] <?= approver ?> gửi phản hồi',
  notification: '[hr][notification] <?= title ?>'
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
  let user = db.from('user').query.where('email', email).toJSON(1)[0];
  return user;
}

export function removeAccent(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/*
export function sendMail(subject, email, body) {
  MailApp.sendEmail({
    to: email,
    subject: `[hr][notice][leave]${subject}`,
    htmlBody: body,
    noReply: true,
  });
}*/

export function sendMail(templateKey, emailAddresses, params) {
  let template = templates[templateKey];
  let sTemplate = subjectTemplates[templateKey];

  const bodyTemplate = HtmlService.createTemplate(template);
  const subjectTemplate = HtmlService.createTemplate(sTemplate);

  Object.assign(bodyTemplate, params);
  Object.assign(subjectTemplate, params);

/*
  htmlTemplate.requester = params.requester;
  htmlTemplate.startTime = params.startTime;
  htmlTemplate.endTime = params.endTime;
  htmlTemplate.reason = params.reason;
  htmlTemplate.description = params.description;
*/
  const htmlBody = bodyTemplate.evaluate().getContent();
  const subject = subjectTemplate.evaluate().getContent();
  MailApp.sendEmail({
    to: emailAddresses.join(','),
    subject, htmlBody,
    noReply: true,
  })
}
