/* global __ROOT__, req, res, next */
const {
  exportHTML, exportJSON, renderer, rendererSymbols,
} = require(`${__ROOT__}/controllers/handlers/exporter.js`)[Symbol.for('__TEST__')];


// mock
const calledWithNext = Symbol('done');
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = () => calledWithNext;
});


// test
describe('Middleware: Exporter', () => {
  test('Fn: renderer.posts.single', () => {
    res.render = jest.fn();

    // should throw an Error (HTTPException(404))
    // // if no given `$$post` (i.e. no $$post.state)
    expect(() => renderer.posts.single()(req, res)).toThrow(Error);

    // // if `post` is recycled
    expect(() => renderer.posts.single({ post: { state: { recycled: true } } })(req, res)).toThrow(Error);

    // // if `post` is unpublished, and user is not signed-in
    expect(() => renderer.posts.single({ post: { state: { published: false } } })(req, res)).toThrow(Error);

    // should success and NOT call with the next middleware
    const someSignedInReq = httpMocks.createRequest({ session: { user: 'some_user_obj' } });
    expect(renderer.posts.single({ post: { state: { published: false } } })(someSignedInReq, res)).not.toBe(calledWithNext);
    expect(res.render).toHaveBeenCalledTimes(1);
  });


  test('Fn: renderer.posts.multiple', () => {
    res.locals.$$VIEW = { route: '' };
    res.render = jest.fn();

    // should success and NOT call with the next middleware
    expect(renderer.posts.multiple()(req, res, next)).not.toBe(calledWithNext);
    expect(res.render).toHaveBeenCalledTimes(1);

    // should have populate meta properties into `res.locals.$$VIEW` based on a given meta
    expect(renderer.posts.multiple({ meta: { num: 2, now: 4, end: 6 } })(req, res, next)).not.toBe(calledWithNext);
    expect(res.locals.$$VIEW).toEqual({ route: '', prev: "?num=2&page='3", next: "?num=2&page='5" });
  });


  test('Fn: exportHTML', () => {
    req.session.chest = { doc: 'test' };
    renderer.posts.single = jest.fn(() => () => {});
    renderer.posts.multiple = jest.fn(() => () => {});
    res.render = jest.fn();

    // should success and NOT call with the next middleware
    // // if renderer is bound to `VIEW_POSTS_SINGLE`
    expect(exportHTML({ renderer: rendererSymbols.VIEW_POSTS_SINGLE })(req, res, next)).not.toBe(calledWithNext);

    // // if renderer is bound to `VIEW_POSTS_MULTIPLE`
    expect(exportHTML({ renderer: rendererSymbols.VIEW_POSTS_MULTIPLE })(req, res, next)).not.toBe(calledWithNext);

    // // if no explicitly issued with a renderer
    expect(exportHTML()(req, res, next)).not.toBe(calledWithNext);

    // should only be evoked once
    expect(renderer.posts.single).toHaveBeenCalledTimes(1);
    expect(renderer.posts.multiple).toHaveBeenCalledTimes(1);
    expect(res.render).toHaveBeenCalledTimes(1);

    // should do housekeeping on session
    expect(req.session).not.toHaveProperty('chest');
  });


  test('Fn: exportJSON', () => {
    Date.now = () => new Date('2018-01-01T00:00:00.000Z');
    req.session.chest = { doc: 'test' };
    res.json = jest.fn();

    // should success and NOT call with the next middleware
    expect(exportJSON(req, res, next)).not.toBe(calledWithNext);
    expect(res.json).toHaveBeenCalledTimes(1);

    // should do housekeeping on session
    expect(req.session).not.toHaveProperty('chest');
  });
});