'use strict';

Promise = require('bluebird');
const express = require('express'),
  helmet = require('helmet'),
  compress = require('compression'),
  cors = require('cors'),
  logger = require('morgan'),
  body_parser = require('body-parser'),
  error_handler = require('errorhandler'),
  path = require('path');

// Initialize express app
const app = express();

app.is_running = Promise.pending();
app.db_connect = require('./mongo');

app.get('/downloads/:filename', (req, res)=>{
  const filePath = path.join(__dirname, '../../public/downloads/'+req.params.filename);
  res.download(filePath);
});

//TODO change the limit
app.use(body_parser.json({limit: '10mb'}));
app.use(body_parser.urlencoded({
  limit: '10mb',
  extended: true
}));

app.use(cors());

app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('public'));
// Should be placed before express.static
app.use(compress());

// Showing stack errors
app.set('showStackError', true);

// Use helmet to secure Express headers
// later on use advanced options for more flexibility
// https://github.com/helmetjs/helmet
app.use(helmet());

app.use((err, req, res, next) => {
  if (err.name === 'StatusError') res.send(err.status, err.message);
  else next(err);
});

// Add headers
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_HOST || '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
  app.use(error_handler())
}

app.enable('case sensitive routing');
app.enable('strict routing');

require('./routes')(app);

// Handle errors
require('./error-handler')(app);

module.exports = app;
