// Compiled using ts2gas 3.4.4 (TypeScript 3.7.5)
var exports = exports || {};
var module = module || { exports: exports };
function test() {
    var currentUser = Session.getActiveUser();
    var email = currentUser.getEmail();
    var user = AdminDirectory.Users.get(email);
    return user;
}
function dummy() {
    return { a: 1, b: 2, dummy: true };
}
/**
* Lists users in G Suite domain.
*/
function listUsers(maxResults) {
    var optionalArgs = {
        customer: 'my_customer',
        maxResults: maxResults || 100,
        orderBy: 'email'
    };
    var response = AdminDirectory.Users.list(optionalArgs);
    return { total: response.users.length, users: response.users };
}
