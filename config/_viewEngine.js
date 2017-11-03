const
    _                       = require('lodash'),
    fs                      = require('fs'),
    doT                     = require('dot'),
    path                    = require('path'),
    marked                  = require('marked');



// render function
function render(filePath, locals, next) {
    return getTemplate(filePath, getReference(locals))
        .then(Template => next(null, Template.render()))
        .catch(err => next(err, null));
}


// access functions
function getReference(locals) { // todo: allows the user to added customized runtime function
    // load express configs by restricting `locals`
    const reference = _.omit(locals, ['settings', 'cache', '_locals', '_render']);
    reference.set = {partials: locals.settings['partials'], extName: locals.settings['view engine']};

    // populate the run-time available functions
    reference._fn = {   // note: runtime functions
        useMarkdown : (markdown) => marked(markdown.replace(/&gt;|&#62;/g, '>')),
        loadPartial : (filePath) => {
            filePath = path.join(reference.set.partials, `${filePath}.${reference.set.extName}`);
            return getTemplate(filePath, reference, true).render();},
    };

    return reference;
}


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
function buildTemplateFromFile(templateString, filePath, reference) {
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

    // templateFn assemble
    this.templateFnSet = {};
    // templateFn compilation
    for (const item in this.sections) {
        if (this.sections.hasOwnProperty(item)) {
            // comments stripping (defaulted in HTML)
            if (this.configs.stripComment) this.sections[item] = this.sections[item].replace(this.configs.comment, '');
            // doT compilation
            this.templateFnSet[item] = doT.template(this.sections[item], this.configs);
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


function Settings(varNames) {   // todo: allows the user to customized the delimiters
    this.doTConfig = {
        comment:            /<!--([\s\S]+?)-->/g,
        evaluate:           /\{\{([\s\S]+?)\}\}/g,
        interpolate:        /\{\{=([\s\S]+?)\}\}/g,
        encode:             /\{\{!([\s\S]+?)\}\}/g,
        use:                /\{\{#([\s\S]+?)\}\}/g,
        define:             /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional:        /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate:            /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        varname:            varNames,
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
