const {
  checkToStringTag, toKebabCase, toCapitalized, toEscapedChars, parseMongoObjectId, parseObjPath, parseFilePath,
} = require(`${__ROOT__}/controllers/utilities/string`)[Symbol.for('__TEST__')];


// test
describe('Utilities: String', () => {
  test('Fn: checkToStringTag', () => {
    const target = [
      [],
      {},
      async () => {},
    ];
    const result = [
      'Array',
      'Object',
      'AsyncFunction',
    ];
    //
    const test_1 = target.map(obj => checkToStringTag(obj));
    expect(test_1[0]).toBe(result[0]);
    expect(test_1[1]).toBe(result[1]);
    expect(test_1[2]).toBe(result[2]);
    //
    const test_2 = target.map((obj, index) => checkToStringTag(obj, result[index]));
    expect(test_2[0]).toBeTruthy();
    expect(test_2[1]).toBeTruthy();
    expect(test_2[2]).toBeTruthy();
  });


  test('Fn: toKebabCase', () => {
    const target = [
      '~~THIS_IS_ATest~~',
      'This Is A Test!',
      undefined,
    ];
    const result = 'this-is-a-test';
    //
    const test = target.map(str => toKebabCase(str));
    expect(test[0]).toBe(result);
    expect(test[1]).toBe(result);
    expect(test[2]).toBeNull();
  });


  test('Fn: toCapitalized', () => {
    const target = [
      'test',
      'This is a test, and can be tested.',
      undefined,
    ];
    //
    const test = target.map(str => toCapitalized(str));
    expect(test[0]).toBe('Test');
    expect(test[1]).toBe('This Is A Test, And Can Be Tested.');
    expect(test[2]).toBeNull();
  });


  test('Fn: toEscapedChars', () => {
    const target = [
      'result- =\'"`.,:;<([{',
      'This is a test...',
      undefined,
    ];
    //
    const test = target.map(str => toEscapedChars(str));
    expect(test[0]).toBe('result- &#61;&#39;&#34;&#96;&#46;&#44;&#58;&#59;&#60;&#40;&#91;&#123;');
    expect(test[1]).toBe('This is a test&#46;&#46;&#46;');
    expect(test[2]).toBeNull();
  });


  test('Fn: parseObjPath', () => {
    const target = [
      'a[b].c.d[e][f]',
      'a[b[c]].d[e.f]',
      undefined,
    ];
    const result = ['a', 'b', 'c', 'd', 'e', 'f'];
    //
    const test = target.map(str => parseObjPath(str));
    expect(test[0]).toEqual(result);
    expect(test[1]).toEqual(result);
    expect(test[2]).toBeNull();
  });


  test('Fn: parseMongoObjectId', () => {
    const target = [
      'http://(url)/5a167966807c57204ef40cdd?page=1',
      '5a167966807c57204ef40cdd0',
      undefined,
    ];
    const result = '5a167966807c57204ef40cdd';
    //
    const test = target.map(str => parseMongoObjectId(str));
    expect(checkToStringTag(test[0])).toBe('Object');
    expect(test[0].toString()).toEqual(result);
    expect(test[1]).toBeNull();
    expect(test[2]).toBeNull();
  });


  test('Fn: parseFilePath', () => {
    const target = [
      '//some.domain.com/a/b/c/d/e/test.pdf?s=na#top',
      'https://some.domain.com/abc/test.pdf',
      'test.pdf#end_point',
      'test.me//test.pdf',
      undefined,
    ];
    //
    const test = target.map(str => parseFilePath(str));
    expect(test[0]).toEqual({
      input: '//some.domain.com/a/b/c/d/e/test.pdf?s=na#top',
      protocol: null,
      hostname: 'some.domain.com',
      path: '/a/b/c/d/e/',
      filename: 'test.pdf',
      extension: 'pdf',
      query: 's=na',
      hash: 'top',
    });
    expect(test[1]).toEqual({
      input: 'https://some.domain.com/abc/test.pdf',
      protocol: 'https',
      hostname: 'some.domain.com',
      path: '/abc/',
      filename: 'test.pdf',
      extension: 'pdf',
      query: null,
      hash: null,
    });
    expect(test[2]).toEqual({
      input: 'test.pdf#end_point',
      protocol: null,
      filename: null,
      path: null,
      hostname: 'test.pdf',
      extension: null,
      query: null,
      hash: 'end_point',
    });
    expect(test[3]).toBeNull();
    expect(test[4]).toBeNull();
  });
});
