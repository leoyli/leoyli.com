const { _fn } = require('./methods');
const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy');



function checkNativeBrand(obj, name) {
    if (name) return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === name.toLowerCase();
    else return Object.prototype.toString.call(obj).slice(8, -1);
}


function cloneDeepObject(obj) {
    return mergeDeepObject({}, obj, { mutate: true });
}


function mergeDeepObject(target, source, { mutate } = {}) {
    function mergeRecursion(obj, source) {
        for(const key in source) if (source.hasOwnProperty(key) && checkNativeBrand(source[key], 'object')) {
            if (!obj.hasOwnProperty(key)) obj[key] = {};
            mergeRecursion(obj[key], source[key]);
        } else obj[key] = source[key];
    }

    const obj = ( mutate === true ) ? target : cloneDeepObject(target);
    mergeRecursion(obj, source);
    return obj;
}


function assignDeepObject(target, path, value, { mutate } = {}) {
    function assignRecursion(obj, path, value) {
        const keys = checkNativeBrand(path, 'string') ? _fn.string.parseNestKey(path) : path;
        if (keys.length !== 1) assignRecursion(obj[keys[0]] ? obj[keys[0]] : (obj[keys[0]] = {}), keys.slice(1), value);
        else obj[keys[0]] = value ? value : {};
    }

    const obj = ( mutate === true ) ? target : cloneDeepObject(target);
    assignRecursion(obj, path, value);
    return obj;
}


function getUploadPath(parser) {                // note: this function can only be called once in a stream
    const fireTime = new Date();
    const dirIndex = fireTime.getUTCFullYear() + `0${fireTime.getUTCMonth()+1}`.slice(-2);
    const fileBase = fireTime.getTime() + path.extname(parser.fileName);
    return path.join(__dirname + '/../..', 'public', 'media', dirIndex, fileBase);
}


function uploadFile(parser) {
    parser.stream.pipe(fs.createWriteStream(parser.filePath).on('error', err => {
        if (err && !(err.code === 'ENOENT')) throw err;
        fs.mkdir(path.dirname(parser.filePath), err => {
            if (err) throw Error(`Errors in creating ${path.dirname(parser.filePath)}:\n${err.toString()}`);
            parser.stream.pipe(fs.createWriteStream(parser.filePath));
        });
    }));
}


function checkPermission(parser, configs) {
    return !(!parser.fileName || configs.MIME.indexOf(parser.MIME) === -1 || parser.stream.truncated);
}


function getRawDoc(parser, configs) {
    if (checkPermission(parser, configs)) return assignDeepObject({}, parser.fieldName,
        { fileType: path.extname(parser.fileName), filePath: parser.filePath });
    else return assignDeepObject({}, _fn.string.parseNestKey(parser.fieldName)[0], { isSkipped: true });
}


function getNotice(parser, configs) {
    const messenger = [];
    if (!parser.fileName) {
        messenger.push(`No Files was found on ${parser.fieldName}...`);
    } else if (configs.MIME.indexOf(parser.MIME) === -1) {
        messenger.push(`${parser.fileName} is an unsupported file types...`);
    } else if (parser.stream.truncated) {
        messenger.push(`${parser.fileName} is too large (> ${configs.fileSize/1048576})...`);
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
        mergeDeepObject(req.body.busboySlip.rawDoc, getRawDoc(parser, configs));
        req.body.busboySlip.notice.push(...getNotice(parser, configs));
    });
    checkPermission(parser, configs) ? uploadFile(parser) : parser.stream.resume();
}


function fieldParser(req, res, configs, args) {
    const parser = { fieldName: args[0], value: _fn.string.escapeInHTML(args[1]), truncatedName: args[2],
        truncatedValue: args[3], encoding: args[4], MIME: args[5] };
    if (parser.value) assignDeepObject(req.body.busboySlip.rawDoc, parser.fieldName, parser.value, { mutate: true });
}


function finishUpload(req, res, next) {
    req.body.busboySlip.rawDoc = Object.values(req.body.busboySlip.rawDoc).filter(obj => obj.isSkipped !== true);
    return next();
}


function uploadController(req, res, configs, next) {
    req.body.busboySlip = { rawDoc: {}, notice: [] };
    if (!configs.fileSize) configs.fileSize = 25 * 1048576;
    if (!configs.MIME) configs.MIME = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    return req.pipe(new Busboy({ headers: req.headers, limits: configs })
        .on('file'  , (...args) => fileParser(req, res, configs, args))
        .on('field' , (...args) => fieldParser(req, res, configs, args))
        .on('finish', ()        => finishUpload(req, res, next)));
}



// exports
module.exports = uploadController;
