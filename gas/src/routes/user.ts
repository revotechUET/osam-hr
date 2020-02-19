import { GoogleUser, User, UserRole} from "../@types/user";
import { db } from "../db";
import { isValid,uuid } from "../utils";
import { User_Department } from "../@types/user_department";
import { Department } from "../@types/department";

global.listUsersDomain  = listUsersDomain;
global.listUsers        = listUsers;
global.generateUid      = generateUid;
global.appendUser       = appendUser;


function listUsersDomain(maxResults) {
  var optionalArgs = {
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
  let users = db.from<User>('user').getDataJSON();
  let user_department = db.from<User_Department>('user_department').getDataJSON();
  for (let i = 0; i < users.length; i++) {
    users[i].departments = user_department.filter((e)=>e.idUser == users[i].id).map((e)=>e.idDepartment)
  }
  return users;
}

function appendUser(data, listDepartment) {
  //gen
  for (let i = 0; i < listDepartment.length; i++) {
    db.from<User_Department>('user_department').insert({idUser: data.id, idDepartment: listDepartment[i]});
  }
  return db.from<User>('user').insert(data);
}







