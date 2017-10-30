const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy');



//uploader configurations
function ImgUploadByBusboy (req, res, limits, next) {
    // initialization
    const notice = new ClientNoticeHandler(req);
    const busboy = new Busboy({headers: req.headers, limits : limits});
    const populator = {};


    // BUSBOY-LISTENER: parse 'file' inputs
    busboy.on('file', (fieldName, file, fileName, encoding, MIMEType) => {
        const branch = new FileStreamBranch(fileName, MIMEType);

        if (branch.isAttached && branch.isAccepted) {
            file.pipe(fs.createWriteStream(branch.fullPath).on('error', err => {    // note: error handling by listener
                // handle all errors other than 'ENOENT'
                if (err && !(err.code === 'ENOENT')) throw err;

                // if sub-folder does not exist then attempt to create it
                fs.mkdir(path.dirname(branch.fullPath), err => {
                    if (err) throw Error(`Errors in creating ${path.dirname(branch.fullPath)}:\n${err.toString()}`);
                    file.pipe(fs.createWriteStream(branch.fullPath));
                });
            }));
        } else file.resume();


        // FILE-LISTENER: end (completed/terminated)
        file.on('end', () => {
            const properties = _propertyReference(fieldName);

            // exception handler
            if (!branch.isAttached || !branch.isAccepted || file.truncated) populator[properties[0]].isDiscarded = true;
            if (!branch.isAttached) return;
            if (!branch.isAccepted) return notice.errorUnaccepted();
            if (file.truncated) {
                return fs.unlink(branch.fullPath, err => {
                    if (err) {
                        throw new Error(`Errors in deleting: ('${branch.fullPath}', truncated):\n${err.toString()}`);
                    } else notice.errorOversizing(limits.fileSize);
                });
            }

            // if no exceptions
            _updateByNestedProperty(populator, properties, {
                fileType: path.extname(branch.fileBase),
                fileBase: branch.fileBase,
                fullPath: branch.fullPath,
            });
        });
    });


    // BUSBOY-LISTENER: parse 'field' inputs
    busboy.on('field', (fieldName, val) => {
        if (val) _updateByNestedProperty(populator, _propertyReference(fieldName), req.sanitize(val));
    });


    // BUSBOY-LISTENER: event finished
    busboy.on('finish', () => {
        // remove all sub-collectors (the top-level keys)
        const mediaArray = Object.values(populator).filter(obj => obj.isDiscarded !== true);
        if (mediaArray.length > 0) notice.infoSucceed(mediaArray.length);
        next(null, mediaArray);
    });


    // ACTIVATION: pipe busboy
    req.pipe(busboy);
}


// extracted functions
function _propertyReference(source) {
    if (!source || /[^a-zA-Z0-9._$\[\]]/g.test(source)) {
        throw new SyntaxError('Field name cannot have special characters other than ".$[]".');
    } else return source.match(/[a-zA-Z0-9_$]+/g);
}

function _updateByNestedProperty(obj, referenceKeys, bottomValue, index) {
    if (!index) index = 0;
    if (index < referenceKeys.length-1) {
        const _extendedObj = obj[referenceKeys[index]] ? obj[referenceKeys[index]] : (obj[referenceKeys[index]] = {});
        return _updateByNestedProperty(_extendedObj, referenceKeys, bottomValue, ++index);
    } else obj[referenceKeys[index]] = bottomValue ? bottomValue : {};
}


// constructor
function ClientNoticeHandler(req) {
    this.errorUnaccepted = ()    => req.flash('error', `There were unaccepted file types!`);
    this.errorOversizing = size  => req.flash('error', `Some failed in oversizing! (> ${size/1048576} MB)`);
    this.infoSucceed     = count => req.flash('info' , `${count} File(s) successfully uploaded!`);
}

function FileStreamBranch(fileName, MIMEType) {
    // reference
    this.saveTime = new Date();
    this.pathName = this.saveTime.getUTCFullYear() + `0${this.saveTime.getUTCMonth()+1}`.slice(-2);
    this.fileBase = this.saveTime.getTime() + path.extname(fileName);
    this.fullPath = path.join(__dirname + '/..', 'public', 'media', this.pathName, this.fileBase);

    // validation   // todo: customize in accepting file types
    const acceptedTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    this.isAttached = fileName !== '';
    this.isAccepted = acceptedTypes.indexOf(MIMEType) !== -1;
}


// exports
function ImgUploadByBusboySwitch(req, res, limits, next) {
    if (typeof next === 'function') return ImgUploadByBusboy(req, res, limits, next);

    return new Promise((resolve, reject) => {
        ImgUploadByBusboy(req, res, limits, (err, docs) => {
            if (err) return reject(err);
            resolve(docs);
        });
    });
}

module.exports = ImgUploadByBusboySwitch;
