module.exports = function (app) {
  app.use(require('./api/friend'));
  app.use(require('./api/chat'));
  app.use(require('./api/user'));
  app.use(require('./api/message'));
};