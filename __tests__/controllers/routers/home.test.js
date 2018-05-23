/* global __ROOT__, req, res, next */
const { home: {
  profile, security,
} } = require(`${__ROOT__}/controllers/routers/home`)[Symbol.for('__TEST__')];


// mock
const { UsersModel } = require(`${__ROOT__}/models/`);
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stubbed functions */
  req.flash = jest.fn();
  res.redirect = jest.fn();
});


// test
describe('Routers: home.profile', () => {
  test('Middleware: home_profile_GET', () => {
    req.user = { toObject: jest.fn(() => Symbol.for('some_user_doc')) };
    res.locals.$$VIEW = {};

    // should populate plain user document into $$VIEW
    profile.GET(req, res, next);
    expect(req.user.toObject).toHaveBeenCalledTimes(1);
    expect(res.locals.$$VIEW.user).toBe(Symbol.for('some_user_doc'));

    // should pass the final state checks
    expect(next).toHaveBeenCalledTimes(1);
  });


  test('Middleware: home_profile_PATCH', async () => {
    req.body.profile = { info: { birthday: '2018-01-01T00:00:00.000Z' } };
    req.user = { _id: 'some_id', nickname: 'some_name' };

    /* stub `update` model method */
    UsersModel.update = jest.fn();

    // should patch user profile
    await profile.PATCH(req, res, next);
    expect(UsersModel.update).toHaveBeenLastCalledWith({ _id: req.user._id }, {
      $set: expect.objectContaining({ _$nickname: req.user.nickname }),
    });

    // should proceed the client with flash message
    expect(req.flash).toHaveBeenLastCalledWith('info', expect.any(String));
    expect(res.redirect).toHaveBeenLastCalledWith('/home/profile');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});


describe('Routers: home.security', () => {
  test('Middleware: home_security_GET', () => {
    // should pass the final state checks
    security.GET(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });


  test('Middleware: home_security_PATCH', async () => {
    const _home_security_PATCH = security.PATCH[security.PATCH.length - 1];
    req.body.password = { old: 'some_old_pw', new: 'some_new_pw' };

    /* stub `changePassword` method @lib'passport-local-mongoose' */
    req.user = { changePassword: jest.fn(() => Promise.resolve()) };
    await _home_security_PATCH(req, res, next);

    // should change user password
    expect(req.user.changePassword).toHaveBeenLastCalledWith(req.body.password.old, req.body.password.new);

    // should proceed the client with flash message
    expect(req.flash).toHaveBeenLastCalledWith('info', expect.any(String));
    expect(res.redirect).toHaveBeenLastCalledWith('/home/profile');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});
