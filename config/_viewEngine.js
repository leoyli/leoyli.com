const _ = require('lodash');
const fs = require('fs');
const doT = require('dot');



// render function
function render(filePath, options, next) {
    // reference setup
    const reference = _.omit(options, ['settings', '_locals', 'cache']);
    reference.express = {partials: options.settings['partials'], extname: options.settings['view engine']};

    // page rendering
    return getTemplate(filePath, reference)
        .then(Template => {
            Template.render()
                .then(result => next(null, result))
                .catch(err => next(err, null));
        })
        .catch(err => console.log(err));
}


// access functions
function getTemplate(filePath, reference, _SYNC) {
    if (_SYNC === true) return buildTemplateFromFileContent(getFileContent(filePath, true), filePath, reference);

    return getFileContent(filePath)
        .then(templateContent => buildTemplateFromFileContent(templateContent, filePath, reference))
    // .catch(err => Promise.reject(err)); // note: if is unhandled errors, it will leave `getTemplate` to handle
}


function getFileContent(filePath, _SYNC) {
    if (_SYNC === true) return fs.readFileSync(filePath, 'utf8');

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, templateContent) => {
            if (err) return reject(new Error(`Failed to open view file (${filePath})`));
            return resolve(templateContent);
        });
    });
}


// read function
function buildTemplateFromFileContent(templateContent, filePath, reference) {
    // todo: strip HTML comments
    const reducedRef = _.omit(reference, 'express');
    const segments = {};
    segments.main = templateContent;

    // construct a new Template by `params`
    return new Template({
        express: reference.express,
        filePath: filePath,
        segments: segments,
        variables: Object.keys(reducedRef).toString(),
        reference: reducedRef,
    });
}


// constructors
function Template(params) {
    // reserved for error handler
    this.filePath = params.filePath;
    // reference for templateFn
    this.reference = params.reference;

    // template text (tmpl)
    this.segments = params.segments;
    // compilation settings (c)
    this.configs = new Settings(params.variables).doTConfig;
    // compile-time evaluation (def)
    this.def = new PreCompiledDef(params); // todo: add supports for 'partial'
    // templateFn assemble
    this.templateFnAssemble = {};

    // templateFn compilation
    for (const segment in this.segments) {
        if (this.segments.hasOwnProperty(segment)) {
            this.templateFnAssemble[segment] = doT.template(this.segments[segment], this.configs, this.def);
        }
    }
}


Template.prototype.render = function(_SYNC) {
    if (_SYNC === true) return this.templateFnAssemble.main(...Object.values(this.reference));

    return new Promise((resolve, reject) => {
        try {
            const result = this.templateFnAssemble.main(...Object.values(this.reference));
            resolve(result);
        }
        catch (err) {
            reject(new Error(`Failed to render ('${this.filePath}'):\n${err.message}`));
        }
    });
};


function Settings(variables) {
    this.doTConfig = {
        evaluate:           /\{\{([\s\S]+?)\}\}/g,
        interpolate:        /\{\{=([\s\S]+?)\}\}/g,
        encode:             /\{\{!([\s\S]+?)\}\}/g,
        use:                /\{\{#([\s\S]+?)\}\}/g,
        define:             /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional:        /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate:            /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        varname:            variables || 'it',
        strip:              true,
        append:             true,
        selfcontained:      false
    };
}


function PreCompiledDef(params) {
    this.partial = (partialFileName) => {
        const filePath = `${params.express.partials}${partialFileName}.${params.express.extname || 'dot'}`;
        const template = getTemplate(filePath, params.reference, true);
        return template.render(true);
    };
}



module.exports = {
    __express:              render,
    render:                 render,
};
