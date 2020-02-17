import { Leave, LeaveStatus } from "../@types/leave";
import { User } from "../@types/user";
import { db } from "../db";
import { googleUser } from "../utils";

global.leaveList    = leaveList;
global.leaveApprove = leaveApprove;
global.leaveNew     = leaveNew; 


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
  return leavesQuery.toJSON();
}

function leaveApprove({ id, status }) {
  const user = googleUser();
  const ok = db.from<Leave>('leave').update(id, 'status', status || LeaveStatus.Approved);
  if (ok) {
    db.from<Leave>('leave').update(id, 'idApprover', user.id);
  }
  return ok;
}

function leaveNew(data){
  db.from<Leave>('leave').insert(data);
}
