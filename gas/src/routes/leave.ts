import { Leave, LeaveStatus } from "../@types/leave";
import { User } from "../@types/user";
import { db } from "../db";
import { uuid } from "../utils";

global.leaveList    = leaveList;
global.leaveApprove = leaveApprove;


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

function leaveApprove({ id, status }) {
  const user = { id: null };
  const ok = db.from<Leave>('leave').update(id, { status: status || LeaveStatus.Approved, idApprover: user.id });
  return ok;
}

global.leaveAdd = leaveAdd;
function leaveAdd({ idRequester, startTime, endTime, reason, description }) {
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
