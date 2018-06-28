/* global __ROOT__, req, res, next */
const {
  exportHTML, exportJSON, renderer, rendererSymbols,
} = require(`${__ROOT__}/server/controllers/handlers/exporter.js`)[Symbol.for('__TEST__')];


// modules
const { _M_ } = require(`${__ROOT__}/server/controllers/modules`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/server/controllers/modules`, () => ({
  _M_: {
    titleTagModifier: jest.fn(() => () => {}),
  },
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  res.render = jest.fn();
});


// tests
describe('Handlers: Exporter', () => {
  test('Middleware: renderer.posts.single', () => {
    // should throw an Error (HTTPException(404))
    // // if no given `$$post` (i.e. no $$post.state)
    expect(() => renderer.posts.single()(req, res, next))
      .toThrowError('HTTP 404');

    // // if `post` is recycled
    expect(() => renderer.posts.single({ filename: '/', post: { state: { recycled: true } } })(req, res, next))
      .toThrowError('HTTP 404');

    // // if `post` is unpublished, and user is not signed-in
    expect(() => renderer.posts.single({ filename: '/', post: { state: { published: false } } })(req, res, next))
      .toThrowError('HTTP 404');

    // should NOT throw an Error
    req.session.user = {};
    expect(() => renderer.posts.single({ filename: '/', post: { state: { published: false } } })(req, res, res))
      .not.toThrowError();

    // should call `res.render`
    expect(res.render).lastCalledWith('/', expect.objectContaining({
      $$POST: expect.any(Object),
      $$META: expect.any(Object),
    }));

    // should replace title tag when 'post' have a title
    renderer.posts.single({ filename: '/', post: { title: 'some_title', state: {} } })(req, res, next);
    expect(_M_.titleTagModifier).toBeCalledTimes(1);

    // should pass the final state checks
    expect(res.render).toBeCalledTimes(2);
    expect(next).not.toBeCalled();
  });


  test('Middleware: renderer.posts.multiple', () => {
    res.locals.$$VIEW = { route: '' };

    // should call `res.render`
    renderer.posts.multiple()(req, res, next);
    expect(res.render).toBeCalledTimes(1);
    expect(res.render).lastCalledWith(undefined, expect.objectContaining({
      $$LIST: expect.any(Array),
      $$META: expect.any(Object),
    }));

    // should have populate meta properties into `res.locals.$$VIEW` based on a given meta
    renderer.posts.multiple({ filename: '/', meta: { num: 2, now: 4, end: 6 } })(req, res, next);
    expect(res.locals.$$VIEW).toStrictEqual({ route: '', prev: "?num=2&page='3", next: "?num=2&page='5" });

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: exportHTML', () => {
    // should throw error if missing template
    expect(() => exportHTML()(req, res, next)).toThrowError(ReferenceError);

    // should handle based on a given renderer symbol
    // // if is `VIEW_POSTS_SINGLE`
    req.session.cache = { doc: 'test' };
    renderer.posts.single = jest.fn(() => () => {});
    exportHTML({ template: '/', renderer: rendererSymbols.VIEW_POSTS_SINGLE })(req, res, next);
    expect(req.session).not.toHaveProperty('cache');
    expect(renderer.posts.single).toBeCalledTimes(1);

    // // if is `VIEW_POSTS_MULTIPLE`
    req.session.cache = { doc: 'test' };
    renderer.posts.multiple = jest.fn(() => () => {});
    exportHTML({ template: '/', renderer: rendererSymbols.VIEW_POSTS_MULTIPLE })(req, res, next);
    expect(req.session).not.toHaveProperty('cache');
    expect(renderer.posts.multiple).toBeCalledTimes(1);

    // // if any other cases
    req.session.cache = { doc: 'test' };
    exportHTML({ template: '/' })(req, res, next);
    expect(req.session).not.toHaveProperty('cache');
    expect(res.render).toBeCalledTimes(1);

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: exportJSON', () => {
    const someCache = { doc: 'test' };
    Date.now = () => new Date('2018-01-01T00:00:00.000Z').getTime();
    res.json = jest.fn();

    // should export data via `res.json`
    // // if nothing store in session caches
    exportJSON()(req, res, next);
    expect(res.json).lastCalledWith(expect.objectContaining({
      _execution_time: expect.any(String),
      _cache: expect.any(Boolean),
    }));

    // // if something store in session caches
    req.session.cache = someCache;
    exportJSON()(req, res, next);
    expect(res.json).lastCalledWith(expect.objectContaining({
      ...someCache,
      _execution_time: expect.any(String),
      _cache: expect.any(Boolean),
    }));

    // should clean up session caches
    expect(req.session).not.toHaveProperty('cache');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});
