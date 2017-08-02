const mongoose = require('../common/mongoose');

const User = mongoose.model('User', require('../schemas/User'));

exports.findUser = function (userId) {
  console.log(`User.findUser, userId: ${userId}`);
  return User.findOne({ userId: parseInt(userId) }).exec();
};
exports.findAllUsers = function () {
  return User.find().exec();
};
exports.saveUser = function (newUser) {
  return new User(newUser).save();
};
exports.updateUser = function (user) {
  return User.where({ userId: user.userId }).update(user);
};