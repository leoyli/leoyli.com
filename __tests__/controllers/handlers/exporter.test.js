/* global __ROOT__, req, res, next */
const {
  exportHTML, exportJSON, renderer, rendererSymbols,
} = require(`${__ROOT__}/controllers/handlers/exporter.js`)[Symbol.for('__TEST__')];


// mock
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stubbed functions */
  res.render = jest.fn();
});


// test
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
    expect(res.render).toHaveBeenLastCalledWith('/', expect.objectContaining({
      $$POST: expect.any(Object),
      $$META: expect.any(Object),
    }));

    // should pass the final state checks
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(next).not.toBeCalled();
  });


  test('Middleware: renderer.posts.multiple', () => {
    res.locals.$$VIEW = { route: '' };

    // should call `res.render`
    renderer.posts.multiple()(req, res, next);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render).toHaveBeenLastCalledWith(undefined, expect.objectContaining({
      $$LIST: expect.any(Array),
      $$META: expect.any(Object),
    }));

    // should have populate meta properties into `res.locals.$$VIEW` based on a given meta
    renderer.posts.multiple({ filename: '/', meta: { num: 2, now: 4, end: 6 } })(req, res, next);
    expect(res.locals.$$VIEW).toEqual({ route: '', prev: "?num=2&page='3", next: "?num=2&page='5" });

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: exportHTML', () => {
    // should handle based on a given renderer symbol
    // // if is `VIEW_POSTS_SINGLE`
    req.session.chest = { doc: 'test' };
    renderer.posts.single = jest.fn(() => () => {});
    exportHTML({ renderer: rendererSymbols.VIEW_POSTS_SINGLE })(req, res, next);
    expect(req.session).not.toHaveProperty('chest');
    expect(renderer.posts.single).toHaveBeenCalledTimes(1);

    // // if is `VIEW_POSTS_MULTIPLE`
    req.session.chest = { doc: 'test' };
    renderer.posts.multiple = jest.fn(() => () => {});
    exportHTML({ renderer: rendererSymbols.VIEW_POSTS_MULTIPLE })(req, res, next);
    expect(req.session).not.toHaveProperty('chest');
    expect(renderer.posts.multiple).toHaveBeenCalledTimes(1);

    // // if any other cases
    req.session.chest = { doc: 'test' };
    exportHTML()(req, res, next);
    expect(req.session).not.toHaveProperty('chest');
    expect(res.render).toHaveBeenCalledTimes(1);

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: exportJSON', () => {
    Date.now = () => new Date('2018-01-01T00:00:00.000Z').getTime();
    req.session.chest = { doc: 'test' };
    res.json = jest.fn();

    // should call `res.json`
    exportJSON()(req, res, next);
    expect(res.json).toHaveBeenCalledTimes(1);

    // should do housekeeping on session
    expect(req.session).not.toHaveProperty('chest');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});
