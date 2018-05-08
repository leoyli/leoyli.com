const { checkToStringTag } = require('./string');
const errorCodeProxyAgent = require('./error-code/');


// main
class ExtendableError extends Error {
  constructor(entry, literals) {
    if (Reflect.getPrototypeOf(new.target) === TransferableError) {                                                     // note: lock-in this parental class can be only extended by a special child class
      super();
      this.name = this.constructor.name;
      this.message = errorCodeProxyAgent[this.name](entry, literals);
      if (checkToStringTag(entry, 'Number')) this.code = entry;
      if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);                                     // note: V8 JS-engine only
      else this.stack = (new Error(this.message)).stack;                                                                // note: non-V8 browser only
    }
  }
}


class TransferableError extends ExtendableError {
  constructor(entry, literals) {
    if (new.target !== TransferableError) {
      if (entry instanceof ExtendableError) return entry;
      if (entry instanceof Error) {
        super(entry.message);
        this.code = entry.code;
        this.from = entry.name;
        this.stack = `${this.name} (transferred):${new RegExp(/\s+at.+[^\n]/).exec(this.stack)[0]}\n${entry.stack}`;
      } else {
        super(entry, literals);
      }
    }
  }
}


// extensions
class ServerError extends TransferableError {}                                                                          // note: this type is not intended to handle by the middleware
class TemplateException extends TransferableError {}
class ClientException extends TransferableError {}
class HttpException extends TransferableError {}


// exports
module.exports = {
  ServerError,
  ClientException,
  TemplateException,
  HttpException,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ExtendableError,
    TransferableError,
    ...module.exports,
  },
});
