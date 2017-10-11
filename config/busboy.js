const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy');



//uploader configurations
function ImgUploadByBusboy (req, res, limits, next) {
    // initialization
    const notice = new ClientNoticeHandler(req);
    const busboy = new Busboy({headers: req.headers, limits : limits});
    const saveRoot = path.join(__dirname + '/..', 'public', 'media');
    const acceptedTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    const contentParser = {};


    // BUSBOY-LISTENER: parse 'file' inputs
    busboy.on('file', (fieldName, file, fileName, encoding, MIMEType) => {
        // path structure
        const taskTime = new Date();
        const saveNest = taskTime.getUTCFullYear() + `0${taskTime.getUTCMonth()+1}`.slice(-2);
        const saveName = taskTime.getTime() + path.extname(fileName);
        const filePath = saveRoot + '/' + saveNest + '/' + saveName;

        // validations
        const isProvided = fileName !== '';
        const isAccepted = acceptedTypes.indexOf(MIMEType) !== -1;

        // file streaming
        const $prompt = isProvided && isAccepted ? _insuredFStream(filePath, file) : file.resume();
        // note: pseudo($) prompt: action is fired when 'value' as a function being executing for a return


        // FILE-LISTENER: end (completed/terminated)
        file.on('end', () => {
            // nested property assignments
            const properties = _propertyReference(fieldName);
            _updateByNestedProperty(contentParser, properties, {path: filePath, fileName: saveName});

            // if limited
            if (!isProvided || !isAccepted || file.truncated) contentParser[properties[0]]['_toIgnore'] = true;
            if (!isProvided) return;
            if (!isAccepted) return notice.errorUnaccepted();
            if (file.truncated) {
                try {
                    fs.unlink(filePath);
                    notice.errorOversizing(limits.fileSize);
                } catch (err) {
                    throw new Error(`Failed in deleting truncated file: ('${filePath}'):\n${err.toString()}`);
                }
            }
        });
    });


    // BUSBOY-LISTENER: parse 'field' inputs
    busboy.on('field', (fieldName, val) => {
        if (val) _updateByNestedProperty(contentParser, _propertyReference(fieldName), req.sanitize(val));
    });


    // BUSBOY-LISTENER: event finished
    busboy.on('finish', () => {
        // remove all sub-collectors (the top-level keys)
        const mediaArray = Object.values(contentParser).filter(obj => obj._toIgnore !== true);
        if (mediaArray.length > 0) notice.infoSucceed(mediaArray.length);
        next(null, mediaArray);
    });


    // ACTIVATION: pipe busboy
    req.pipe(busboy);
}


// extracted functions
function _propertyReference(source) {
    return source.split(/[[\]]/).filter(frag => frag !== '');
}

function _updateByNestedProperty(obj, referenceKeys, bottomValue, index) {
    if (!index) index = 0;
    if (index < referenceKeys.length-1) {
        const _extendedObj = obj[referenceKeys[index]] ? obj[referenceKeys[index]] : (obj[referenceKeys[index]] = {});
        return _updateByNestedProperty(_extendedObj, referenceKeys, bottomValue, ++index);
    } else obj[referenceKeys[index]] = bottomValue ? bottomValue : {};
}

function _insuredFStream(filePath, file) {
    try {
        fs.mkdir(path.dirname(filePath), err => {
            if (err && !(err.code === 'EEXIST')) {
                throw new Error(`Failed in creating directory: ('${path.dirname(filePath)}'):\n${err.toString()}`);
            } else file.pipe(fs.createWriteStream(filePath));
        });
    } catch (err) {
        throw new Error(`Failed in the file stream: ('${filePath}'):\n${err.toString()}`);
    }
}


// client notice handler
function ClientNoticeHandler(req) {
    this.errorUnaccepted = ()    => req.flash('error', `There were unaccepted file types!`);
    this.errorOversizing = size  => req.flash('error', `Some failed in oversizing! (> ${size/1048576} MB)`);
    this.infoSucceed     = count => req.flash('info' , `${count} File(s) successfully uploaded!`);
}



// function exports
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
