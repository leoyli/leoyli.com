/* global __ROOT__ */
const {
  hasOwnKey, cloneDeep, mergeDeep, assignDeep, freezeDeep, burstArrayDeep, createCaseInsensitiveProxy,
} = require(`${__ROOT__}/server/controllers/utilities/object`)[Symbol.for('__TEST__')];


// tests
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
    expect(test[0]).toStrictEqual(target[0]);
    expect(test[0]).not.toBe(target[0]);

    // // if is an object
    expect(test[1]).toStrictEqual(target[1]);
    expect(test[1]).not.toBe(target[1]);

    // // an array/object mixture
    expect(test[2]).toStrictEqual(target[2]);
    expect(test[2]).not.toBe(target[2]);

    // should throw an Error for invalid cloning target
    expect(() => cloneDeep(Symbol('some_invalid_target'))).toThrowError(TypeError);
  });


  test('Fn: mergeDeep', () => {
    const target = { a: 0, b: 1, c: { d: { e: 2, f: 3 }, g: 4 } };
    const source = { c: { d: { e: 5 }, f: 6 } };
    const expectation = { a: 0, b: 1, c: { d: { e: 5, f: 3 }, f: 6, g: 4 } };

    // should immutably merge the source into the target deeply (default)
    const test_1 = mergeDeep(target, source);
    expect(test_1).toStrictEqual(expectation);
    expect(target).not.toStrictEqual(expectation);

    // should mutably merge the source into the target deeply
    const test_2 = mergeDeep(target, source, { mutate: true });
    expect(test_2).toStrictEqual(expectation);
    expect(target).toStrictEqual(expectation);
  });


  test('Fn: assignDeep', () => {
    const target = { a: { b: { g: 'g' } } };
    const value = 'f';
    const expectation = { a: { b: { c: { d: { e: { f: 'f' } } }, g: 'g' } } };

    // should immutably assign value by object path{string} in depth (default)
    const testWithPathString = assignDeep(target, 'a[b].c.d[e][f]', value);
    expect(testWithPathString).not.toBe(target);
    expect(testWithPathString).toStrictEqual(expectation);

    // should mutably assign value by object path{array} in depth
    const testWithPathArray = assignDeep(target, ['a', 'b', 'c', 'd', 'e', 'f'], value, { mutate: true });
    expect(testWithPathArray).toBe(target);
    expect(testWithPathArray).toStrictEqual(expectation);
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
    expect(test_1).toStrictEqual(expectLastOneWin);

    // should immutably burst the nested array deeply based on the first element (expectFirstOneWin)
    const test_3 = burstArrayDeep(target, { position: 0 });
    expect(test_3).not.toBe(target);
    expect(test_3).toStrictEqual(expectFirstOneWin);

    // should immutably burst the nested array deeply
    const test_2 = burstArrayDeep(target, { mutate: true });
    expect(test_2).toBe(target);
    expect(test_2).toStrictEqual(expectLastOneWin);
  });


  test('Fn: createCaseInsensitiveProxy', () => {
    const target = { a: 1, A: 2 };

    // should create a case-insensitive proxy for the target
    // // if is default order (last-one-win)
    const test_1 = createCaseInsensitiveProxy(target);
    expect(test_1).not.toBe(target);
    expect(test_1).toEqual({ a: 2, A: 2 });

    // // if is reverse order (first-one-win)
    const test_2 = createCaseInsensitiveProxy(target, { reverse: false });
    expect(test_2).not.toBe(target);
    expect(test_2).toEqual({ a: 1, A: 1 });

    // should throw an Error for invalid target
    expect(() => createCaseInsensitiveProxy([])).toThrowError(TypeError);
  });
});
