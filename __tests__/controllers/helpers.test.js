// module
const { checkNativeBrand, cloneDeep, mergeDeep, assignDeep,
    toKebabCase, escapeChars, readMongoId, readObjPath } = require('../../controllers/helpers')._test;



// test
describe('Check the ENV', () => {
    test('Should run in test mode', () => {
        expect(process.env.NODE_ENV).toEqual('test');
    });
});


describe('Bundle: Object methods', () => {
    test('Fn: checkNativeBrand: Should check the native brand(type) of objects', () => {
        expect(checkNativeBrand(async () => {})).toBe('AsyncFunction');
        expect(checkNativeBrand(() => {}, 'AsyncFunction')).toBeFalsy();
        expect(checkNativeBrand([() => {}], 'array')).toBeTruthy();
    });

    test('Fn: cloneDeep', () => {
        const mockSource = { test: test };
        const result = cloneDeep(mockSource);
        //
        expect(result).not.toBe(mockSource);
        expect(result).toEqual(mockSource);
    });

    test('Fn: mergeDeep', () => {
        const mockTarget = { a: 0, b: 1, c: { d: { e: 2, f: 3 }, g: 4 }};
        const mockSource = { c: { d: { e: 5 }, f: 6 }};
        const result = [mergeDeep(mockTarget, mockSource), mergeDeep(mockSource, mockTarget, { mutate: true })];
        //
        expect(result[0]).not.toEqual(mockTarget);
        expect(result[0]).toEqual({ a: 0, b: 1, c: { d: { e: 5, f: 3}, f: 6, g: 4 }});
        expect(result[1]).toBe(mockSource);
        expect(result[1]).toEqual({ a: 0, b: 1, c: { d: { e: 2, f: 3}, f: 6, g: 4 }});
    });

    test('Fn: assignDeep', () => {
        const mockTarget1 = {};
        const mockTarget2 = {};
        const mockPath = 'a[b].c.d[e][f]';
        const result = [assignDeep(mockTarget1, mockPath, 0), assignDeep(mockTarget2, mockPath, 0, { mutate: true })];
        //
        expect(mockTarget1).not.toEqual(mockTarget2);
        expect(result[0]).toEqual({ a: { b: { c: { d: { e: { f: 0 }}}}}});
        expect(result[1]).toEqual({ a: { b: { c: { d: { e: { f: 0 }}}}}});
    });
});


describe('Bundle: String methods', () => {
    test('Fn: toKebabCase', () => {
        const test = ['~~THIS_IS_A_TEST~~', '  thisIsATest...', 'This Is A Test!'];
        const result = test.map(test => toKebabCase(test));
        //
        expect(result[0]).toBe('this-is-a-test');
        expect(result[1]).toBe('this-is-a-test');
        expect(result[2]).toBe('this-is-a-test');
    });

    test('Fn: escapeChars', () => {
        const test = ['result- =\'"`.,:;<([{', undefined];
        const result = test.map(str => escapeChars(str));
        //
        expect(result[0]).toBe('result-&#32;&#61;&#39;&#34;&#96;&#46;&#44;&#58;&#59;&#60;&#40;&#91;&#123;');
        expect(result[1]).toBe(test[1]);
    });

    test('Fn: readMongoId', () => {
        const test = ['http://(url)/5a167966807c57204ef40cdd?page=1', 'http://(url)/5a167966807c57204ef40cdd0wg/'];
        const result = readMongoId(test[0]);
        //
        expect(result).toEqual('5a167966807c57204ef40cdd');
        expect(() => readMongoId(test[1])).toThrow(/No Mongo ObjectId/);
    });

    test('Fn: readObjPath', () => {
        const test = 'a[b].c.d[e][f]';
        const result = readObjPath(test);
        //
        expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });
});
