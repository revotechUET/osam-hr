import {Checking} from '../@types/checking';
import { User } from '../@types/user';
import {db} from '../db';
import { dateString , uuid } from '../utils';


global.listCheck = listCheck;
global.checkingNew = checkingNew;
global.verifyCheckingDate = verifyCheckingDate;
global.checkingDetail = checkingDetail;

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

function verifyCheckingDate(date){
  let dateChecked = db.from<Checking>('checking').query.where('date', date).toJSON();
  if(dateChecked[0]['date'] == ""){
    return true;
  }else{
    return false;
  }
}

function checkingDetail({idUser}){
  const checkingQuery = db.join<Checking, User>('checking', 'user','idUser','requester');
  if (idUser) {
    checkingQuery.sWhere('idUser', idUser);
  }
  return checkingQuery.toJSON(); 
}