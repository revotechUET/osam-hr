import { googleUser, uuid, isValid } from "../utils";
import { db } from "../db";
import { Leave, LeaveStatus } from "../@types/leave";

function approveLeaveRequest({id, status}) {
  const user = googleUser();
  const ok = db.from<Leave>('leave').update(id, 'status', status || LeaveStatus.Approved);
  if (ok) {
    db.from<Leave>('leave').update(id, 'idApprover', user.id);
  }
  return ok;
}
