const fs = require('fs');
const path = require('path');


// modules
const { _U_ } = require('../../../utilities/');


// helpers
/**
 * compose the upload path and saving file name                                                                         // note: can only be called once in a stream
 * @param {object} pathBase                 - default path
 * @param {object} fileName                 - original filename
 * @return {string}                         - file saving path
 */
const getSavingPath = (pathBase, fileName) => {
  const fireTime = new Date(Date.now());
  const filePath = fireTime.getUTCFullYear() + `0${fireTime.getUTCMonth() + 1}`.slice(-2);
  const uniqueName = fireTime.getTime() + path.extname(fileName);
  return path.join(pathBase, filePath, uniqueName);
};


/**
 * check if the file is uploadable
 * @param {object} task                     - busboy emitted arguments
 * @param {object} configs                  - upload configurations
 * @return {boolean}                        - uploadable(true) / in-uploadable(false)
 */
const isUploadable = (task, configs) => {
  return !(!task.fileName || !configs.MIME.includes(task.MIME) || task.stream.truncated);
};


/**
 * parse to give a raw document
 * @param {object} task                     - busboy emitted arguments
 * @param {object} configs                  - upload configurations
 * @return {object}                         - parsed document to be merged
 */
const fetchRawDoc = (task, configs) => {
  if (isUploadable(task, configs)) {
    const pathParser = path.parse(task.filePath);
    const doc = { ext: pathParser.ext.slice(1), path: task.filePath, name: pathParser.base };
    return _U_.object.assignDeep({}, task.fieldName, doc);
  }
  return _U_.object.assignDeep({}, _U_.string.parseObjPath(task.fieldName)[0], { isSkipped: true });
};


/**
 * parse to stack messages
 * @param {object} task                     - busboy emitted arguments
 * @param {object} configs                  - received configurations
 * @return {string}                         - message to be stacked
 */
const fetchMessage = (task, configs) => {
  const { stream, fileName, MIME } = task;
  if (!fileName) return 'No files were uploaded.';                                                                      // tofix: centralized message; only display when upload = 0
  if (!configs.MIME.includes(MIME)) return `"${fileName}" is in a unsupported file type.`;
  if (stream.truncated) return `"${fileName}" exceed the file size limit (${configs.fileSize / 1000000}MB).`;
  return '';
};


/**
 * pipe the busboy readable stream with fs writable stream to upload the file
 * @param {object} task                     - busboy emitted arguments
 */
const upload = (task) => {
  const { stream, filePath } = task;
  const fileStream = () => fs.createWriteStream(filePath).on('error', err => {
    if (err && err.code !== 'ENOENT') stream.emit('error', new _U_.error.ServerError(err));
    else if (err) stream.emit('mkdir', path.dirname(filePath));
  });
  stream.on('mkdir', directory => fs.mkdir(directory, err => {
    if (err) stream.emit('error', new _U_.error.ServerError(92001, `${directory}\n${err.toString()}`));
    else stream.pipe(fileStream());
  }));
  stream.pipe(fileStream());
};


// exports
module.exports = {
  getSavingPath,
  isUploadable,
  fetchRawDoc,
  fetchMessage,
  upload,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
