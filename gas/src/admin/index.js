function listAllUsers(params) {
    let page = AdminDirectory.Users.list(params);
    let users = page.users;
    if (users) return {
        users: users,
        pageToken: pageToken
    }
}