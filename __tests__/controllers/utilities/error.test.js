const {
  ExtendableError, TransferableError, ServerError, ClientException, TemplateException, HttpException,
} = require(`${global.__ROOT__}/controllers/utilities/error`)[Symbol.for('__TEST__')];


// test
describe('Utilities: Error', () => {
  test('Class: ExtendableError', () => {
    expect(ExtendableError.prototype instanceof Error).toBeTruthy();
    expect(() => new ExtendableError()).toThrow(ReferenceError);
  });


  test('Class: TransferableError', () => {
    expect(TransferableError.prototype instanceof ExtendableError).toBeTruthy();
    expect(() => new TransferableError()).toThrow(ReferenceError);

    // subclass should not be further extended
    class TestException extends TransferableError {}
    class FurtherExtendedException extends TestException {}
    expect(() => new FurtherExtendedException()).toThrow(ReferenceError);

    // subclass should wrap non-ExtendableErrors
    const mockErrorMessage = 'message';
    const target = [
      new ReferenceError(mockErrorMessage),
      new TestException(mockErrorMessage),
      mockErrorMessage,
    ];
    const test = target.map(err => new TestException(err));

    // wrapping mode: an non-ExtendableError instance
    expect(test[0]).not.toBe(target[0]);
    expect(test[0].from).toBe(target[0].name);
    expect(test[0].message).toBe(mockErrorMessage);

    // passing mode: an ExtendableErrors instance
    expect(test[1]).toBe(target[1]);
    expect(test[1].from).toBeUndefined();
    expect(test[1].message).toBe(mockErrorMessage);

    // normal mode: an object{toString}
    expect(test[2]).not.toBe(target[1]);
    expect(test[2].from).toBeUndefined();
    expect(test[2].message).toBe(mockErrorMessage);
  });


  // todo: (?) error code testing
  test('Class: ServerError', () => {
    expect(() => new ServerError()).not.toThrow();
  });


  test('Class: ClientException', () => {
    expect(() => new ClientException()).not.toThrow();
  });


  test('Class: TemplateException', () => {
    expect(() => new TemplateException()).not.toThrow();
  });


  test('Class: HttpException', () => {
    expect(() => new HttpException()).not.toThrow();
  });
});
