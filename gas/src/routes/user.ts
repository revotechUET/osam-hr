import { GoogleUser, User, UserRole, Department } from "../@types/user";
import { db } from "../db";
import { googleUser, userInfo, isValid,uuid } from "../utils";

global.listUsersDomain  = listUsersDomain;
global.listUsers        = listUsers;
global.addNewDepartment = addNewDepartment;
global.appendUser       = appendUser;
global.generateUid      = generateUid;

function listUsersDomain(maxResults) {
  var optionalArgs = {
      customer: 'my_customer',
      maxResults: maxResults || 100,
      orderBy: 'email'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return { total: response.users.length, users: response.users };
}

function generateUid(){
  let uid = uuid();
  return uid;
}

function listUsers() {
  return db.from<User>('user').getDataJSON();
}

function addNewDepartment(data){
  return db.from<Department>('department').insert(data);
}

function appendUser(data){
  return db.from<User>('user').insert(data);
}

