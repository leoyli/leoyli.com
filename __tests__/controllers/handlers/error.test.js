/* global __ROOT__, req, res, next */
const {
  redirect, terminal, exceptionHandler,
} = require(`${__ROOT__}/controllers/handlers/error.js`)[Symbol.for('__TEST__')];


// modules
const { _U_: { error: exceptions } } = require(`${__ROOT__}/controllers/utilities`);
const httpMocks = require('node-mocks-http');


// mocks
beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  res.render = jest.fn();
  res.redirect = jest.fn();
  res.status = jest.fn(() => res);
  req.flash = jest.fn();
});


// tests
describe('Handlers: Exception', () => {
  test('Middleware: redirect.signInRetry', () => {
    req._setHeadersVariable('Referrer', '/samePage');
    res.locals.$$VIEW = { flash: { info: ['info_A', 'info_B'] } };

    // (1) should behave differently based on referrer
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


    // (2) should store redirecting address and proceed the user
    expect(req.flash).toBeCalledWith('action', 'retry');
    expect(req.session).toHaveProperty('returnTo', req.originalUrl);
    expect(res.redirect).lastCalledWith('/signin');


    // should pass the final state checks
    expect(res.redirect).toBeCalledTimes(2);
    expect(next).not.toBeCalled();
  });


  test('Middleware: terminal.ClientException', () => {
    /* stub the related middleware */
    redirect.signInRetry = jest.fn();

    // (1) should proceed to `signInRetry` middleware
    const fakeErr_1 = { code: 20000 };
    terminal.ClientException(fakeErr_1, req, res, next);
    expect(redirect.signInRetry).toBeCalledTimes(1);
    expect(req.flash).toBeCalledTimes(0);
    expect(res.redirect).toBeCalledTimes(0);


    // (2) should handle switch: `BulkWriteError`
    // // if code is not `11000`
    jest.resetAllMocks();
    const fakeErr_2A = { from: 'BulkWriteError' };
    terminal.ClientException(fakeErr_2A, req, res, next);
    expect(redirect.signInRetry).toBeCalledTimes(0);
    expect(req.flash).toBeCalledTimes(0);
    expect(res.redirect).toBeCalledTimes(1);

    // // if code is `11000`
    jest.resetAllMocks();
    const fakeErr_2B = { from: 'BulkWriteError', code: 11000 };
    terminal.ClientException(fakeErr_2B, req, res, next);
    expect(redirect.signInRetry).toBeCalledTimes(0);
    expect(req.flash).toBeCalledTimes(1);
    expect(res.redirect).toBeCalledTimes(1);


    // (3) should handle switch: `UserExistsError`
    jest.resetAllMocks();
    const fakeErr_3 = { from: 'UserExistsError' };
    terminal.ClientException(fakeErr_3, req, res, next);
    expect(redirect.signInRetry).toBeCalledTimes(0);
    expect(req.flash).toBeCalledTimes(1);
    expect(res.redirect).toBeCalledTimes(1);


    // (4) should handle switch: `ValidationError`
    jest.resetAllMocks();
    const fakeErr_4 = { from: 'ValidationError' };
    terminal.ClientException(fakeErr_4, req, res, next);
    expect(redirect.signInRetry).toBeCalledTimes(0);
    expect(req.flash).toBeCalledTimes(1);
    expect(res.redirect).toBeCalledTimes(1);


    // (5) should handle switch: (default)
    jest.resetAllMocks();
    const fakeErr_5 = {};
    terminal.ClientException(fakeErr_5, req, res, next);
    expect(redirect.signInRetry).toBeCalledTimes(0);
    expect(req.flash).toBeCalledTimes(1);
    expect(res.redirect).toBeCalledTimes(1);


    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: terminal.TemplateException', () => {
    const fakeErr = new exceptions.TemplateException();

    // should response http-500 and proceed the client to the error page
    terminal.TemplateException(fakeErr, req, res, next);
    expect(res.status).lastCalledWith(500);
    expect(res.render).lastCalledWith('./theme/error', { err: fakeErr });

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: terminal.HttpException', () => {
    const fakeErr = new exceptions.HttpException(400);

    // should response http-500 and proceed the client to the error page
    terminal.HttpException(fakeErr, req, res, next);
    expect(res.status).lastCalledWith(400);
    expect(res.render).lastCalledWith('./theme/error', { err: fakeErr });

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('(!) Middleware: exceptionHandler', () => {
    // should handle errors
    // // if is not app-customized errors
    const fakeErr_1 = {};
    exceptionHandler(fakeErr_1, req, res, next);
    expect(res.status).toBeCalledTimes(0);
    expect(res.render).lastCalledWith('./theme/error', { err: fakeErr_1 });

    // // if is app-customized errors
    const fakeErr_2 = { name: 'TemplateException' };
    exceptionHandler(fakeErr_2, req, res, next);
    expect(res.status).toBeCalledTimes(1);
    expect(res.render).lastCalledWith('./theme/error', { err: fakeErr_2 });

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});
