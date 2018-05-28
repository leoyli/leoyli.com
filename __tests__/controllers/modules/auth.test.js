/* global __ROOT__, req, res, next */
const {
  usePassport, isSignedIn, isAuthorized, isValidPasswordReset,
} = require(`${__ROOT__}/controllers/modules/auth`)[Symbol.for('__TEST__')];


// modules
const { PostsModel } = require(`${__ROOT__}/models/`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/models/`, () => ({
  PostsModel: {
    count: jest.fn(),
  },
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// tests
describe('Modules: Auth', () => {
  test('Middleware: usePassport', () => {
    // no testing items
  });


  test('Middleware: isSignedIn', () => {
    const _isSignedIn = isSignedIn[isSignedIn.length - 1];
    req.session.user = {};

    // should throw exception if authenticated
    req.isAuthenticated = () => false;
    expect(() => _isSignedIn(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 20000,
    }));

    // should NOT throw exception if authenticated
    req.isAuthenticated = () => true;
    expect(() => _isSignedIn(req, res, next)).not.toThrowError();

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
  });


  test('Middleware: isAuthorized', async () => {
    const _isAuthorized = isAuthorized[isAuthorized.length - 1];
    req.user = { _id: 'some_user_id' };

    // should behave differently based on authority
    // // if not authorized
    try {
      PostsModel.count.mockImplementationOnce(() => 2);
      await _isAuthorized(req, res, next);
    } catch (err) {
      expect(PostsModel.count).toBeCalledTimes(1);
      expect(err).toStrictEqual(expect.objectContaining({
        name: 'ClientException',
        code: 20001,
      }));
    }

    // // if authorized
    try {
      PostsModel.count.mockImplementationOnce(() => 1);
      await _isAuthorized(req, res, next);
      expect(PostsModel.count).toBeCalledTimes(2);
    } catch (err) {
      // expect NOT to be executed
      expect(err).not.toBeInstanceOf(Error);
    }

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
    expect.assertions(4);
  });


  test('Middleware: isValidPasswordReset', () => {
    // should pass reset validation
    req.body = { password: { old: 'old', new: 'new', confirmed: 'new' } };
    expect(() => isValidPasswordReset(req, res, next)).not.toThrowError();

    // should NOT pass validation
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

    // should pass the final state checks
    expect(next).toBeCalledTimes(1);
  });
});
