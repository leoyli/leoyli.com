/* global __ROOT__, req, res, next */
const {
  browserReceptor, APIReceptor,
} = require(`${__ROOT__}/controllers/handlers/receptor.js`)[Symbol.for('__TEST__')];


// mock
const calledWithNext = Symbol('done');
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = () => calledWithNext;
});


// test
describe('Middleware: Receptor', () => {
  test('Fn: browserReceptor', () => {
    req.flash = jest.fn(call => (call === 'action' ? ['retry'] : []));
    req.session.returnTo = '/';

    // should call with the next middleware
    expect(browserReceptor(req, res, next)).toBe(calledWithNext);

    // should set $$MODE to 'html'
    expect(res.locals.$$MODE).toBe('html');

    // should create flash containers
    expect(req.flash).toBeCalledWith('action');
    expect(req.flash).toBeCalledWith('error');
    expect(req.flash).toBeCalledWith('info');

    // should not do housekeeping whenever `retry` existed in `flash.action`
    expect(req.session).toHaveProperty('returnTo', '/');
  });


  test('Fn: APIReceptor', () => {
    const arbitraryStringValue = expect.stringMatching('');
    res.set = jest.fn();

    // should call with the next middleware
    expect(APIReceptor(req, res, next)).toBe(calledWithNext);

    // should set $$MODE to 'html'
    expect(res.locals.$$MODE).toBe('api');

    // should set CORS headers
    expect(res.set).toBeCalledWith('Access-Control-Allow-Origin', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Allow-Methods', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Allow-Headers', arbitraryStringValue);
    // expect(res.set).toBeCalledWith('Access-Control-Allow-Credentials', arbitraryStringValue);
    expect(res.set).toBeCalledWith('Access-Control-Max-Age', arbitraryStringValue);
  });
});
