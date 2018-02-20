const { MongoError } = require('mongodb');


// ==============================
//  CORE
// ==============================
class ExtendableError extends Error {
    constructor(message) {
        if (new.target !== ExtendableError) {                                                                           // note: ensure this class cannot be instancified
            super(message);
            this.name = this.constructor.name;
            if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);                               // note: only available on V8
            else this.stack = (new Error(message)).stack;                                                               // note: used if expose in client browser that not based on V8
        }
    }
}



// ==============================
//  ERROR CLASSES
// ==============================
class ServerError   extends ExtendableError {}

class TemplateError extends ExtendableError {}

class AccountError  extends ExtendableError {
    constructor(arg) {
        if (arg instanceof AccountError) return arg;
        else if (arg instanceof Error) {
            super(arg.message);
            this.code = arg.name;
            this.transfer = `AccountError (transferred):\n${new RegExp(/\s{4}at.+[^\n]/).exec(this.stack)[0]}\n`;
            this.stack = this.transfer + arg.stack;
        } else super(arg);
    }
}

class HttpError     extends ExtendableError {
    constructor(code) {
        super();
        this.code = code;
        if (code === 400) this.message = 'HTTP 400 - Bad Request.';
        if (code === 401) this.message = 'HTTP 401 - Unauthorized.';
        if (code === 403) this.message = 'HTTP 403 - Forbidden.';
        if (code === 404) this.message = 'HTTP 404 - Not found.';
    }
}


// export
module.exports = { MongoError, ServerError, AccountError, TemplateError, HttpError };
