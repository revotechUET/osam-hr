module.exports.getUserInfo = () => {
    return AdminDirectory.Users.get(Session.getActiveUser().getEmail())
}