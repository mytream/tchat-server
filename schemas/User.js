/**
 * Created by mytream on 17/7/19.
 */
const Schema = require('../common/mongoose').Schema;

const User = Schema({
  userId: Number, // 唯一标识
  name: String, // 用户昵称
  url: String, // 头像路径
  deleted: Boolean, // 是否已删除
  order: Number, // 置顶顺序
  online: Boolean, // 是否在线
});

module.exports = User;