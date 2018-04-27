const _ = require('lodash');
const fs = require('fs');
const doT = require('dot');
const path = require('path');
const marked = require('marked');


// modules
const { TemplateError } = require('../utilities/')._U_.error;


// functions
/**
 * generate doT configs on-the-fly
 * @param {string} variables                - names to be registered into the runtime scope
 * @return {object}                         - return doT.js compilation configs
 */
const getCompilationConfigs = (variables) => ({
  comment: /<!--([\s\S]+?)-->/g,
  evaluate: /\{\{([\s\S]+?)\}\}/g,
  interpolate: /\{\{=([\s\S]+?)\}\}/g,
  encode: /\{\{!([\s\S]+?)\}\}/g,
  use: /\{\{#([\s\S]+?)\}\}/g,
  define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
  conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
  iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
  varname: variables,
  stripHTMLComment: true,
  strip: true,
  append: true,
  selfcontained: false,
});


/**
 * get context as string from a template file
 * @param {string} filePath                 - template file path
 * @param {boolean} [_SYNC=null]            - change the state of the function to be sync
 * @return {(Promise|string)}               - return a Promise(async) or string(sync)
 */
const getFileString = (filePath, _SYNC) => {
  const readFileAsync = (file, option) => {
    return new Promise((resolve, reject) => fs.readFile(file, option, (err, content) => {
      if (err) return reject(new TemplateError(91003, filePath));
      return resolve(content);
    }));
  };

  try {
    return _SYNC !== true ? readFileAsync(filePath, 'utf8') : fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    throw new TemplateError(91004, filePath);
  }
};


/**
 * get runtime template methods
 * @param {object} blueprint                - raw blueprint{object} that has no `._fn` methods
 * @param {object} settings                 - view settings extracted from locals{object}
 * @param {string} [source]                 - runtime function caller (point to the source file)
 * @return {object}                         - return a object contains runtime template functions
 */
const getRuntimeMethods = (blueprint, settings, source = '') => {
  const useMarkdown = (context, option, next) => marked(context.replace(/&gt;|&#62;/g, '>', option, next));

  const loadPartial = (fileName, option = {}) => {
    const workPath = option.path === 'default' ? '__root__' : /^[^\/]+/.exec(path.relative(settings.views, source))[0];
    const pathBase = option.path === 'relative'
      ? path.dirname(source)
      : path.join(settings.views, workPath, '_partials');
    const filePath = path.join(pathBase, `${fileName}.${settings['view engine'] || 'dot'}`);
    return getTemplate(filePath, getBlueprint({ settings, ...blueprint }, filePath), true).render();
  };

  return { useMarkdown, loadPartial };
};


/**
 * transpile Express.js meta into the blueprint of Template{object}
 * @param {object} {*}                      - local populations from the Express.js object
 * @param {object} settings                 - destructed parameters from locals{object}
 * @param {string} [source]                 - pass down the caller (point to the source file)
 * @return {object}                         - return a transipiled blueprint
 */
const getBlueprint = ({ settings, ...locals }, source) => {
  const loadWidget = (blueprint, settings) => {
    return new Proxy(this, {
      get: (target, name) => {
        const filePath = path.join(settings.views, '__root__/_widgets', `${name}.${settings['view engine'] || 'dot'}`);
        try {
          return getTemplate(filePath, getBlueprint({ settings, ...blueprint }, filePath), true).render();              // todo: pre-compile codes
        } catch (err) {
          return '';
        }
      },
    });
  };

  const blueprint = _.omit(locals, ['settings', 'cache', '_locals']);
  blueprint._fn = getRuntimeMethods(blueprint, settings, source);
  blueprint._widget = loadWidget(blueprint, settings);
  return blueprint;
};


/**
 * construct a new Template{object}                                                                                     // todo: added multiple sections support
 * @param {string} filePath                 - template file path to be passed
 * @param {object} blueprint                - runtime objects to be passed
 * @param {string} fileString               - raw template context
 * @return {Template}                       - return a new Template{object}
 */
const buildTemplate = (filePath, blueprint, fileString) => {
  const sections = { main: fileString };
  return new Template(filePath, blueprint, sections);
};


/**
 * get a compiled Template{object}
 * @param {string} filePath                 - template file path to be passed
 * @param {object} blueprint                - runtime objects to be passed
 * @param {boolean} [_SYNC=null]            - change the state of the function to be sync
 * @return {(Promise|Template)}             - return a Promise(async) or object(sync)
 */
const getTemplate = (filePath, blueprint, _SYNC) => {
  if (_SYNC === true) return buildTemplate(filePath, blueprint, getFileString(filePath, true));
  return getFileString(filePath).then(templateString => buildTemplate(filePath, blueprint, templateString));
};


// main
/**
 * define the scheme of Template{object}
 * @constructor
 * @param {string} filePath                 - reserved for error messaging
 * @param {object} blueprint                - blueprint to be decoded
 * @param {object} sections                 - section to be complied by `doT.template`
 */
class Template {
  constructor(filePath, blueprint, sections) {                                                                          // todo: [private] make these private once JS supports
    this.filePath = filePath;
    this.settings = getCompilationConfigs(Object.keys(_.omit(blueprint, 'set')).toString());
    this._arguement = Object.values(blueprint);
    this._compileFn = this.compile(sections, this.settings);
  }

  compile(sections, settings) {
    try {
      const compiledStack = {};
      Object.keys(sections).forEach(item => {
        if (settings.stripHTMLComment === true) sections[item] = sections[item].replace(settings.comment, '');
        compiledStack[item] = doT.template(sections[item], settings);
      });
      return compiledStack;
    } catch (err) {
      throw new TemplateError(91001, { filePath: this.filePath, err });
    }
  }

  render() {
    try {
      return this._compileFn.main(...this._arguement);
    } catch (err) {
      throw new TemplateError(91002, { filePath: this.filePath, err });
    }
  }
}


// middleware
/**
 * Should return the requested content in HTML
 * @param {string} filePath                 - template file path to be passed
 * @param {object} locals                   - local populations from the Express.js object
 * @param {function} next                   - callback function
 * @return {Promise}                        - return the executable HTML string
 */
const render = (filePath, locals, next) => {
  return getTemplate(filePath, getBlueprint(locals, filePath))
    .then(receivedTemplate => next(null, receivedTemplate.render()))
    .catch(err => next(new TemplateError(err)));
};


// exports
module.exports = { __express: render,
  render,
  _test: {
    Template,
    render,
    getCompilationConfigs,
    getBlueprint,
    getRuntimeMethods,
    getTemplate,
    buildTemplate,
    getFileString,
  },
};
