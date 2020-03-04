import { Contract } from "../@types/contract";
import { Department } from "../@types/department";
import { User } from "../@types/user";
import { User_Department } from "../@types/user_department";
import { db } from "../db";
import { uuid } from '../utils';

global.listUsersDomain = listUsersDomain;
global.listUsers = listUsers;
global.appendUser = appendUser;
global.deleteUserById = deleteUserById;
global.updateUserById = updateUserById;

function listUsersDomain(maxResults) {
  var optionalArgs = {
    maxResults: maxResults || 500,
    orderBy: 'email',
    domain: ''
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return response.users.map((e) => ({ primaryEmail: e.primaryEmail, id: e.id, name: { familyName: e.name.familyName, givenName: e.name.givenName, fullName: e.name.fullName } }));
}

export function listUsers({ full = false, loadDepartments = false, loadContracts = false } = {}) {
  let users: User[];
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

export function loadUserById(id, { full = false, loadDepartments = false, loadContracts = false }) {
  let users = db.from<User>('user').query.where('id', id).toJSON();
  if (users.length == 0) return null;
  let user = users[0];
  if (full || loadContracts) {
    let contract = db.from<Contract>('contract').query.where('id', user.idContract).toJSON();
    user.contract = contract.length === 0 ? null : contract[0];
  }
  if (full || loadDepartments) {
    let user_department = db.from<User_Department>('user_department').query.where('idUser', user.id).toJSON();
    let departments = [];
    for (let i = 0; i < user_department.length; i++) {
      departments.push(db.from<Department>('department').query.where('id', user_department[i].idDepartment).toJSON());
    }
    user.departments = departments;
  }
  return user;
}

function deleteUserById(id) {
  const table = db.from<User_Department>('user_department');
  let user_department = table.query.where('idUser', id).toJSON();
  for (let i = 0; i < user_department.length; i++) {
    table.delete(user_department[i].id);
  }
  return db.from<User>('user').delete(id);
}

export function updateUserById(id, info) {
  const table = db.from<User_Department>('user_department');
  let user_department = table.query.where('idUser', id).toJSON();
  for (let i = 0; i < user_department.length; i++) {
    table.delete(user_department[i].id);
  }
  if (info.departments) {
    for (let i = 0; i < info.departments.length; i++) {
      table.insert({ id: uuid(), idUser: id, idDepartment: info.departments[i] });
    }
  }
  delete info.departments
  return db.from<User>('user').update(id, info);
}

function appendUser(data) {
  const existed = db.from<User>('user').query.where('email', data.email).toJSON().length;
  if (existed) throw 'Email nhân viên đã tồn tại';
  const table = db.from<User_Department>('user_department');
  for (let i = 0; i < data.departments.length; i++) {
    table.insert({ id: uuid(), idUser: data.id, idDepartment: data.departments[i] });
  }
  return db.from<User>('user').insert(data);
}







