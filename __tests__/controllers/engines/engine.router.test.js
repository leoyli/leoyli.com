/* global __ROOT__ */
const {
  getProcessingPipes, getMiddlewareChain, Device,
} = require(`${__ROOT__}/controllers/engines/router`)[Symbol.for('__TEST__')];


// tests
describe('Engines: Router', () => {
  test('Fn: getProcessingPipes', () => {
    const target = [
      { sensitive: true, authorization: true, authentication: true, crawler: false, cache: false },
      { authentication: true, cache: false },
      {},
    ];
    //
    const test = target.map(option => getProcessingPipes(option).map(fn => fn.name));

    // should print out the stacked middleware name based on the given options
    expect(test[0]).toEqual([
      'noCrawlerHeader',
      'initialize',
      'authenticate',
      'isSignedIn',
      'isAuthorized',
      'noStoreCacheHeader',
    ]);
    expect(test[1]).toEqual([
      'caseInsensitiveQueryProxy',
      'noCrawlerHeader',
      'initialize',
      'authenticate',
      'isSignedIn',
      'noStoreCacheHeader',
    ]);
    expect(test[2]).toEqual([
      'caseInsensitiveQueryProxy',
    ]);
  });


  test('Fn: getMiddlewareChain', () => {
    const mockMain = () => {};
    const mockHooker = { pre: [], post: [] };
    const mockOption = {};
    const thunk = (mode) => getMiddlewareChain(mode, mockMain, mockHooker, mockOption);
    const test = (mode) => thunk(mode).map(fn => fn.name);

    // should print out the stacked middleware name in 'html' mode
    expect(test('html')).toEqual([
      'caseInsensitiveQueryProxy',
      'mockMain',
      'templateHandler',
    ]);

    // should print out the stacked middleware name in 'api' mode
    expect(test('api')).toEqual([
      'caseInsensitiveQueryProxy',
      'mockMain',
      'JSONHandler',
    ]);
  });


  test('Class: Device', () => {                                                                                         // todo: more comprehensive test (e.g. `setting.method` option)
    const mockRule = [{ route: '/', controller: { GET: jest.fn() } }];
    const mockSetting = { sensitive: true, cache: false };
    const mockMiddleware = () => {};
    const testDevice = new Device(mockRule);

    // constructor
    expect(testDevice.rules).not.toBe(mockRule);
    expect(testDevice.rules).toEqual(mockRule);
    expect(Object.keys(testDevice).length).toBe(4);
    expect(Object.isFrozen(testDevice.rules)).toBeTruthy();

    // get/set setting
    testDevice.setting.crawler = true;
    testDevice.setting = mockSetting;
    expect(testDevice.setting).toEqual({ ...mockSetting, crawler: true });

    // use
    const spy_1 = jest.spyOn(testDevice._base, 'use');
    testDevice.use(mockMiddleware);
    expect(spy_1).toBeCalledWith(mockMiddleware);

    // hook
    testDevice.hook('pre', mockMiddleware);
    testDevice.hook('post', mockMiddleware);
    testDevice.hook('some', mockMiddleware);
    expect(testDevice._hook).toEqual({
      post: [mockMiddleware],
      pre: [mockMiddleware],
    });

    // exec
    expect(() => testDevice.exec('html')).not.toThrowError();
    expect(() => testDevice.exec('api')).not.toThrowError();
    expect(() => testDevice.exec(undefined)).toThrowError(ReferenceError);

    // static exec
    const spy_2 = jest.spyOn(testDevice, 'exec');
    Device.exec('html', [['/', testDevice], ['/test', testDevice]]);
    expect(spy_2).toHaveBeenCalledTimes(2);

    // static get renderer
    expect(Object.values(Device.renderer).map(ele => typeof ele === 'symbol')).toBeTruthy();
  });
});
