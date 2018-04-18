// modules
const { exp_dateRange, getDateRangeArray } = require('../../../../controllers/middleware/package/fetch')._test;



// tests
describe('Check the ENV', () => {
  test('Should run in test mode', () => {
    expect(process.env['NODE_ENV']).toEqual('test');
  });
});


describe('Bundle: search.js', () => {
  test('Fn: exp_dateRange - Should construct Mongo query expression based on a time range from an array', () => {
    expect(exp_dateRange([2018, 0, 0  ], [0   , 0, 0  ]))
      .toEqual({ '$gte': new Date('2018-01-01T00:00:00.000Z'), '$lt': new Date('2019-01-01T00:00:00.000Z') });
    expect(exp_dateRange([2018, 5, 0  ], [0   , 0, 0  ]))
      .toEqual({ '$gte': new Date('2018-05-01T00:00:00.000Z'), '$lt': new Date('2018-06-01T00:00:00.000Z') });
    expect(exp_dateRange([2018, 5, 10 ], [0   , 0, 0  ]))
      .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2018-05-11T00:00:00.000Z') });
    expect(exp_dateRange([0   , 0, 0  ], [2019, 1, 1  ]))
      .toEqual({ '$gte': new Date('2019-01-01T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
    expect(exp_dateRange([2018, 0, 0  ], [2019, 1, 1  ]))
      .toEqual({ '$gte': new Date('2018-01-01T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
    expect(exp_dateRange([2018, 5, 0  ], [2019, 1, 1  ]))
      .toEqual({ '$gte': new Date('2018-05-01T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
    expect(exp_dateRange([2018, 5, 10 ], [2019, 1, 1  ]))
      .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
    expect(exp_dateRange([2019, 1, 1  ], [2018, 5, 10 ]))
      .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
  });

  test('Fn: getDateRangeArray : Should translate into an array that contains a time range from a string', () => {
    expect(getDateRangeArray('')                    ).toEqual([                              ]);
    expect(getDateRangeArray('-')                   ).toEqual([                              ]);
    expect(getDateRangeArray('/')                   ).toEqual([                              ]);
    expect(getDateRangeArray('2018')                ).toEqual([[2018, 0, 0  ], [0   , 0, 0  ]]);
    expect(getDateRangeArray('20180')               ).toEqual([                              ]);
    expect(getDateRangeArray('201805')              ).toEqual([[2018, 5, 0  ], [0   , 0, 0  ]]);
    expect(getDateRangeArray('2018051')             ).toEqual([                              ]);
    expect(getDateRangeArray('20180510')            ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(getDateRangeArray('20180510-')           ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(getDateRangeArray('20180510/')           ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(getDateRangeArray('20180510-/')          ).toEqual([[2018, 5, 10 ], [0   , 0, 0  ]]);
    expect(getDateRangeArray('-20190101/')          ).toEqual([[0   , 0, 0  ], [2019, 1, 1  ]]);
    expect(getDateRangeArray('-20190101//')         ).toEqual([                              ]);
    expect(getDateRangeArray('--20190101/')         ).toEqual([                              ]);
    expect(getDateRangeArray('2018-20190101')       ).toEqual([[2018, 0, 0  ], [2019, 1, 1  ]]);
    expect(getDateRangeArray('20180-20190101')      ).toEqual([                              ]);
    expect(getDateRangeArray('201805-20190101/')    ).toEqual([[2018, 5, 0  ], [2019, 1, 1  ]]);
    expect(getDateRangeArray('2018051-20190101')    ).toEqual([                              ]);
    expect(getDateRangeArray('20180510-20190101')   ).toEqual([[2018, 5, 10 ], [2019, 1, 1  ]]);
    expect(getDateRangeArray('20190101-20180510')   ).toEqual([[2019, 1, 1  ], [2018, 5, 10 ]]);
  });
});
