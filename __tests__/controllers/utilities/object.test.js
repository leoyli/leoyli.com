// module
const { checkNativeBrand, hasOwnKey, cloneDeep, mergeDeep, assignDeep, freezeDeep,
  proxyfyInCaseInsensitiveKey } = require('../../../controllers/utilities/')._test;


// test
describe('Check the ENV', () => {
  test('Should run in test mode', () => {
    expect(process.env.NODE_ENV).toEqual('test');
  });
});


describe('Bundle: Object methods', () => {
  test('Fn: checkNativeBrand: check the native brand(type) of objects', () => {
    expect(checkNativeBrand(async () => {})).toBe('AsyncFunction');
    expect(checkNativeBrand(() => {}, 'AsyncFunction')).toBeFalsy();
    expect(checkNativeBrand([() => {}], 'array')).toBeTruthy();
  });

  test('Fn: hasOwnKey: check if object has wwn a property', () => {
    expect(hasOwnKey({}, '')).toBeFalsy();
    expect(hasOwnKey({ a: 0 }, 'a')).toBeTruthy();
    expect(hasOwnKey({ a: { b: 0 } }, 'b')).toBeFalsy();
  });

  test('Fn: cloneDeep: clone the object/array deeply by its value (reference decoupled)', () => {
    const mockSource1 = { test: 'test' };
    const mockSource2 = ['test'];
    const result = [cloneDeep(mockSource1), cloneDeep(mockSource2)];
    //
    expect(result[0]).not.toBe(mockSource1);
    expect(result[0]).toEqual(mockSource1);
    expect(result[1]).not.toBe(mockSource2);
    expect(result[1]).toEqual(['test']);
  });

  test('Fn: mergeDeep: merge two object recursively', () => {
    const mockTarget = { a: 0, b: 1, c: { d: { e: 2, f: 3 }, g: 4 } };
    const mockSource = { c: { d: { e: 5 }, f: 6 } };
    const result = [mergeDeep(mockTarget, mockSource), mergeDeep(mockSource, mockTarget, { mutate: true })];
    //
    expect(result[0]).not.toEqual(mockTarget);
    expect(result[0]).toEqual({ a: 0, b: 1, c: { d: { e: 5, f: 3 }, f: 6, g: 4 } });
    expect(result[1]).toBe(mockSource);
    expect(result[1]).toEqual({ a: 0, b: 1, c: { d: { e: 2, f: 3 }, f: 6, g: 4 } });
  });

  test('Fn: freezeDeep: frozen the target and its property deeply', () => {
    const mockTarget1 = { a: { b: { c: { d: { e: { f: 0 } } } } } };
    const mockTarget2 = { a: { b: { c: { d: { e: { f: 0 } } } } } };
    const result = [freezeDeep(mockTarget1), freezeDeep(mockTarget2, { mutate: true })];
    //
    expect(result[0]).not.toBe(mockTarget1);
    expect(result[1]).toBe(mockTarget2);
    expect(Object.getOwnPropertyDescriptors(mockTarget1)).toHaveProperty('a.writable', true);
    expect(Object.getOwnPropertyDescriptors(mockTarget2)).toHaveProperty('a.writable', false);
    expect(Object.getOwnPropertyDescriptors(result[0])).toHaveProperty('a.writable', false);
    expect(Object.getOwnPropertyDescriptors(result[1])).toHaveProperty('a.writable', false);
    expect(Object.getOwnPropertyDescriptors(result[0].a.b.c.d.e)).toHaveProperty('f.writable', false);
    expect(Object.getOwnPropertyDescriptors(result[1].a.b.c.d.e)).toHaveProperty('f.writable', false);
  });

  test('Fn: assignDeep: assigned the value to an object by path recursively', () => {
    const mockTarget1 = {};
    const mockTarget2 = {};
    const mockPath = 'a[b].c.d[e][f]';
    const result = [assignDeep(mockTarget1, mockPath, 0), assignDeep(mockTarget2, mockPath, 0, { mutate: true })];
    //
    expect(result[0]).not.toBe(result[1]);
    expect(result[0]).toEqual({ a: { b: { c: { d: { e: { f: 0 } } } } } });
    expect(result[1]).toEqual({ a: { b: { c: { d: { e: { f: 0 } } } } } });
  });

  test('Fn: proxyfyInCaseInsensitiveKey: proxyfy the object for allowing case-insensitive access', () => {
    const mockTarget = { a: 1 };
    const result = proxyfyInCaseInsensitiveKey(mockTarget);
    //
    expect(mockTarget.A).toBeUndefined();
    expect(result.A).toEqual(result.a);
    expect(result.A).toBe(1);
  });
});
