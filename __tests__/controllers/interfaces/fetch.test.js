/* eslint-disable space-in-parens, array-bracket-spacing, comma-spacing */
const {
  queryDateExpression, parseQueryDate,
} = require(`${global.__ROOT__}/controllers/interfaces/fetch`)[Symbol.for('__TEST__')];


// tests
describe('Interface: Query', () => {
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
    // should auto-fix the oder of inputs
    // // if contains no ranges
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

    // should parse the starting range
    expect(parseQueryDate('2018-20190101')      ).toEqual([[2018, 0, 0  ], [2019, 1, 1  ]]);
    expect(parseQueryDate('201805-20190101/')   ).toEqual([[2018, 5, 0  ], [2019, 1, 1  ]]);
    expect(parseQueryDate('20180510-20190101')  ).toEqual([[2018, 5, 10 ], [2019, 1, 1  ]]);
    expect(parseQueryDate('20190101-20180510')  ).toEqual([[2019, 1, 1  ], [2018, 5, 10 ]]);

    // should parse the ending date
    expect(parseQueryDate('-20190101/')         ).toEqual([[0   , 0, 0  ], [2019, 1, 1  ]]);
  });
});
