/* global __ROOT__, req, res, next */
const {
  browserReceptor, APIReceptor,
} = require(`${__ROOT__}/controllers/handlers/receptor.js`)[Symbol.for('__TEST__')];


// mock
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// test
describe('Handlers: Receptor', () => {
  test('Middleware: browserReceptor', () => {
    req.flash = jest.fn(call => (call === 'action' ? ['retry'] : []));
    req.session.returnTo = '/';
    browserReceptor(req, res, next);

    // should set $$MODE to 'html'
    expect(res.locals.$$MODE).toBe('html');

    // should create flash containers
    expect(req.flash).toBeCalledWith('action');
    expect(req.flash).toBeCalledWith('error');
    expect(req.flash).toBeCalledWith('info');

    // should not do housekeeping whenever `retry` existed in `flash.action`
    expect(req.session).toHaveProperty('returnTo', '/');

    // should call `next`
    expect(next).toHaveBeenCalledTimes(1);
  });


  test('Middleware: APIReceptor', () => {
    const arbitraryStringValue = expect.stringMatching('');
    res.set = jest.fn();
    APIReceptor(req, res, next);

    // should set $$MODE to 'html'
    expect(res.locals.$$MODE).toBe('api');

    // should set CORS headers
    expect(res.set).toBeCalledWith('Access-Control-Allow-Origin', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Allow-Methods', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Allow-Headers', arbitraryStringValue);
    // expect(res.set).toBeCalledWith('Access-Control-Allow-Credentials', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Max-Age', arbitraryStringValue);

    // should call `next`
    expect(next).toHaveBeenCalledTimes(1);
  });
});
