'use strict';

const mongoose = require('mongoose'),
  beautify_unique = require('mongoose-beautiful-unique-validation');

mongoose.plugin(beautify_unique, {
  defaultMessage: "{PATH} ({VALUE}) duplication detected"
});

module.exports = mongoConfig => {
  return mongoose.connect(
          mongoConfig.connection.url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};
