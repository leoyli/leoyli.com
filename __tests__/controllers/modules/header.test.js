/* global __ROOT__, req, res, next */
const {
  noCrawlerHeader, noStoreCacheHeader,
} = require(`${__ROOT__}/controllers/modules/header`)[Symbol.for('__TEST__')];


// mock
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stubbed functions */
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
    expect(res.set).toHaveBeenCalledTimes(2);

    // should pass the final state checks
    expect(next).toHaveBeenCalledTimes(1);
  });


  test('Middleware: noStoreCacheHeader', () => {
    // should set headers
    noStoreCacheHeader(req, res, next);
    expect(res.set).toBeCalledWith('Cache-Control', 'no-store, no-cache, must-revalidate');

    // should be able to use as a modifier (not a middleware)
    res.set.mockReset();
    expect(() => noStoreCacheHeader(req, res)).not.toThrowError();
    expect(res.set).toHaveBeenCalledTimes(1);

    // should pass the final state checks
    expect(next).toHaveBeenCalledTimes(1);
  });
});
