const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy'),
    MediaModel              = require('../models/media');



// uploader configurations // todo: extract (req, res) arguments; i.e. centralize flash messages
function busboyImgUploader (req, res, limits, next) {
    // initialization
    const busOptions = {headers: req.headers, limits : limits};
    const busboy = new Busboy(busOptions);
    const supportedType = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    const filePath = path.join(__dirname + '/..', 'public', 'images');

    // collectors
    let mediaCollector = {};

    // pipe busboy
    req.pipe(busboy);


    // BUSBOY-LISTENER: parse 'file' inputs
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // saving path
        const saveInName = Date.now() + path.extname(filename);
        const saveToPath = filePath + '/' + saveInName;
        // note: if set 'fs.createWriteStream()' as a variable here, it ends with an inexhaustible empty file

        // validations
        const isProvided = filename !== '';
        const isSupported = supportedType.indexOf(mimetype) !== -1;

        // file saving as 1) filename provided; 2) MEME types supported
        const $trigger = isProvided && isSupported ? file.pipe(fs.createWriteStream(saveToPath)) : file.resume();
        // note: pseudo($) trigger: action is fired when 'value' as a function being executing for a return

        // FILE-LISTENER: end (completed/terminated)
        file.on('end', function () {
            const properties = _propertyList(fieldname);
            _updateByNestedProperty(mediaCollector, properties, {path: saveToPath, filename: saveInName});

            // if limited
            if (!isProvided || !isSupported || file.truncated) mediaCollector[properties[0]]['_ignore'] = true;
            if (!isProvided) return;
            if (!isSupported) return req.flash('error', 'Some upload failed in unsupported file types!');
            if (file.truncated) {
                // note: 'fs.existsSync()' prevents the un-found crash
                if (fs.existsSync(saveToPath)) fs.unlink(saveToPath);
                return req.flash('error', 'Some upload failed in too big! (> ' + limits.fileSize/1048576 + ' MB)');
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

        // report succeed uploaded files for the user
        if (mediaArray.length > 0) {
            req.flash('info', mediaArray.length + ' File(s) successfully uploaded!');
        }

        // register documents into DB // todo: extra this step out
        if (mediaArray.length > 0) {
            MediaModel.mediaCreateAndAssociate(req, res, mediaArray, function (err, newMedia) {
                if (err) return res.send(err);  // todo: hide from user  (error can pass to one more layer)
                console.log(newMedia);

                // ending header
                res.writeHead(303, {Connection: 'close', Location: '/console/upload'});
                return res.end();
            });
        } else {
            res.writeHead(303, {Connection: 'close', Location: '/console/upload'});
            return res.end();
        }
    });
}


function _propertyList(expression) {
    return expression.split(/[[\]]/).filter(frag => frag !== '');
}


function _updateByNestedProperty(obj, keys, value, index) {
    if (!index) index = 0;
    if (index < keys.length-1) {
        let self = obj[keys[index]] ? obj[keys[index]] : (obj[keys[index]] = {});
        return _updateByNestedProperty(self, keys, value, ++index);
    } else obj[keys[index]] = value ? value : {};
}



// function exports
module.exports = busboyImgUploader;
