const {
  getCompilationConfigs, getBlueprint, getRuntimeMethods, getTemplate, buildTemplate, getFileString, render, Template,
} = require(`${global.__ROOT__}/controllers/engines/view`)[Symbol.for('__TEST__')];


// mock
const fs = require('fs');

const mockLocals = { settings: {}, cache: false, _locals: {}, test: {} };
const mockString = '<a>Hello World</a>';
const mockCallback = (err, str) => {
  if (err) return err;
  return str;
};

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  readFile: jest.fn(),
}));
fs.readFileSync.mockReturnValue(mockString);
fs.readFile.mockImplementation((file, option, cb) => cb(null, mockString));


// test
describe('Engines: View', () => {
  test('Fn: getCompilationConfigs', () => {
    // should returns object with `varname` property consisted with argument
    expect(getCompilationConfigs('a, b, c').varname).toBe('a, b, c');
  });


  test('Fn: getFileString', async () => {
    // should returns file string synchronously
    expect(getFileString('test', true)).toEqual(mockString);

    // should returns file string in Promise
    expect(await getFileString('test').then(str => str)).toEqual(mockString);
  });


  test('Fn: getRuntimeMethods', () => {
    // should returns object with run-time view methods
    const test = getRuntimeMethods({}, {}, '');
    expect(test).toHaveProperty('useMarkdown');
    expect(test).toHaveProperty('loadPartial');
  });


  test('Fn: getBlueprint', () => {
    // should returns a blueprint object
    const test = getBlueprint(mockLocals);
    expect(test).toHaveProperty('_fn');
    expect(test).toHaveProperty('test');
    expect(test).not.toHaveProperty('settings');
    expect(test).not.toHaveProperty('cache');
    expect(test).not.toHaveProperty('_locals');
  });


  test('Fn: buildTemplate', () => {
    // should construct a `Template` object
    const test = buildTemplate('', {}, mockString);
    expect(test instanceof Template).toBeTruthy();
    expect(test.compile instanceof Function).toBeTruthy();
    expect(test.render()).toBe(mockString);
  });


  test('Fn: getTemplate', async () => {
    // should returns a `Template` object
    const test = await Promise.all([getTemplate('test', {}, true), getTemplate('test', {}).then(template => template)]);
    expect(test[0] instanceof Template).toBeTruthy();
    expect(test[1] instanceof Template).toBeTruthy();
  });


  test('Fn: render', async () => {
    // should returns the rendering result
    const test = await (render('', mockLocals, mockCallback));
    expect(test).toEqual(mockString);
  });
});
