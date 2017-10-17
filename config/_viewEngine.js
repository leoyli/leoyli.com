const
    _                       = require('lodash'),
    fs                      = require('fs'),
    doT                     = require('doT'),
    path                    = require('path');



// render function
function render(filePath, options, next) {
    const reference = _.omit(options, ['settings', '_locals', 'cache']);
    reference.set = {partials: options.settings['partials'], extName: options.settings['view engine']};

    return getTemplate(filePath, reference)
        .then(Template => next(null, Template.render()))
        .catch(err => next(err, null));
}


// access functions
function getTemplate(filePath, reference, _SYNC) {
    if (_SYNC === true) return buildTemplateFromFile(getFileContent(filePath, true), filePath, reference);

    return getFileContent(filePath)
        .then(templateString => buildTemplateFromFile(templateString, filePath, reference));
}


function getFileContent(filePath, _SYNC) {
    if (_SYNC === true) return fs.readFileSync(filePath, 'utf8');

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, templateString) => {
            if (err) return reject(new Error(`Failed to read the file: (${filePath})`));
            return resolve(templateString);
        });
    });
}


// read function
function buildTemplateFromFile(templateString, filePath, reference) {   // todo: strip HTML comments @templateString
    const identifier = _.omit(reference, 'set');
    const sections = {main : templateString};   // todo: added multiple sections support

    try {
        return new Template({
            set: reference.set,
            sections: sections,
            filePath: filePath,
            varNames: Object.keys(identifier).toString(),
            identifier: identifier,
        });
    } catch (err) {
        throw new Error(`Failed to build a Template: ('${filePath}'):\n${err.toString()}`);
    }
}


// constructors
function Template(params) {
    // reserved for error handler
    this.filePath = params.filePath;
    // reference for templateFn
    this.identifier = params.identifier;

    // template text (tmpl)
    this.sections = params.sections;
    // compilation settings (c)
    this.configs = new Settings(params.varNames).doTConfig;
    // compile-time evaluation (def)
    this.def = new PreCompiledDef(params);

    // templateFn assemble
    this.templateFnEnsemble = {};
    // templateFn compilation
    for (const section in this.sections) {
        if (this.sections.hasOwnProperty(section)) {
            this.templateFnEnsemble[section] = doT.template(this.sections[section], this.configs, this.def);
        }
    }
}


Template.prototype.render = function() {
    try {
        return this.templateFnEnsemble.main(...Object.values(this.identifier));
    } catch (err) {
        throw new Error(`Failed to render: ('${this.filePath}'):\n${err.toString()}`);
    }
};


function PreCompiledDef(params) {
    this.partial = (partialFile) => {
        partialFile = path.join(params.set.partials, `${partialFile}.${params.set.extName || 'dot'}`);
        return getTemplate(partialFile, params.identifier, true).render();  // note: `getTemplate` is not a Promise here
    };
}


function Settings(varNames) {
    this.doTConfig = {
        evaluate:           /\{\{([\s\S]+?)\}\}/g,
        interpolate:        /\{\{=([\s\S]+?)\}\}/g,
        encode:             /\{\{!([\s\S]+?)\}\}/g,
        use:                /\{\{#([\s\S]+?)\}\}/g,
        define:             /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional:        /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate:            /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        varname:            varNames || 'it',
        strip:              true,
        append:             true,
        selfcontained:      false,
    };
}



// view engine export
module.exports = {
    __express:              render,
    render:                 render,
};
