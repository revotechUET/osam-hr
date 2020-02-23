import { Leave, LeaveStatus } from "../@types/leave";
import { User } from "../@types/user";
import { db } from "../db";
import { uuid } from "../utils";

global.leaveList = leaveList;
function leaveList({ id, startTime, endTime, status }) {
  const leavesQuery = db.join<Leave, User>('leave', 'user', 'idRequester', 'requester');
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

global.leaveApprove = leaveApprove;
function leaveApprove({ id, status }) {
  const user = { id: null };
  const ok = db.from<Leave>('leave').update(id, { status: status || LeaveStatus.Approved, idApprover: user.id });
  return ok;
}

global.leaveNew = leaveNew;
function leaveNew({ idRequester, startTime, endTime, reason, description }) {
  const leavesQuery = db.from<Leave>('leave').query;
  leavesQuery.raw(
    `SELECT * WHERE ${leavesQuery.getColId('idRequester')} ='${idRequester}' AND
     ((B >='${startTime}' AND B <='${endTime}') OR (C >= '${startTime}' AND C <='${endTime}'))`
  )
  const leaves = leavesQuery.toJSON();
  if (leaves.length) throw 'Đã có yêu cầu nghỉ trong thời gian này';
  const leave: Leave = {
    id: uuid('lr-'),
    idRequester,
    startTime,
    endTime,
    reason,
    description,
    status: LeaveStatus.Waiting,
  }
  db.from<Leave>('leave').insert(leave);
  return leave;
}

global.leaveEdit = leaveEdit;
function leaveEdit({ id, startTime, endTime, reason, description, idRequester, idApprover }) {
  return db.from<Leave>('leave').update(id, { startTime, endTime, reason, description, idRequester, idApprover });
}
