/* global __ROOT__, req, res, next */
const { auth: {
  signup, signin, signout,
} } = require(`${__ROOT__}/controllers/routers/auth`)[Symbol.for('__TEST__')];


// modules
const { UsersModel } = require(`${__ROOT__}/models/`);
const passport = require('passport');
const httpMocks = require('node-mocks-http');


// mocks
jest.mock('passport', () => ({
  authenticate: jest.fn(),
  initialize: jest.fn(),
  session: jest.fn(),
}));

jest.mock(`${__ROOT__}/models/`, () => ({
  UsersModel: jest.fn(),
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();

  /* stub functions */
  req.flash = jest.fn();
  res.redirect = jest.fn();
  req.isAuthenticated = jest.fn();
});


// assertion
const toProceedTheClientByAuthenticity = (fn, req, res, next) => {
  // should proceed the client based on authenticity
  // // if not authenticated
  req.isAuthenticated.mockReturnValueOnce(false);
  fn(req, res, next);
  expect(res.redirect).toHaveBeenCalledTimes(0);
  expect(next).toHaveBeenCalledTimes(1);

  // // if authenticated
  req.isAuthenticated.mockReturnValueOnce(true);
  fn(req, res, next);
  expect(res.redirect).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledTimes(1);

  return true;
};


// tests
describe('Routers: Auth.signup', () => {
  test('Middleware: account_signup_GET', () => {
    // (*) should run recycling tests
    expect(toProceedTheClientByAuthenticity(signup.GET, req, res, next)).toBeTruthy();
    expect(res.redirect).toBeCalledWith('/home');
  });


  test('Middleware: account_signup_POST', async () => {
    const _account_signup_POST = signup.POST[signup.POST.length - 1];
    UsersModel.register = jest.fn(() => Symbol.for('some_user_doc'));
    req.logIn = jest.fn();
    req.body = { username: 'some_new_user', password: { new: 'some_pw', confirmed: 'some_pw' } };

    // should call `register` on the model
    await _account_signup_POST(req, res, next);
    expect(UsersModel.register).toBeCalledWith(expect.any(UsersModel), expect.any(String));

    // should `login` the user
    // // if fail
    try {
      req.logIn.mockImplementationOnce((doc, cb) => cb(new Error()));
      await _account_signup_POST(req, res, next);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }

    // // if success
    try {
      req.logIn.mockImplementationOnce((doc, cb) => cb());
      await _account_signup_POST(req, res, next);

      // should call with `someUserDoc` return from the stubbed function
      expect(req.logIn).toBeCalledWith(Symbol.for('some_user_doc'), expect.any(Function));

      // should proceed the client
      expect(req.flash).toBeCalledWith('info', expect.stringContaining(req.body.username));
      expect(res.redirect).toBeCalledWith('/home');
    } catch (err) {
      // expect NOT to be executed
      expect(err).not.toBeInstanceOf(Error);
    }

    // should pass the final state checks
    expect(next).not.toBeCalled();
    expect.assertions(6);
  });
});


describe('Routers: Auth.signin', () => {
  test('Middleware: account_signin_GET', () => {
    res.locals.$$VIEW = { flash: { action: [] } };

    // (*) should run recycling tests
    expect(toProceedTheClientByAuthenticity(signin.GET, req, res, next)).toBeTruthy();
    expect(res.redirect).toBeCalledWith('/home');
    jest.resetAllMocks();

    // should preserve 'retry' flash action
    req.isAuthenticated.mockReturnValue(false);

    // // if no `retry` action
    signin.GET(req, res, next);
    expect(req.flash).toHaveBeenCalledTimes(0);

    // // if with `retry` action
    res.locals.$$VIEW.flash.action = ['retry'];
    signin.GET(req, res, next);
    expect(req.flash).toBeCalledWith('action', 'retry');
    expect(req.flash).toHaveBeenCalledTimes(1);
  });


  test('Middleware: account_signin_POST', async () => {
    // (L0) (*) should run recycling tests
    passport.authenticate.mockImplementation((strategy, cb) => jest.fn(cb));
    expect(toProceedTheClientByAuthenticity(signin.POST, req, res, next)).toBeTruthy();
    expect(res.redirect).toBeCalledWith('/home');
    jest.resetAllMocks();


    // (L1) should handle message incoming from `passport.authenticate`
    const someAuthUser = { _id: 'some_id', picture: 'some_location', nickname: 'some_name', something_else: '/' };
    const mockPassportCB = jest.fn();
    passport.authenticate.mockImplementation((strategy, cb) => jest.fn(() => mockPassportCB(cb)));
    req.logIn = jest.fn();

    // // if an unexpected errors (e.g. DB)
    mockPassportCB.mockImplementationOnce(cb => cb(Symbol.for('some_error')));
    signin.POST(req, res, next);
    expect(next).toHaveBeenLastCalledWith(Symbol.for('some_error'));

    // // if fail to be authenticated
    mockPassportCB.mockImplementationOnce(cb => cb(null, null));
    signin.POST(req, res, next);
    expect(next).toHaveBeenLastCalledWith(expect.objectContaining({
      name: 'ClientException',
      code: 20002,
    }));

    // // if authenticated
    mockPassportCB.mockImplementation(cb => cb(null, someAuthUser));
    signin.POST(req, res, next);
    expect(req.logIn).toBeCalledWith(someAuthUser, expect.any(Function));


    // (L2) should handle message incoming from `req.logIn`
    Date.now = () => new Date('2018-01-01T00:00:00.000Z').getTime();
    req.session = { cookie: {} };
    someAuthUser.updateLastTimeLog = jest.fn();

    // // if failed to be signed-in
    req.logIn.mockImplementationOnce((_someAuthUser, cb) => cb(Symbol.for('some_error')));
    signin.POST(req, res, next);
    expect(next).toHaveBeenLastCalledWith(Symbol.for('some_error'));

    // // if can be signed-in
    req.logIn.mockImplementation((_someAuthUser, cb) => cb());
    signin.POST(req, res, next);
    expect(res.redirect).toHaveBeenCalledTimes(1);


    // (L3) should handle successful sign-in
    // should update user document
    expect(someAuthUser.updateLastTimeLog).toBeCalledWith('signIn');

    // should partially populate user document into session
    expect(req.session).toEqual(expect.objectContaining({
      user: {
        _id: someAuthUser._id,
        picture: someAuthUser.picture,
        nickname: someAuthUser.nickname,
      },
      cookie: {
        expires: expect.any(Date),
      },
    }));

    // should set cookie `expires` to now
    expect(req.session.cookie.expires.getTime() - Date.now()).toBe(0);

    // should proceed the client with flash message
    expect(req.flash).toHaveBeenLastCalledWith('info', expect.stringContaining(someAuthUser.nickname));
    expect(res.redirect).toHaveBeenLastCalledWith('/home');

    // should handle special conditions
    req.body.isPersisted = true;
    req.session = { cookie: {}, returnTo: 'some_location' };
    signin.POST(req, res, next);
    expect(req.session.cookie.expires.getTime() - Date.now()).toBe(14 * 24 * 3600000);
    expect(res.redirect).toHaveBeenLastCalledWith(req.session.returnTo);


    // should pass the final state checks
    expect(next).toHaveBeenCalledTimes(3);
  });
});


describe('Routers: Auth.signout', () => {
  test('Middleware: account_signout_GET', async () => {
    req.session.user = {};
    req.logout = jest.fn();

    // should proceed the client based on authenticity
    // // if not authenticated
    req.isAuthenticated.mockReturnValueOnce(false);
    signout.GET(req, res, next);
    expect(req.flash).not.toBeCalled();
    expect(req.logout).toHaveBeenCalledTimes(0);
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenLastCalledWith('back');

    // // if authenticated
    req.isAuthenticated.mockReturnValueOnce(true);
    signout.GET(req, res, next);
    expect(req.flash).toBeCalledWith('info', expect.any(String));
    expect(req.logout).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledTimes(2);
    expect(res.redirect).toHaveBeenLastCalledWith('back');

    // should pass the final state checks
    expect(next).not.toBeCalled();
  });
});
