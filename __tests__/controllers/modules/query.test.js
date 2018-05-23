/* global __ROOT__, req, res, next *//* eslint-disable space-in-parens, array-bracket-spacing, comma-spacing */
const {
  paginatedMetaExpression, queryDateExpression, parseQueryDate, parseQuerySort,
  pullPipe_1_matching, pullPipe_2_masking, pullPipe_3_sorting, pullPipe_4_grouping, pullPipe_5_paginating,
  getAggregationQuery, paginatedQuery,
} = require(`${__ROOT__}/controllers/modules/query`)[Symbol.for('__TEST__')];


// mock
const modelIndex = require(`${__ROOT__}/models/`);
const httpMocks = require('node-mocks-http');

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// tests
describe('Modules: Query', () => {
  test('Fn: paginatedMetaExpression', () => {
    // should return an object as $$meta
    // // if all argument are "empty"
    expect(paginatedMetaExpression({})).toEqual({
      end: { $ceil: { $divide: ['$count', 10] } },
      now: { $cond: {
        if: { $lt: [1, { $ceil: { $divide: ['$count', 10] } }] },
        then: { $literal: 1 },
        else: { $ceil: { $divide: ['$count', 10] } },
      } },
      num: 10,
      page: 1,
    });

    // // if query have `page` object > 0 and preset num
    expect(paginatedMetaExpression({ page: 5 }, 25)).toEqual({
      end: { $ceil: { $divide: ['$count', 25] } },
      now: { $cond: {
        if: { $lt: [5, { $ceil: { $divide: ['$count', 25] } }] },
        then: { $literal: 5 },
        else: { $ceil: { $divide: ['$count', 25] } },
      } },
      num: 25,
      page: 5,
    });

    // // if query have `page` object < 0 (ignored invalid page value)
    expect(paginatedMetaExpression({ page: 0 }, 25)).toEqual({
      end: { $ceil: { $divide: ['$count', 25] } },
      now: { $cond: {
        if: { $lt: [1, { $ceil: { $divide: ['$count', 25] } }] },
        then: { $literal: 1 },
        else: { $ceil: { $divide: ['$count', 25] } },
      } },
      num: 25,
      page: 1,
    });
  });


  test('Fn: queryDateExpression', () => {
    // should query the whole year
    expect(queryDateExpression([2018, 0, 0], [0, 0, 0])).toEqual({
      $gte: new Date('2018-01-01T00:00:00.000Z'),
      $lt: new Date('2019-01-01T00:00:00.000Z'),
    });

    // should query the whole month
    expect(queryDateExpression([2018, 5, 0], [0, 0, 0])).toEqual({
      $gte: new Date('2018-05-01T00:00:00.000Z'),
      $lt: new Date('2018-06-01T00:00:00.000Z'),
    });

    // should query the whole day
    expect(queryDateExpression([2018, 5, 10], [0, 0, 0])).toEqual({
      $gte: new Date('2018-05-10T00:00:00.000Z'),
      $lt: new Date('2018-05-11T00:00:00.000Z'),
    });

    // should query year-to-date range
    expect(queryDateExpression([2018, 0, 0], [2019, 5, 10])).toEqual({
      $gte: new Date('2018-01-01T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });

    // should query month-to-date range
    expect(queryDateExpression([2018, 5, 0], [2019, 5, 10])).toEqual({
      $gte: new Date('2018-05-01T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });

    // should query date-to-date range
    expect(queryDateExpression([2018, 5, 10], [2019, 5, 10])).toEqual({
      $gte: new Date('2018-05-10T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });

    // should auto-fix the oder of inputs
    expect(queryDateExpression([2019, 5, 10], [2018, 5, 10])).toEqual({
      $gte: new Date('2018-05-10T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });
    expect(queryDateExpression([0, 0, 0], [2019, 1, 1])).toEqual({
      $gte: new Date('2019-01-01T00:00:00.000Z'),
      $lt: new Date('2019-01-02T00:00:00.000Z'),
    });

    // should return `null` for invalid arguments
    expect(queryDateExpression([0, 0], [0, 0, 0, 0])).toBeNull();
    expect(queryDateExpression(undefined, undefined)).toBeNull();
    expect(queryDateExpression(undefined, [0, 0, 0])).toBeNull();
    expect(queryDateExpression([0, 0, 0], undefined)).toBeNull();
  });


  test('Fn: parseQueryDate', () => {
    // should return empty array for the invalid input or empty string
    // // if contains no ranges
    expect(parseQueryDate(undefined)            ).toEqual([]);
    expect(parseQueryDate('')                   ).toEqual([]);
    expect(parseQueryDate('-')                  ).toEqual([]);
    expect(parseQueryDate('/')                  ).toEqual([]);

    // // if contains wrong dates
    expect(parseQueryDate('20180')              ).toEqual([]);
    expect(parseQueryDate('201800')             ).toEqual([]);
    expect(parseQueryDate('2018053')            ).toEqual([]);
    expect(parseQueryDate('20180532')           ).toEqual([]);
    expect(parseQueryDate('20180-20190101')     ).toEqual([]);
    expect(parseQueryDate('2018053-20190101')   ).toEqual([]);

    // // if contains wrong format
    expect(parseQueryDate('-20190101//')        ).toEqual([]);
    expect(parseQueryDate('--20190101/')        ).toEqual([]);

    // should parse the starting date
    expect(parseQueryDate('2018')               ).toEqual([[2018, 0, 0  ], [0   , 0, 0  ]]);
    expect(parseQueryDate('201805')             ).toEqual([[2018, 5, 0  ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510')           ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510-')          ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510/')          ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510-/')         ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);

    // should parse the two-end range
    expect(parseQueryDate('2018-20190101')      ).toEqual([[2018, 0, 0  ], [2019, 1, 1  ]]);
    expect(parseQueryDate('201805-20190101/')   ).toEqual([[2018, 5, 0  ], [2019, 1, 1  ]]);
    expect(parseQueryDate('20180510-20190101')  ).toEqual([[2018, 5, 10 ], [2019, 1, 1  ]]);
    expect(parseQueryDate('20190101-20180510')  ).toEqual([[2019, 1, 1  ], [2018, 5, 10 ]]);

    // should parse the right-end date
    expect(parseQueryDate('-20190101/')         ).toEqual([[0   , 0, 0  ], [2019, 1, 1  ]]);
  });


  test('Fn: parseQuerySort', () => {
    // should return empty array for the invalid input or empty string
    expect(parseQuerySort(undefined)).toEqual([]);
    expect(parseQuerySort('')).toEqual([]);

    // should return entries in terms of `[key, weight]`
    const someQueryStr = 'date,view:a, author:d, revised: 2, comment counts:-2';

    // // if no oder `flag`, and no `preset` (preset as -1)
    expect(parseQuerySort(someQueryStr)).toEqual([
      ['date', -1],
      ['view', 1],
      ['author', -1],
      ['revised', 1],
      ['comment counts', -1],
    ]);

    // // if no `order` flag, but given `preset`
    expect(parseQuerySort(someQueryStr, '', 3)).toEqual([
      ['date', 1],
      ['view', 1],
      ['author', -1],
      ['revised', 1],
      ['comment counts', -1],
    ]);

    // // if given ascending `order` flag, and given `preset` (ignored all field flags and `preset`)
    expect(parseQuerySort(someQueryStr, 'x:a', 3)).toEqual([
      ['date', 1],
      ['view', 1],
      ['author', 1],
      ['revised', 1],
      ['comment counts', 1],
    ]);

    // // if given descending `order` flag, and given `preset` (ignored all field flags and `preset`)
    expect(parseQuerySort(someQueryStr, 'x:d', 3)).toEqual([
      ['date', -1],
      ['view', -1],
      ['author', -1],
      ['revised', -1],
      ['comment counts', -1],
    ]);

    // // if given invalid `order` flag, and given `preset` (as if no `order` flag)
    expect(parseQuerySort(someQueryStr, 'x:ad', 3)).toEqual([
      ['date', 1],
      ['view', 1],
      ['author', -1],
      ['revised', 1],
      ['comment counts', -1],
    ]);
  });


  test('Fn: pullPipe_1_matching', () => {
    // should return an object with `$match` property
    // // if all argument are "empty"
    expect(pullPipe_1_matching('', {}, {}))
      .toHaveProperty('$match', {});

    // // if params have `search` key (Mongo full text search)
    expect(pullPipe_1_matching('', { search: 'test' }, {}))
      .toHaveProperty('$match', { $text: { $search: 'test' } });

    // // if query have `date` key
    expect(pullPipe_1_matching('', {}, { date: '2018-2019' }))
      .toHaveProperty('$match', {
        'time._created': {
          $gte: new Date('2018-01-01T00:00:00.000Z'),
          $lt: new Date('2020-01-01T00:00:00.000Z'),
        },
      });

    // // if (A) collection is `posts || media || page`
    expect(pullPipe_1_matching('posts', {}, {}))
      .toHaveProperty('$match', { 'state.hidden': false, 'state.published': true, 'time._recycled': { $eq: null } });

    // // if (B) collection is `posts || media || page`; param have `collection`; query have `access: 'bin'` key
    expect(pullPipe_1_matching('posts', { collection: 'posts/media' }, { access: 'bin' }))
      .toHaveProperty('$match', { 'time._recycled': { $ne: null } });
  });


  test('Fn: pullPipe_2_masking', () => {
    // should return an object with `$project` property
    // // if param is "empty"
    expect(pullPipe_2_masking({}))
      .toHaveProperty('$project', { content: 0 });

    // // if param have `collection` key
    expect(pullPipe_2_masking({ collection: 'post' }))
      .toHaveProperty('$project', { content: 0, featured: 0 });
  });


  test('Fn: pullPipe_3_sorting', () => {
    // should return an object with `$sort` property
    // // if all argument are "empty"
    expect(pullPipe_3_sorting({}))
      .toHaveProperty('$sort', { 'state.pinned': -1, 'time._updated': -1 });

    const someQueryStr = 'pin,time:a,update:d,post:1,author:2,title:-1,category:-2,tags:x,revise:y';
    // // if query have `sort` key
    expect(pullPipe_3_sorting({ sort: someQueryStr }))
      .toHaveProperty('$sort', {
        'state.pinned': -1,
        'time._updated': -1,
        'time._created': 1,
        'author.nickname': 1,
        title: -1,
        category: -1,
        tags: -1,
        _revised: -1,
      });

    // // if query have `sort:a` key
    expect(pullPipe_3_sorting({ 'sort:a': someQueryStr }))
      .toHaveProperty('$sort', {
        'state.pinned': 1,
        'time._updated': 1,
        'time._created': 1,
        'author.nickname': 1,
        title: 1,
        category: 1,
        tags: 1,
        _revised: 1,
      });

    // // if query have `sort:d` key
    expect(pullPipe_3_sorting({ 'sort:d': someQueryStr }))
      .toHaveProperty('$sort', {
        'state.pinned': -1,
        'time._updated': -1,
        'time._created': -1,
        'author.nickname': -1,
        title: -1,
        category: -1,
        tags: -1,
        _revised: -1,
      });

    // should override setting based on the creating order of the keys
    expect(pullPipe_3_sorting({ 'sort:a': 'pin, time, title', 'sort:d': 'update, post, title', sort: someQueryStr }))
      .toHaveProperty('$sort', {
        'state.pinned': -1,
        'time._updated': -1,
        'time._created': 1,
        'author.nickname': 1,
        title: -1,
        category: -1,
        tags: -1,
        _revised: -1,
      });
    expect(pullPipe_3_sorting({ 'sort:d': 'update, post, title', sort: someQueryStr, 'sort:a': 'pin, time, title' }))
      .toHaveProperty('$sort', {
        'state.pinned': 1,
        'time._updated': -1,
        'time._created': 1,
        'author.nickname': 1,
        title: 1,
        category: -1,
        tags: -1,
        _revised: -1,
      });
    expect(pullPipe_3_sorting({ sort: someQueryStr, 'sort:a': 'pin, time, title', 'sort:d': 'update, post, title' }))
      .toHaveProperty('$sort', {
        'state.pinned': 1,
        'time._updated': -1,
        'time._created': -1,
        'author.nickname': 1,
        title: -1,
        category: -1,
        tags: -1,
        _revised: -1,
      });
  });


  test('Fn: pullPipe_4_grouping', () => {
    // should return an object with `$group` property
    expect(pullPipe_4_grouping())
      .toHaveProperty('$group', { _id: null, count: { $sum: 1 }, list: { $push: '$$ROOT' } });
  });


  test('Fn: pullPipe_5_paginating', () => {
    const test = pullPipe_5_paginating({}, {});

    // should return an object with `$project` property
    expect(test).toHaveProperty('$project');

    // (*) should match with the snapshot
    expect(test).toMatchSnapshot();
  });


  test('Fn: getAggregationQuery', () => {
    const test = getAggregationQuery('', {}, {}, 10, {}).length;

    // should return an object with `$project` property
    expect(test).toBe(5);

    // (*) should match with the snapshot
    expect(test).toMatchSnapshot();
  });


  test('Middleware: paginatedQuery', async () => {
    const result = { list: ['some_docs'], meta: {} };
    res.locals.$$SITE = { num: 10 };

    /* stub the modelIndex */
    modelIndex.SomeCollectionModel = {
      aggregate: jest.fn(() => Promise.resolve([result])),
      hydrate: jest.fn(item => item),
    };

    // should perform query via `SomeCollectionModel.aggregate`
    await paginatedQuery('SomeCollection')(req, res, next);
    expect(modelIndex.SomeCollectionModel.aggregate).toHaveBeenCalled();

    // should `hydrate` resulted documents
    expect(modelIndex.SomeCollectionModel.hydrate).toHaveBeenLastCalledWith(result.list[0]);

    // should store data into session cache
    expect(req.session.cache).toEqual(result);

    // should pass the final state checks
    expect(next).toHaveBeenCalledTimes(1);
  });
});
