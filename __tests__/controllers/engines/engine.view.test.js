// mock
jest.mock('fs', () => ({
    readFileSync : jest.fn(),
    readFile : jest.fn(),
}));
const fs = require('fs');



// module
const { getCompilationConfigs, getBlueprint, getRuntimeMethods,
    getTemplate, buildTemplate, getFileString, render, Template } = require('../../../controllers/engines/view')._test;



// test
describe('Check the ENV', () => {
    test('Should run in test mode', () => {
        expect(process.env['NODE_ENV']).toEqual('test');
    });
});


describe('Bundle: engine.js', () => {
    const mockLocals = { settings: {}, cache: false, _locals: {}, test: {} };
    const mockContent = '<a>Hello World</a>';
    fs.readFileSync.mockReturnValue(mockContent);
    fs.readFile.mockImplementation((file, option, next) => next(null, mockContent));

    test('Fn: getCompilationConfigs: Should generate doT configs on-the-fly', () => {
        const result = getCompilationConfigs('a, b, c');
        //
        expect(result.varname).toBe('a, b, c');
    });

    test('Fn: getBlueprint: Should transpile Express.js meta into the blueprint of Template{object}', () => {
        const result = getBlueprint(mockLocals);
        //
        expect(result).toHaveProperty('_fn');
        expect(result).toHaveProperty('test');
        expect(result).not.toHaveProperty('settings');
        expect(result).not.toHaveProperty('cache');
        expect(result).not.toHaveProperty('_locals');
    });

    test('Fn: getRuntimeMethods: Should get runtime template methods', () => {
        const result = getRuntimeMethods({}, {}, '');
        //
        expect(result).toHaveProperty('useMarkdown');
        expect(result).toHaveProperty('loadPartial');
    });

    test('Fn: getTemplate: Should get a compiled Template{object}', async () => {
        const result = [getTemplate('test', {}, true), await getTemplate('test', {})];
        //
        expect(result[0] instanceof Template).toBeTruthy();
        expect(result[1] instanceof Template).toBeTruthy();
    });

    test('Fn: buildTemplate: Should construct a new Template{object}', () => {
        const result = buildTemplate('', {}, mockContent);
        //
        expect(result instanceof Template).toBeTruthy();
        expect(result.compile instanceof Function).toBeTruthy();
        expect(result.render()).toBe(mockContent);
    });

    test('Fn: getFileString: Should get context as string from the template file', async () => {
        const result = [getFileString('test', true), await getFileString('test').then(() => 0)];
        //
        expect(result[0]).toEqual(mockContent);
        expect(result[1]).toEqual(0);
    });

    test('Fn: render: Should return the requested content in HTML', async () => {
        const result = await (render( '', mockLocals, (err, context) => {
            if (err) throw err;
            else return context;
        })).then(string => {
            return typeof string === 'string';
        });
        //
        expect(result).toBeTruthy();
    });
});
