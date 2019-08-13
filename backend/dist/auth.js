"use strict";
exports.__esModule = true;
var users_1 = require("./users");
var jwt = require("jsonwebtoken");
var api_config_1 = require("./api-config");
exports.handleAuthentication = function (req, resp) {
    var user = req.body;
    if (isValid(user)) {
        var dbUser_1 = users_1.users[user.email];
        var token = jwt.sign({ sub: function () { return dbUser_1.email; }, iss: 'agroSolo-api' }, api_config_1.apiConfig.secret);
        resp.json({ name: dbUser_1.name, email: dbUser_1.email, accessToken: token });
    }
    else {
        resp.status(303).json({ message: 'dados invalidos' });
    }
};
function isValid(user) {
    if (!user) {
        return false;
    }
    var dbUser = users_1.users[user.email];
    return dbUser !== undefined && dbUser.matches(user);
}
