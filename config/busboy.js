const
    fs                      = require('fs'),
    path                    = require('path'),
    Busboy                  = require('busboy'),
    MediaModel              = require('../models/media');



// uploader configurations
function busboyImgUploader (req, res, limits, next) {
    // initialization
    const busOptions = {headers: req.headers, limits : limits};
    const busboy = new Busboy(busOptions);
    const supportedType = ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'];
    const filePath = path.join(__dirname + '/..', 'public', 'images');

    // collectors
    var streamCounter = 0;
    var mediaArray = [];

    // pipe busboy
    req.pipe(busboy);


    // BUSBOY-LISTENER: parse 'file' inputs
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // path for saving
        const saveInName = Date.now() + path.extname(filename);
        const saveToPath = filePath + '/' + saveInName;
        // note: if set 'fs.createWriteStream()' as a variable here, it ends with an inexhaustible empty file

        // parameters for validations
        const isNotProvided = filename === '';
        const isNotSupported = supportedType.indexOf(mimetype) === -1;

        // file saving when 1) filename being provided; 2) supported types
        if (isNotProvided || isNotSupported) {
            file.resume();
        } else {
            file.pipe(fs.createWriteStream(saveToPath));
            mediaArray.push({path: saveToPath, filename: saveInName});
        }

        // FILE-LISTENER: end (completed/terminated)
        file.on('end', function () {
            // stream counter
            ++streamCounter;

            // if invalid
            if (isNotProvided) return --streamCounter;
            if (isNotSupported) return req.flash('error', 'Unsupported types!');

            // if oversizing
            if (file.truncated) {
                // note: 'fs.existsSync()' prevents the un-found crash
                if (fs.existsSync(saveToPath)) fs.unlink(saveToPath);
                mediaArray.pop();
                return req.flash('error', 'Image is too big! (> ' + limits.fileSize/1048576 + ' MB)');
            }
        });
    });


    // BUSBOY-LISTENER: parse 'field' inputs
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        // todo: field data integration into DB data
    });


    // BUSBOY-LISTENER: event finished
    busboy.on('finish', function() {
        if (streamCounter === mediaArray.length && streamCounter > 0) {
            req.flash('info', mediaArray.length + ' File(s) successfully uploaded!');
        }

        // DB association
        if (mediaArray.length > 0) {
            MediaModel.mediaCreateAndAssociate(req, res, mediaArray, function () {
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


// function exports
module.exports = busboyImgUploader;
