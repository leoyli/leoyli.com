/* global __ROOT__ */
const {
  ExtendableError, TransferableError, ServerError, ClientException, TemplateException, HttpException,
} = require(`${__ROOT__}/controllers/utilities/error`)[Symbol.for('__TEST__')];


// test
describe('Utilities: Error', () => {
  test('Class: ExtendableError', () => {
    // should be an instance and behave as an Error
    expect(ExtendableError.prototype instanceof Error).toBeTruthy();
    expect(() => new ExtendableError()).toThrow(ReferenceError);
  });


  test('Class: TransferableError', () => {
    // should be an instance and behave as an ExtendableError
    expect(TransferableError.prototype instanceof ExtendableError).toBeTruthy();
    expect(() => new TransferableError()).toThrow(ReferenceError);

    // should not able to further extend a subclass
    class TestException extends TransferableError {}
    class FurtherExtendedException extends TestException {}
    expect(() => new FurtherExtendedException()).toThrow(ReferenceError);

    // should create error instance from a given argument
    const mockErrorMessage = 'message';
    const target = [
      new ReferenceError(mockErrorMessage),
      new TestException(mockErrorMessage),
      mockErrorMessage,
    ];
    const test = target.map(err => new TestException(err));

    // // if constructed with an non-ExtendableError instance
    expect(test[0]).not.toBe(target[0]);
    expect(test[0].from).toBe(target[0].name);
    expect(test[0].message).toBe(mockErrorMessage);

    // // if constructed with an ExtendableErrors instance
    expect(test[1]).toBe(target[1]);
    expect(test[1].from).toBeUndefined();
    expect(test[1].message).toBe(mockErrorMessage);

    // // if constructed with an object{toString}
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
