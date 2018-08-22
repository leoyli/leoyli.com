/* global __ROOT__, req, res, next */
const {
  streamingUploader,
} = require(`${__ROOT__}/server/modules/upload`)[Symbol.for('__TEST__')];


// modules
const handlers = require(`${__ROOT__}/server/modules/upload/handlers`);
const httpMocks = require('node-mocks-http');
const EventEmitter = require('events');
const Busboy = require('busboy');


// mocks
jest.mock('busboy');
jest.mock(`${__ROOT__}/server/modules/upload/handlers`, () => ({
  handleOnFile: jest.fn(),
  handleOnField: jest.fn(),
  handleOnFinish: jest.fn(),
}));

beforeEach(() => {
  global.res = httpMocks.createResponse();
  global.req = httpMocks.createRequest({ session: {} });
  global.next = jest.fn();
});


// tests
describe('Modules: Upload (control)', () => {
  test('Middleware: streamingUploader', () => {
    req.app = { get: jest.fn() };
    req.pipe = jest.fn(arg => arg);

    /* stub components */
    const mockHandleOnFile = jest.fn();
    const mockHandleOnField = jest.fn();
    const mockHandleOnFinish = jest.fn();
    handlers.handleOnFile.mockImplementation(() => mockHandleOnFile);
    handlers.handleOnField.mockImplementation(() => mockHandleOnField);
    handlers.handleOnFinish.mockImplementation(() => mockHandleOnFinish);


    // (C1) should run middleware with default settings
    const mockBusboy_1 = new EventEmitter();
    Busboy.mockImplementationOnce(() => mockBusboy_1);
    streamingUploader()(req, res, next);

    // should call mocked constructor and register 4 events
    expect(Busboy).toBeCalledTimes(1);
    expect(mockBusboy_1._eventsCount).toBe(4);

    // should evoke targeted event function only
    mockBusboy_1.emit('file');
    expect(mockHandleOnFile).toBeCalledTimes(1);
    expect(mockHandleOnField).toBeCalledTimes(0);
    expect(mockHandleOnFinish).toBeCalledTimes(0);

    mockBusboy_1.emit('field');
    expect(mockHandleOnFile).toBeCalledTimes(1);
    expect(mockHandleOnField).toBeCalledTimes(1);
    expect(mockHandleOnFinish).toBeCalledTimes(0);

    mockBusboy_1.emit('finish');
    expect(mockHandleOnFile).toBeCalledTimes(1);
    expect(mockHandleOnField).toBeCalledTimes(1);
    expect(mockHandleOnFinish).toBeCalledTimes(1);

    // should not call next during above emissions
    expect(next).toBeCalledTimes(0);

    // should do nothing for falsy error emission
    mockBusboy_1.emit('error');
    expect(mockBusboy_1._eventsCount).toBe(4);
    expect(next).toBeCalledTimes(0);

    // should trigger error-handling events
    mockBusboy_1.emit('error', Symbol.for('some_error'));
    expect(mockBusboy_1._eventsCount).toBe(0);
    expect(next).lastCalledWith(Symbol.for('some_error'));


    // (C2) should run middleware with given settings
    jest.restoreAllMocks();
    const settings = { fileSize: 10, MIME: ['some/type'] };
    const mockBusboy_2 = new EventEmitter();
    Busboy.mockImplementationOnce(() => mockBusboy_2);
    streamingUploader(settings)(req, res, next);

    // should run event handler with given settings
    expect(handlers.handleOnFile).lastCalledWith(expect.any(Object), expect.objectContaining(settings));
    expect(handlers.handleOnField).lastCalledWith(expect.any(Object), expect.objectContaining(settings));
  });
});
