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
class AccountError  extends ExtendableError {}
class TemplateError extends ExtendableError {}
class HttpError     extends ExtendableError {
    constructor(status) {
        super();
        this.status = status;
        if (status === 404) this.message = 'HTTP 404 - Not found.';
    }
}


// export
module.exports = { MongoError, ServerError, AccountError, TemplateError, HttpError };
