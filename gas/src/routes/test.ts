global.getUserInfo = getUserInfo;
global.testUserInfo = testUserInfo;
global.test = test;

function testUserInfo() {
  const user = People.People.get('people/me', { personFields: 'names,emailAddresses' });
  return user;
}

function test(args) {
  return args;
}

function getUserInfo() {
  const user =  Session.getActiveUser()
  return user.getEmail()
}

<<<<<<< HEAD


=======
global.getUserInfo = getUserInfo;
>>>>>>> 0644003cccedfd7f64d23814addff3d1ddd4e574
