import {Checking} from '../@types/checking';
import { User } from '../@types/user';
import {db} from '../db';
import { dateString , uuid, sendMail, userInfo } from '../utils';
import {startOfDay} from 'date-fns';


global.listCheck = listCheck;
global.checkingNew = checkingNew;
global.checkingDetail = checkingDetail;
global.checkingEdit = checkingEdit;
global.checkingResponse = checkingResponse;

function todayDateString() {
  return startOfDay(new Date()).toISOString();
}

function checkingNew(data : Checking){
     data.id = uuid();
     const [checking] = db.from<Checking>('checking').query.select().where('date', todayDateString()).where('idUser', data.idUser).toJSON();
     if(!checking){
       return db.from<Checking>('checking').insert(data);
      }
      throw 'Đã tồn tại chấm công';
}

function listCheck({ idUser}){
    const checkingQuery = db.join<Checking, User>('checking', 'user','idUser','requester').setType('inner');
    if (idUser) {
        checkingQuery.sWhere('idUser', idUser);
      }
    return checkingQuery.toJSON();
}




function checkingDetail({idUser}){
  const checkingQuery = db.join<Checking, User>('checking', 'user','idUser','requester').setType('inner');
  if (idUser) {
    checkingQuery.sWhere('idUser', idUser);
  }
  return checkingQuery.toJSON();
}

function checkingEdit({ id, date, checkinTime, checkoutTime, reportContent, responseContent, reportStatus, idUser, note}){
  return db.from<Checking>('checking').update(id, { date, checkinTime, checkoutTime, reportContent, responseContent, reportStatus, idUser, note});
}

function checkingResponse(id, responseContent){
  let table = db.from<Checking>('checking');
  let user = userInfo();
  table.update(id, {responseContent : responseContent, reportStatus : "done"});

  const checkingWithUser = db.join<Checking, User>('checking', 'user', 'idUser', 'user').sWhere('id', id).toJSON()[0];
  sendMail('response', [checkingWithUser.user.email], {
    approver: user.name,
    content: checkingWithUser.responseContent || "khong co gi"
  });
  return;
}