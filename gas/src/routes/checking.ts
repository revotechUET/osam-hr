import {Checking} from '../@types/checking';
import {db} from '../db';

global.listCheck = listCheck;
global.checkingNew = checkingNew;

function listCheck(){
    return db.from<Checking>('checking').getDataJSON(); 
}

function checkingNew(data){
    return db.from<Checking>('checking').insert(data);
}