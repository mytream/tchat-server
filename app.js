const http = require('http');
const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
import cors from "koa-cors";

const app = new Koa();

app.use(bodyParser());
app.use(cors());

app.use(serve(path.join(__dirname + '/views')));

const apiFriend = require('./api/friend');
const apiChat = require('./api/chat');
app.use(apiFriend);
app.use(apiChat);
app.use(require('./api/user'));
app.use(require('./api/message'));

const httpServer = http.createServer(app.callback());

module.exports = httpServer;