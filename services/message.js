// - `Message[] findMessages()` /message/list
// - `Message sendMessage(msg:Message)` /message/send

const mongoose = require('../common/mongoose');

const Message = mongoose.model('Message', require('../schemas/Message'));
const User = mongoose.model('User', require('../schemas/User'));

exports.findMessages = function () {
  console.log(`Message.findMessages`);

  return User.find().exec().then((users) => {
    const userMap = {};
    users.forEach(user => {
      userMap[user.userId] = user;
    });

    // console.log(`复合地基撒狂蜂浪蝶卡萨`, userMap);

    return Message.find().exec().then(msgs => {
      if (!msgs || !msgs.length) {
        return [];
      }

      const fMsgs = msgs.map(msg => {
        const { createTime, messageId, senderId, content } = msg;
        let senderName, url;

        let tUser = userMap[String(senderId)];
        if (tUser) {
          senderName = tUser.name;
          url = tUser.url;
        }
        // console.log('>>>>>>>>>>>>>> msg', senderName);

        return {
          createTime,
          messageId,
          senderId,
          content,
          senderName,
          url,
        };
      });

      return fMsgs;
    });
  });
};

exports.saveMessage = function (msg) {
  // if(!msg.messageId){
  // }
  const dateNow = Date.now();
  msg.messageId = dateNow;
  msg.createTime = dateNow;

  return new Message(msg).save().then((fMsg) => {
    return User.findOne({ userId: fMsg.senderId }).exec().then(user => {
      const { createTime, messageId, senderId, content } = msg;
      const { url, name: senderName } = user;
      return Object.assign({
        url, senderName,
      }, {
        createTime, messageId, senderId, content,
      });
    });
  });
};