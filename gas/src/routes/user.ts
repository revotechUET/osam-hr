import { GoogleUser, User, UserRole } from "../@types/user";
import { db } from "../db";
import { googleUser, userInfo, isValid } from "../utils";

global.listUsersDomain  = listUsersDomain;
global.listUsers        = listUsers;

function listUsersDomain(maxResults) {
  var optionalArgs = {
      customer: 'my_customer',
      maxResults: maxResults || 100,
      orderBy: 'email'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return { total: response.users.length, users: response.users };
}


function listUsers() {
  return db.from<User>('user').getDataJSON();
}
