const router = require('koa-router')();
const util = require('../common/util');
const UserService = require('../services/user');

/**
 *  - `User findUser()` /user/info
 - `User[] findAllUsers()` /user/list
 - `User updateUser(user:User)` /user/update
 */

router.get('/user/info', async function (ctx, next) {

  try {

    // 获取用户信息
    let friends = await Friend.find().exec();

    console.log('friends', friends);

    ctx.body = {
      code: '0',
      message: null,
      data: friends
    };
  } catch (e) {
    console.error(e);
    ctx.body = 'error';
  }
});

router.get('/user/list', async function (ctx, next) {
  const users = await UserService.findAllUsers();

  ctx.body = util.getResultData(users);
});

router.post('/user/update', async function (ctx, next) {
  const newUser = ctx.request.body;
  console.log('newUser', newUser);
  const users = await UserService.updateUser(newUser);

  ctx.body = util.getResultData(users);
});

module.exports = router.routes();