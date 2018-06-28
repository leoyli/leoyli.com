/* global __ROOT__, req, res, next */
const {
  handleOnFile, handleOnField, handleOnFinish,
} = require(`${__ROOT__}/server/controllers/modules/upload/handlers`)[Symbol.for('__TEST__')];


// modules
const helpers = require(`${__ROOT__}/server/controllers/modules/upload/helpers`);
const httpMocks = require('node-mocks-http');
const fs = require('fs');
const EventEmitter = require('events');


// mocks
jest.mock(`${__ROOT__}/server/controllers/modules/upload/helpers`);
jest.mock('fs', () => ({
  unlink: jest.fn(),
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// tests
describe('Modules: Upload (handlers)', () => {
  test('Handler: handleOnFile', () => {
    const slip = { mes: new Set(), raw: {} };
    const fakeStream = new EventEmitter();
    helpers.fetchRawDoc.mockReturnValue({});
    helpers.fetchMessage.mockReturnValue([]);
    fakeStream.resume = jest.fn();
    // fs.unlink = jest.fn();

    // (1) should control the stream by `isUploadable()`
    // // if is not uploadable
    helpers.isUploadable.mockReturnValueOnce(false);
    handleOnFile(slip, {})('some_name', fakeStream);
    expect(helpers.isUploadable).toBeCalledTimes(1);
    expect(helpers.upload).toBeCalledTimes(0);
    expect(fakeStream.resume).toBeCalledTimes(1);

    // // if is uploadable
    helpers.isUploadable.mockResolvedValueOnce(true);
    handleOnFile(slip, {})('some_name', fakeStream);
    expect(helpers.isUploadable).toBeCalledTimes(2);
    expect(helpers.upload).toBeCalledTimes(1);
    expect(fakeStream.resume).toBeCalledTimes(1);


    // (2) should listen to events
    const fakeStream_2 = new EventEmitter();
    const mockBusboy = new EventEmitter().on('error', () => {});
    const spyOnMockBusboyEmit = jest.spyOn(mockBusboy, 'emit');
    fakeStream_2.resume = jest.fn();
    handleOnFile.bind(mockBusboy)(slip, {})('some_name', fakeStream_2);

    // // if is `error` event
    fakeStream_2.emit('error', Symbol.for('some_error'));
    expect(spyOnMockBusboyEmit).lastCalledWith('error', Symbol.for('some_error'));
    expect(spyOnMockBusboyEmit).toBeCalledTimes(1);

    // // if is `end` event
    fakeStream_2.emit('end', Symbol.for('some_error'));
    expect(helpers.fetchRawDoc).toBeCalledTimes(1);
    expect(helpers.fetchMessage).toBeCalledTimes(1);


    // (3) should handle truncated file
    fakeStream_2.truncated = true;

    // // if success
    fs.unlink.mockImplementationOnce((filePath, cb) => cb(null));
    fakeStream_2.emit('end', Symbol.for('some_error'));
    expect(fs.unlink).toBeCalledTimes(1);
    expect(spyOnMockBusboyEmit).toBeCalledTimes(1);

    // // if fail, bubble the error
    fs.unlink.mockImplementationOnce((filePath, cb) => cb(Symbol.for('some_error')));
    fakeStream_2.emit('end', Symbol.for('some_error'));
    expect(fs.unlink).toBeCalledTimes(2);
    expect(spyOnMockBusboyEmit).toBeCalledTimes(2);
  });


  test('Handler: handleOnField', () => {
    const slip = { raw: {} };

    // should have no effects for an empty string
    handleOnField(slip)('media_a[_id]', '');
    expect(slip.raw).toStrictEqual({});

    // should mutate slip with parsed data (by expression)
    handleOnField(slip)('media_a[_id]', 'some_id');
    expect(slip.raw).toStrictEqual({ media_a: { _id: 'some_id' } });

    // should populate additional data with another call (by dot notation)
    handleOnField(slip)('media_a.author', 'some_author');
    expect(slip.raw).toStrictEqual({ media_a: { _id: 'some_id', author: 'some_author' } });
  });


  test('Handler/Middleware: handleOnFinish', () => {
    const slip = {
      mes: new Set(),
      raw: {
        media_a: { _id: 'a' },
        media_b: { _id: 'b', isSkipped: true },
        media_c: { _id: 'c' } },
    };
    req.body = {};
    handleOnFinish(slip)(req, res, next);

    // should transform slip into array
    expect(req.body).toHaveProperty('busboySlip.raw', expect.any(Array));
    expect(req.body).toHaveProperty('busboySlip.mes', expect.any(Array));

    // should filter out any sub-object with `isSkipped === true` in `raw`
    expect(req.body.busboySlip.raw).toStrictEqual(expect.arrayContaining([slip.raw.media_a, slip.raw.media_c]));
    expect(req.body.busboySlip.raw).not.toStrictEqual(expect.arrayContaining([slip.raw.media_b]));
  });
});
