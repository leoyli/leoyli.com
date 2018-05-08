const { checkToStringTag } = require('./string');
const { Router } = require('express');


/**
 * (decorator) handle asyncfunction for error bubbling
 * @param {array|function} target           - fn may be wrapped
 * @return {array|function}                 - task is triggered only when keyword 'async' is found
 */
const wrapAsync = (target) => {
  const unnamedWrapper = (fn) => (...arg) => fn.apply(this, arg).catch(arg[arg.length - 1]);
  const namedWrapper = (fn) => Object.defineProperty(unnamedWrapper(fn), 'name', { value: `WrappedAsync ${fn.name}` });
  const evaluator = (fn) => (checkToStringTag(fn, 'AsyncFunction') ? namedWrapper(fn) : fn);
  const type = checkToStringTag(target);
  switch (type) {
    case 'Function':
    case 'AsyncFunction':
      return evaluator(target);
    case 'Array':
      return target.map(fn => evaluator(fn));
    default: {
      throw new TypeError(`Argument is neither an Array nor an AsyncFunction but ${type}.`);
    }
  }
};


/**
 * (factory) insert additional middleware into the chain
 * @param {array|map|function} queue        - fn may be wrapped
 * @return {function}                       - middleware chain with insertion
 */
const wrapMiddleware = (queue) => {
  const router = new Router({ mergeParams: true });
  const type = checkToStringTag(queue);
  switch (type) {
    case 'Array':
    case 'Function':
    case 'AsyncFunction':
      return router.use(wrapAsync(queue));
    case 'Map':
      queue.forEach((middleware, condition) => {
        if (condition) router.use(wrapAsync(middleware));
      });
      return router;
    default: {
      throw new TypeError(`Argument is neither an Array, Map, nor (Async)Function but ${type}.`);
    }
  }
};


// exports
module.exports = {
  wrapAsync,
  wrapMiddleware,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
