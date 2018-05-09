const {
  wrapAsync, wrapMiddleware,
} = require(`${global.__ROOT__}/controllers/utilities/express`)[Symbol.for('__TEST__')];


// test
describe('Utilities: Express', () => {
  test('Fn: wrapAsync', async () => {
    const mockAsyncMiddleware = async (req, res, next) => next();
    const mockMiddleware = (req, res, next) => next();
    const target = [mockAsyncMiddleware, mockMiddleware, [mockAsyncMiddleware, mockMiddleware]];

    // async function should be wrapped with prefixed name
    const test = target.map(fn => wrapAsync(fn));
    expect(test[0].name).toBe('wrappedAsync mockAsyncMiddleware');
    expect(test[1].name).toBe('mockMiddleware');
    expect(test[2].map(fn => fn.name)).toEqual(['wrappedAsync mockAsyncMiddleware', 'mockMiddleware']);

    // only async function should be wrapped
    expect(test[0]).not.toBe(mockAsyncMiddleware);
    expect(test[1]).toBe(mockMiddleware);

    // error should be cached and passed to `next`
    const mockError = new Error();
    const mockNext = jest.fn();
    const mockAsyncMiddlewareThatThrowsError = async (req, res, next) => { throw mockError; };
    await wrapAsync(mockAsyncMiddlewareThatThrowsError)(null, null, mockNext);
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });


  test('Fn: wrapMiddleware', async () => {
    const mockNext = jest.fn(cb => cb());
    const mockMiddlewareA = (req, res, next) => mockNext(next);
    const mockMiddlewareB = (req, res, next) => mockNext(next);
    const mockMiddlewareC = (req, res, next) => mockNext(next);
    //
    const test = wrapMiddleware([mockMiddlewareA, mockMiddlewareB, mockMiddlewareC]);
    await wrapMiddleware([mockMiddlewareA, mockMiddlewareB, mockMiddlewareC]).handle({ url: '/' }, {}, () => {});
    expect(mockNext).toHaveBeenCalledTimes(3);
    expect(test.stack.length).toBe(3);
  });
});
