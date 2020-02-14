import { googleUser, uuid, isValid } from "../utils";
import { db } from "../db";
import { Leave, LeaveStatus } from "../@types/leave";

function leaveList({ id, startTime, endTime, status }) {
  const leavesQuery = db.from<Leave>('leave').query;
  if (id) {
    leavesQuery.where('id', id);
  }
  if (startTime) {
    leavesQuery.where('startTime', startTime);
  }
  if (endTime) {
    leavesQuery.where('endTime', endTime);
  }
  if (status) {
    leavesQuery.where('status', status);
  }
  return leavesQuery.getResultsJson();
}
global.leaveList = leaveList;

function leaveApprove({ id, status }) {
  const user = googleUser();
  const ok = db.from<Leave>('leave').update(id, 'status', status || LeaveStatus.Approved);
  if (ok) {
    db.from<Leave>('leave').update(id, 'idApprover', user.id);
  }
  return ok;
}
global.leaveApprove = leaveApprove;
