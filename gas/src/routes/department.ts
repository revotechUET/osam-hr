import { Department } from '../@types/department';
import { User } from '../@types/user';
import { db } from '../db';
import { uuid } from '../utils';
import { updateUserById, loadUserById } from './user';
import { createGroup, deleteGroup } from './groups';
import {User_Department} from '../@types/user_department';

global.addNewDepartment = addNewDepartment;
global.listDepartment = listDepartment;
global.departmentDetail = departmentDetail;
global.deleteDepartment = deleteDepartment;
global.departmentEdit = departmentEdit;
global.generateDepartmentId = generateDepartmentId;

function addNewDepartment(data) {
  const dId = uuid();
  const table = db.from<Department>('department');
  const existed = table.query.where('name', data.name).toJSON()[0];
  if (existed) throw 'Tên bộ phận đã tồn tại';
  const ok = table.insert({ ...data, id: dId });
  if (!ok) return ok;
  // add manager to department
  const manager = loadUserById(data.idManager, { loadDepartments: true });
  updateUserById(manager.id, { departments: [...manager.departments.map(d => d.id), dId] });
  // create group
  const group = createGroup(data.name);
  table.update(dId, { idGroup: group.id });
  return ok;
}

function listDepartment({ loadManagers }) {
  let departments;
  if (loadManagers) {
    departments = db.join<Department, User>('department', 'user', 'idManager', 'manager').setType('inner').toJSON();
  } else {
    departments = db.from<Department>('department').query.toJSON();
  }
  return departments.map(d => ({ ...d, idApprovers: JSON.parse(d.idApprovers) }));
}

function departmentDetail({ id }) {
  const departmentQuery = db.join<Department, User>('department', 'user', 'id', 'department');
  if (id) {
    departmentQuery.sWhere('id', id);
  }
  return departmentQuery.toJSON().map(d => ({ ...d, idApprovers: JSON.parse(d.idApprovers) }));
}

function deleteDepartment(id, groupKey) {
  deleteGroup(groupKey);
  const table = db.from<User_Department>('user_department');
  let user_department = table.query.where('idDepartment', id).toJSON();
  for (let i = 0; i < user_department.length; i++) {
    table.delete(user_department[i].id);
  }
  return db.from<Department>('department').delete(id);
}

function departmentEdit({ id, name, idManager, idApprovers, active }) {
  return db.from<Department>('department').update(id, { name, idManager, idApprovers, active });
}
function generateDepartmentId() {
  let id = uuid();
  return id;
}
