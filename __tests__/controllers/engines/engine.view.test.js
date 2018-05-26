/* global __ROOT__ */
const {
  getCompilationConfigs, getBlueprint, getRuntimeMethods, getTemplate, buildTemplate, getFileString, render, Template,
} = require(`${__ROOT__}/controllers/engines/view`)[Symbol.for('__TEST__')];


// modules
const fs = require('fs');


// mocks
const someLocals = { settings: {}, cache: false, _locals: {}, test: {} };
const someString = '<a>Hello World</a>';

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  readFile: jest.fn(),
}));
fs.readFileSync.mockReturnValue(someString);
fs.readFile.mockImplementation((file, option, cb) => cb(null, someString));


// tests
describe('Engines: View', () => {
  test('Fn: getCompilationConfigs', () => {
    // should return object with `varname` property consisted with argument
    expect(getCompilationConfigs('a, b, c').varname).toBe('a, b, c');
  });


  test('Fn: getFileString', async () => {
    // should return file string synchronously
    expect(getFileString('test', true)).toEqual(someString);

    // should return file string in Promise
    expect(await getFileString('test').then(str => str)).toEqual(someString);
  });


  test('Fn: getRuntimeMethods', () => {
    // should return object with run-time view methods
    const test = getRuntimeMethods({}, {}, '');
    expect(test).toHaveProperty('useMarkdown');
    expect(test).toHaveProperty('loadPartial');
  });


  test('Fn: getBlueprint', () => {
    // should return a blueprint object
    const test = getBlueprint(someLocals);
    expect(test).toHaveProperty('_fn');
    expect(test).toHaveProperty('test');
    expect(test).not.toHaveProperty('settings');
    expect(test).not.toHaveProperty('cache');
    expect(test).not.toHaveProperty('_locals');
  });


  test('Fn: buildTemplate', () => {
    // should construct a `Template` object
    const test = buildTemplate('', {}, someString);
    expect(test instanceof Template).toBeTruthy();
    expect(test.compile instanceof Function).toBeTruthy();
    expect(test.render()).toBe(someString);
  });


  test('Fn: getTemplate', async () => {
    // should return a `Template` object
    const test = await Promise.all([getTemplate('test', {}, true), getTemplate('test', {}).then(template => template)]);
    expect(test[0] instanceof Template).toBeTruthy();
    expect(test[1] instanceof Template).toBeTruthy();
  });


  test('Fn: render', async () => {
    const someCallback = (err, str) => {
      if (err) return err;
      return str;
    };

    // should return the rendering result
    const test = await (render('', someLocals, someCallback));
    expect(test).toEqual(someString);
  });
});
