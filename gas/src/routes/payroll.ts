import { areIntervalsOverlapping, eachDayOfInterval, endOfDay, isSameDay } from 'date-fns';
import { Leave, LeaveReason, LeaveStatus } from "../@types/leave";
import { db } from "../db";
import { getSetting } from './setting';

global.getPayroll = getPayroll;
function getPayroll(startDate, endDate, idDepartment = null) {
  if (!startDate || !endDate) throw 'Không có khoảng thời gian tính công';
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
    .where('status', LeaveStatus.Approved)
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
  const workDay = setting.workDays[date.getDay()];
  if (workDay === 0 || !checking && !leave) return { point, lunch, permittedLeave, unpermittedLeave };
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
  let totalLeave = 0;
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

  let late1 = 0, early1 = 0, total1 = 0, permittedLeave1 = 0, unpermittedLeave1 = 0, point1 = 0;
  let late2 = 0, early2 = 0, total2 = 0, permittedLeave2 = 0, unpermittedLeave2 = 0, point2 = 0;
  const ratio = setting.contractType === 'parttime' ? 1 : 0.5;
  if (workDay === 1 || workDay === 3) {
    total1 = +morningEnd - +morningStart;
    let leaveValid = false, checkingValid = false;
    if (leave && areIntervalsOverlapping({ start: leave.startTime, end: leave.endTime }, { start: morningStart, end: morningEnd })) {
      leaveValid = true;
    }
    if (checking && areIntervalsOverlapping({ start: checkin, end: checkout }, { start: morningStart, end: morningEnd })) {
      checkingValid = true;
      late1 = Math.max(0, +checkin - +morningStart);
      early1 = Math.max(0, +morningEnd - +checkout);
    }
    if (leaveValid) {
      if (leave.endTime >= checkin && leave.endTime <= checkout) {
        permittedLeave1 = Math.min(totalLeave, leave.endTime - + morningStart);
      } else {
        permittedLeave1 = Math.min(total1, Math.min(+leave.endTime, +morningEnd) - leave.startTime);
      }
    }
    if (checkingValid || leaveValid) {
      unpermittedLeave1 = Math.max(0, late1 + early1 - permittedLeave1);
    } else {
      unpermittedLeave1 = total1;
    }
    point1 = (total1 - unpermittedLeave1 - permittedLeave1) / total1 * ratio;
    permittedLeave1 = permittedLeave1 / total1 * ratio;
    unpermittedLeave1 = unpermittedLeave1 / total1 * ratio;
  }
  if (workDay === 2 || workDay === 3) {
    let leaveValid = false, checkingValid = false;
    total2 = +afternoonEnd - +afternoonStart;
    if (leave && areIntervalsOverlapping({ start: leave.startTime, end: leave.endTime }, { start: afternoonStart, end: afternoonEnd })) {
      leaveValid = true;
    }
    if (checking && areIntervalsOverlapping({ start: checkin, end: checkout }, { start: afternoonStart, end: afternoonEnd })) {
      checkingValid = true;
      late2 = Math.max(0, +checkin - +afternoonStart);
      early2 = Math.max(0, +afternoonEnd - +checkout);
    }
    if (leaveValid) {
      if (leave.endTime >= checkin && leave.endTime <= checkout) {
        permittedLeave2 = Math.min(totalLeave, leave.endTime - + afternoonStart);
      } else {
        permittedLeave2 = Math.min(total2, +afternoonEnd - leave.startTime);
      }
    }
    if (checkingValid || leaveValid) {
      unpermittedLeave2 = Math.max(0, late2 + early2 - permittedLeave2);
    } else {
      unpermittedLeave2 = total2;
    }
    point2 = (total2 - unpermittedLeave2 - permittedLeave2) / total2 * ratio;
    permittedLeave2 = permittedLeave2 / total2 * ratio;
    unpermittedLeave2 = unpermittedLeave2 / total2 * ratio;
  }
  if (workDay === 3 && setting.haveLunch) {
    const lunchStart = new Date(setting.lunchStart);
    lunchStart.setFullYear(y, m, d);
    const lunchEnd = new Date(setting.lunchEnd);
    lunchEnd.setFullYear(y, m, d);
    if (checkin < lunchStart && checkout > lunchEnd) lunch = 1;
    if (leave && leave.startTime <= lunchStart && leave.endTime >= lunchEnd) lunch = 0;
  }
  point = point1 + point2;
  permittedLeave = permittedLeave1 + permittedLeave2;
  unpermittedLeave = unpermittedLeave1 + unpermittedLeave2;
  return { point: +point.toFixed(2), lunch, permittedLeave: +permittedLeave.toFixed(2), unpermittedLeave: +unpermittedLeave.toFixed(2) };
}
