/* global __ROOT__, req, res, next */
const {
  noCrawlerHeader, noStoreCacheHeader,
} = require(`${__ROOT__}/controllers/modules/header`)[Symbol.for('__TEST__')];


// mock
const calledWithNext = Symbol('done');
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn(() => calledWithNext);
});


// tests
describe('Modules: Query', () => {
  test('Middleware: noCrawlerHeader', () => {
    const arbitraryStringValue = expect.stringMatching('');
    res.set = jest.fn();

    // should call `next`
    expect(noCrawlerHeader(req, res, next)).toBe(calledWithNext);

    // should set headers
    expect(res.set).toBeCalledWith('Cache-Control', arbitraryStringValue);
    expect(res.set).toBeCalledWith('x-robots-tag', 'none');
  });


  test('Middleware: noStoreCacheHeader', () => {
    res.set = jest.fn();

    // should call `next`
    expect(noStoreCacheHeader(req, res, next)).toBe(calledWithNext);

    // should set headers
    expect(res.set).toBeCalledWith('Cache-Control', 'no-store, no-cache, must-revalidate');
  });
});
