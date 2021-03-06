/* global __ROOT__, req, res, next */
const { home: {
  profile, security,
} } = require(`${__ROOT__}/server/controllers/routers/home`)[Symbol.for('__TEST__')];


// modules
const { UsersModel } = require(`${__ROOT__}/server/models/`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/server/models/`, () => ({
  UsersModel: jest.fn(),
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
describe('Routers: home.profile', () => {
  test('Middleware: home_profile_GET', () => {
    req.user = { toObject: jest.fn(() => Symbol.for('some_user_doc')) };
    res.locals.$$VIEW = {};

    // should populate plain user document into $$VIEW
    profile.GET(req, res, next);
    expect(req.user.toObject).toBeCalledTimes(1);
    expect(res.locals.$$VIEW.user).toBe(Symbol.for('some_user_doc'));

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: home_profile_PATCH', async () => {
    req.body.profile = { info: { birthday: '2018-01-01T00:00:00.000Z' } };
    req.user = { _id: 'some_id', nickname: 'some_name' };
    UsersModel.update = jest.fn();

    // should patch user profile
    await profile.PATCH(req, res, next);
    expect(UsersModel.update).lastCalledWith({ _id: req.user._id }, {
      $set: expect.objectContaining({ _$nickname: req.user.nickname }),
    });

    // should proceed the client with flash message
    expect(req.flash).lastCalledWith('info', expect.any(String));
    expect(res.redirect).lastCalledWith('/home/profile');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});


describe('Routers: home.security', () => {
  test('Middleware: home_security_GET', () => {
    // should pass the final state checks
    security.GET(req, res, next);
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: home_security_PATCH', async () => {
    const _home_security_PATCH = security.PATCH[security.PATCH.length - 1];
    req.body.password = { old: 'some_old_pw', new: 'some_new_pw' };
    req.user = { changePassword: jest.fn(() => Promise.resolve()) };

    // should change user password
    await _home_security_PATCH(req, res, next);
    expect(req.user.changePassword).lastCalledWith(req.body.password.old, req.body.password.new);

    // should proceed the client with flash message
    expect(req.flash).lastCalledWith('info', expect.any(String));
    expect(res.redirect).lastCalledWith('/home/profile');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});
