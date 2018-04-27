/* eslint-disable key-spacing */
// mock
const fs = require('fs');

fs.unlink = jest.fn();


// module
const { checkStatus, getUploadPath, uploadFile,
  transpileRaw, transpileMes } = require('../../../controllers/modules/upload')._test;


// test
describe('Check the ENV', () => {
  test('Should run in test mode', () => {
    expect(process.env.NODE_ENV).toEqual('test');
  });
});


describe('Bundle: upload.js', () => {
  const mocConfigs = {
    fileSize    : 25 * 1048576,
    MIME        : ['image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/x-icon'],
  };
  const mocParser = {
    fieldName   : 'media_test[file]',
    stream      : '',
    fileName    : 'test.png',
    encoding    : '7bit',
    MIME        : 'image/png',
    filePath    : '',
  };
  const mocParserEx1 = { ...mocParser, stream: { truncated: true } };
  const mocParserEx2 = { ...mocParser, MIME: 'unknown' };
  const mocParserEx3 = { ...mocParser, fileName: undefined };
  const mocParserEx4 = { ...mocParser,
    stream: fs.createReadStream('__tests__/test.png'),
    time: new Date(),
    filePath: 'public/media/__tests__/test.streamed.png' };

  test('Fn: checkStatus: Should check the current status of permission/condition', () => {
    const test = [mocParser, mocParserEx1, mocParserEx2];
    const result = test.map(fn => checkStatus(fn, mocConfigs));
    //
    expect(result[0]).toBeTruthy();
    expect(result[1]).toBeFalsy();
    expect(result[2]).toBeFalsy();
  });

  test('Fn: getUploadPath: Should generate an path from the executing time', () => {
    const result = getUploadPath(mocParser, '__moc_UPLOAD_ROOT__');
    //
    expect(result).not.toContain(mocParser.fileName);
    expect(result).toContain(((new Date()).getUTCMonth() + 1).toString());
    expect(result).toContain('.png');
  });

  test('Fn: uploadFile: Should pipe the writable stream to upload the file', (done) => {
    const result = uploadFile(mocParserEx4);
    //
    mocParserEx4.stream.on('end', () => {
      fs.stat(mocParserEx4.filePath, (err, stats) => {
        if (err) throw err;
        expect(result).toBe(undefined);
        expect(stats.size).toBe(11821);
        expect(stats.mtime - mocParserEx4.time).toBeGreaterThan(0);
        done();
      });
    });
  });

  test('Fn: transpileRaw: Should transpile the raw document of media from parser', () => {
    const test = [mocParser, mocParserEx1];
    const result = test.map(fn => transpileRaw(fn, mocConfigs));
    //
    expect(result[0]).toEqual({ media_test: { file: { name: '', path: '', type: '.png' } } });
    expect(result[1]).toEqual({ media_test: { isSkipped: true } });
  });

  test('Fn: transpileMes: Should transpile the raw document of media from parser', () => {
    const test = [mocParser, mocParserEx1, mocParserEx2, mocParserEx3];
    const result = test.map(fn => transpileMes(fn, mocConfigs));
    //
    expect(result[0].length).toBe(0);
    expect(result[1]).toEqual([`test.png is too large (> ${mocConfigs.fileSize / 1048576} MB)...`]);
    expect(result[2]).toEqual(['types of \'test.png\' is not supported.']);
    expect(result[3]).toEqual(['No Files was found on media_test[file]...']);
  });
});
