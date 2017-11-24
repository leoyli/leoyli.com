const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy'),
    _fn                     = require('./methods');



//uploader configurations
function ImgUploadByBusboy (req, res, limits, next) {
    const busboy = new Busboy({headers: req.headers, limits: limits});
    const notice = [];
    const populator = {};

    // BUSBOY-LISTENER: 'file' as in inputs
    busboy.on('file', (fieldName, file, fileName, encoding, MIMEType) => {
        const branch = new FileStreamBranch(fileName, MIMEType);

        if (branch.isAttached && branch.isAccepted) {
            file.pipe(fs.createWriteStream(branch.fullPath).on('error', err => {
                if (err && !(err.code === 'ENOENT')) throw err;

                // if 'ENOENT': create the folder then fire the stream again
                fs.mkdir(path.dirname(branch.fullPath), err => {
                    if (err) throw Error(`Errors fin creating ${path.dirname(branch.fullPath)}:\n${err.toString()}`);
                    file.pipe(fs.createWriteStream(branch.fullPath));
                });
            }));
        } else file.resume();

        // FILE-LISTENER: after file uploaded
        file.on('end', () => {
            if (branch.isAttached && branch.isAccepted && !file.truncated) {
                return _assignInNest(populator, _fn.string.parseNestKey(fieldName), {
                    fileType: path.extname(branch.fileBase),
                    fileBase: branch.fileBase,
                    fullPath: branch.fullPath,
                });
            } else populator[_fn.string.parseNestKey(fieldName)[0]] = {isSkipped: true};

            // exception handler
            if (branch.isAttached && !branch.isAccepted) return notice.push(`${fileName} is in unaccepted file types!`);
            if (file.truncated) return fs.unlink(branch.fullPath, err => {
                if (err) throw new Error(`Errors in deleting: ('${branch.fullPath}', truncated):\n${err.toString()}`);
                notice.push(`${fileName} is too large! (> ${limits.limits.fileSize / 1048576} MB)`);
            });
        });
    });

    // BUSBOY-LISTENER: 'field' as in inputs
    busboy.on('field', (fieldName, val) => {
            if (val) _assignInNest(populator, _fn.string.parseNestKey(fieldName), _fn.string.escapeInHTML(val));
        });

    // BUSBOY-LISTENER: after all streams resolved
    busboy.on('finish', () => {
        req.body.busboySlip = { raw: Object.values(populator).filter(obj => obj.isSkipped !== true), notice };
        next();
    });

    // ACTIVATION: pipe busboy
    req.pipe(busboy);
}


// constructor
function FileStreamBranch(fileName, MIMEType) {
    // structure
    this.saveTime = new Date();
    this.pathName = this.saveTime.getUTCFullYear() + `0${this.saveTime.getUTCMonth()+1}`.slice(-2);
    this.fileBase = this.saveTime.getTime() + path.extname(fileName);
    this.fullPath = path.join(__dirname + '/..', 'public', 'media', this.pathName, this.fileBase);

    // validation   // todo: customize in accepting file types
    const acceptedTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    this.isAttached = !!fileName;
    this.isAccepted = acceptedTypes.indexOf(MIMEType) !== -1;
}


// ancillary functions
function _assignInNest(obj, referenceKeys, bottomValue, index = 0) {
    if (index < referenceKeys.length-1) {
        const _extendedObj = obj[referenceKeys[index]] ? obj[referenceKeys[index]] : (obj[referenceKeys[index]] = {});
        return _assignInNest(_extendedObj, referenceKeys, bottomValue, ++index);
    } else obj[referenceKeys[index]] = bottomValue ? bottomValue : {};
}



// exports
module.exports = ImgUploadByBusboy;
