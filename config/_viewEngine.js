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
    const sections = {main : templateString};   // todo: added multiple sections support

    try {
        return new Template(filePath, reference, sections);
    } catch (err) {
        throw new Error(`Failed to build a Template: ('${filePath}'):\n${err.toString()}`);
    }
}


// constructors
function Template(filePath, reference, sections) {
    // reserved for error handler
    this.filePath = filePath;

    // reference for template functions
    this.varNames = Object.keys(_.omit(reference, 'set'));
    this.varValue = Object.values(_.omit(reference, 'set'));

    // template text (tmpl)
    this.sections = sections;
    // compilation settings (c)
    this.configs = new Settings(this.varNames.toString()).doTConfig;
    // compile-time evaluation (def)
    this.def = new PreCompiledDef(reference);

    // templateFn assemble
    this.templateFnSet = {};
    // templateFn compilation
    for (const item in this.sections) {
        if (this.sections.hasOwnProperty(item)) {
            // comments stripping (defaulted in HTML)
            if (this.configs.stripComment) this.sections[item] = this.sections[item].replace(this.configs.comment, '');
            // doT compilation
            this.templateFnSet[item] = doT.template(this.sections[item], this.configs, this.def);
        }
    }
}


Template.prototype.render = function() {
    try {
        return this.templateFnSet.main(...this.varValue);
    } catch (err) {
        throw new Error(`Failed to render: ('${this.filePath}'):\n${err.toString()}`);
    }
};


function PreCompiledDef(reference) {
    this.partial = (partialFile) => {
        partialFile = path.join(reference.set.partials, `${partialFile}.${reference.set.extName}`);
        return getTemplate(partialFile, reference, true).render();  // note: `getTemplate` is not a Promise here
    };
}


function Settings(varNames) {
    this.doTConfig = {
        comment:            /<!--([\s\S]+?)-->/g,
        evaluate:           /\{\{([\s\S]+?)\}\}/g,
        interpolate:        /\{\{=([\s\S]+?)\}\}/g,
        encode:             /\{\{!([\s\S]+?)\}\}/g,
        use:                /\{\{#([\s\S]+?)\}\}/g,
        define:             /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional:        /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate:            /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        varname:            varNames || 'it',
        stripComment:       true,
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
