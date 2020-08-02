const {forbiddenFileExtentions, uploadedFileSizeLimit} = require("../config/attachment.config"),
{fileSizeValidationError, fileTypeValidationError} = require('../config/error.config'),
  uuidv1 = require('uuid/v1'),
  path = require('path'),
  fs = require('fs');

/**
 * Execute file extention from file name
 * @param fileName {string}
 * @returns {string|undefined}
 */
function getFileExtention(fileName){
  const ext = /(?:\.([^.]+))?$/.exec(fileName)[1];
  return ext && ext.toLowerCase();
}

/**
 * Validate file size
 * @param file {object}
 * @returns {string|null}
 */
function fileSizeValidator(file){
  return (file.size / 1024 > uploadedFileSizeLimit*1024) ? fileSizeValidationError : null;
}

/**
 * Validate file type
 * @param file {object}
 * @returns {string|null}
 */
function fileTypeValidator(file){
  const fileExt = getFileExtention(file.name);
  if(!fileExt) return fileTypeValidationError;
  const isMatch = forbiddenFileExtentions.some(ext => ext.test(fileExt));
  return isMatch ? fileTypeValidationError : null;
}


/**
 * Get the destination to save the file
 * @param dir {string}
 * @returns {string}
 */
function getDest(dir){
  const folderName = String(Math.floor((new Date().getTime()/1000)/(3600*24))); // get the folder created at last 1 day
  const newDir = path.join(dir, folderName);
  if (!fs.existsSync(newDir)){
    fs.mkdirSync(newDir);
  }
  return folderName;
}

module.exports = {
  fileSizeValidator,
  fileTypeValidator,
  getFileExtention,
  getDest
};


