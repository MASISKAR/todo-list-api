const formidable = require('formidable'),
  path = require('path'),
  { fileSizeValidator, fileTypeValidator, getDest, getFileExtention } = require('../../utils/file-utils'),
  readChunk = require('read-chunk'),
  uuidv1 = require('uuid/v1'),
  fs = require('fs');

const uploader = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../../temp');
  form
  .on('field', (name, value) => {
    req.body = JSON.parse(value);
  })
  .on('file', (name, file) => {
    if (!req.files) req.files = [];
    // const buffer = readChunk.sync(file.path, 0, 262);
    // const type = fileType(buffer);

    const fileSizeValidationError = fileSizeValidator(file);
    if(fileSizeValidationError) return next(fileSizeValidationError);
    
    const fileTypeValidationError = fileTypeValidator(file);
    if(fileTypeValidationError) return next(fileTypeValidationError);
  const currentDest = path.join(__dirname, '../../uploads/chat');
    const dest = getDest(currentDest);
    const  fileName = uuidv1() +'.'+ getFileExtention(file.name),
      fullPath = path.join(currentDest, dest, fileName);
    fs.rename(file.path, fullPath,
      (err) => {
        if (err) return next(err);
      });
    req.files.push({
      name: file.name,
      size: file.size,
      type: file.type,
      path: path.join(dest, fileName)
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

//TODO pls create a scheduler for delete temp files
