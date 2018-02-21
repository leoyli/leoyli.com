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
class ServerError       extends ExtendableError {}  // note: this error can not be handled by middleware

class TemplateError     extends ExtendableError {}
class AccountError      extends ExtendableError {
    constructor(arg) {
        if (arg instanceof ExtendableError) return arg;
        else if (arg instanceof Error) {
            super(arg.message);
            this.code = arg.code;
            this.from = arg.name;
            this.stack = `AccountError (transferred):${new RegExp(/\s+at.+[^\n]/).exec(this.stack)[0]}\n${arg.stack}`;
        } else super(arg);
    }
}

class HttpError         extends ExtendableError {
    constructor(code) {
        super();
        this.code = code;
        if (code === 400) this.message = 'HTTP 400 - Bad Request.';
        if (code === 401) this.message = 'HTTP 401 - Unauthorized.';
        if (code === 403) this.message = 'HTTP 403 - Forbidden.';
        if (code === 404) this.message = 'HTTP 404 - Not found.';
        if (code === 500) this.message = 'HTTP 500 - Internal Server Error.';
    }
}


// export
module.exports = { MongoError, ServerError, AccountError, TemplateError, HttpError };
