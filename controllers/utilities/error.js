const dictionaryProxy = require('./dictionary/');



// ==============================
//  CORE
// ==============================
class ExtendableError extends Error {
    constructor(...arg) {
        if (new.target !== ExtendableError) {                                                                           // note: ensure this class cannot be instancified
            super();
            this.name = this.constructor.name;
            this.message = dictionaryProxy[this.name](...arg);                                                          // note: the proxy agent first try to map the arg with the dictionary of the error, if not found, return arg
            if (typeof arg === 'number') this.code = arg[0];
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
class HttpError         extends ExtendableError {}
class ClientError       extends ExtendableError {   // tofix: mongo error handler redirecting
    constructor(arg) {
        if (arg instanceof ExtendableError) return arg;
        else if (arg instanceof Error) {
            super(arg.message);
            this.code = arg.code;
            this.from = arg.name;
            this.stack = `ClientError (transferred):${new RegExp(/\s+at.+[^\n]/).exec(this.stack)[0]}\n${arg.stack}`;
        } else super(arg);
    }
}



// exports
module.exports = { ServerError, ClientError, TemplateError, HttpError };
