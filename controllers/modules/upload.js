const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');



// modules
const { _U_ } = require('../utilities/');



// components
/**
 * check the current status of permission/condition
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @param {object} configs                  - object contains the key as criteria
 * @return {boolean}                        - action passed(true) / blocked(false)
 */
const checkStatus = (parser, configs) => {
  return !(!parser.fileName || !configs.MIME.includes(parser.MIME) || parser.stream.truncated);
};


/**
 * generate an path from the executing time                                                                             // note: can only be called once in a stream
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @param {string} __UPLOAD_ROOT__          - upload path set by `app.set('upload')`
 * @return {string}                         - upload path
 */
const getUploadPath = (parser, __UPLOAD_ROOT__) => {
  const fireTime = new Date();
  const dirIndex = fireTime.getUTCFullYear() + `0${fireTime.getUTCMonth() + 1}`.slice(-2);
  const fileBase = fireTime.getTime() + path.extname(parser.fileName);
  return path.join(__UPLOAD_ROOT__, dirIndex, fileBase);
};


/**
 * pipe the writable stream to upload the file
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @return {undefined}                      - the uploaded file is not returned
 */
const uploadFile = (parser) => {
  parser.stream.pipe(fs.createWriteStream(parser.filePath).on('error', err => {
    if (err && !(err.code === 'ENOENT')) throw new _U_.error.ServerError(err);
    fs.mkdir(path.dirname(parser.filePath), err => {
      if (err) throw new _U_.error.ServerError(92001, `${path.dirname(parser.filePath)}\n${err.toString()}`);
      parser.stream.pipe(fs.createWriteStream(parser.filePath));
    });
  }));
};


/**
 * transpile the raw document of media from parser
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @param {object} configs                  - configurations for passing
 * @return {object}                         - data to be populated later
 */
const transpileRaw = (parser, configs) => {
  if (checkStatus(parser, configs)) return _U_.object.assignDeep({}, parser.fieldName,
    { type: path.extname(parser.fileName), path: parser.filePath, name: path.basename(parser.filePath) });
  return _U_.object.assignDeep({}, _U_.string.readObjPath(parser.fieldName)[0], { isSkipped: true });
};


/**
 * transpile the raw document of media from parser
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @param {object} configs                  - object contains the key as criteria
 * @return {object}                         - data to be populated later
 */
const transpileMes = (parser, configs) => {
  const messenger = [];
  if (!parser.fileName) messenger.push(`No Files was found on ${parser.fieldName}...`);                                 // tofix: centralized message; only display when upload = 0
  else if (!configs.MIME.includes(parser.MIME)) messenger.push(`types of '${parser.fileName}' is not supported.`);
  else if (parser.stream.truncated) {
    messenger.push(`${parser.fileName} is too large (> ${configs.fileSize/1048576} MB)...`);
    fs.unlink(parser.filePath, err => {
      if (err) throw new _U_.error.ServerError(92002, err.toString());
    });
  }
  return messenger;
};



// workers
const fileParser = (req, res, configs, args) => {
  const { 0: fieldName, 1: stream, 2: fileName, 3: encoding, 4: MIME } = args;
  const parser = { fieldName, stream, fileName, encoding, MIME };
  parser.filePath = getUploadPath(parser, req.app.get('upload'));
  parser.settings = configs;
  parser.stream.on('end', () => {
    _U_.object.mergeDeep(req.body.busboySlip.raw, transpileRaw(parser, configs), { mutate: true });
    req.body.busboySlip.mes.push(...transpileMes(parser, configs));
  });
  checkStatus(parser, configs) ? uploadFile(parser) : parser.stream.resume();
};


const fieldParser = (req, res, configs, args) => {
  const { 0: fieldName, 1: value, 2: truncatedName, 3: truncatedValue, 4: encoding, 5: MIME } = args;
  if (value) _U_.object.assignDeep(req.body.busboySlip.raw, fieldName, _U_.string.toEscapedChars(value), { mutate: true });
};


const finishExport = (req, res, configs, next) => {
  req.body.busboySlip.raw = Object.values(req.body.busboySlip.raw).filter(obj => obj.isSkipped !== true);
  return next();
};



// middleware
const uploadController = (configs) => function uploadController(req, res, next) {
  req.body.busboySlip = { raw: {}, mes: [] };
  if (!configs.fileSize) configs.fileSize = 25 * 1048576;
  if (!configs.MIME) configs.MIME = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
  return req.pipe(new Busboy({ headers: req.headers, limits: configs })
    .on('file'  , (...args) => fileParser(req, res, configs, args))
    .on('field' , (...args) => fieldParser(req, res, configs, args))
    .on('finish', ()        => finishExport(req, res, configs, next)));
};



// exports
module.exports = { uploadController, _test: {
    checkStatus,
    getUploadPath,
    uploadFile,
    transpileRaw,
    transpileMes,
  },
};
