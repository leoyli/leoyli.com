// module
const { toKebabCase, toEscapedChars,
  readMongoId, readObjPath, inspectFileURL } = require('../../../controllers/utilities/')[Symbol.for('UNIT_TEST')];


// test
describe('Check the ENV', () => {
  test('Should run in test mode', () => {
    expect(process.env.NODE_ENV).toEqual('test');
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

  test('Fn: toEscapedChars', () => {
    const test = ['result- =\'"`.,:;<([{', undefined];
    const result = test.map(str => toEscapedChars(str));
    //
    expect(result[0]).toBe('result- &#61;&#39;&#34;&#96;&#46;&#44;&#58;&#59;&#60;&#40;&#91;&#123;');
    expect(result[1]).toBe(null);
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

  test('Fn: inspectFileURL', () => {
    const mockExtName = ['png', 'gif'];
    const test = ['http://domain.com/path/name/file.png', 'domain.com/file.png', 'http://t.io/t.gif', 'file.png'];
    const result1 = inspectFileURL(test[0], mockExtName);
    const result2 = inspectFileURL(test[1], mockExtName);
    const result3 = inspectFileURL(test[2], mockExtName, { raw: false, use: 'ftp' });
    const result4 = inspectFileURL(test[2], mockExtName, { raw: false });
    const result5 = inspectFileURL(test[3], mockExtName, { raw: false });
    const result6 = inspectFileURL(test[4], mockExtName, { raw: false });
    //
    expect(result1.slice(0, 6)).toEqual([test[0], 'http', 'domain.com', '/path/name/', 'file.png']);
    expect(result2.slice(0, 6)).toEqual([test[1], undefined, 'domain.com', '/', 'file.png']);
    expect(result3).toBe('ftp://t.io/t.gif');
    expect(result4).toBe(test[2]);
    expect(result5).toBeNull();
    expect(result6).toBeNull();
  });
});
