/* global __ROOT__, req, res, next */
const {
  initialReceptor, browserReceptor, APIReceptor,
} = require(`${__ROOT__}/server/controllers/handlers/receptor.js`)[Symbol.for('__TEST__')];


// modules
const httpMocks = require('node-mocks-http');


// mocks
beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  res.redirect = jest.fn();
});


// tests
describe('Handlers: Receptor', () => {
  test('Middleware: initialReceptor', () => {
    req.app = { get: jest.fn(() => ({ initialized: false })) };

    // should proceed the client based on the state of the app
    // // if have not initialized
    initialReceptor(req, res, next);
    expect(res.redirect).lastCalledWith('/init');
    expect(next).toBeCalledTimes(0);

    // // if have initialized
    req.app = { get: jest.fn(() => ({ initialized: true })) };
    initialReceptor(req, res, next);
    expect(res.redirect).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(1);

    // should populate website config into $$SITE view variable
    expect(res.locals).toHaveProperty('$$SITE');
  });


  test('Middleware: browserReceptor', () => {
    req.session.returnTo = '/';
    res.locals.$$SITE = {};
    req.flash = jest.fn();

    // should set $$MODE to 'HTML'
    req.flash.mockImplementation(call => (call === 'action' ? ['retry'] : []));
    browserReceptor(req, res, next);
    expect(res.locals.$$MODE).toBe('HTML');

    // should create flash containers
    expect(req.flash).toBeCalledWith('action');
    expect(req.flash).toBeCalledWith('error');
    expect(req.flash).toBeCalledWith('info');

    // should only clean up `req.session.returnTo` depends on `req.flash.action`.
    // // if `req.flash.action` have 'retry' as an element, then do nothing
    expect(req.session).toHaveProperty('returnTo', '/');

    // // if `req.flash.action` have no 'retry' as an element, then delete it
    req.flash.mockImplementation(() => []);
    browserReceptor(req, res, next);
    expect(req.session).not.toHaveProperty('returnTo');

    // should pass the final state checks
    expect(next).toBeCalledTimes(2);
  });


  test('Middleware: APIReceptor', () => {
    const arbitraryStringValue = expect.stringMatching('');
    res.set = jest.fn();

    // should set $$MODE to 'HTML'
    APIReceptor(req, res, next);
    expect(res.locals.$$MODE).toBe('API');

    // should set CORS headers
    expect(res.set).toBeCalledWith('Access-Control-Allow-Origin', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Allow-Methods', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Allow-Headers', arbitraryStringValue);
    // expect(res.set).toBeCalledWith('Access-Control-Allow-Credentials', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Max-Age', arbitraryStringValue);

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
  });
});
