/* global __ROOT__ */
const {
  hasOwnKey, cloneDeep, mergeDeep, assignDeep, freezeDeep, burstArrayDeep, createCaseInsensitiveProxy,
} = require(`${__ROOT__}/controllers/utilities/object`)[Symbol.for('__TEST__')];


// test
describe('Utilities: Object', () => {
  test('Fn: hasOwnKey', () => {
    // should check if object has own a key
    expect(hasOwnKey({}, 'a')).toBeFalsy();
    expect(hasOwnKey({ a: 0 }, 'a')).toBeTruthy();
    expect(hasOwnKey({ b: { a: 0 } }, 'a')).toBeFalsy();
  });


  test('Fn: cloneDeep', () => {
    const target = [
      ['a'],
      { a: 'a' },
      { c: [{ b: { a: ['a'] } }] },
    ];

    // should clone deeply
    const test = target.map(obj => cloneDeep(obj));

    // // if is an array
    expect(test[0]).toEqual(target[0]);
    expect(test[0]).not.toBe(target[0]);

    // // if is an object
    expect(test[1]).toEqual(target[1]);
    expect(test[1]).not.toBe(target[1]);

    // // an array/object mixture
    expect(test[2]).toEqual(target[2]);
    expect(test[2]).not.toBe(target[2]);
  });


  test('Fn: mergeDeep', () => {
    const target = { a: 0, b: 1, c: { d: { e: 2, f: 3 }, g: 4 } };
    const source = { c: { d: { e: 5 }, f: 6 } };
    const expectation = { a: 0, b: 1, c: { d: { e: 5, f: 3 }, f: 6, g: 4 } };

    // should immutably merge the source into the target deeply (default)
    const test_1 = mergeDeep(target, source);
    expect(test_1).toEqual(expectation);
    expect(target).not.toEqual(expectation);

    // should mutably merge the source into the target deeply
    const test_2 = mergeDeep(target, source, { mutate: true });
    expect(test_2).toEqual(expectation);
    expect(target).toEqual(expectation);
  });


  test('Fn: assignDeep', () => {
    const target = { a: { b: { g: 'g' } } };
    const path = 'a[b].c.d[e][f]';
    const value = 'f';
    const expectation = { a: { b: { c: { d: { e: { f: 'f' } } }, g: 'g' } } };

    // should immutably assign value by object path in depth (default)
    const test_1 = assignDeep(target, path, value);
    expect(test_1).not.toBe(target);
    expect(test_1).toEqual(expectation);

    // should mutably assign value by object path in depth
    const test_2 = assignDeep(target, path, value, { mutate: true });
    expect(test_2).toBe(target);
    expect(test_2).toEqual(expectation);
  });


  test('Fn: freezeDeep', () => {
    const target = { a: { b: { c: { d: { e: { f: 0 } } } } } };

    // should immutably freeze the target deeply (default)
    const test_1 = freezeDeep(target);
    expect(test_1).not.toBe(target);
    expect(Object.getOwnPropertyDescriptors(test_1)).toHaveProperty('a.writable', false);
    expect(Object.getOwnPropertyDescriptors(test_1.a.b.c.d.e)).toHaveProperty('f.writable', false);

    // should mutably freeze the target deeply
    const test_2 = freezeDeep(target, { mutate: true });
    expect(test_2).toBe(target);
    expect(Object.getOwnPropertyDescriptors(test_2)).toHaveProperty('a.writable', false);
    expect(Object.getOwnPropertyDescriptors(test_2.a.b.c.d.e)).toHaveProperty('f.writable', false);
  });


  test('Fn: burstArrayDeep', () => {
    const target = { a: [1, 2], b: [1, 2, 3], c: [1, 2, [1, 2]], d: { e: { f: [1, 2] } } };
    const expectLastOneWin = { a: 2, b: 3, c: [1, 2], d: { e: { f: 2 } } };
    const expectFirstOneWin = { a: 1, b: 1, c: 1, d: { e: { f: 1 } } };

    // should immutably burst the nested array deeply based on the first element (expectLastOneWin, default)
    const test_1 = burstArrayDeep(target);
    expect(test_1).not.toBe(target);
    expect(test_1).toEqual(expectLastOneWin);

    // should immutably burst the nested array deeply based on the first element (expectFirstOneWin)
    const test_3 = burstArrayDeep(target, { position: 0 });
    expect(test_3).not.toBe(target);
    expect(test_3).toEqual(expectFirstOneWin);

    // should immutably burst the nested array deeply
    const test_2 = burstArrayDeep(target, { mutate: true });
    expect(test_2).toBe(target);
    expect(test_2).toEqual(expectLastOneWin);
  });


  test('Fn: createCaseInsensitiveProxy', () => {
    const target = { a: 1 };

    // should create a case-insensitive proxy for the target
    const test = createCaseInsensitiveProxy(target);
    expect(test).not.toBe(target);
    expect(test).toEqual(target);
    expect(target.A).toBeUndefined();
    expect(test.A).toEqual(test.a);
  });
});
