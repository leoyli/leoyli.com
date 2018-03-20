module.exports = admin = {};



// ==============================
//  DEPENDENCIES
// ==============================
const { _M_ } = require('../middleware/plugins');
const { _U_ } = require('../utilities/');
const { configsModel, mediaModel } = require('../../models/');
const { fetch } = require('../middleware/fetch');


// ==============================
//  CONTROLLERS
// ==============================
admin.main = {
    get: (req, res, next) => next(),
};

admin.configs = {
    get: (req, res, next) => {
        res.locals.$$VIEW.configs = JSON.parse(process.env['$WEBSITE_CONFIGS']);
        return next();
    },
    patch: async (req, res) => {
        await configsModel.updateSettings(req.body.configs);                                                             // tofix: pickup updated variables to avoid injections
        return res.redirect('back');
    },
};

admin.upload = {   // todo: to be integrated in profile and media manager
    get: (req, res, next) => next(),
    post: [_M_.hireBusboy({ fileSize: 25*1048576 }), async (req, res) => {
        if (req.body.busboySlip.mes.length > 0) req.body.busboySlip.mes.forEach(mes => req.flash('error', mes));
        if (req.body.busboySlip.raw.length > 0) {
            req.body.busboySlip.raw.forEach(medium => medium.author = req.session.user);
            const docs = await mediaModel.create(req.body.busboySlip.raw);
            if (docs.length > 0) req.flash('info', `${docs.length} file(s) successfully uploaded!`);
        }
        return res.redirect('back');
    }],
};

admin.stack = {
    get: (req, res, next) => {
        const collection = req.params['stackType'].toLowerCase();
        if (['posts', 'media'].indexOf(collection) !== -1) {
            _M_.setTitleTag(collection)(req, res);                                                                       // todo: capitalize
            return fetch(collection, { num: 10 })(req, res, next);
        } else throw new _U_.error.HttpError(404);
    },
    patch: async (req, res) => res.redirect('back'),
};
