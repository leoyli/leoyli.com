const fs = require('fs');
const path = require('path');
const domain = require('domain');                                                                                       // tofix: 'domain' is deprecated, may try `async_hook` to fix it
const Busboy = require('busboy');


// modules
const { _U_ } = require('../utilities/');


// components
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
 * @param {object} busboy                   - busboy emitted object
 * @param {object} configs                  - object contains the key as criteria
 * @return {boolean}                        - action passed(true) / blocked(false)
 */
const isUploadable = (busboy, configs) => {
  return !(!busboy.fileName || !configs.MIME.includes(busboy.MIME) || busboy.stream.truncated);
};


/**
 * parse to give a raw document
 * @param {object} busboy                   - busboy emitted object
 * @param {object} configs                  - received configurations
 * @return {object}                         - document to be merged
 */
const fetchRawDoc = (busboy, configs) => {
  if (isUploadable(busboy, configs)) {
    const pathParser = path.parse(busboy.filePath);
    const doc = { ext: pathParser.ext.slice(1), path: busboy.filePath, name: pathParser.base };
    return _U_.object.assignDeep({}, busboy.fieldName, doc);
  }
  return _U_.object.assignDeep({}, _U_.string.parseObjPath(busboy.fieldName)[0], { isSkipped: true });
};


/**
 * parse to stack messages
 * @param {object} busboy                   - busboy emitted object
 * @param {object} configs                  - received configurations
 * @return {string}                         - message to be stacked
 */
const fetchMessage = (busboy, configs) => {
  const { stream, fileName, MIME } = busboy;
  if (!fileName) return 'No files were uploaded.';                                                                      // tofix: centralized message; only display when upload = 0
  if (!configs.MIME.includes(MIME)) return `"${fileName}" is in a unsupported file type.`;
  if (stream.truncated) return `"${fileName}" exceed the file size limit (${configs.fileSize / 1000000}MB).`;
  return '';
};


/**
 * pipe the busboy readable stream with fs writable stream to upload the file
 * @param {object} busboy                   - busboy emitted object
 * @return {undefined}                      - the uploaded file is not returned
 */
const upload = (busboy) => {
  busboy.stream.pipe(fs.createWriteStream(busboy.filePath).on('error', streamError => {
    if (streamError && !(streamError.code === 'ENOENT')) throw new _U_.error.ServerError(streamError);
    fs.mkdir(path.dirname(busboy.filePath), fsError => {
      if (fsError) throw new _U_.error.ServerError(92001, `${path.dirname(busboy.filePath)}\n${fsError.toString()}`);
      busboy.stream.pipe(fs.createWriteStream(busboy.filePath));
    });
  }));
};


// events
const busboyOnFile = (slip, configs, args) => {
  const [fieldName, stream, fileName, encoding, MIME] = args;
  const busboy = { fieldName, stream, fileName, encoding, MIME };
  busboy.filePath = getSavingPath(configs.pathBase, fileName);
  stream.upload = upload;
  stream.on('end', () => {
    // update slip
    _U_.object.mergeDeep(slip.raw, fetchRawDoc(busboy, configs), { mutate: true });
    slip.mes.add(fetchMessage(busboy, configs));

    // cleanup debris
    if (stream.truncated) {
      fs.unlink(busboy.filePath, err => {
        if (err) throw new _U_.error.ServerError(92002, err.toString());
      });
    }
  });

  // stream
  return (isUploadable(busboy, configs)) ? stream.upload(busboy) : stream.resume();                                     // note: both function will emit 'end' event at the end
};


const busboyOnField = (slip, configs, args) => {
  const [fieldName, value, truncatedName, truncatedValue, encoding, MIME] = args;
  if (value) _U_.object.assignDeep(slip.raw, fieldName, _U_.string.toEscapedChars(value), { mutate: true });
};


// middleware
const parseMultipart = (setting) => function uploadController(req, res, next) {
  const slip = { raw: {}, mes: new Set() };
  const configs = {
    ...setting,
    pathBase: req.app.get('upload'),
    fileSize: setting.fileSize ? setting.fileSize : (25 * 1000000),                                                     // tofix: use default value (from env)
    MIME: setting.MIME ? setting.MIME : ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'],      // tofix: use default value (from env)
  };
  const reqPipeDomain = domain.create();
  reqPipeDomain.on('error', next);
  reqPipeDomain.run(() => req.pipe(new Busboy({ headers: req.headers, limits: configs })
    .on('file', (...args) => busboyOnFile(slip, configs, args))
    .on('field', (...args) => busboyOnField(slip, configs, args))
    .on('finish', () => {
      req.body.busboySlip = {
        raw: Object.values(slip.raw).filter(obj => obj.isSkipped !== true),
        mes: [...slip.mes],
      };
      return next();
    })));
};


// exports
module.exports = {
  parseMultipart,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    getSavingPath,
    isUploadable,
    fetchRawDoc,
    fetchMessage,
    upload,
    ...module.exports,
  },
});
