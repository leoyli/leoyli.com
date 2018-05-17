/* global __ROOT__, req, res, next */
const {
  caseInsensitiveQueryProxy, modifyHTMLTitleTag,
} = require(`${__ROOT__}/controllers/modules/helper`)[Symbol.for('__TEST__')];


// mock
const util = require('util');
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// test
describe('Modules: Helper', () => {
  test('Middleware: caseInsensitiveQueryProxy', () => {
    req.query = {};
    caseInsensitiveQueryProxy(req, res, next);

    // should be dedicated to a proxy
    expect(util.types.isProxy(req.query)).toBeTruthy();

    // should call `next`
    expect(next).toHaveBeenCalledTimes(1);
  });


  test('Middleware: modifyHTMLTitleTag', () => {
    const theSameTitle = 'some_title';
    const insertedTitle = 'inserted_title';
    res.locals.$$VIEW = { title: theSameTitle };

    // should NOT modify tag without 'html' mode flag
    modifyHTMLTitleTag(insertedTitle)(req, res, next);
    expect(res.locals.$$VIEW.title).toBe(theSameTitle);

    // should modify title tag
    res.locals.$$MODE = 'html';

    // // if no option specified (default to prepend)
    modifyHTMLTitleTag(insertedTitle)(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title - some_title');

    // // if option `append` is `true`
    modifyHTMLTitleTag({ tag: insertedTitle, append: true })(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title - some_title - inserted_title');

    // // if option `extend` is `false`
    modifyHTMLTitleTag({ tag: insertedTitle, extend: false })(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title');

    // // if option `delimiter` is specified
    modifyHTMLTitleTag({ tag: insertedTitle, delimiter: '|' })(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title | inserted_title');

    // should call `next`
    expect(next).toHaveBeenCalledTimes(5);
  });
});
