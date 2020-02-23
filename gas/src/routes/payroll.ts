import { areIntervalsOverlapping, eachDayOfInterval, endOfDay, endOfMonth, isSameDay, startOfMonth } from 'date-fns';
import { Leave } from "../@types/leave";
import { db } from "../db";
import { getSetting } from './setting';

global.getPayroll = getPayroll;
function getPayroll(startDate, endDate, idDepartment = null) {
  if (!startDate || !endDate) throw 'Không có khoảng thời gian tính công';
  // if (!startDate) startDate = startOfMonth(new Date()).toISOString();
  // if (!endDate) endDate = new Date().toISOString();
  endDate = endOfDay(new Date(endDate)).toISOString();
  let checkingQuery;
  if (idDepartment) {
    checkingQuery = db.join('checking', 'user_department', 'idUser', 'user_department').setType("inner").sWhere('checkoutTime', null, null, 'is not null').dWhere('idDepartment', idDepartment);
    checkingQuery.sWhere('date', '>=', startDate);
    checkingQuery.sWhere('date', '<=', endDate);
  } else {
    checkingQuery = db.from('checking').query.where('checkoutTime', null, null, 'is not null');
    checkingQuery.where('date', '>=', startDate);
    checkingQuery.where('date', '<=', endDate);
  }
  const checkings = checkingQuery.toJSON().map(c => ({ ...c, date: new Date(c.date), checkinTime: new Date(c.checkinTime), checkoutTime: new Date(c.checkoutTime) }));
  if (!checkings.length) return [];
  const setting = getSetting();
  const users = db.from('user').query.where('active', true).toJSON();
  const leaves = db.from<Leave>('leave').query.where('status', 'approved')
    .where('startTime', '>=', startDate)
    .where('endTime', '>=', endDate)
    .toJSON()
    .map(l => ({ idRequester: l.idRequester, startTime: new Date(l.startTime), endTime: new Date(l.endTime) }));
  for (const user of users) {
    const userCheckings = checkings.filter(c => c.idUser === user.id);
    const userLeaves = leaves.filter(l => l.idRequester === user.id);
    const { points, lunches, permittedLeaves, unpermittedLeaves } = getSummaries({ checkings: userCheckings, leaves: userLeaves, setting, startDate, endDate });
    user.points = points;
    user.lunches = lunches;
    user.permittedLeaves = permittedLeaves;
    user.unpermittedLeaves = unpermittedLeaves;
  }
  return users;
}

function getSummaries({ startDate, endDate, checkings, leaves, setting }) {
  const dates = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).map(d => ({ start: d, end: endOfDay(d) }));
  let points = 0, lunches = 0, permittedLeaves = 0, unpermittedLeaves = 0;
  for (const date of dates) {
    const checking = checkings.find(c => isSameDay(c.date, date.start));
    const leave = leaves.find(l => areIntervalsOverlapping({ start: l.startTime, end: l.endTime }, date));
    if (!checking && !leave) continue;
    const { point, lunch, permittedLeave, unpermittedLeave } = getDateSummaries(date.start, checking, leave, setting);
    points += point;
    lunches += lunch;
    permittedLeaves = permittedLeave;
    unpermittedLeaves = unpermittedLeave;
  }
  return { points, lunches, permittedLeaves, unpermittedLeaves };
}

function getDateSummaries(date: Date, checking, leave, setting) {
  let point = 0, lunch = 0, permittedLeave = 0, unpermittedLeave = 0;
  const defaultReturn = { point, lunch, permittedLeave, unpermittedLeave };
  if (!checking && !leave) return defaultReturn;
  const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()];
  const [
    morningStart,
    morningEnd,
    afternoonStart,
    afternoonEnd
  ] = [
    setting.morningStart,
    setting.morningEnd,
    setting.afternoonStart,
    setting.afternoonEnd,
  ].map(v => {
    const ret = new Date(v);
    ret.setFullYear(y, m, d);
    return ret;
  });
  let late = 0, early = 0, total = 0, totalLeave = 0;
  if (leave) {
    leave = {
      startTime: new Date(leave.startTime),
      endTime: new Date(leave.endTime),
    }
    totalLeave = leave.endTime - leave.startTime;
  }
  let checkin: Date, checkout: Date;
  if (checking) {
    checkin = new Date(checking.checkinTime);
    checkin.setFullYear(y, m, d);
    checkout = new Date(checking.checkoutTime);
    checkout.setFullYear(y, m, d);
  }
  const dayOfWeek = date.getDay();
  switch (setting.workDays[dayOfWeek]) {
    case 0: // off
      return defaultReturn;
    case 1: // morning only
      total = +morningEnd - +morningStart;
      if (!checking) break;
      late = Math.max(0, +checkin - +morningStart);
      early = Math.max(0, +morningEnd - +checkout);
      if (leave) {
        if (leave.endTime >= checkin && leave.endTime <= checkout) {
          permittedLeave = Math.min(totalLeave, leave.endTime - + morningStart);
        } else {
          permittedLeave = Math.min(total, +morningEnd - leave.startTime);
        }
      }
      break;
    case 2: // afternoon only
      total = +afternoonEnd - +afternoonStart;
      if (!checking) break;
      late = Math.max(0, +checkin - +afternoonStart);
      early = Math.max(0, +afternoonEnd - +checkout);
      if (leave) {
        if (leave.endTime >= checkin && leave.endTime <= checkout) {
          permittedLeave = Math.min(totalLeave, leave.endTime - + afternoonStart);
        } else {
          permittedLeave = Math.min(total, +afternoonEnd - leave.startTime);
        }
      }
      break;
    case 3: // all-day
      total = (+afternoonEnd - +afternoonStart) + (+morningEnd - +morningStart);
      if (!checking) break;
      if (checkin < afternoonStart) {
        late = Math.max(0, Math.min(+checkin, +morningEnd) - +morningStart);
      } else {
        late = (+checkin - +afternoonStart) + (+morningEnd - +morningStart);
      }
      if (checkout > morningEnd) {
        early = Math.max(0, +afternoonEnd - Math.max(+checkout, + afternoonStart));
      } else {
        early = (+checkout - +morningEnd) + (+afternoonEnd - +afternoonStart);
      }
      if (leave) {
        if (leave.endTime >= checkin && leave.endTime <= checkout) {
          permittedLeave = Math.min(totalLeave, leave.endTime - + morningStart);
        } else {
          permittedLeave = Math.min(total, Math.min(+leave.endTime, +afternoonEnd) - leave.startTime);
        }
      }
      const lunchStart = new Date(setting.lunchStart);
      lunchStart.setFullYear(y, m, d);
      const lunchEnd = new Date(setting.lunchEnd);
      lunchEnd.setFullYear(y, m, d);
      if (checkin < lunchStart && checkout > lunchEnd) lunch = 1;
      if (leave && leave.startTime <= lunchStart && leave.endTime >= lunchEnd) lunch = 0;
      break;
  }
  if (!checking) {
    permittedLeave = total;
  }
  unpermittedLeave = Math.max(0, late + early - permittedLeave);
  point = (total - unpermittedLeave - permittedLeave) / total;
  permittedLeave = permittedLeave / total;
  unpermittedLeave = unpermittedLeave / total;
  return { point: +point.toFixed(1), lunch, permittedLeave: +permittedLeave.toFixed(1), unpermittedLeave: +unpermittedLeave.toFixed(1) };
}
