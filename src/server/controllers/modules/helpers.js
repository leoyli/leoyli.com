const { _U_ } = require('../../utilities/');


/**
 * app configurations loader
 */
const appConfigsLoader = (req, res, next) => {
  res.locals.config = req.app.get('APP_CONFIG');
  return next();
};


/**
 * JSON response handler
 */
const JSONResponseHandler = (req, res) => {
  const doc = {
    ...res.locals.data,
    _timestamp: Date.now(),
    _status: 200,
    _cache: false,
  };
  return res.json(doc);
};


/**
 * allow case insensitive accessing of `req.query`
 */
const caseInsensitiveQueryProxy = (req, res, next) => {
  req.query = _U_.object.createCaseInsensitiveProxy(req.query);
  return next();
};


/**
 * modify HTML title tag
 * @param {object|string} option            - modifying options
 * @param {string} option.tag               - title substring
 * @param {boolean} [option.extend = true]  - replace the whole string
 * @param {boolean} [option.append = false] - append title tag
 * @param {string} [option.delimiter = '-'] - delimiter used in conjunction
 */
const titleTagModifier = (option) => function titleTagModifierByOption(req, res, next) {
  if (res.locals.$$MODE === 'HTML') {
    const config = (_U_.string.checkToStringTag(option, 'String')) ? { tag: option } : option;
    const { tag, extend = true, append = false, delimiter = '-' } = config;

    // populate sequence
    const sequence = [];
    if (extend !== false) sequence.push(res.locals.$$VIEW.title);
    if (append === true) sequence.push(tag);
    else sequence.unshift(tag);

    res.locals.$$VIEW.title = sequence.join(` ${delimiter} `);
  }
  if (typeof next === 'function') return next();
};


// exports
module.exports = {
  appConfigsLoader,
  JSONResponseHandler,
  caseInsensitiveQueryProxy,
  titleTagModifier,
  // postNormalizer,
};

Object.defineProperty(module.exports, Symbol.for('__TEST__'), {
  value: {
    ...module.exports,
  },
});
