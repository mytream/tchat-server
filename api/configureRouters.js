module.exports = function (app) {
  app.use(require('./friend'));
  app.use(require('./chat'));
  app.use(require('./user'));
  app.use(require('./message'));
};