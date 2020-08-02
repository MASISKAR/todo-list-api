const formidable = require('formidable'),
  path = require('path'),
  errorConfig = require('../../config/error.config'),
  readChunk = require('read-chunk'),
  fs = require('fs');

const uploader =(req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../../temp');
  form
  .on('field', (name, value) => {
    req.body = JSON.parse(value);
  })
  .on('file',  (name, file) => {
    let buffer, fileName;
    if(!req.images) req.images = [];
    buffer = readChunk.sync(file.path, 0, 262);
    const type =  file.type,
      reg = /jpg|gif|png/;
    if (!(type && reg.test(type))) {
      return next(errorConfig.imageTypeValidationError);
    }
    
    if (file.size > 10 * 1024 * 1024) {
      //Limits the size of uploaded file, current value is 10 mb
      //TODO pls create a scheduler for delete temp files
      return next(errorConfig.imageSizeValidationError);
    }
    
    fileName = Date.now() + '-' + file.name+'.'+type.ext;
    fs.rename(file.path, path.join(__dirname, '../../uploads/' + fileName),
      (err) => { if (err) return next(err); });
    req.images.push({
      fileName: fileName,
      index: parseInt(name) || 0
    });
  })
  .on('end', () => {
    return next();
  })
  .on('error', (err) => {
    return next(err);
  });
  form.parse(req);
};

module.exports = uploader;
