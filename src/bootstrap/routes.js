'use strict';

module.exports = app => {
  app.use('/', require('../routes/index.route'));

  app.use('/user', require('../routes/user.route'));
  app.use('/task', require('../routes/task.route'));
};
