import { GoogleUser, User, UserRole } from "../@types/user";
import { db } from "../db";
import { isValid, uuid } from "../utils";
import { User_Department } from "../@types/user_department";
import { Department } from "../@types/department";
import { Contract } from "../@types/contract";

global.listUsersDomain = listUsersDomain;
global.listUsers = listUsers;
global.appendUser = appendUser;


function listUsersDomain(maxResults) {
  var optionalArgs = {
    maxResults: maxResults || 100,
    orderBy: 'email'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return { total: response.users.length, users: response.users };
}

function listUsers({ full = false, loadDepartments = false, loadContracts = false } = {}) {
  let users;
  if (full || loadContracts) {
    users = db.join<User, Contract>('user', 'contract', 'idContract', 'contract').toJSON();
  } else {
    users = db.from<User>('user').getDataJSON();
  }
  if (full || loadDepartments) {
    const departments = db.from<Department>('department').getDataJSON();
    const user_department = db.from<User_Department>('user_department').getDataJSON();
    for (let i = 0; i < users.length; i++) {
      const idDepartments = user_department.filter((e) => e.idUser == users[i].id).map((e) => e.idDepartment);
      users[i].departments = departments.filter(d => idDepartments.includes(d.id));
    }
  }
  return users;
}

function appendUser(data, listDepartment) {
  for (let i = 0; i < listDepartment.length; i++) {
    db.from<User_Department>('user_department').insert({ idUser: data.id, idDepartment: listDepartment[i] });
  }
  return db.from<User>('user').insert(data);
}







