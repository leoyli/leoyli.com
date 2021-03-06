/* global __ROOT__, req, res, next */
const {
  caseInsensitiveQueryProxy, titleTagModifier,
} = require(`${__ROOT__}/server/modules/handlers/helpers`)[Symbol.for('__TEST__')];


// modules
const util = require('util');
const httpMocks = require('node-mocks-http');


// mocks
beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// tests
describe('Modules: Helper', () => {
  test('Middleware: caseInsensitiveQueryProxy', () => {
    req.query = {};

    // should be dedicated to a proxy
    caseInsensitiveQueryProxy(req, res, next);
    expect(util.types.isProxy(req.query)).toBeTruthy();

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: titleTagModifier', () => {
    const theSameTitle = 'some_title';
    const insertedTitle = 'inserted_title';
    res.locals.$$VIEW = { title: theSameTitle };

    // (1) should NOT modify tag without 'HTML' mode flag
    titleTagModifier(insertedTitle)(req, res, next);
    expect(res.locals.$$VIEW.title).toBe(theSameTitle);


    // (2) should modify title tag
    res.locals.$$MODE = 'HTML';

    // // if no option specified (default to prepend)
    titleTagModifier(insertedTitle)(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title - some_title');

    // // if option `append` is `true`
    titleTagModifier({ tag: insertedTitle, append: true })(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title - some_title - inserted_title');

    // // if option `extend` is `false`
    titleTagModifier({ tag: insertedTitle, extend: false })(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title');

    // // if option `delimiter` is specified
    titleTagModifier({ tag: insertedTitle, delimiter: '|' })(req, res, next);
    expect(res.locals.$$VIEW.title).toBe('inserted_title | inserted_title');


    // (3) should be able to use as a modifier (not a middleware)
    expect(() => titleTagModifier({ tag: insertedTitle })(req, res)).not.toThrowError();
    expect(res.locals.$$VIEW.title).toBe('inserted_title - inserted_title | inserted_title');


    // should pass the final state checks
    expect(next).toBeCalledTimes(5);
  });
});
