/* global __ROOT__, req, res, next */
const {
  init,
} = require(`${__ROOT__}/server/controllers/routers/init`)[Symbol.for('__TEST__')];


// modules
const { PostsModel, UsersModel, ConfigsModel } = require(`${__ROOT__}/server/models/`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/server/models/`, () => ({
  PostsModel: jest.fn(),
  UsersModel: jest.fn(),
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


// tests
describe('Routers: init', () => {
  test('Middleware: init_GET', async () => {
    res.locals = { $$SITE: {} };

    // should proceed the client
    // // if app have initialized
    req.app = { get: () => ({ initialized: true }) };
    await init.GET(req, res, next);
    expect(res.redirect).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(0);

    // // if app have not initialized
    req.app = { get: () => ({ initialized: false }) };
    await init.GET(req, res, next);
    expect(res.redirect).toBeCalledTimes(1);
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: init_POST', async () => {
    const init_POST = init.POST[1];
    const updateLastTimeLog = jest.fn();
    PostsModel.create = jest.fn(arg => Promise.resolve(arg));
    UsersModel.register = jest.fn(arg => Promise.resolve({ ...arg, updateLastTimeLog }));
    ConfigsModel.updateConfig = jest.fn(arg => Promise.resolve(arg));
    req.logIn = jest.fn((user, cb) => cb());
    req.body = { password: {} };

    // (1) should redirect the client when the app have been initialized
    req.app = { get: () => ({ initialized: true }) };
    await init_POST(req, res, next);
    expect(res.redirect).lastCalledWith('/');


    // (2) should initialize the app
    jest.clearAllMocks();
    req.app = { get: () => ({ initialized: false }) };
    await init_POST(req, res, next);

    // should create/update three db collections
    expect(PostsModel.create).toBeCalledTimes(1);
    expect(UsersModel.register).toBeCalledTimes(1);
    expect(ConfigsModel.updateConfig).toBeCalledWith(expect.any(Object), { initialized: true });

    // should auto-sign-in the admin
    expect(req.logIn).toBeCalledTimes(1);
    expect(updateLastTimeLog).toBeCalledWith('signIn');
    expect(req.session).toHaveProperty('user');
    expect(req.flash).toBeCalledWith('info', expect.any(String));

    // should redirect the client to the 'hello world' post
    expect(res.redirect).toBeCalledWith('/blog/hello-world');


    // should pass the final state checks
    expect(next).toBeCalledTimes(0);
  });
});

