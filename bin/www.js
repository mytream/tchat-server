/**
 * Created by mytream on 17/7/19.
 */
const SOCKET = require('../common/socket');

// web
const httpServer = require('../app');

// websocket
SOCKET.handleSocketIo(httpServer);

const port = process.env.PORT || 8080;
httpServer.listen(port, function (err) {
  if (err) return console.log(err);
  console.log('Listening at http://localhost:' + port);
});

// 全局（进程）错误处理
process.on('uncaughtException', (err) => {
  console.error('系统进程异常', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('未捕获的Promise异常', reason);
});
