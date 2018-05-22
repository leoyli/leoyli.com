/* global __ROOT__ */
const {
  wrapAsync, wrapMiddleware,
} = require(`${__ROOT__}/controllers/utilities/express`)[Symbol.for('__TEST__')];


// test
describe('Utilities: Express', () => {
  test('Fn: wrapAsync', async () => {
    const someAsyncMiddleware = async (req, res, next) => next();
    const someMiddleware = (req, res, next) => next();
    const target = [someAsyncMiddleware, someMiddleware, [someAsyncMiddleware, someMiddleware]];

    // should wrap async function prefixed with `wrappedAsync`
    const test = target.map(fn => wrapAsync(fn));
    expect(test[0].name).toBe('wrappedAsync someAsyncMiddleware');
    expect(test[1].name).toBe('someMiddleware');
    expect(test[2].map(fn => fn.name)).toEqual(['wrappedAsync someAsyncMiddleware', 'someMiddleware']);

    // should wrap with only async function
    expect(test[0]).not.toBe(someAsyncMiddleware);
    expect(test[1]).toBe(someMiddleware);

    // should cache error and pass it to `next`
    const spyNext = jest.fn();
    const someAsyncMiddlewareThatThrowsError = async (req, res, next) => { throw Symbol.for('some_error'); };
    await wrapAsync(someAsyncMiddlewareThatThrowsError)(null, null, spyNext);
    expect(spyNext).toBeCalledWith(Symbol.for('some_error'));
  });


  test('Fn: wrapMiddleware', async () => {
    const spyNext = jest.fn(cb => cb());
    const someMiddlewareA = (req, res, next) => spyNext(next);
    const someMiddlewareB = (req, res, next) => spyNext(next);
    const someMiddlewareC = (req, res, next) => spyNext(next);

    // should accept array input
    spyNext.mockClear();
    const test_1 = wrapMiddleware([someMiddlewareA, someMiddlewareB, someMiddlewareC]);
    expect(test_1.stack.length).toBe(3);
    await test_1.handle({ url: '/' }, {}, () => {});
    expect(spyNext).toHaveBeenCalledTimes(3);

    // should accept map for conditional input
    spyNext.mockClear();
    const test_2 = wrapMiddleware(new Map([[someMiddlewareA, true], [someMiddlewareB, false], [someMiddlewareC, true]]));
    expect(test_2.stack.length).toBe(2);
    await test_2.handle({ url: '/' }, {}, () => {});
    expect(spyNext).toHaveBeenCalledTimes(2);

    // should throw error for invalid arguments
    expect(() => wrapMiddleware(undefined)).toThrowError(TypeError);
  });
});
