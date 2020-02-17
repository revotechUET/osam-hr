import {Department} from '../@types/department';
import {db} from '../db';

global.addNewDepartment = addNewDepartment;

function addNewDepartment(data){
    return db.from<Department>('department').insert(data);
}
  