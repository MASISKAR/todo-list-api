'use strict';

const create_error = require('http-errors'),
  errorConfig = require('../../config/error.config');


module.exports = app => {
  // tools
  let format_err = err => {
    if (err.ref) return errorConfig[err.ref];
    
    if (err.errors) {
      // format mongo unique error
      let errorKey = Object.keys(err.errors)[0];
      return {
        name: errorConfig.fieldAlreadyExists.name,
        message: err.errors[errorKey].message,
        status: errorConfig.fieldAlreadyExists.status,
        private: err.private || false
      }
    } else {
      return {
        message: err.message,
        name: err.name,
        private: err.private || false,
        status: err.status || 500,
        info: err.info || undefined
      }
    }
  };
  
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(create_error(404));
  });
  
  // error handler
  app.use((err, req, res, next) => {
    const error = format_err(err);
    let unexpected_error = false;
    
    // show errors for developers
    if (!error.status || error.status >= 500 || error.private) {
      unexpected_error = true;
      if ( process.env.NODE_ENV === 'dev' ) {
          console.log('####################');
          console.log(err);
        console.log('####################');
      } else if (process.env.NODE_ENV === 'test') {
        console.log(err);
        process.exit(1);
      }
    }
    
    if (error.private) return;
    
    if (unexpected_error) res.status(500).json({error: errorConfig.defaultError});
    else res.status(error.status).json({error});
  });
};
