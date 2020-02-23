import { Department } from '../@types/department';
import {User} from '../@types/user';
import { db } from '../db';
import { uuid } from '../utils';

global.addNewDepartment = addNewDepartment;
global.listDepartment = listDepartment;
global.departmentDetail = departmentDetail;

function addNewDepartment(data) {
  return db.from<Department>('department').insert({ id: uuid(), ...data });
}

function listDepartment({idManager, idApprovers}) {
  const departmentQuery = db.join<Department, User>('department', 'user','idManager','manager');
  if (idManager) {
    departmentQuery.sWhere('idManager', idManager);
  }
  const approversQuery = db.join<Department, User>('department', 'user','idApprovers','approvers');
  if(idApprovers){
    approversQuery.sWhere('idApprovers', idApprovers);
  }  
  return departmentQuery.toJSON();
}

function departmentDetail({id}){
  const departmentQuery = db.join<Department, User>('department', 'user','id','department');
  if (id) {
    departmentQuery.sWhere('id', id);
  }
  return departmentQuery.toJSON(); 
}