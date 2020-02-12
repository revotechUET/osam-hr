function doGet() {
    return HtmlService.createHtmlOutputFromFile("src/dist/index.html");
}

function getUserInfo() {
    return AdminDirectory.Users.get(Session.getActiveUser().getEmail())
}