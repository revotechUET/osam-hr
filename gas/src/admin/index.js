function doGet() {
    return HtmlService.createHtmlOutputFromFile("src/dist/index.html");
}

function getUserInfo() {
    return AdminDirectory.Users.get(Session.getActiveUser().getEmail())
}

function listAllUsers(params) {
    let page = AdminDirectory.Users.list(params);
    let users = page.users;
    if (users) return {
        users: users,
        pageToken: pageToken
    }
}