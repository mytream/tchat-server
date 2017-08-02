const router = require('koa-router')();
const util = require('../common/util');
const SOCKET = require('../common/socket');
const constants = require('../common/constants');
const MsgService = require('../services/message');

/**
 *  - `User findUser()` /user/info
 - `User[] findAllUsers()` /user/list
 - `User updateUser(user:User)` /user/update
 */

router.get('/message/list', async function (ctx, next) {
  const msgs = await MsgService.findMessages();

  // console.log('----> /message/list',  msgs);

  ctx.body = util.getResultData(msgs);
});

router.post('/message/send', async function (ctx, next) {
  const newMsg = ctx.request.body;

  console.log(`newMsg`, newMsg);


  // 保存到后台
  const fMsg = await MsgService.saveMessage(newMsg);

  // 广播消息
  SOCKET.emit({
    code: constants.MSG_CODE.MESSAGE,
    result: fMsg
  });

  // ctx.body = util.getResultData(newMsg);
  ctx.body = util.getResultData(fMsg);
});

module.exports = router.routes();