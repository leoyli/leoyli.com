const Busboy = require('busboy');


// helpers
const { handleOnFile, handleOnField, handleOnFinish } = require('./handlers');


// middleware
/**
 * (factory) handle/parse multipart upload by stream
 * @param setting
 */
const handleStreamUpload = (setting = {}) => function uploadController(req, res, next) {
  const slip = { raw: {}, mes: new Set() };
  const configs = {
    ...setting,
    pathBase: req.app.get('upload'),
    fileSize: setting.fileSize ? setting.fileSize : (25 * 1000000),                                                     // tofix: use default value (from env)
    MIME: setting.MIME ? setting.MIME : ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'],      // tofix: use default value (from env)
  };
  const busboy = new Busboy({ headers: req.headers, limits: configs });
  req.pipe(busboy
    .on('file', handleOnFile.bind(busboy)(slip, configs))
    .on('field', handleOnField.bind(busboy)(slip, configs))
    .on('finish', () => handleOnFinish(slip)(req, res, next))
    .on('error', err => {
      if (err) {
        busboy.removeAllListeners();
        return next(err); // note: only receive an unexpected server error
      }
    }));
};


// exports
module.exports = {
  handleStreamUpload,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
