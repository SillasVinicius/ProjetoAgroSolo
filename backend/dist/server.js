"use strict";
exports.__esModule = true;
var jsonServer = require("json-server");
var fs = require("fs");
var http = require("http");
var auth_1 = require("./auth");
var authz_1 = require("./authz");
var server = jsonServer.create();
var router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.post('/login', auth_1.handleAuthentication);
server.use('/menu', authz_1.handleAuthorization);
server.get('/cliente');
server.use(router);
var options = {
    cert: fs.readFileSync('./backend/keys/cert.pem'),
    key: fs.readFileSync('./backend/keys/key.pem')
};
http.createServer(options, server).listen(3001, function () {
    console.log('JSON Server is running on https://localhost:3001');
});
