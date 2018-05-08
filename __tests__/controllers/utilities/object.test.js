const {
  hasOwnKey, cloneDeep, mergeDeep, assignDeep, freezeDeep, proxyfyInCaseInsensitiveKey,
} = require('../../../controllers/utilities/')[Symbol.for('UNIT_TEST')];


// test
describe('Utilities: Object', () => {
  test('Fn: hasOwnKey', () => {
    const target = [
      {},
      { a: 0 },
      { b: { a: 0 } },
    ];
    //
    const test = target.map(obj => hasOwnKey(obj, 'a'));
    expect(test[0]).toBeFalsy();
    expect(test[1]).toBeTruthy();
    expect(test[2]).toBeFalsy();
  });


  test('Fn: cloneDeep', () => {
    const target = [
      ['a'],
      { a: 'a' },
      { b: [{ a: 'a' }] },
    ];
    //
    const test = target.map(obj => cloneDeep(obj));
    expect(test[0]).toEqual(target[0]);
    expect(test[0]).not.toBe(target[0]);
    expect(test[1]).toEqual(target[1]);
    expect(test[1]).not.toBe(target[1]);
    expect(test[2]).toEqual(target[2]);
    expect(test[2]).not.toBe(target[2]);
  });


  test('Fn: mergeDeep', () => {
    const target = { a: 0, b: 1, c: { d: { e: 2, f: 3 }, g: 4 } };
    const source = { c: { d: { e: 5 }, f: 6 } };
    const result = { a: 0, b: 1, c: { d: { e: 5, f: 3 }, f: 6, g: 4 } };
    //
    const test_1 = mergeDeep(target, source);
    expect(test_1).toEqual(result);
    expect(target).not.toEqual(result);
    //
    const test_2 = mergeDeep(target, source, { mutate: true });
    expect(test_2).toEqual(result);
    expect(target).toEqual(result);
  });


  test('Fn: freezeDeep', () => {
    const target = { a: { b: { c: { d: { e: { f: 0 } } } } } };
    expect(Object.getOwnPropertyDescriptors(target)).toHaveProperty('a.writable', true);
    expect(Object.getOwnPropertyDescriptors(target.a.b.c.d.e)).toHaveProperty('f.writable', true);
    //
    const test_1 = freezeDeep(target);
    expect(test_1).not.toBe(target);
    expect(Object.getOwnPropertyDescriptors(test_1)).toHaveProperty('a.writable', false);
    expect(Object.getOwnPropertyDescriptors(test_1.a.b.c.d.e)).toHaveProperty('f.writable', false);
    //
    const test_2 = freezeDeep(target, { mutate: true });
    expect(test_2).toBe(target);
    expect(Object.getOwnPropertyDescriptors(test_2)).toHaveProperty('a.writable', false);
    expect(Object.getOwnPropertyDescriptors(test_2.a.b.c.d.e)).toHaveProperty('f.writable', false);
  });


  test('Fn: assignDeep', () => {
    const target = { a: { b: { g: 'g' } } };
    const path = 'a[b].c.d[e][f]';
    const value = 'f';
    const result = { a: { b: { c: { d: { e: { f: 'f' } } }, g: 'g' } } };
    //
    const test_1 = assignDeep(target, path, value);
    expect(test_1).not.toBe(target);
    expect(test_1).toEqual(result);
    //
    const test_2 = assignDeep(target, path, value, { mutate: true });
    expect(test_2).toBe(target);
    expect(test_2).toEqual(result);
  });


  test('Fn: proxyfyInCaseInsensitiveKey', () => {
    const target = { a: 1 };
    const test = proxyfyInCaseInsensitiveKey(target);
    //
    expect(test).not.toBe(target);
    expect(test).toEqual(target);
    expect(target.A).toBeUndefined();
    expect(test.A).toEqual(test.a);
  });
});
