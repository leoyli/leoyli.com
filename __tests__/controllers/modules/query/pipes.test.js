/* global __ROOT__ */
const {
  pullPipe_1_matching, pullPipe_2_masking, pullPipe_3_sorting, pullPipe_4_grouping, pullPipe_5_paginating,
  getAggregationQuery,
} = require(`${__ROOT__}/controllers/modules/query/pipes`)[Symbol.for('__TEST__')];


// tests
describe('Modules: Query (pipes)', () => {
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

    // // if collection is `posts || media || page`
    expect(pullPipe_1_matching('posts', {}, {}))
      .toHaveProperty('$match', { 'state.hidden': false, 'state.published': true, 'time._recycled': { $eq: null } });

    // // if collection is `posts || media || page`; param have `collection`; query have `access: 'bin'` key
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
});
