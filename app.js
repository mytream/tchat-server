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

// 配置路由
require('./api/configureRouters')(app);

const httpServer = http.createServer(app.callback());

module.exports = httpServer;
