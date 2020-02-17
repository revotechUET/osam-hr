import {Department} from '../@types/department';
import {db} from '../db';

global.addNewDepartment = addNewDepartment;
global.listDepartment   = listDepartment;

function addNewDepartment(data){
    return db.from<Department>('department').insert(data);
}

function listDepartment(){
    return db.from<Department>('department').getDataJSON();
}
  