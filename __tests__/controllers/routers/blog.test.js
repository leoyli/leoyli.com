/* global __ROOT__, req, res, next */
const { blog: {
  edit, post, list,
} } = require(`${__ROOT__}/controllers/routers/blog`)[Symbol.for('__TEST__')];


// modules
const { _M_ } = require(`${__ROOT__}/controllers/modules`);
const { PostsModel } = require(`${__ROOT__}/models/`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/controllers/modules`, () => ({
  _M_: {
    paginatedQuery: jest.fn(() => () => {}),
  },
}));

jest.mock(`${__ROOT__}/models/`, () => ({
  PostsModel: jest.fn(),
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  req.flash = jest.fn();
  res.redirect = jest.fn();

  /* fake documents */
  req.session = { user: {} };
  req.body.post = { title: 'some_title', content: 'some_content' };
});


// tests
describe('Routers: Blog.edit', () => {
  test('Middleware: blog_edit_alias', async () => {
    req.params = { canonical: 'some_slug' };
    PostsModel.findOne = jest.fn();

    // should find a post with the canonical slug
    // // if with no received post
    try {
      PostsModel.findOne.mockResolvedValueOnce(null);
      await edit.alias(req, res, next);
    } catch (err) {
      expect(err).toEqual(expect.objectContaining({
        name: 'HttpException',
        code: 404,
      }));
    }

    // // if with received post
    try {
      PostsModel.findOne.mockResolvedValueOnce({ _id: 'a12b34c57d78e90f12a34b56' });
      await edit.alias(req, res, next);
      expect(PostsModel.findOne).toHaveBeenLastCalledWith(req.params);

      // should cache returned document
      expect(req.session.cache).toHaveProperty('post');

      // should proceed the client
      expect(res.redirect).toHaveBeenLastCalledWith('/blog/a12b34c57d78e90f12a34b56/edit');
    } catch (err) {
      // expect NOT to be executed
      expect(err).not.toBeInstanceOf(Error);
    }

    // should pass the final state checks
    expect(next).not.toBeCalled();
    expect.assertions(5);
  });


  test('Middleware: blog_edit_GET', async () => {
    PostsModel.findById = jest.fn(() => Promise.resolve(Symbol.for('some_post')));

    // should get a post based on cases
    // // if url is `blog/edit` or `blog/new`
    req.url = '/new';
    await edit.GET(req, res, next);

    // // if cached
    req.url = '/a12b34c57d78e90f12a34b56';
    req.session.cache = { post: { _id: 'a12b34c57d78e90f12a34b56' } };
    await edit.GET(req, res, next);
    expect(PostsModel.findById).not.toBeCalled();

    // // if not correctly cached
    req.url = '/a12b34c57d78e90f12a34b56';
    req.session.cache = { post: { _id: 'a12b34c57d78e90f12a34b57' } };
    await edit.GET(req, res, next);
    expect(req.session.cache).toHaveProperty('post', Symbol.for('some_post'));
    expect(PostsModel.findById).toBeCalledWith(expect.any(Object));
    expect(PostsModel.findById.mock.calls[0][0].toHexString()).toEqual('a12b34c57d78e90f12a34b56');

    // should pass the final state checks
    expect(next).toHaveBeenCalledTimes(3);
  });
});


describe('Routers: Blog.post', () => {
  test('Middleware: blog_post_alias', async () => {
    PostsModel.findOne = jest.fn(() => Promise.resolve(Symbol.for('some_post')));
    req.params.canonical = 'some_slug';

    // should find the post by _id
    // // if cached
    req.session.cache = { post: { canonical: 'some_slug' } };
    await post.alias(req, res, next);
    expect(PostsModel.findOne).not.toBeCalled();

    // // if not correctly cached
    req.session.cache = { post: { canonical: 'wrong_slug' } };
    await post.alias(req, res, next);
    expect(req.session.cache).toHaveProperty('post', Symbol.for('some_post'));
    expect(PostsModel.findOne).toHaveBeenLastCalledWith(expect.objectContaining({
      canonical: expect.any(String), 'time._recycled': { $eq: null },
    }));

    // should pass the final state checks
    expect(next).toHaveBeenCalledTimes(2);
  });


  test('Middleware: blog_post_GET', async () => {
    req.params = ['a12b34c57d78e90f12a34b56'];
    PostsModel.findOne = jest.fn();

    // should find a post with the canonical slug
    // // if with no received post
    try {
      PostsModel.findOne.mockResolvedValueOnce(null);
      await post.GET(req, res, next);
    } catch (err) {
      expect(err).toEqual(expect.objectContaining({
        name: 'HttpException',
        code: 404,
      }));
    }

    // // if with received post
    try {
      PostsModel.findOne.mockResolvedValueOnce({ canonical: 'some_slug' });
      await post.GET(req, res, next);
      expect(PostsModel.findOne).toHaveBeenLastCalledWith(expect.objectContaining({
        _id: expect.any(String), 'time._recycled': { $eq: null },
      }));

      // should cache returned document
      expect(req.session.cache).toHaveProperty('post');

      // should proceed the client
      expect(res.redirect).toHaveBeenLastCalledWith('/blog/some_slug');
    } catch (err) {
      // expect NOT to be executed
      expect(err).not.toBeInstanceOf(Error);
    }

    // should pass the final state checks
    expect(next).not.toBeCalled();
    expect.assertions(5);
  });


  test('Middleware: blog_post_PUT', async () => {
    req.url = '/blog/a12b34c57d78e90f12a34b56';
    PostsModel.update = jest.fn(() => Promise.resolve({ canonical: 'some_slug' }));

    // should update the post with _id
    await post.PUT(req, res, next);
    expect(PostsModel.update).toHaveBeenLastCalledWith(
      expect.objectContaining({ _id: expect.any(Object) }),
      expect.objectContaining({ $set: { ...req.body.post } }),
      { new: true },
    );

    // should cache returned document
    expect(req.session.cache).toHaveProperty('post');

    // should proceed the client with flash message
    expect(req.flash).toHaveBeenLastCalledWith('info', expect.any(String));
    expect(res.redirect).toHaveBeenLastCalledWith('/blog/some_slug');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: blog_post_DELETE', async () => {
    req.url = '/blog/a12b34c57d78e90f12a34b56';
    PostsModel.remove = jest.fn();

    // should delete the post with _id
    await post.DELETE(req, res, next);
    expect(PostsModel.remove).toHaveBeenLastCalledWith(expect.objectContaining({
      _id: expect.any(Object),
    }));

    // should proceed the client with flash message
    expect(req.flash).toHaveBeenLastCalledWith('info', expect.any(String));
    expect(res.redirect).toHaveBeenLastCalledWith('/blog/');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});


describe('Routers: Blog.list', () => {
  test('Middleware: blog_list_GET', async () => {
    // should send a query via `paginatedQuery` module fn
    await list.GET(req, res, next);
    expect(_M_.paginatedQuery).toHaveBeenCalledTimes(1);

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });


  test('Middleware: blog_list_POST', async () => {
    PostsModel.create = jest.fn();

    // should create a post
    await list.POST(req, res, next);
    expect(PostsModel.create).toHaveBeenLastCalledWith(expect.objectContaining({
      title: expect.any(String),
      content: expect.any(String),
      author: expect.any(Object),
    }));

    // should proceed the client with flash message
    expect(req.flash).toHaveBeenLastCalledWith('info', expect.any(String));
    expect(res.redirect).toHaveBeenLastCalledWith('/blog/');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});
