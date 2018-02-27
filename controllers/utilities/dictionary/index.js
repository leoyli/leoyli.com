class ErrorDictionary {
    constructor(reference) {
        this.index = reference;
    }

    lookup(code, meta) {                        // todo: allow placeholder to be converted to the value of meta
        return this.index[code];
    }
}

const ServerErrorDictionary_en = new ErrorDictionary({
    90001:  'Failed to load website configs, please contact the admin.',
});

const AccountErrorDictionary_en = new ErrorDictionary({
    10001:  'Please fill all required fields.',
    10002:  'Two new password does not the same.',
    10003:  'Password cannot be set to the same as the current.',
    20001:  'Invalid authorization...',
    20002:  'Wrong email/username or password!',
});

const HttpErrorDictionary_en = new ErrorDictionary({
    400:    'HTTP 400 - Bad Request.',
    401:    'HTTP 401 - Unauthorized.',
    403:    'HTTP 403 - Forbidden.',
    404:    'HTTP 404 - Not found.',
    500:    'HTTP 500 - Internal Server Error.',
});



// export
const dictionary = { AccountErrorDictionary_en, HttpErrorDictionary_en };
module.exports = new Proxy(dictionary, {
    get: (target, name) => {
        const x = `${name}Dictionary_${process.env['$WEBSITE_CONFIGS'].language || 'en'}`;
        if (target.hasOwnProperty(x)) return (...arg) => target[x].lookup(...arg) || arg;
        else return arg => arg;
    }
});
