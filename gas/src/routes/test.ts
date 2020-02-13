function testUserInfo() {
  const user = People.People.get('people/me', { personFields: 'names,emailAddresses' });
  return user;
}
global.testUserInfo = testUserInfo;

function test(args) {
  return args;
}
global.test = test;

function getUserInfo() {
  return AdminDirectory.Users.get(Session.getActiveUser().getEmail())
}

global.getUserInfo = getUserInfo;

