// module
const { getAggregationQuery, getDateRangeArray,
    exp_matchFilter, exp_docFieldMask, exp_sortRule, exp_dateRange } = require('../../../controllers/middleware/fetch')._test;



// test
describe('Check the ENV', () => {
    test('Should run in test mode', () => {
        expect(process.env['NODE_ENV']).toEqual('test');
    });
});


describe('Bundle: search.js', () => {
    test.skip('Fn: getAggregationQuery : Should construct Mongo query expression for search operations', () => {             // todo: throw to MongoDB for a test
        expect(null);
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

    test('Fn: exp_matchFilter: Should construct Mongo query expression (for $match)', () => {
        expect(exp_matchFilter('', {}, {}))
            .toEqual({});
        expect(exp_matchFilter('posts', {}, {}))
            .toEqual({ 'state.hidden': false, 'state.published': true, 'time._recycled': { $eq: null }});
        expect(exp_matchFilter('posts', { search: {} }, {}))
            .toEqual({ '$text': { '$search': {}},
                'state.hidden': false, 'state.published': true, 'time._recycled': { $eq: null }});
        expect(exp_matchFilter('posts', { category: 'test'}, {}))
            .toEqual({ 'category': 'test',
                'state.hidden': false, 'state.published': true, 'time._recycled': { $eq: null }});
        expect(exp_matchFilter('', {}, { date: '20180510-20190101/' })['time._created'])
            .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
    });

    test('Fn: exp_docFieldMask - Should construct Mongo query expression (for $project)', () => {
        expect(exp_docFieldMask({ stackType: 'posts' }))
            .toEqual({ content: 0, featured: 0 });
        expect(exp_docFieldMask({}))
            .toEqual({ content: 0 });
    });

    test('Fn: exp_sortRule - Should construct Mongo query expression (for $sort)', () => {
        expect(exp_sortRule({ 'time._updated': 0 })).toEqual({ 'time._updated': -1, 'state.pinned': -1 });
        expect(exp_sortRule({ 'time._updated': 1 })).toEqual({ 'time._updated': 1, 'state.pinned': -1 });
        expect(exp_sortRule({})).toEqual({ 'time._updated': -1, 'state.pinned': -1 });
    });

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
});
