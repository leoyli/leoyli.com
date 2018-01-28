const
    _                       = require('lodash'),
    fs                      = require('fs'),
    doT                     = require('dot'),
    path                    = require('path'),
    marked                  = require('marked');


/**
 * view engine renderer
 * @param {string} filePath                 - template file path to be passed
 * @param {object} locals                   - local populations from the Express.js object
 * @param {function} next                   - callback function
 * @return {Promise}                        - return the executable HTML string
 */
function render(filePath, locals, next) {
    return getTemplate(filePath, getBlueprint(locals))
        .then(Template => next(null, Template.render()))
        .catch(err => next(err, null));
}


/**
 * generate doT configs on-the-fly          // todo: allows the user to customized the delimiters
 * @param {string} variables                - names to be registered into the runtime scope
 * @return {object}                         - return doT.js compilation configs
 */
function getCompilationConfigs(variables) {
    return {
        comment:            /<!--([\s\S]+?)-->/g,
        evaluate:           /\{\{([\s\S]+?)\}\}/g,
        interpolate:        /\{\{=([\s\S]+?)\}\}/g,
        encode:             /\{\{!([\s\S]+?)\}\}/g,
        use:                /\{\{#([\s\S]+?)\}\}/g,
        define:             /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional:        /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate:            /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        varname:            variables,
        stripHTMLComment:   true,
        strip:              true,
        append:             true,
        selfcontained:      false,
    };
}


/**
 * transpile Express.js meta into the blueprint of Template{object}
 * @param {object} {*}                      - local populations from the Express.js object
 * @param {object} settings                 - destructed parameters from locals{object}
 * @return {object}                         - return a transipiled blueprint
 */
function getBlueprint({ settings, ...locals }) {
    const blueprint = _.omit(locals, ['settings', 'cache', '_locals']);
    blueprint._fn = getRuntimeMethods(blueprint, settings);
    return blueprint;
}


/**
 * get runtime template methods             // todo: added more methods
 * @param {object} blueprint                - raw blueprint{object} that has no `._fn` methods
 * @param {object} settings                 - view settings extracted from locals{object}
 * @return {object}                         - return a object contains runtime template functions
 */
function getRuntimeMethods (blueprint, settings) {
    function useMarkdown (context, option, next) {
        return marked(context.replace(/&gt;|&#62;/g, '>', option, next));
    }

    function loadPartial (fileName, option = {}) {
        const pathBase = option.isPanel === true || blueprint._view._status.isPanel === true
            ? settings['partials'].panel
            : settings['partials'].theme || settings['partials'].panel;
        const filePath = path.join(pathBase || __dirname, `${fileName}.${settings['view engine'] || 'dot'}`);
        return getTemplate(filePath, getBlueprint({ settings, ...blueprint }), true).render();
    }

    return { useMarkdown, loadPartial };
}


/**
 * get the compiled template
 * @param {string} filePath                 - template file path to be passed
 * @param {object} blueprint                - runtime objects to be passed
 * @param {boolean} [_SYNC=null]            - change the state of the function to be sync
 * @return {(Promise|Template)}             - return a Promise(async) or object(sync)
 */
function getTemplate(filePath, blueprint, _SYNC) {
    if (_SYNC === true) return buildTemplate(getFileString(filePath, true), filePath, blueprint);
    else return getFileString(filePath).then(templateString => buildTemplate(templateString, filePath, blueprint));
}


/**
 * get string from template file
 * @param {string} filePath                 - template file path
 * @param {boolean} [_SYNC=null]            - change the state of the function to be sync
 * @return {(Promise|string)}               - return a Promise(async) or string(sync)
 */
function getFileString(filePath, _SYNC) {
    if (_SYNC === true) return fs.readFileSync(filePath, 'utf8');
    else return new Promise((resolve, reject) => fs.readFile(filePath, 'utf8', (err, templateString) => {
        if (err) return reject(new Error(`Failed to read the file: (${filePath})`));
        else return resolve(templateString);
    }));
}


/**
 * construct a new Template{object}         // todo: added multiple sections support
 * @param {string} fileString               - raw template context
 * @param {string} filePath                 - template file path to be passed
 * @param {object} blueprint                - runtime objects to be passed
 * @return {Template}                       - return a new Template{object}
 */
function buildTemplate(fileString, filePath, blueprint) {
    const sections = { main : fileString };
    return new Template(filePath, blueprint, sections);
}


/**
 * define the scheme of Template{object}
 * @constructor
 * @param {string} filePath                 - reserved for error messaging
 * @param {object} blueprint                - blueprint to be decoded
 * @param {object} sections                 - section to be complied by `doT.template`
 */
function Template(filePath, blueprint, sections) {
    this.filePath   = filePath;
    this.settings   = getCompilationConfigs(Object.keys(_.omit(blueprint, 'set')).toString());
    this.arguement  = Object.values(blueprint);
    this.compileFn  = this.compile(sections, this.settings);
}

Template.prototype.compile = function (sections, settings) {
    const compiledStack = {};
    Object.keys(sections).forEach(item => {
        if (settings.stripHTMLComment === true) sections[item] = sections[item].replace(settings.comment, '');
        compiledStack[item] = doT.template(sections[item], settings);
    });
    return compiledStack;
};

Template.prototype.render = function() {
    try {
        return this.compileFn.main(...this.arguement);
    } catch (err) {
        throw new Error(`Failed to render: ('${this.filePath}'):\n${err.toString()}`);
    }
};



// view engine export
module.exports = { __express: render, render, _test: {
    getCompilationConfigs, getBlueprint, getRuntimeMethods, getTemplate, getFileString, buildTemplate }};

