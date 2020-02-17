import { GoogleUser, User, UserRole} from "../@types/user";
import { db } from "../db";
import { isValid,uuid } from "../utils";

global.listUsersDomain  = listUsersDomain;
global.listUsers        = listUsers;
global.generateUid      = generateUid;
global.appendUser       = appendUser;


function listUsersDomain(maxResults) {
  var optionalArgs = {
      maxResults: maxResults || 100,
      orderBy: 'email'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return { total: response.users.length, users: response.users };
}

function generateUid(){
  let uid = uuid();
  return uid;
}

function listUsers() {
  return db.from<User>('user').getDataJSON();
}

function appendUser(data){
  return db.from<User>('user').insert(data);
}







