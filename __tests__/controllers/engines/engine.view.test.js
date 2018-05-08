const { getCompilationConfigs, getBlueprint, getRuntimeMethods, getTemplate, buildTemplate, getFileString, render,
  Template } = require('../../../controllers/engines/view')[Symbol.for('UNIT_TEST')];


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
    const test = getCompilationConfigs('a, b, c');
    expect(test.varname).toBe('a, b, c');
  });


  test('Fn: getFileString', async () => {
    const test = await Promise.all([getFileString('test', true), getFileString('test').then(str => str)]);
    expect(test[0]).toEqual(mockString);
    expect(test[1]).toEqual(mockString);
  });


  test('Fn: getRuntimeMethods', () => {
    const test = getRuntimeMethods({}, {}, '');
    expect(test).toHaveProperty('useMarkdown');
    expect(test).toHaveProperty('loadPartial');
  });


  test('Fn: getBlueprint', () => {
    //
    const test = getBlueprint(mockLocals);
    expect(test).toHaveProperty('_fn');
    expect(test).toHaveProperty('test');
    expect(test).not.toHaveProperty('settings');
    expect(test).not.toHaveProperty('cache');
    expect(test).not.toHaveProperty('_locals');
  });


  test('Fn: buildTemplate', () => {
    const test = buildTemplate('', {}, mockString);
    expect(test instanceof Template).toBeTruthy();
    expect(test.compile instanceof Function).toBeTruthy();
    expect(test.render()).toBe(mockString);
  });


  test('Fn: getTemplate', async () => {
    const test = await Promise.all([getTemplate('test', {}, true), getTemplate('test', {}).then(template => template)]);
    expect(test[0] instanceof Template).toBeTruthy();
    expect(test[1] instanceof Template).toBeTruthy();
  });


  test('Fn: render', async () => {
    const test = await (render('', mockLocals, mockCallback));
    expect(test).toEqual(mockString);
  });
});
