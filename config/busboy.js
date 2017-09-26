const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy');



//uploader configurations
function ImgUploadByBusboy (req, res, limits, next) {
    // initialization
    const busboy = new Busboy({headers: req.headers, limits : limits});
    const supportedType = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    const filePath = path.join(__dirname + '/..', 'public', 'images');
    const mediaCollector = {};

    // message handler
    const message = {
        infoSucceed     : count => req.flash('info', count + ' File(s) successfully uploaded!'),
        errorUnaccepted : ()    => req.flash('error', 'There were unaccepted file types!'),
        errorOversizing : size  => req.flash('error', 'Some failed in oversizing! (> ' + size/1048576 + ' MB)'),
        errorUnexpected : ()    => req.flash('error', 'Unexpected occurred!')
    };

    // pipe busboy
    req.pipe(busboy);


    // BUSBOY-LISTENER: parse 'file' inputs
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // path structure
        const saveTime = new Date();
        const saveName = saveTime.getTime() + path.extname(filename);
        const saveNest = saveTime.getUTCFullYear() + ('0' + (saveTime.getUTCMonth()+1)).slice(-2);
        const savePath = filePath + '/' + saveNest + '/' + saveName;

        // validations
        const isProvided = filename !== '';
        const isAccepted = supportedType.indexOf(mimetype) !== -1;

        // stream switch
        const $prompt = isProvided && isAccepted ? _insuredFStream(savePath, file, message) : file.resume();
        // note: pseudo($) prompt: action is fired when 'value' as a function being executing for a return


        // FILE-LISTENER: end (completed/terminated)
        file.on('end', function () {
            // nested property assignments
            const properties = _propertyReference(fieldname);
            _updateByNestedProperty(mediaCollector, properties, {path: savePath, filename: saveName});

            // if limited
            if (!isProvided || !isAccepted || file.truncated) mediaCollector[properties[0]]['_ignore'] = true;
            if (!isProvided) return;
            if (!isAccepted) return message.errorUnaccepted();
            if (file.truncated) {
                // note: should no error occurred since 'file.pipe()' have finished then get this 'end' event
                fs.unlink(savePath, err => {if (err) return message.errorUnexpected()});
                message.errorOversizing(limits.fileSize);
            }
        });
    });


    // BUSBOY-LISTENER: parse 'field' inputs
    busboy.on('field', function (fieldname, val) {
        if (val) _updateByNestedProperty(mediaCollector, _propertyReference(fieldname), val);
    });


    // BUSBOY-LISTENER: event finished
    busboy.on('finish', function() {
        // remove all sub-collectors (the top-level keys)
        // *** (ECMAScript 2017+ || 2015) ***
        Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));
        const mediaArray = Object.values(mediaCollector).filter(obj => obj._ignore !== true);
        if (mediaArray.length > 0) message.infoSucceed(mediaArray.length);
        next(mediaArray);
    });
}


// extracted functions
function _propertyReference(source) {
    return source.split(/[[\]]/).filter(frag => frag !== '');
}

function _updateByNestedProperty(obj, referenceKeys, bottomValue, index) {
    if (!index) index = 0;
    if (index < referenceKeys.length-1) {
        let _extendedObj = obj[referenceKeys[index]] ? obj[referenceKeys[index]] : (obj[referenceKeys[index]] = {});
        return _updateByNestedProperty(_extendedObj, referenceKeys, bottomValue, ++index);
    } else obj[referenceKeys[index]] = bottomValue ? bottomValue : {};
}

function _insuredFStream(savePath, file, message) {
    fs.mkdir(path.dirname(savePath), function (err) {
        // only catch errors other than 'EEXIST'
        if (err && !(err.code === 'EEXIST')) {
            message.errorUnexpected();
            return file.resume();
        } else file.pipe(fs.createWriteStream(savePath));
    });
}



// function exports
module.exports = ImgUploadByBusboy;