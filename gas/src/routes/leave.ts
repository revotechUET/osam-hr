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
  return db.join<Leave, User>('leave', 'user', 'idRequester', 'requester').sWhere('id', id).toJSON()[0];
}

global.leaveApprove = leaveApprove;
function leaveApprove({ id, status }) {
  const user = { id: null };
  const ok = db.from<Leave>('leave').update(id, { status: status || LeaveStatus.Approved, idApprover: user.id });
  return ok;
}

global.leaveNew = leaveNew;
function leaveNew({ idRequester, startTime, endTime, reason, description }) {
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
