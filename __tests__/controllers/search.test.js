// module
const { getAggregationQuery, getFilterExp,
    getDateRangeArray, getDateRangeExp, getSortExp } = require('../../controllers/middleware/search')._test;



// test
describe('Check the ENV', () => {
    test('Should run in test mode', () => {
        expect(process.env.NODE_ENV).toEqual('test');
    });
});


describe('Bundle: search.js', () => {
    test('Fn: getAggregationQuery : Should construct Mongo query expression for search operations', () => {             // tofix: throw to MongoDB for a test
        expect(JSON.stringify(getAggregationQuery({}, {}))).toBe('[{\"$match\":{}},{\"$sort\":{\"time.updated\":-' +
            '1}},{\"$group\":{\"_id\":null,\"count\":{\"$sum\":1},\"post\":{\"$push\":\"$$ROOT\"}}},{\"$project\"' +
            ':{\"_id\":0,\"post\":{\"$slice\":[\"$post\",{\"$multiply\":[{\"$add\":[{\"$cond\":{\"if\":{\"$lt\":[' +
            '1,{\"$ceil\":{\"$divide\":[\"$count\",5]}}]},\"then\":{\"$literal\":1},\"else\":{\"$ceil\":{\"$divid' +
            'e\":[\"$count\",5]}}}},-1]},5]},5]},\"meta\":{\"count\":\"$count\",\"num\":{\"$literal\":5},\"now\":' +
            '{\"$cond\":{\"if\":{\"$lt\":[1,{\"$ceil\":{\"$divide\":[\"$count\",5]}}]},\"then\":{\"$literal\":1},' +
            '\"else\":{\"$ceil\":{\"$divide\":[\"$count\",5]}}}},\"end\":{\"$ceil\":{\"$divide\":[\"$count\",5]}}' +
            ',\"sort\":{\"$literal\":{\"time.updated\":-1}},\"date\":{\"$literal\":{}}}}}]');
    });

    test('Fn: getFilterExp: Should construct Mongo query expression (for $match)', () => {
        expect(getFilterExp({}, {}))
            .toEqual({});
        expect(getFilterExp({ search: {}}, {}))
            .toEqual({ $text: { $search: {}}});
        expect(getFilterExp({ category: 'test'}, {}))
            .toEqual({ category: 'test'});
        expect(getFilterExp({}, { date: '20180510-20190101/' })['time.updated'])
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

    test('Fn: getDateRangeExp : Should construct Mongo query expression based on a time range from an array', () => {
        expect(getDateRangeExp([2018, 0, 0  ], [0   , 0, 0  ]))
            .toEqual({ '$gte': new Date('2018-01-01T00:00:00.000Z'), '$lt': new Date('2019-01-01T00:00:00.000Z') });
        expect(getDateRangeExp([2018, 5, 0  ], [0   , 0, 0  ]))
            .toEqual({ '$gte': new Date('2018-05-01T00:00:00.000Z'), '$lt': new Date('2018-06-01T00:00:00.000Z') });
        expect(getDateRangeExp([2018, 5, 10 ], [0   , 0, 0  ]))
            .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2018-05-11T00:00:00.000Z') });
        expect(getDateRangeExp([0   , 0, 0  ], [2019, 1, 1  ]))
            .toEqual({ '$gte': new Date('2019-01-01T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
        expect(getDateRangeExp([2018, 0, 0  ], [2019, 1, 1  ]))
            .toEqual({ '$gte': new Date('2018-01-01T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
        expect(getDateRangeExp([2018, 5, 0  ], [2019, 1, 1  ]))
            .toEqual({ '$gte': new Date('2018-05-01T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
        expect(getDateRangeExp([2018, 5, 10 ], [2019, 1, 1  ]))
            .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
        expect(getDateRangeExp([2019, 1, 1  ], [2018, 5, 10 ]))
            .toEqual({ '$gte': new Date('2018-05-10T00:00:00.000Z'), '$lt': new Date('2019-01-02T00:00:00.000Z') });
    });

    test('Fn: getSortExp : Should construct Mongo query expression (for $sort)', () => {
        expect(getSortExp({ 'time.updated': 0 }, {})).toEqual({ 'time.updated': -1 });
        expect(getSortExp({ 'time.updated': 1 }, {})).toEqual({ 'time.updated': 1 });
        expect(getSortExp({}, {})).toEqual({ 'time.updated': -1 });
    });
});
