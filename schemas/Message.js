/**
 * Created by mytream on 17/7/19.
 */
const Schema = require('../common/mongoose').Schema;

const Message = Schema({
  messageId: Number, //唯一标识
  createTime: Number, //聊天时间戳
  content: String, // 聊天内容
  senderId: Number, //消息发送人ID

  isRead: Boolean, //是否已读
  type: Number, //类型：1. 资源 2.文本
  url: String, //资源路径
  receiverId: Number, // 消息接收人ID
});

module.exports = Message;