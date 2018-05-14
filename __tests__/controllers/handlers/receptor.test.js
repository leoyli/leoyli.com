/* global __ROOT__, req, res, next */
const {
  browserReceptor, APIReceptor,
} = require(`${__ROOT__}/controllers/handlers/receptor.js`)[Symbol.for('__TEST__')];


// mock
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = () => 'passed';
});


// test
describe('Middleware: Receptor', () => {
  test('Fn: browserReceptor', () => {
    req.flash = jest.fn(call => (call === 'action' ? ['retry'] : []));
    req.session.returnTo = '/';

    // should success and call with the next middleware
    expect(browserReceptor(req, res, next)).toBe('passed');

    // should set $$MODE to 'html'
    expect(res.locals.$$MODE).toBe('html');

    // should create flash containers
    expect(req.flash).toHaveBeenCalledWith('action');
    expect(req.flash).toHaveBeenCalledWith('error');
    expect(req.flash).toHaveBeenCalledWith('info');

    // should not run housekeeping with `retry` in `flash.action`
    expect(req.session).toHaveProperty('returnTo', '/');
  });


  test('Fn: APIReceptor', () => {
    // should success and call with the next middleware
    expect(APIReceptor(req, res, next)).toBe('passed');

    // should set $$MODE to 'html'
    expect(res.locals.$$MODE).toBe('api');
  });
});
