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
        errorUnsupported: ()    => req.flash('error', 'There were unsupported file types!'),
        errorOversizing : size  => req.flash('error', 'Some failed in oversizing! (> ' + size/1048576 + ' MB)')
    };

    // pipe busboy
    req.pipe(busboy);


    // BUSBOY-LISTENER: parse 'file' inputs
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // saving path
        const saveTime = new Date();
        const saveName = saveTime.getTime() + path.extname(filename);
        const savePath = filePath + '/'; // todo: + saveTime.getUTCFullYear() + '/' + saveTime.getUTCMonth() + '/'

        // validations
        const isProvided = filename !== '';
        const isAccepted = supportedType.indexOf(mimetype) !== -1;

        // file saving as 1) filename provided; 2) MEME types supported
        const $prompt = isProvided && isAccepted ? file.pipe(fs.createWriteStream(savePath + saveName)) : file.resume();
        // note: pseudo($) prompt: action is fired when 'value' as a function being executing for a return

        // FILE-LISTENER: end (completed/terminated)
        file.on('end', function () {
            const properties = _propertyList(fieldname);
            _updateByNestedProperty(mediaCollector, properties, {path: savePath, filename: saveName});

            // if limited
            if (!isProvided || !isAccepted || file.truncated) mediaCollector[properties[0]]['_ignore'] = true;
            if (!isProvided) return;
            if (!isAccepted) return message.errorUnsupported();
            if (file.truncated) {
                if (fs.exists(savePath)) fs.unlink(savePath); // todo: remove 'fs.exits' and handle errors if unfound
                return message.errorOversizing(limits.fileSize);
            }
        });
    });


    // BUSBOY-LISTENER: parse 'field' inputs
    busboy.on('field', function (fieldname, val) {
        if (val) return _updateByNestedProperty(mediaCollector, _propertyList(fieldname), val);
    });


    // BUSBOY-LISTENER: event finished
    busboy.on('finish', function() {
        // remove all sub-collectors (stored as top-keys in mediaCollector)
        // *** (ECMAScript 2017+ || 2015) ***
        Object.values = Object.values || (obj => Object.keys(obj).map(key => obj[key]));
        const mediaArray = Object.values(mediaCollector).filter(obj => obj._ignore !== true);
        if (mediaArray.length > 0) message.infoSucceed(mediaArray.length);
        return next(mediaArray); // todo: errors collecting and passing
    });
}


function _propertyList(expression) {
    return expression.split(/[[\]]/).filter(frag => frag !== '');
}


function _updateByNestedProperty(obj, cascadedKeys, bottomValue, index) {
    if (!index) index = 0;
    if (index < cascadedKeys.length-1) {
        let _extendedObj = obj[cascadedKeys[index]] ? obj[cascadedKeys[index]] : (obj[cascadedKeys[index]] = {});
        return _updateByNestedProperty(_extendedObj, cascadedKeys, bottomValue, ++index);
    } else obj[cascadedKeys[index]] = bottomValue ? bottomValue : {};
}



// function exports
module.exports = ImgUploadByBusboy;
