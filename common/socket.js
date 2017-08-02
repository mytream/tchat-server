'use strict'

/**
 * Created by 苑永志 on 16/8/8.
 */
const constants = require('../common/constants');
// const logger = require('../common/logger/log4js').getLogger(constants.LOG_TYPE.APPLICATION);
const logger = {};
// socket.io
const socketIo = require('socket.io');
const UserService = require('../services/user');
//redis
// const redis = require('redis');

const MSG_TYPE = constants.MSG_TYPE;
const MSG_CODE = constants.MSG_CODE;

const REDIS_OPTIONS = constants.REDIS_OPTIONS;

// socket.io实例
let io;

// 用户ID(可能有多个,后加时间戳区别)和sessionId的映射
const userIdSocketIdMap = {};

// redis订阅的频道
function configRedisSubClient() {
  const subClient = redis.createClient({
    host: REDIS_OPTIONS.redisClientIp,
    port: REDIS_OPTIONS.redisClientPort,
    password: REDIS_OPTIONS.redisClientPwd
  });

  // 订阅redis消息,并在接收到消息的时候进行广播
  subClient.subscribe(REDIS_OPTIONS.channelName); //订阅指定频道的消息
  subClient.on("error", function (err) {
    console.log("socket io: redis 订阅客户端发生异常,如下:", err);
  });

  subClient.on("message", function (channel, message) {

    const msg = JSON.parse(message);
    msg.content = JSON.parse(msg.content);
    // console.log('从Redis订阅到消息了: \n'+ JSON.stringify(msg,true,2));

    // 需要发给的用户
    const userId = msg.key;


    // console.log('all user id map ---------->>>>>>>>>>>>>>>>>>' + JSON.stringify(userIdSocketIdMap,true,2));
    // 将消息发给对应的用户
    let socketId,userInfo;
    for(const uniqueId in userIdSocketIdMap){
      if(uniqueId.startsWith(userId)){
        userInfo = userIdSocketIdMap[uniqueId];
        socketId = userInfo.socketId;

        // console.log('selected socket id  ---------->>>>>>>>>>>>>>>>>>' + socketId);

        // 发送ws消息
        io.sockets.connected[socketId] && io.sockets.connected[socketId].emit(constants.MSG_TYPE.ON_GOING,msg.content);
      }
    }
  });
}

function findUserInfoFromMap(userId) {
  let userInfo,socketId;
  for(const uniqueId in userIdSocketIdMap){
    if(uniqueId.startsWith(userId)){
      userInfo = userIdSocketIdMap[uniqueId];

      return userInfo;
    }
  }

  return null;
}

function handleSocketIo(httpServer) {
  io = socketIo(httpServer);

  // configRedisSubClient();

  // ws连接监听
  io.on('connection', function (socket) {
    console.log('a client connected ...');

    // 确定身份
    socket.emit(MSG_TYPE.FIRST_CONNECT, `Are you sure to connect, send your userId to me if u have one`);

    // 这是由页面链接成功后第一次发送的身份相关信息
    socket.on(MSG_TYPE.FIRST_CONNECT, userId => {
      console.log(`receive FIRST_CONNECT msg => userId: `, userId);

      if(!userId){
        const currTime = Date.now();
        const newUser = {
          userId: currTime, // 唯一标识
          name: `游客${currTime}`, // 用户昵称
          url: constants.DEFAULT_USER_URL, // 头像路径
          deleted: true, // 是否已删除
          order: 0, // 置顶顺序
          online: true, // 是否在线
        };
        UserService.saveUser(newUser).then(() => {
          socket.emit(MSG_TYPE.GREETING, newUser);
        }).catch(e => {
          console.error(e);
        });
        return;
      }

      UserService.findUser(userId).then((newUser) => {
        console.log(`User.findUser, newUser: ${newUser}`);

        socket.emit(MSG_TYPE.GREETING, newUser);
      });
    });

    // 查询用户状态的请求
    socket.on(MSG_TYPE.USER_STATE,(data)=>{

    });


    // 连接断开
    socket.on('disconnect', function(socket){
      console.log('a client disconnect', socket);

      // 查询用户ID
      const socketId = socket.id;
      let userInfo;
      let _socketId, _userInfo, nIndex, notifyId;
      for(const _uniqueId in userIdSocketIdMap){
        userInfo = userIdSocketIdMap[_uniqueId];

        if(userInfo.socketId !== socketId){
          continue;
        }

        // 通过关联的用户 - 下线信息
        for(nIndex in userInfo.notifyIds){
          notifyId = userInfo.notifyIds[nIndex];
          _userInfo = findUserInfoFromMap(notifyId);

          if(_userInfo){
            _socketId = _userInfo.socketId;
            io.sockets.connected[_socketId] && io.sockets.connected[_socketId].emit(MSG_TYPE.ON_GOING,{
              code: MSG_CODE.OFF_LINE,
              message: 'user offline',
              result:{
                userId: userInfo.userId
              }
            });
          }
        }

        // 缓存移除
        delete userIdSocketIdMap[_uniqueId];

        // 打印
        console.log(_uniqueId + '与ws server断开连接');
        break;
      }
    });

  });
}

function emit(msg) {
  io.emit(MSG_TYPE.ON_GOING, msg);
}

const SOCKET = {
  handleSocketIo,
  emit,
};

module.exports = SOCKET;

