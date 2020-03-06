import { format } from "date-fns";
import { Leave, LeaveReason, LeaveStatus } from "../@types/leave";
import { User } from "../@types/user";
import { db } from "../db";
import template from '../email-templates/new-leave-request.html';
import { userInfo, uuid, sendMail } from "../utils";
import { createEvent, updateEvent } from '../routes/calendar';
import config from '../../../config';


global.leaveList = leaveList;
function leaveList({ id, startTime, endTime, status }) {
  const leavesQuery = db.join<Leave, User>('leave', 'user', 'idRequester', 'requester').setType('inner');
  if (id) {
    leavesQuery.sWhere('id', id);
  }
  if (startTime) {
    leavesQuery.sWhere('startTime', startTime);
  }
  if (endTime) {
    leavesQuery.sWhere('endTime', endTime);
  }
  if (status) {
    leavesQuery.sWhere('status', status);
  }
  const leaves = leavesQuery.toJSON();
  console.log(leaves);
  return leaves;
}

global.leaveDetail = leaveDetail;
function leaveDetail({ id }) {
  return db.join<Leave, User>('leave', 'user', 'idRequester', 'requester').sWhere('id', id).toJSON(1)[0];
}
global.leaveDelete = leaveDelete;
function leaveDelete({ id, status, deletedReason }) {
  const user = userInfo();
  const ok = db.from<Leave>('leave').update(id, { status: status || LeaveStatus.Deleted, idApprover: user.id, deletedReason });
  const leaveWithUser = db.join<Leave, User>('leave', 'user', 'idRequester', 'user').sWhere('id', id).toJSON()[0];
  let requester = leaveWithUser.user;
  sendMail('delete', [requester.email], {
    approver: user.name,
    startTime: leaveWithUser.startTime,
    endTime: leaveWithUser.endTime,
    reason: LeaveReason[leaveWithUser.reason],
    id: leaveWithUser.id,
    description: deletedReason
  });
  updateEvent({
    calendarIdx: 0, eventId: leaveWithUser.eventId,
    summary: `[deleted] - ${requester.name} - ${LeaveReason[leaveWithUser.reason]}`,
    description: leaveWithUser.description,
    start: leaveWithUser.startTime,
    end: leaveWithUser.endTime
  });

  //sendMail(`Huỷ yêu cầu nghỉ ${id}`, requester.email, "Yêu cầu nghỉ của bạn đã bị huỷ rồi đấy");
  return ok;
}
global.leaveApprove = leaveApprove;
function leaveApprove({ id, status }) {
  const user = userInfo();
  const ok = db.from<Leave>('leave').update(id, { status: status || LeaveStatus.Approved, idApprover: user.id });
  const leaveWithUser = db.join<Leave, User>('leave', 'user', 'idRequester', 'user').sWhere('id', id).toJSON()[0];
  let requester = leaveWithUser.user;
  let action = (status === LeaveStatus.Approved) ? "approve" : "reject";

  //sendMail(`${action} yêu cầu nghỉ ${id}`, requester.email, `Yêu cầu nghỉ của bạn đã được ${action.toLowerCase()} rồi đấy`);

  sendMail(action, [requester.email], {
    approver: user.name,
    startTime: leaveWithUser.startTime,
    endTime: leaveWithUser.endTime,
    reason: LeaveReason[leaveWithUser.reason],
    id: leaveWithUser.id,
    description: leaveWithUser.description
  });

  // Update calendar
  if (leaveWithUser.eventId && leaveWithUser.eventId.length) {
    updateEvent({
      calendarIdx: 0, eventId: leaveWithUser.eventId,
      summary: `[${action}] - ${requester.name} - ${LeaveReason[leaveWithUser.reason]}`,
      description: leaveWithUser.description,
      start: leaveWithUser.startTime,
      end: leaveWithUser.endTime
    });
    /*Calendar.Events.update({
      summary: `[${action}] - ${requester.name} - ${LeaveReason[leaveWithUser.reason]}`,
      start: {
        dateTime: new Date(leaveWithUser.startTime)
      }
    }, config.calendarIds[0], leaveWithUser.eventId);*/
  }

  return ok;
}

global.leaveNew = leaveNew;
function leaveNew({ idRequester, startTime, endTime, reason, description, notifyList = [] }) {
  const leaveTable = db.from<Leave>('leave');
  const leavesQuery = leaveTable.query
  const [idRequesterCol, statusCol, startTimeCol, endTimeCol] = ['idRequester', 'status', 'startTime', 'endTime'].map(leavesQuery.getColId.bind(leavesQuery));
  leavesQuery.raw(
    `SELECT * WHERE ${idRequesterCol} ='${idRequester}' AND (${statusCol} ='${LeaveStatus.Approved}' OR ${statusCol} ='${LeaveStatus.Waiting}')
      ((${startTimeCol} >='${startTime}' AND ${startTimeCol} <='${endTime}') OR (${endTimeCol} >= '${startTime}' AND ${endTimeCol} <='${endTime}'))`
  )
  const leaves = leavesQuery.toJSON();
  if (leaves.length) throw 'Đã có yêu cầu nghỉ trong thời gian này';

  const requester = db.from<User>('user').query.where('id', idRequester).toJSON(1)[0];
  // create event in leave calendar
  let event = createEvent({
    calendarIdx: 0,
    summary: `[Pending] - ${requester.name} - ${LeaveReason[reason]}`,
    description: description,
    start: new Date(startTime).toISOString(),
    end: new Date(endTime).toISOString(),
    emails: notifyList
  });


  const leave: Leave = {
    id: uuid('lr-'),
    idRequester,
    startTime,
    endTime,
    reason,
    description,
    status: LeaveStatus.Waiting,
    eventId: event.id
  }
  const ok = leaveTable.insert(leave);
  if (!ok) return ok;

  // Send notificaton via mail
  if (notifyList.length) {
    sendMail('new', notifyList, {
      requester: requester.name,
      startTime: format(new Date(startTime), 'HH:mm dd/MM/yyyy'),
      endTime: format(new Date(endTime), 'HH:mm dd/MM/yyyy'),
      reason: LeaveReason[reason],
      description: description
    });
    /*
    console.log("Remaining email quota: " + MailApp.getRemainingDailyQuota());
    const htmlTemplate = HtmlService.createTemplate(template);
    htmlTemplate.requester = requester.name;
    htmlTemplate.startTime = format(new Date(startTime), 'HH:mm dd/MM/yyyy');
    htmlTemplate.endTime = format(new Date(endTime), 'HH:mm dd/MM/yyyy');
    htmlTemplate.reason = LeaveReason[reason];
    htmlTemplate.description = description;
    const htmlBody = htmlTemplate.evaluate().getContent();
    MailApp.sendEmail({
      to: notifyList.join(','),
      subject: `[hr][leave][new]${requester.name} đã gửi yêu cầu nghỉ`,
      htmlBody,
      noReply: true,
    })
    */
  }

  return leave;
}

global.leaveEdit = leaveEdit;
function leaveEdit({ id, startTime, endTime, reason, description, idRequester, idApprover }) {
  return db.from<Leave>('leave').update(id, { startTime, endTime, reason, description, idRequester, idApprover });
}
