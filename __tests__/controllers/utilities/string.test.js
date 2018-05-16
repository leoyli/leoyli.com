/* global __ROOT__ */
const {
  checkToStringTag, toKebabCase, toCapitalized, toEscapedChars, parseMongoObjectId, parseObjPath, parsePath,
} = require(`${__ROOT__}/controllers/utilities/string`)[Symbol.for('__TEST__')];


// test
describe('Utilities: String', () => {
  test('Fn: checkToStringTag', () => {
    const target = [
      [],
      {},
      async () => {},
    ];
    const expectation = [
      'Array',
      'Object',
      'AsyncFunction',
    ];

    // should use `Object.prototype.toString` to get the object type
    const test_1 = target.map(obj => checkToStringTag(obj));
    expect(test_1[0]).toBe(expectation[0]);
    expect(test_1[1]).toBe(expectation[1]);
    expect(test_1[2]).toBe(expectation[2]);

    // should check if object match with a type name
    const test_2 = target.map((obj, index) => checkToStringTag(obj, expectation[index]));
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
    const expectation = 'this-is-a-test';

    // should convert the target string to the kebab-case
    const test = target.map(str => toKebabCase(str));
    expect(test[0]).toBe(expectation);
    expect(test[1]).toBe(expectation);

    // should return `null` if target is not a string
    expect(test[2]).toBeNull();
  });


  test('Fn: toCapitalized', () => {
    // should capitalize the target string
    expect(toCapitalized('test')).toBe('Test');
    expect(toCapitalized('This is a test, and can be tested.')).toBe('This Is A Test, And Can Be Tested.');

    // should return `null` if failed
    expect(toCapitalized(undefined)).toBeNull();
  });


  test('Fn: toEscapedChars', () => {
    // should escape special characters in the target string
    expect(toEscapedChars('result- =\'"`.,:;<([{'))
      .toBe('result- &#61;&#39;&#34;&#96;&#46;&#44;&#58;&#59;&#60;&#40;&#91;&#123;');
    expect(toEscapedChars('This is a test...'))
      .toBe('This is a test&#46;&#46;&#46;');

    // should return `null` if failed
    expect(toEscapedChars(undefined)).toBeNull();
  });


  test('Fn: parseObjPath', () => {
    const expectation = ['a', 'b', 'c', 'd', 'e', 'f'];

    // should parse a target string into an ordered array
    expect(parseObjPath('a[b].c.d[e][f]')).toEqual(expectation);
    expect(parseObjPath('a[b[c]].d[e.f]')).toEqual(expectation);

    // should return `null` if failed
    expect(parseObjPath(undefined)).toBeNull();
  });


  test('Fn: parseMongoObjectId', () => {
    const expectation = '5a167966807c57204ef40cdd';

    // should parse a target string into a Mongo ObjectId
    const test = parseMongoObjectId('http://(url)/5a167966807c57204ef40cdd?page=1');
    expect(checkToStringTag(test)).toBe('Object');
    expect(test.toString()).toEqual(expectation);

    // should return `null` if failed
    expect(parseMongoObjectId('5a167966807c57204ef40cdd0')).toBeNull();
    expect(parseMongoObjectId(undefined)).toBeNull();
  });


  test('Fn: parsePath', () => {
    // should fail to parse
    // // if is invalid argument
    expect(parsePath(undefined)).toBeNull();
    expect(parsePath('')).toBeNull();

    // // if contains more than one (//, @, #, ?)
    expect(parsePath('https://some@domain.com:8080/t@st.pdf')).toBeNull();
    expect(parsePath('https://some.domain.com:8080/test.pdf?abc?def')).toBeNull();
    expect(parsePath('https://some.domain.com:8080/test.pdf#abc#def')).toBeNull();
    expect(parsePath('https://some.domain.com:8080//test.pdf')).toBeNull();

    // // if contains invalid port
    expect(parsePath('https://some.domain.com:99999/')).toBeNull();
    expect(parsePath('https://some.domain.com:abcde/')).toBeNull();

    // // if contains base
    expect(parsePath('https://some.domain.com/some:test.js')).toBeNull();
    expect(parsePath('some:test.js')).toBeNull();
    expect(parsePath('some@test.js')).toBeNull();
    expect(parsePath('some?test.js')).toBeNull();

    // should parse full URL
    expect(parsePath('https://name@some.domain.com:8080/a/b/c/test.pdf?s=na#top')).toEqual({
      input: 'https://name@some.domain.com:8080/a/b/c/test.pdf?s=na#top',
      protocol: 'https',
      hostname: 'some.domain.com',
      username: 'name',
      port: 8080,
      dir: '/a/b/c',
      base: 'test.pdf',
      ext: 'pdf',
      query: 's=na',
      hash: 'top',
    });

    // should parse hostname with no protocol
    expect(parsePath('//some.domain.com:8080')).toEqual({
      input: '//some.domain.com:8080',
      protocol: null,
      hostname: 'some.domain.com',
      username: null,
      port: 8080,
      dir: '/',
      base: null,
      ext: null,
      query: null,
      hash: null,
    });

    // should parse directory with no protocol
    expect(parsePath('//some/')).toEqual({
      input: '//some/',
      protocol: null,
      hostname: null,
      username: null,
      port: null,
      dir: '/some',
      base: null,
      ext: null,
      query: null,
      hash: null,
    });

    // should parse as file if not wrapped by slash
    expect(parsePath('//some')).toEqual({
      input: '//some',
      protocol: null,
      hostname: null,
      username: null,
      port: null,
      dir: '/',
      base: 'some',
      ext: null,
      query: null,
      hash: null,
    });

    // should parse as file if not contain any slash
    expect(parsePath('some.test.js')).toEqual({
      input: 'some.test.js',
      protocol: null,
      hostname: null,
      username: null,
      port: null,
      dir: '/',
      base: 'some.test.js',
      ext: 'js',
      query: null,
      hash: null,
    });
  });
});
