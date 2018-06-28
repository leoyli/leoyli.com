/* global __ROOT__ */
const {
  getSavingPath, isUploadable, fetchRawDoc, fetchMessage, upload,
} = require(`${__ROOT__}/server/controllers/modules/upload/helpers`)[Symbol.for('__TEST__')];


// modules
const path = require('path');
const fs = require('fs');


// tests
describe('Modules: Upload (components)', () => {
  const someConfig = { fileSize: 25 * 1000000, MIME: ['image/png', 'image/gif'] };
  const someBusboy = { fieldName: 'media_test[file]', fileName: 'test.png', MIME: 'image/png', stream: {} };


  test('Fn: getSavingPath', () => {
    /* stub Date.now */
    Date.now = () => new Date('2018-01-01T00:00:00.000Z').getTime();

    // should take the current time as the saving file name
    expect(getSavingPath('__PATH__', 'someFile.png')).toBe(`__PATH__/201801/${+Date.now()}.png`);
  });


  test('Fn: isUploadable', () => {
    // should be falsy when stream truncated
    expect(isUploadable({ ...someBusboy, stream: { truncated: true } }, someConfig)).toBeFalsy();

    // should be falsy when MIME type is not acceptable
    expect(isUploadable({ ...someBusboy, MIME: 'image/jpeg' }, someConfig)).toBeFalsy();

    // should be falsy when filename is a falsy string
    expect(isUploadable({ ...someBusboy, fileName: '' }, someConfig)).toBeFalsy();

    // should be truthy in other cases
    expect(isUploadable({ ...someBusboy }, someConfig)).toBeTruthy();
  });


  test('Fn: fetchRawDoc', () => {
    // should populate document based on the parser object
    expect(fetchRawDoc({ ...someBusboy, filePath: '/_temp/_time.png' }, someConfig))
      .toStrictEqual({ media_test: { file: { name: '_time.png', path: '/_temp/_time.png', ext: 'png' } } });

    // should mark the document with `isSkipped` flag
    expect(fetchRawDoc({ ...someBusboy, MIME: 'image/jpeg' }, someConfig))
      .toStrictEqual({ media_test: { isSkipped: true } });
  });


  test('Fn: fetchMessage', () => {
    // should return no error messages
    expect(fetchMessage({ ...someBusboy }, someConfig))
      .toBe('');

    // should return error messages
    // // if no file Name (empty filed)
    expect(fetchMessage({ ...someBusboy, fileName: '' }, someConfig))
      .toBe('No files were uploaded.');

    // // if file type is not supported
    expect(fetchMessage({ ...someBusboy, MIME: '' }, someConfig))
      .toBe('"test.png" is in a unsupported file type.');

    // // if file too big
    expect(fetchMessage({ ...someBusboy, stream: { truncated: true } }, someConfig))
      .toBe('"test.png" exceed the file size limit (25MB).');
  });


  test('Fn: upload', (done) => {
    const anotherBusboy = {
      ...someBusboy,
      time: Date.now(),
      stream: fs.createReadStream(`${path.join(__ROOT__, '../', 'static/private/default/admin_picture.png')}`),
      filePath: `${__dirname}/_tempt/test.streamed.png`,
    };

    // should run assertions after 3ms later of `close` event
    upload(anotherBusboy);
    anotherBusboy.stream.on('close', () => setTimeout(() => fs.stat(anotherBusboy.filePath, (err, stats) => {
      if (err) throw err;

      // should be exactly uploaded
      expect(stats.size).toBe(63526);

      // should be newly uploaded
      expect(stats.mtime - anotherBusboy.time).toBeGreaterThan(0);

      // should delete the testing file
      fs.unlink(anotherBusboy.filePath, () => fs.rmdir(`${__dirname}/_tempt`, done));
      done();
    }), 3));
  });
});
