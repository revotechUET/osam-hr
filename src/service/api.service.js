import { useEffect, useRef } from "react";

function gscriptrun(fnName, ...args) {
  if (args.length === 1 && args[0] === undefined) args.length = 0;
  visitObject(args, (obj, key) => {
    if (obj[key] instanceof Date) {
      obj[key] = obj[key].toISOString();
    }
  })
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)[fnName](...args);
  })
}

function visitObject(object, fn) {
  if (typeof object !== 'object') return;
  for (const key in object) {
    const ret = fn(object, key);
    if (ret) return;
    visitObject(object[key], fn);
  }
}

function makeCancelable(promise) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val => (isCanceled ? reject({ isCanceled }) : resolve(val)))
      .catch(error => (isCanceled ? reject({ isCanceled }) : reject(error)));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

function useCancellable() {
  const promises = useRef([]);
  useEffect(() => {
    return () => {
      promises.current.forEach(p => p.cancel());
      promises.current = [];
    };
  }, []);
  function cancellablePromise(p) {
    const cPromise = makeCancelable(p);
    promises.current.push(cPromise);
    return cPromise.promise;
  }
  return cancellablePromise;
}

class ApiService {
  constructor() {
    // hooks
    this.useCancellable = useCancellable;
    this.gscriptrun = gscriptrun;
  }

  getCalendarEvents(from, to) {
    return gscriptrun('getCalendarEvents', from, to);
  }

  updateUserById(id, info) {
    return gscriptrun('updateUserById', id, info);
  }

  deleteUserById(id) {
    return gscriptrun('deleteUserById', id);
  }

  getUserById(id, option) {
    return gscriptrun('loadUserById', id, option)
  }

  getContracts() {
    return gscriptrun('getContracts');
  }

  insertContract(contract) {
    return gscriptrun('insertContract', contract);
  }
  updateContract(contract){
    return gscriptrun('updateContract', contract);
  }
  //#region user
  listUsers(payload) {
    return gscriptrun('listUsers', payload);
  }

  listEmails(maxResult) {
    return gscriptrun('listUsersDomain', maxResult);
  }

  getUserInfo() {
    return gscriptrun('getUserInfo');
  }

  appendUser(data) {
    let { name, email, idContract, role } = data;
    if (!name || !name.length) {
      throw new Error("\"Tên nhân viên\" không được để trống");

    }
    if (!email || !email.length) {
      throw new Error("\"Email\" không được để trống");
    }
    if (!idContract || !idContract.length) {
      throw new Error("\"Hợp đồng\" không được để trống");
    }
    if (!role || !role.length) {
      throw new Error("\"Vai trò\" không được để trống");
    }
    return gscriptrun('appendUser', data);
  }
  //#endregion

  //#region department
  addNewDepartment(data) {
    return gscriptrun('addNewDepartment', data);
  }

  listDepartment(obj) {
    return gscriptrun('listDepartment', obj || {});
  }

  departmentDetail(id){
    return gscriptrun('departmentDetail', id);

  }

  deleteDepartment(id, groupKey){
    return gscriptrun('deleteDepartment', id, groupKey);
  }

  editDepartment(payload){
    return gscriptrun('departmentEdit', payload);
  }

  generateDepartmentId(){
    return gscriptrun('generateDepartmentId');
  }

  createGroup(email, name){
    return gscriptrun('createGroup',email, name);
  }

  listGroups(email){
    return gscriptrun('listGroups', email);
  }

  deleteGroup(groupKey){
    return gscriptrun('deleteGroup', groupKey);
  }
  //#endregion

  //#region leave
  listLeaves(payload) {
    return gscriptrun('leaveList', payload);
  }
  leaveNew(data) {
    return gscriptrun('leaveNew', data);
  }
  leaveDetail({ id }) {
    return gscriptrun('leaveDetail', { id });
  }
  leaveEdit(data) {
    return gscriptrun('leaveEdit', data);
  }
  leaveApprove(payload) {
    return gscriptrun('leaveApprove', payload)
  }
  leaveDelete({ id, status, deletedReason }) {
    return gscriptrun("leaveDelete", { id, status, deletedReason });
  }
  //#endregion

  //#region checking
  listCheck(payload) {
    return gscriptrun('listCheck', payload);
  }
  checkingNew(data) {
    return gscriptrun('checkingNew', data);
  }
  verifyCheckingDate(date) {
    return gscriptrun('verifyCheckingDate', date);
  }
  checkingDetail(payload) {
    return gscriptrun('checkingDetail', payload);
  }
  checkingDetailById(id) {
    return gscriptrun('checkingDetailById', { id });
  }
  checkingEdit(payload){
    return gscriptrun('checkingEdit', payload);
  }
  checkingResponse(id, content){
    return gscriptrun('checkingResponse', id, content);
  }

  //#endregion

  // payroll
  getMonthInterval(dateInMonth) {
    return gscriptrun('getMonthInterval', dateInMonth)
  }
  getPayroll(...args) {
    return gscriptrun('getPayroll', ...args);
  }

  //#region setting
  getSetting() {
    return gscriptrun('getSetting');
  }
  updateSetting(setting) {
    return gscriptrun('updateSetting', setting)
  }
  //#endregion

  getEventsOfThisMonth(calendarIdx = 0, startDate = 1) {
    return gscriptrun('getEventsOfThisMonth', { calendarIdx, startDate });
  }
  getEventsOfMonth(calendarIdx = 0, startDate = 1, date) {
    return gscriptrun('getEventsOfMonth', { calendarIdx, startDate, date });
  }
  getHolidayOfThisMonth() {
    return gscriptrun('getEventsOfThisMonth', { calendarIdx: 1});
  }
  getHolidayOfMonth(date) {
    date = date || new Date();
    console.log(new Date(date).toDateString());
    return gscriptrun('getEventsOfMonth', { calendarIdx: 1, date, buffer: 1 });
  }
  createHoliday(summary, description, start, end, emails) {
    return gscriptrun("createEvent", {calendarIdx: 1, summary, description, start, end, emails});
  }
  updateHoliday(eventId, summary, description, start, end, emails) {
    return gscriptrun("updateEvent", {calendarIdx: 1, eventId, summary, description, start, end, emails});
  }
  deleteHoliday(eventId) {
    return gscriptrun('deleteEvent', {calendarIdx: 1, eventId});
  }
  createEvent(summary, description, start, end, emails) {
    return gscriptrun("createEvent", {calendarIdx: 0, summary, description, start, end, emails});
  }
  getNotifications() {
    return gscriptrun("getNotifications", {});
  }
  addNotification(notification) {
    return gscriptrun("addNotification", notification);
  }
  deleteNotification(id) {
    return gscriptrun("deleteNotification", {id});
  }
  updateNotification(notification) {
    return gscriptrun("updateNotification", notification);
  }
  sendNotification(notification, sendTime) {
    return gscriptrun('sendEmailNotif', { id: notification.id, sendTime });
  }
  getMyNotifications(messageCount=10) {
    return gscriptrun('getMyNotifications', {messageCount});
  }
  getMyNotificationBody(messageId) {
    return gscriptrun('getMyNotificationBody', {messageId});
  }
  checkMail() {
    return gscriptrun('checkMail', {});
  }
  me() {
    return gscriptrun('me', {});
  }
}

export default new ApiService();
