/* global __ROOT__, req, res, next */
const { site: {
  configs, upload, stack, root,
} } = require(`${__ROOT__}/server/controllers/routers/site`)[Symbol.for('__TEST__')];


// modules
const { PostsModel, MediaModel, ConfigsModel } = require(`${__ROOT__}/server/models/`);
const { _U_ } = require(`${__ROOT__}/server/controllers/utilities`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/server/models/`, () => ({
  PostsModel: jest.fn(),
  MediaModel: jest.fn(),
  ConfigsModel: jest.fn(),
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  req.flash = jest.fn();
  res.redirect = jest.fn();
});


// assertion
const toHandleHttpExceptionsForInvalidCollection = async (fn, req, res, next) => {
  // should through an Error(HTTPException(404))
  // // if `collection` is  `posts` or `media`
  try {
    req.params.collection = 'posts';
    await fn(req, res, next);
    req.params.collection = 'media';
    await fn(req, res, next);
  } catch (err) {
    // expect NOT to be executed
    expect(err).not.toBeInstanceOf(Error);
  }

  // // if is others
  try {
    req.params.collection = '';
    await fn(req, res, next);
  } catch (err) {
    expect(err).toStrictEqual(expect.objectContaining({
      name: 'HttpException',
      code: 404,
    }));
  }

  return true;
};


// tests
describe('Routers: Site.configs', () => {
  test('Middleware: site_configs_GET', () => {
    // should pass the final state checks
    configs.GET(req, res, next);
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: site_configs_PATCH', async () => {
    req.body.configs = Symbol.for('some_configs');
    req.app = { get: jest.fn(), set: jest.fn() };
    ConfigsModel.updateConfig = jest.fn();

    // should call `updateConfig` model method
    await configs.PATCH(req, res, next);
    expect(ConfigsModel.updateConfig).lastCalledWith(req.app, Symbol.for('some_configs'));

    // should pass the final state checks
    expect(res.redirect).lastCalledWith('back');
    expect(next).not.toBeCalled();
  });
});


describe('Routers: Site.upload', () => {
  test('Middleware: site_upload_GET', () => {
    // should pass the final state checks
    upload.GET(req, res, next);
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: site_upload_POST', async () => {
    const _site_upload_POST = upload.POST[upload.POST.length - 1];
    req.session.user = {};
    MediaModel.create = jest.fn(items => Promise.resolve(items));

    // should have no special calls at all
    req.body.busboySlip = { raw: [], mes: []};
    await _site_upload_POST(req, res, next);
    expect(MediaModel.create).not.toBeCalled();
    expect(req.flash).not.toBeCalled();

    // should create media associated with the uploader
    req.body.busboySlip = { raw: [{}, {}] };
    await _site_upload_POST(req, res, next);
    expect(MediaModel.create).toBeCalledTimes(1);
    expect(req.body.busboySlip.raw).toContainEqual(expect.objectContaining({ author: {} }));
    expect(req.flash).lastCalledWith('info', expect.stringContaining('2 file'));

    // should flash all messages
    req.body.busboySlip = { mes: [''] };
    await _site_upload_POST(req, res, next);
    expect(req.flash).lastCalledWith('error', expect.any(String));

    // should pass the final state checks
    expect(req.flash).toBeCalledTimes(2);
    expect(next).not.toBeCalled();
  });
});


describe('Routers: Site.stack', () => {
  test('Middleware: site_stack_GET', async () => {
    _U_.express.wrapMiddleware = jest.fn(() => () => {});

    // (*) should run recycling tests
    expect(await toHandleHttpExceptionsForInvalidCollection(stack.GET, req, res, next)).toBeTruthy();
    expect(_U_.express.wrapMiddleware).toBeCalled();

    // should pass the final state checks
    expect(next).not.toBeCalled();
    expect.assertions(4);
  });


  test('Middleware: site_stack_PATCH', async () => {
    _U_.express.wrapMiddleware = jest.fn(() => () => {});
    PostsModel.update = jest.fn();
    MediaModel.update = jest.fn();
    req.body = { action: '' };

    // (*) should run recycling tests
    expect(await toHandleHttpExceptionsForInvalidCollection(stack.PATCH, req, res, next)).toBeTruthy();

    // should not touch DB if no actions
    jest.resetAllMocks();
    req.params.collection = 'posts';
    await stack.PATCH(req, res, next);
    expect(PostsModel.update).toBeCalledTimes(0);
    expect(MediaModel.update).toBeCalledTimes(0);

    // should update documents in a given collection
    req.body = { action: 'some_action', target: [{}] };

    // // if is 'post'
    jest.resetAllMocks();
    req.params.collection = 'posts';
    await stack.PATCH(req, res, next);
    expect(PostsModel.update).toBeCalledTimes(1);
    expect(MediaModel.update).toBeCalledTimes(0);

    // // if is 'media'
    jest.resetAllMocks();
    req.params.collection = 'media';
    await stack.PATCH(req, res, next);
    expect(PostsModel.update).toBeCalledTimes(0);
    expect(MediaModel.update).toBeCalledTimes(1);

    // should update in accordance with actions
    expect(MediaModel.update).lastCalledWith(
      expect.anything(),
      { $set: expect.objectContaining({ 'state.some_action': true }) },
      expect.anything(),
    );

    // should pass the final state checks
    expect(next).not.toBeCalled();
    expect.assertions(10);
  });
});


describe('Routers:', () => {
  test('Middleware: site_main_GET', () => {
    // should pass the final state checks
    root.GET(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
