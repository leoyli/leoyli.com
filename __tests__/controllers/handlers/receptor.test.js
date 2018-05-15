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
    expect(req.flash).toHaveBeenCalledWith('action');
    expect(req.flash).toHaveBeenCalledWith('error');
    expect(req.flash).toHaveBeenCalledWith('info');

    // should not do housekeeping whenever `retry` existed in `flash.action`
    expect(req.session).toHaveProperty('returnTo', '/');
  });


  test('Fn: APIReceptor', () => {
    // should call with the next middleware
    expect(APIReceptor(req, res, next)).toBe(calledWithNext);

    // should set $$MODE to 'html'
    expect(res.locals.$$MODE).toBe('api');
  });
});
