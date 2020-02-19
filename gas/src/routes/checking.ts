import {Checking} from '../@types/checking';
import { User } from '../@types/user';
import {db} from '../db';
import { dateString , uuid } from '../utils';


global.listCheck = listCheck;
global.checkingNew = checkingNew;

function listCheck({ idUser}){
    const checkingQuery = db.join<Checking, User>('checking', 'user','idUser','requester');
    if (idUser) {
        checkingQuery.sWhere('idUser', idUser);
      }
    return checkingQuery.toJSON(); 
}

function checkingNew(data : Checking){
     data.id = uuid();
    return db.from<Checking>('checking').insert(data);
}