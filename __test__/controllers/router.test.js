// module
const { checkNativeBrand, asyncWrapper, getMethods,
    getMiddlewareQueue, getControllerQueue, getViewRenderQueue } = require('../../controllers/router')._test;



// test
describe('Check the ENV', () => {
    test('Should run in test mode', () => {
        expect(process.env.NODE_ENV).toEqual('test');
    });
});

describe('Fn: checkNativeBrand', () => {
    test('Should check the native brand(type) of objects', () => {
        expect(checkNativeBrand(async () => {})).toBe('AsyncFunction');
        expect(checkNativeBrand(() => {}, 'AsyncFunction')).toBeFalsy();
        expect(checkNativeBrand([() => {}], 'array')).toBeTruthy();
    });
});


describe('Fn: asyncWrapper', () => {
    test('Should wrap asyncfunctions with an error catcher', () => {
        const mockInput = [async (req, res, next) => {}, (req, res, next) => {}];
        const result = mockInput.map(fn => asyncWrapper(fn));
        //
        expect(checkNativeBrand(result[0], 'array')).toBeTruthy();
        expect(checkNativeBrand(result[1], 'array')).toBeTruthy();
        expect(result[0].toString()).toBe('(req, res, next) => fn(req, res, next).catch(next)');
        expect(result[1].toString()).toBe('(req, res, next) => {}');
    });
});


describe('Bundle: router.js', () => {
    const mockMethod = ['get', 'pull'];
    const mockController1 = { get: () => { return false }, pull: () => { return true } };
    const mockController2 = [() => { return 0 }, () => { return 1 }];
    const mockSetting1 = { title: 'test', authentication: true, authorization: true, template: './test' };
    const mockSetting2 = { title: 'test', titleOption: { root: true }, crawler: false };


    describe('Fn: getMethods', () => {
        test('Should normalize into a method array in the anti-alphabetical order', () => {
            const test = [{ controller: mockController1 }, { controller: mockController1, method: ['pull'], alias: '/' }];
            const result = test.map(obj => getMethods(obj));
            //
            expect(result[0]).toEqual(['pull', 'get']);
            expect(result[1]).toEqual(['pull', 'alias']);
        });
    });


    describe('Fn: getMiddlewareQueue', () => {
        test('Should stack a queue from settings', () => {
            const test = [mockSetting1, mockSetting2];
            const result = test.map(obj => getMiddlewareQueue(obj));
            //
            expect(result[0].length).toBe(6);
            expect(result[1].length).toBe(2);
        });
    });


    describe('Fn: getControllerQueue', () => {
        test('Should stack a queue from controllers with normalization', () => {
            const test = [mockController1, mockController2];
            const result = test.map(fn => getControllerQueue(fn, mockMethod[1]));
            //
            expect(result[0][0]()).toBeTruthy();
            expect(result[1].length).toBe(2);
        });
    });


    describe('Fn: getViewRenderQueue', () => {
        test('Should stack a queue with a given template when HTTP method is \'get\'', () => {
            const test = [mockSetting1, mockSetting2];
            const result1 = test.map(fn => getViewRenderQueue(fn, mockMethod[0]));
            const result2 = test.map(fn => getViewRenderQueue(fn, mockMethod[1]));
            //
            expect(result1[0].length).toBe(1);
            expect(result1[1].length).toBe(0);
            expect(result2[0].length).toBe(0);
            expect(result1[1].length).toBe(0);
        });
    });
});
