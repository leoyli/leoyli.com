// module
const { getAggregationQuery, getDateRangeArray,
    exp_matchFilter, exp_postFiledMask, exp_sortRule, exp_dateRange } = require('../../controllers/middleware/fetch')._test;



// test
describe('Check the ENV', () => {
    test('Should run in test mode', () => {
        expect(process.env['NODE_ENV']).toEqual('test');
    });
});


describe('Bundle: search.js', () => {
    test('Fn: getAggregationQuery : Should construct Mongo query expression for search operations', () => {             // todo: throw to MongoDB for a test
        expect(JSON.stringify(getAggregationQuery({ params: {}}, 0, null, null))).toBe('[{\"$match\":' +
            '{\"status\":{\"$eq\":\"published\"},\"visibility.hidden\":false}},{\"$project\":{\"conte' +
            'nt\":0}},{\"$sort\":{\"visibility.pinned\":-1,\"time.updated\":-1}},{\"$group\":{\"_id\"' +
            ':null,\"count\":{\"$sum\":1},\"list\":{\"$push\":\"$$ROOT\"}}},{\"$project\":{\"_id\":0,' +
            '\"list\":{\"$slice\":[\"$list\",{\"$multiply\":[{\"$add\":[{\"$cond\":{\"if\":{\"$lt\":[' +
            '1,{\"$ceil\":{\"$divide\":[\"$count\",10]}}]},\"then\":{\"$literal\":1},\"else\":{\"$cei' +
            'l\":{\"$divide\":[\"$count\",10]}}}},-1]},10]},10]},\"meta\":{\"count\":\"$count\",\"num' +
            '\":{\"$literal\":10},\"now\":{\"$cond\":{\"if\":{\"$lt\":[1,{\"$ceil\":{\"$divide\":[\"$' +
            'count\",10]}}]},\"then\":{\"$literal\":1},\"else\":{\"$ceil\":{\"$divide\":[\"$count\",1' +
            '0]}}}},\"end\":{\"$ceil\":{\"$divide\":[\"$count\",10]}},\"sort\":{\"$literal\":{\"visib' +
            'ility.pinned\":-1,\"time.updated\":-1}},\"route\":{\"$literal\":null},\"period\":{\"$lit' +
            'eral\":{}}}}}]');
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
        expect(exp_matchFilter({}, {}))
            .toEqual({ status: { $eq: 'published'}, 'visibility.hidden': false });
        expect(exp_matchFilter({ search: {} }, {}))
            .toEqual({ $text: { $search: {} }, status: { $eq: 'published'}, 'visibility.hidden': false });
        expect(exp_matchFilter({ category: 'test'}, {}))
            .toEqual({ category: 'test', status: { $eq: 'published'}, 'visibility.hidden': false });
        expect(exp_matchFilter({}, { date: '20180510-20190101/' })['time.updated'])
            .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
    });

    test('Fn: exp_postFiledMask - Should construct Mongo query expression (for $project)', () => {
        expect(exp_postFiledMask({ stackType: 'posts' }))
            .toEqual({ content: 0, featured: 0 });
        expect(exp_postFiledMask({}))
            .toEqual({ content: 0 });
    });

    test('Fn: exp_sortRule - Should construct Mongo query expression (for $sort)', () => {
        expect(exp_sortRule({ 'time.updated': 0 })).toEqual({ 'time.updated': -1, 'visibility.pinned': -1 });
        expect(exp_sortRule({ 'time.updated': 1 })).toEqual({ 'time.updated': 1, 'visibility.pinned': -1 });
        expect(exp_sortRule({})).toEqual({ 'time.updated': -1, 'visibility.pinned': -1 });
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
