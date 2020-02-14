import { GoogleUser, User, UserRole } from "../@types/user";
import { db } from "../db";
import { googleUser, userInfo, isValid } from "../utils";

function listUsersDomain(maxResults) {
  var optionalArgs = {
      customer: 'my_customer',
      maxResults: maxResults || 100,
      orderBy: 'email'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return { total: response.users.length, users: response.users };
}
global.listUsersDomain = listUsersDomain;

function listUsers() {
  return db.from<User>('user').toJSON();
}
global.listUsers = listUsers;
