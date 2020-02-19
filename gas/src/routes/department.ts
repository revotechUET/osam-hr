import { Department } from '../@types/department';
import { db } from '../db';
import { uuid } from '../utils';

global.addNewDepartment = addNewDepartment;
global.listDepartment = listDepartment;

function addNewDepartment(data) {
  return db.from<Department>('department').insert({ id: uuid(), ...data });
}

function listDepartment() {
  return db.from<Department>('department').getDataJSON();
}
