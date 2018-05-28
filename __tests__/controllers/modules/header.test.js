/* global __ROOT__, req, res, next */
const {
  noCrawlerHeader, noStoreCacheHeader,
} = require(`${__ROOT__}/controllers/modules/header`)[Symbol.for('__TEST__')];


// modules
const httpMocks = require('node-mocks-http');


// mocks
beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  res.set = jest.fn();
});


// tests
describe('Modules: Query', () => {
  test('Middleware: noCrawlerHeader', () => {
    // should set headers
    noCrawlerHeader(req, res, next);
    expect(res.set).toBeCalledWith('Cache-Control', expect.any(String));
    expect(res.set).toBeCalledWith('x-robots-tag', 'none');

    // should be able to use as a modifier (not a middleware)
    res.set.mockReset();
    expect(() => noCrawlerHeader(req, res)).not.toThrowError();
    expect(res.set).toBeCalledTimes(2);

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: noStoreCacheHeader', () => {
    // should set headers
    noStoreCacheHeader(req, res, next);
    expect(res.set).toBeCalledWith('Cache-Control', 'no-store, no-cache, must-revalidate');

    // should be able to use as a modifier (not a middleware)
    res.set.mockReset();
    expect(() => noStoreCacheHeader(req, res)).not.toThrowError();
    expect(res.set).toBeCalledTimes(1);

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
  });
});
