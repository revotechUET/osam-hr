function testUserInfo() {
  const user = People.People.get('people/me', { personFields: 'names,emailAddresses' });
  return user;
}
global.testUserInfo = testUserInfo;

function test(args) {
  return args;
}
global.test = test;

function listUsers(maxResults) {
  var optionalArgs = {
      customer: 'my_customer',
      maxResults: maxResults || 100,
      orderBy: 'email'
  };
  var response = AdminDirectory.Users.list(optionalArgs);
  return { total: response.users.length, users: response.users };
}

function getUserInfo() {
  return AdminDirectory.Users.get(Session.getActiveUser().getEmail())
}
