/* global __ROOT__, req, res, next */
const {
  redirect, terminal, exceptionHandler,
} = require(`${__ROOT__}/controllers/handlers/error.js`)[Symbol.for('__TEST__')];


// mock
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stubbed functions */
  req.flash = jest.fn();
  res.redirect = jest.fn();
});


// test
describe('Handlers: Exception', () => {
  test('Middleware: redirect.signInRetry', () => {
    req._setHeadersVariable('Referrer', '/samePage');
    res.locals.$$VIEW = { flash: { info: ['info_A', 'info_B'] } };

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

    // should store redirecting address and proceed the user
    expect(req.flash).toBeCalledWith('action', 'retry');
    expect(req.session).toHaveProperty('returnTo', req.originalUrl);
    expect(res.redirect).toHaveBeenLastCalledWith('/signin');

    // should pass the final state checks
    expect(res.redirect).toHaveBeenCalledTimes(2);
    expect(next).not.toBeCalled();
  });
});