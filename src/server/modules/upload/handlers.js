const fs = require('fs');


// modules
const { _U_ } = require('../../utilities');
const { getSavingPath, isUploadable, fetchRawDoc, fetchMessage, upload } = require('./helpers');


// handlers
/**
 * handle `file` event emitted by busboy
 * @param slip                              - document population pool
 * @param {object} configs                  - upload configurations
 */
const handleOnFile = function handleOnFile(slip, configs) {
  return (fieldName, stream, fileName, encoding, MIME) => {
    const task = { fieldName, stream, fileName, encoding, MIME, filePath: getSavingPath(configs.pathBase, fileName) };
    const busboy = this;
    stream.on('error', err => busboy.emit('error', err));
    stream.on('end', () => {
      // update slip
      _U_.object.mergeDeep(slip.raw, fetchRawDoc(task, configs), { mutate: true });
      slip.mes.add(fetchMessage(task, configs));

      // cleanup debris
      if (stream.truncated) fs.unlink(task.filePath, err => (err ? stream.emit('error', err) : undefined));
    });

    // stream
    return (isUploadable(task, configs)) ? upload(task) : stream.resume();                                              // note: both function will emit 'end' event at the end
  };
};


/**
 * handle `field` event emitted by busboy
 * @param slip                              - document population pool
 * @param {object} configs                  - upload configurations
 */
const handleOnField = function handleOnField(slip, configs) {
  return (fieldName, value, truncatedName, truncatedValue, encoding, MIME) => {
    if (value) _U_.object.assignDeep(slip.raw, fieldName, _U_.string.toEscapedChars(value), { mutate: true });
  };
};


/**
 * (middleware) handle `finish` event emitted by busboy
 * @param slip                              - document population pool
 */
const handleOnFinish = (slip) => function handleOnBusboySlip(req, res, next) {
  req.body.busboySlip = {
    raw: Object.values(slip.raw).filter(obj => obj.isSkipped !== true),
    mes: [...slip.mes],
  };
  return next();
};


// exports
module.exports = {
  handleOnFile,
  handleOnField,
  handleOnFinish,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
