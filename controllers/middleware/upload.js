const { _fn } = require('../helpers');
const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy');


/**
 * check the current status of permission/condition
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @param {object} configs                  - object contains the key as criteria
 * @return {boolean}                        - action passed(true) / blocked(false)
 */
function checkStatus(parser, configs) {
    return !(!parser.fileName || configs.MIME.indexOf(parser.MIME) === -1 || parser.stream.truncated);
}


/**
 * generate an path from the executing time // note: can only be called once in a stream
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @return {string}                         - upload path
 */
function getUploadPath(parser) {
    const fireTime = new Date();
    const dirIndex = fireTime.getUTCFullYear() + `0${fireTime.getUTCMonth()+1}`.slice(-2);
    const fileBase = fireTime.getTime() + path.extname(parser.fileName);
    return path.join(__dirname + '/../..', 'public', 'media', dirIndex, fileBase);
}


/**
 * pipe the writable stream to upload the file
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @return {undefined}                      - the uploaded file is not returned
 */
function uploadFile(parser) {
    parser.stream.pipe(fs.createWriteStream(parser.filePath).on('error', err => {
        if (err && !(err.code === 'ENOENT')) throw err;
        fs.mkdir(path.dirname(parser.filePath), err => {
            if (err) throw Error(`Errors in creating ${path.dirname(parser.filePath)}:\n${err.toString()}`);
            parser.stream.pipe(fs.createWriteStream(parser.filePath));
        });
    }));
}


/**
 * transpile the raw document of media from parser
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @param {object} configs                  - configurations for passing
 * @return {object}                         - data to be populated later
 */
function transpileRaw(parser, configs) {
    if (checkStatus(parser, configs)) return _fn.object.assignDeep({}, parser.fieldName,
        { type: path.extname(parser.fileName), path: parser.filePath, name: path.basename(parser.filePath) });
    else return _fn.object.assignDeep({}, _fn.string.parseNestKey(parser.fieldName)[0], { isSkipped: true });
}


/**
 * transpile the raw document of media from parser
 * @param {object} parser                   - busboy emitted referencing object from a file listener
 * @param {object} configs                  - object contains the key as criteria
 * @return {object}                         - data to be populated later
 */
function transpileMes(parser, configs) {
    const messenger = [];
    if (!parser.fileName) {
        messenger.push(`No Files was found on ${parser.fieldName}...`);
    } else if (configs.MIME.indexOf(parser.MIME) === -1) {
        messenger.push(`${parser.fileName} is an unsupported file types...`);
    } else if (parser.stream.truncated) {
        messenger.push(`${parser.fileName} is too large (> ${configs.fileSize/1048576} MB)...`);
        fs.unlink(parser.filePath, err => {
            if (err) throw new Error(`Failed to clean up the truncated file...\n${err.toString()}`);
        });
    } return messenger;
}


// middleware
function fileParser(req, res, configs, args) {
    const parser = { fieldName: args[0], stream: args[1], fileName: args[2], encoding: args[3], MIME: args[4] };
    parser.filePath = getUploadPath(parser);
    parser.settings = configs;
    parser.stream.on('end', () => {
        _fn.object.mergeDeep(req.body.busboySlip.raw, transpileRaw(parser, configs));
        req.body.busboySlip.mes.push(...transpileMes(parser, configs));
    });
    checkStatus(parser, configs) ? uploadFile(parser) : parser.stream.resume();
}


function fieldParser(req, res, configs, args) {
    const parser = { fieldName: args[0], value: _fn.string.escapeInHTML(args[1]), truncatedName: args[2],
        truncatedValue: args[3], encoding: args[4], MIME: args[5] };
    if (parser.value) _fn.object.assignDeep(req.body.busboySlip.raw, parser.fieldName, parser.value, { mutate: true });
}


function finishUpload(req, res, configs, next) {
    req.body.busboySlip.raw = Object.values(req.body.busboySlip.raw).filter(obj => obj.isSkipped !== true);
    return next();
}


function uploadController(req, res, configs, next) {
    req.body.busboySlip = { raw: {}, mes: [] };
    if (!configs.fileSize) configs.fileSize = 25 * 1048576;
    if (!configs.MIME) configs.MIME = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    return req.pipe(new Busboy({ headers: req.headers, limits: configs })
        .on('file'  , (...args) => fileParser(req, res, configs, args))
        .on('field' , (...args) => fieldParser(req, res, configs, args))
        .on('finish', ()        => finishUpload(req, res, configs, next)));
}



// exports
module.exports = { uploadController, _test: { checkStatus, getUploadPath, uploadFile, transpileRaw ,transpileMes }};
