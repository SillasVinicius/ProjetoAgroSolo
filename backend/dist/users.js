"use strict";
exports.__esModule = true;
var User = /** @class */ (function () {
    function User(email, name, password) {
        this.email = email;
        this.name = name;
        this.password = password;
    }
    User.prototype.matches = function (another) {
        return (another !== undefined && another.email === this.email && another.password === this.password);
    };
    return User;
}());
exports.User = User;
exports.users = {
    'sillas@gmail.com': new User('sillas@gmail.com', 'sillas', '1234'),
    'luiz@gmail.com': new User('luiz@gmail.com', 'luiz', '1234')
};
