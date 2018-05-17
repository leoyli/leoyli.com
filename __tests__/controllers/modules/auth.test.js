/* global __ROOT__, req, res, next */
const {
  usePassport, isSignedIn, isAuthorized, isValidPasswordReset,
} = require(`${__ROOT__}/controllers/modules/auth`)[Symbol.for('__TEST__')];


// mock
const PostsModel = require(`${__ROOT__}/models/posts`);
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// test
describe('Modules: Auth', () => {
  test('Middleware: isSignedIn', () => {
    const isSignedInCore = isSignedIn[isSignedIn.length - 1];
    req.session.user = {};

    // should throw exception if authenticated
    req.isAuthenticated = () => false;
    expect(() => isSignedInCore(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 20000,
    }));

    // should not throw exception if authenticated
    req.isAuthenticated = () => true;
    expect(() => isSignedInCore(req, res, next)).not.toThrowError();

    // should call `next` only once
    expect(next).toHaveBeenCalledTimes(1);
  });


  test('Middleware: isAuthorized', async () => {
    const isAuthorizedCore = isAuthorized[isAuthorized.length - 1];
    req.user = { _id: 'some_user_id' };

    // should throw exception if not authorized
    try {
      PostsModel.count = jest.fn(() => 2);
      await isAuthorizedCore(req, res, next);
    } catch (err) {
      expect(err).toEqual(expect.objectContaining({
        name: 'ClientException',
        code: 20001,
      }));
    }

    // should NOT throw exception if authorized
    PostsModel.count = jest.fn(() => 1);
    await isAuthorizedCore(req, res, next);

    // should call `next` only once
    expect(next).toHaveBeenCalledTimes(1);

    // expect total assertions to be called
    expect.assertions(2);
  });


  test('Middleware: isValidPasswordReset', () => {
    // should pass reset validation
    req.body = { password: { old: 'old', new: 'new', confirmed: 'new' } };
    expect(() => isValidPasswordReset(req, res, next)).not.toThrowError();

    // should not pass validation
    // if missing filed
    req.body = { password: { old: 'old', new: 'new', confirmed: '' } };
    expect(() => isValidPasswordReset(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 10001,
    }));

    // if not match with `confirmed`
    req.body = { password: { old: 'old', new: 'new', confirmed: 'wrong' } };
    expect(() => isValidPasswordReset(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 10002,
    }));

    // if the same as `old`
    req.body = { password: { old: 'old', new: 'old', confirmed: 'old' } };
    expect(() => isValidPasswordReset(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 10003,
    }));

    // should call `next` only once
    expect(next).toHaveBeenCalledTimes(1);
  });
});
