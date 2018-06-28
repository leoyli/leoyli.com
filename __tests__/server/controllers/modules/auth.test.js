/* global __ROOT__, req, res, next */
const {
  isSignedIn, isAuthorized, isValidPasswordSyntax,
} = require(`${__ROOT__}/server/controllers/modules/auth`)[Symbol.for('__TEST__')];


// modules
const { PostsModel } = require(`${__ROOT__}/server/models/`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/server/models/`, () => ({
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

    // (1) should behave differently based on authority
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
      PostsModel.count.mockImplementation(() => 1);
      await _isAuthorized(req, res, next);
      expect(PostsModel.count).toBeCalledTimes(2);
    } catch (err) {
      // expect NOT to be executed
      expect(err).not.toBeInstanceOf(Error);
    }


    // (2) should send query with filed depended on `req.params`
    // // if have not `req.params.canonical`
    expect(PostsModel.count).toBeCalledWith(expect.objectContaining({ _id: null }));

    // // if have `req.params.canonical`
    req.params = { canonical: 'some_slug' };
    await _isAuthorized(req, res, next);
    expect(PostsModel.count).toBeCalledWith(expect.objectContaining({ canonical: 'some_slug' }));


    // should pass the final state checks
    expect(next).toBeCalledTimes(2);
    expect.assertions(6);
  });


  test('Middleware: isValidPasswordSyntax', () => {
    // (1) should pass reset validation
    // // if required `old`
    req.body = { password: { old: 'old', new: 'new', confirmed: 'new' } };
    expect(() => isValidPasswordSyntax(req, res, next)).not.toThrowError();

    // // if not required `old`
    req.body = { password: { new: 'new', confirmed: 'new' } };
    expect(() => isValidPasswordSyntax(req, res, next)).not.toThrowError();


    // (2) should NOT pass validation
    // // if missing filed
    req.body = { password: { old: '', new: 'new', confirmed: 'new' } };
    expect(() => isValidPasswordSyntax(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 10001,
    }));

    // // if not match with `confirmed`
    req.body = { password: { old: 'old', new: 'new', confirmed: 'wrong' } };
    expect(() => isValidPasswordSyntax(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 10002,
    }));

    // // if the same as `old`
    req.body = { password: { old: 'old', new: 'old', confirmed: 'old' } };
    expect(() => isValidPasswordSyntax(req, res, next)).toThrowError(expect.objectContaining({
      name: 'ClientException',
      code: 10003,
    }));


    // should pass the final state checks
    expect(next).toBeCalledTimes(2);
  });
});
