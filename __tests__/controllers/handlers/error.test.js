/* global __ROOT__, req, res, next */
const {
  redirect, terminal, exceptionHandler,
} = require(`${__ROOT__}/controllers/handlers/error.js`)[Symbol.for('__TEST__')];


// mock
const calledWithNext = Symbol('done');
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn(() => calledWithNext);
});


// test
describe('Handlers: Exception', () => {
  test('Middleware: redirect.signInRetry', () => {
    req._setHeadersVariable('Referrer', '/samePage');
    res.locals.$$VIEW = { flash: { info: ['info_A', 'info_B'] } };
    req.flash = jest.fn();
    res.redirect = jest.fn();

    // should NOT call with the next middleware
    expect(redirect.signInRetry(req, res, next)).not.toBe(calledWithNext);

    // should redirect client to '/signin'
    expect(res.redirect).toBeCalledWith('/signin');

    // should behave differently based on referrer
    // // if self-referred
    req.originalUrl = '/samePage';
    req.flash.mockClear();
    redirect.signInRetry(req, res, next);
    expect(req.flash).toBeCalledWith('info', 'info_B');
    expect(req.flash).toBeCalledWith('error');

    // // if referred by other page
    req.originalUrl = '/otherPage';
    req.flash.mockClear();
    redirect.signInRetry(req, res, next);
    expect(req.flash).not.toBeCalledWith('info', 'info_B');
    expect(req.flash).not.toBeCalledWith('error');

    // should store redirecting address
    expect(req.flash).toBeCalledWith('action', 'retry');
    expect(req.session).toHaveProperty('returnTo', req.originalUrl);
  });
});
