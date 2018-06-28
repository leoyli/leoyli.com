/* global __ROOT__, req, res, next */
const {
  paginatedQuery,
} = require(`${__ROOT__}/server/controllers/modules/query/packet`)[Symbol.for('__TEST__')];


// modules
const modelIndex = require(`${__ROOT__}/server/models/`);
const httpMocks = require('node-mocks-http');


// mocks
jest.mock(`${__ROOT__}/server/models/`, () => ({
  SomeCollectionModel: {
    aggregate: jest.fn(),
    hydrate: jest.fn(),
  },
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// tests
describe('Modules: Query (control)', () => {
  test('Middleware: paginatedQuery', async () => {
    const someResult = { list: ['some_docs'], meta: {} };
    modelIndex.SomeCollectionModel.hydrate.mockImplementation(item => item);
    res.locals.$$SITE = { num: 10 };

    // (1) should handle no document returning
    modelIndex.SomeCollectionModel.aggregate.mockImplementationOnce(() => Promise.resolve([undefined]));
    await paginatedQuery('SomeCollection')(req, res, next);
    expect(modelIndex.SomeCollectionModel.aggregate).toBeCalledTimes(1);
    expect(modelIndex.SomeCollectionModel.hydrate).not.toBeCalled();
    expect(req.session).not.toHaveProperty('cache');


    // (2) should perform query via `SomeCollectionModel.aggregate`
    modelIndex.SomeCollectionModel.aggregate.mockImplementationOnce(() => Promise.resolve([someResult]));
    await paginatedQuery('SomeCollection')(req, res, next);
    expect(modelIndex.SomeCollectionModel.aggregate).toBeCalledTimes(2);

    // should `hydrate` resulted documents
    expect(modelIndex.SomeCollectionModel.hydrate).lastCalledWith(someResult.list[0]);

    // should store data into session cache
    expect(req.session).toHaveProperty('cache');
    expect(req.session.cache).toStrictEqual(someResult);


    // should pass the final state checks
    expect(next).toBeCalledTimes(2);
  });
});
