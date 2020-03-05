import {Checking} from '../@types/checking';
import { User } from '../@types/user';
import {db} from '../db';
import { dateString , uuid, sendMail, userInfo } from '../utils';


global.listCheck = listCheck;
global.checkingNew = checkingNew;
global.checkingDetail = checkingDetail;
global.checkingEdit = checkingEdit;
global.checkingResponse = checkingResponse;

function listCheck({ idUser}){
    const checkingQuery = db.join<Checking, User>('checking', 'user','idUser','requester').setType('inner');
    if (idUser) {
        checkingQuery.sWhere('idUser', idUser);
      }
    return checkingQuery.toJSON();
}

function checkingNew(data : Checking){
     data.id = uuid();
    return db.from<Checking>('checking').insert(data);
}

// function verifyCheckingDate(date){
//   let dateChecked = db.from<Checking>('checking').query.where('date', date).toJSON();
//   if(dateChecked[0]['date'] == ""){
//     return true;
//   }else{
//     return false;
//   }
// }

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