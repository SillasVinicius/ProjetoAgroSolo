import * as jsonServer from 'json-server';
import { Express } from 'express';
import * as fs from 'fs';
import * as http from 'http';
import { handleAuthentication } from './auth';
import { handleAuthorization } from './authz';

const server: Express = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.post('/login', handleAuthentication);
server.use('/menu', handleAuthorization);
server.get('/cliente');

server.use(router);

const options = {
  cert: fs.readFileSync('./backend/keys/cert.pem'),
  key: fs.readFileSync('./backend/keys/key.pem')
};

http.createServer(options, server).listen(3001, () => {
  console.log('JSON Server is running on https://localhost:3001');
});
