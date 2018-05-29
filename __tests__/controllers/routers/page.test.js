/* global __ROOT__, req, res, next */
const { page: {
  search, edit, show, root,
} } = require(`${__ROOT__}/controllers/routers/page`)[Symbol.for('__TEST__')];


// modules
const { _M_ } = require(`${__ROOT__}/controllers/modules`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/controllers/modules`, () => ({
  _M_: {
    paginatedQuery: jest.fn(() => () => {}),
  },
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  req.flash = jest.fn();
  res.redirect = jest.fn();
});


// tests
describe('Routers: page.search', () => {
  test('Middleware: page_search_GET', async () => {
    // should send a query via `paginatedQuery` module fn
    await search.GET(req, res, next);
    expect(_M_.paginatedQuery).toBeCalledTimes(1);

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});


describe('Routers: page.edit', () => {
  test('Middleware: page_edit_GET', () => {
    // should pass the final state checks
    edit.GET(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});


describe('Routers: page.show', () => {
  test('Middleware: page_show_GET', () => {
    // should pass the final state checks
    show.GET(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});


describe('Routers: page.root', () => {
  test('Middleware: page_root_GET', () => {
    // should pass the final state checks
    root.GET(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
