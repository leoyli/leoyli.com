/* global __ROOT__ *//* eslint-disable space-in-parens, array-bracket-spacing, comma-spacing */
const {
  paginatedMetaExpression, queryDateExpression, parseQueryDate, parseQuerySort,
} = require(`${__ROOT__}/server/controllers/modules/query/helpers`)[Symbol.for('__TEST__')];


// tests
describe('Modules: Query (components)', () => {
  test('Fn: paginatedMetaExpression', () => {
    // should return an object as $$meta
    // // if `query` have no properties
    expect(paginatedMetaExpression({})).toStrictEqual({
      end: { $ceil: { $divide: ['$count', 10] } },
      now: { $cond: {
        if: { $lt: [1, { $ceil: { $divide: ['$count', 10] } }] },
        then: { $literal: 1 },
        else: { $ceil: { $divide: ['$count', 10] } },
      } },
      num: 10,
      page: 1,
    });

    // // if `query.page` > 0 and preset num
    expect(paginatedMetaExpression({ page: 5 }, 25)).toStrictEqual({
      end: { $ceil: { $divide: ['$count', 25] } },
      now: { $cond: {
        if: { $lt: [5, { $ceil: { $divide: ['$count', 25] } }] },
        then: { $literal: 5 },
        else: { $ceil: { $divide: ['$count', 25] } },
      } },
      num: 25,
      page: 5,
    });

    // // if `query.page` < 0 (ignored invalid page value)
    expect(paginatedMetaExpression({ page: 0 }, 25)).toStrictEqual({
      end: { $ceil: { $divide: ['$count', 25] } },
      now: { $cond: {
        if: { $lt: [1, { $ceil: { $divide: ['$count', 25] } }] },
        then: { $literal: 1 },
        else: { $ceil: { $divide: ['$count', 25] } },
      } },
      num: 25,
      page: 1,
    });

    // // if `query.num` > 0
    expect(paginatedMetaExpression({ num: 10 }, 25)).toStrictEqual({
      end: { $ceil: { $divide: ['$count', 10] } },
      now: { $cond: {
        if: { $lt: [1, { $ceil: { $divide: ['$count', 10] } }] },
        then: { $literal: 1 },
        else: { $ceil: { $divide: ['$count', 10] } },
      } },
      num: 10,
      page: 1,
    });
  });


  test('Fn: queryDateExpression', () => {
    // should query the whole year
    expect(queryDateExpression([2018, 0, 0], [0, 0, 0])).toStrictEqual({
      $gte: new Date('2018-01-01T00:00:00.000Z'),
      $lt: new Date('2019-01-01T00:00:00.000Z'),
    });

    // should query the whole month
    expect(queryDateExpression([2018, 5, 0], [0, 0, 0])).toStrictEqual({
      $gte: new Date('2018-05-01T00:00:00.000Z'),
      $lt: new Date('2018-06-01T00:00:00.000Z'),
    });

    // should query the whole day
    expect(queryDateExpression([2018, 5, 10], [0, 0, 0])).toStrictEqual({
      $gte: new Date('2018-05-10T00:00:00.000Z'),
      $lt: new Date('2018-05-11T00:00:00.000Z'),
    });

    // should query year-to-date range
    expect(queryDateExpression([2018, 0, 0], [2019, 5, 10])).toStrictEqual({
      $gte: new Date('2018-01-01T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });

    // should query month-to-date range
    expect(queryDateExpression([2018, 5, 0], [2019, 5, 10])).toStrictEqual({
      $gte: new Date('2018-05-01T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });

    // should query date-to-date range
    expect(queryDateExpression([2018, 5, 10], [2019, 5, 10])).toStrictEqual({
      $gte: new Date('2018-05-10T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });

    // should auto-fix the oder of inputs
    expect(queryDateExpression([2019, 5, 10], [2018, 5, 10])).toStrictEqual({
      $gte: new Date('2018-05-10T00:00:00.000Z'),
      $lt: new Date('2019-05-11T00:00:00.000Z'),
    });
    expect(queryDateExpression([0, 0, 0], [2019, 1, 1])).toStrictEqual({
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
    expect(parseQueryDate(undefined)            ).toStrictEqual([]);
    expect(parseQueryDate('')                   ).toStrictEqual([]);
    expect(parseQueryDate('-')                  ).toStrictEqual([]);
    expect(parseQueryDate('/')                  ).toStrictEqual([]);

    // // if contains wrong dates
    expect(parseQueryDate('20180')              ).toStrictEqual([]);
    expect(parseQueryDate('201800')             ).toStrictEqual([]);
    expect(parseQueryDate('2018053')            ).toStrictEqual([]);
    expect(parseQueryDate('20180532')           ).toStrictEqual([]);
    expect(parseQueryDate('20180-20190101')     ).toStrictEqual([]);
    expect(parseQueryDate('2018053-20190101')   ).toStrictEqual([]);

    // // if contains wrong format
    expect(parseQueryDate('-20190101//')        ).toStrictEqual([]);
    expect(parseQueryDate('--20190101/')        ).toStrictEqual([]);

    // should parse the starting date
    expect(parseQueryDate('2018')               ).toStrictEqual([[2018, 0, 0  ], [0   , 0, 0  ]]);
    expect(parseQueryDate('201805')             ).toStrictEqual([[2018, 5, 0  ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510')           ).toStrictEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510-')          ).toStrictEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510/')          ).toStrictEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(parseQueryDate('20180510-/')         ).toStrictEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);

    // should parse the two-end range
    expect(parseQueryDate('2018-20190101')      ).toStrictEqual([[2018, 0, 0  ], [2019, 1, 1  ]]);
    expect(parseQueryDate('201805-20190101/')   ).toStrictEqual([[2018, 5, 0  ], [2019, 1, 1  ]]);
    expect(parseQueryDate('20180510-20190101')  ).toStrictEqual([[2018, 5, 10 ], [2019, 1, 1  ]]);
    expect(parseQueryDate('20190101-20180510')  ).toStrictEqual([[2019, 1, 1  ], [2018, 5, 10 ]]);

    // should parse the right-end date
    expect(parseQueryDate('-20190101/')         ).toStrictEqual([[0   , 0, 0  ], [2019, 1, 1  ]]);
  });


  test('Fn: parseQuerySort', () => {
    // should return empty array for the invalid input or empty string
    expect(parseQuerySort(undefined)).toStrictEqual([]);
    expect(parseQuerySort('')).toStrictEqual([]);

    // should return entries in terms of `[key, weight]`
    const someQueryStr = 'date,view:a, author:d, revised: 2, comment counts:-2';

    // // if no oder `flag`, and no `preset` (preset as -1)
    expect(parseQuerySort(someQueryStr)).toStrictEqual([
      ['date', -1],
      ['view', 1],
      ['author', -1],
      ['revised', 1],
      ['comment counts', -1],
    ]);

    // // if no `order` flag, but given `preset`
    expect(parseQuerySort(someQueryStr, '', 3)).toStrictEqual([
      ['date', 1],
      ['view', 1],
      ['author', -1],
      ['revised', 1],
      ['comment counts', -1],
    ]);

    // // if given ascending `order` flag, and given `preset` (ignored all field flags and `preset`)
    expect(parseQuerySort(someQueryStr, 'x:a', 3)).toStrictEqual([
      ['date', 1],
      ['view', 1],
      ['author', 1],
      ['revised', 1],
      ['comment counts', 1],
    ]);

    // // if given descending `order` flag, and given `preset` (ignored all field flags and `preset`)
    expect(parseQuerySort(someQueryStr, 'x:d', 3)).toStrictEqual([
      ['date', -1],
      ['view', -1],
      ['author', -1],
      ['revised', -1],
      ['comment counts', -1],
    ]);

    // // if given invalid `order` flag, and given `preset` (as if no `order` flag)
    expect(parseQuerySort(someQueryStr, 'x:ad', 3)).toStrictEqual([
      ['date', 1],
      ['view', 1],
      ['author', -1],
      ['revised', 1],
      ['comment counts', -1],
    ]);
  });
});
