class ErrorCodeDictionary {
    constructor(dictionary) {
        this.index = dictionary;
    }

    lookup(code, ref) {
        if (ref !== 0 && !ref) return this.index[code];
        return this.index[code].replace(/\${([^}]*)}/g, (match, key) => {
            const replace = (typeof ref === 'string' || typeof ref === 'number') ? ref : ref[key];
            return (replace !== 0 && ref) ? replace.toString() : match;
        });
    }
}


// error codes
const codeIndexes = {};
codeIndexes.ServerError_en = new ErrorCodeDictionary({
    90001:  'Failed to load website configs, please contact the admin.',
    92001:  '[MultiPartUpload] Cannot create the folder (fs.mkdir, missing parent folder?): ${dirPath}',
    92002:  '[MultiPartUpload] Failed to clean up the truncated file...\n${errString}'
});

codeIndexes.TemplateError_en = new ErrorCodeDictionary({
    91001:  'Failed to compile template function: ${filePath}\n${err}',
    91002:  'Failed to render template function: ${filePath}\n${err}',
    91003:  'Failed to asynchronously lookup file (fs.readFile): ${filePath}',
    91004:  'Failed to synchronously lookup file (fs.readFileSync): ${filePath}',
});

codeIndexes.ClientError_en = new ErrorCodeDictionary({
    10001:  'Please fill all required fields.',
    10002:  'Two new password does not the same.',
    10003:  'Password cannot be set to the same as the current.',
    20001:  'Invalid authorization...',
    20002:  'Wrong email/username or password!',
});

codeIndexes.HttpError_en = new ErrorCodeDictionary({
    400:    'HTTP 400 - Bad Request.',
    401:    'HTTP 401 - Unauthorized.',
    403:    'HTTP 403 - Forbidden.',
    404:    'HTTP 404 - Not found.',
    500:    'HTTP 500 - Internal Server Error.',
});



// export
module.exports = new Proxy(codeIndexes, {
    get: (target, name) => {
        const x = `${name}_${process.env['$WEBSITE_CONFIGS'].language || 'en'}`;
        if (target.hasOwnProperty(x)) return (...arg) => target[x].lookup(...arg) || arg[0];
        else return arg => arg;
    }
});
