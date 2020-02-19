import {Department} from '../@types/department';
import {db} from '../db';
import {uuid} from '../utils';

global.addNewDepartment = addNewDepartment;
global.listDepartment   = listDepartment;

function addNewDepartment(data : Department){
    data.id = uuid();
    return db.from<Department>('department').insert(data);
}

function listDepartment(){
    return db.from<Department>('department').getDataJSON();
}
  