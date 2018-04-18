const errorCodeProxyAgent = require('./error-code/');



// main
class ExtendableError extends Error {
  constructor(...arg) {
    if (new.target.__proto__.name === 'TransferableError') {
      super();
      this.name = this.constructor.name;
      this.message = errorCodeProxyAgent[this.name](...arg);
      if (typeof arg[0] === 'number') this.code = arg[0];
      if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);                                     // note: V8 JS-engine only
      else this.stack = (new Error(message)).stack;                                                                     // note: non-V8 browser only
    }
  }
}


class TransferableError extends ExtendableError {
  constructor(arg, ...ref) {
    if (new.target !== TransferableError) if (arg instanceof ExtendableError) return arg;
    else if (arg instanceof Error) {
      super(arg.message);
      this.code = arg.code;
      this.from = arg.name;
      this.stack = `${this.name} (transferred):${new RegExp(/\s+at.+[^\n]/).exec(this.stack)[0]}\n${arg.stack}`;
    } else super(arg, ...ref);
  }
}



// extensions
class ServerError       extends TransferableError {}                                                                    // note: this error cannot be handled by middleware
class TemplateError     extends TransferableError {}
class ClientError       extends TransferableError {}
class HttpError         extends TransferableError {}



// exports
module.exports = { ServerError, ClientError, TemplateError, HttpError };
