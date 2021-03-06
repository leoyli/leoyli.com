/* global __ROOT__ */
const {
  getRouterPlugins, getRouterStacks, Device,
} = require(`${__ROOT__}/server/engines/router`)[Symbol.for('__TEST__')];


// tests
describe('Engines: Router (component)', () => {
  test('Fn: getRouterPlugins', () => {
    const target = [
      { sensitive: false, crawler: false, cache: false },
      { sensitive: true, crawler: true, cache: true },
      {},
    ];
    //
    const test = target.map(option => getRouterPlugins(option).map(fn => fn.name));

    // should print out the stacked middleware name based on the given options
    expect(test[0]).toStrictEqual([
      'caseInsensitiveQueryProxy',
      'noCrawlerHeader',
      'noStoreCacheHeader',
    ]);
    expect(test[1]).toStrictEqual([
    ]);
    expect(test[2]).toStrictEqual([
      'caseInsensitiveQueryProxy',
    ]);
  });


  test('Fn: getRouterStacks', () => {
    const someController = () => {};
    const someHooker = { pre: [], post: [] };
    const someOption = { title: {} };
    const someAccess = [];
    const thunk = (mode) => getRouterStacks(mode, someController, someHooker, someAccess, someOption);
    const test = (mode) => thunk(mode).map(fn => fn.name);

    // should print out the stacked middleware name in 'HTML' mode
    expect(test('HTML')).toStrictEqual([
      'noCrawlerHeader',
      'initialize',
      'authenticate',
      'isSignedIn',
      'caseInsensitiveQueryProxy',
      'titleTagModifierByOption',
      'someController',
      'templateHandler',
    ]);

    // should print out the stacked middleware name in 'API' mode
    expect(test('API')).toStrictEqual([
      'noCrawlerHeader',
      'initialize',
      'authenticate',
      'isSignedIn',
      'caseInsensitiveQueryProxy',
      'someController',
      'JSONHandler',
    ]);
  });
});


describe('Engines: Router (control)', () => {
  test('instance: (constructor)', () => {
    const testDevice = new Device();

    // should clone and freeze the rules
    expect(testDevice.rules).toStrictEqual([]);
    expect(Object.isFrozen(testDevice.rules)).toBeTruthy();

    // should clone and freeze the option
    expect(testDevice._baseOption).toStrictEqual({});
    expect(Object.isFrozen(testDevice._baseOption)).toBeTruthy();
  });


  test('instance: (get/set) setting', () => {
    const testDevice = new Device();
    const someSetting = { sensitive: true, cache: false };

    // should set by attribute
    testDevice.setting.crawler = true;

    // should set by object without dropping previous settings
    testDevice.setting = someSetting;

    // should set title tag
    testDevice.setting.title = { tag: 'some_title' };
    expect(testDevice._hook.pre.map(fn => fn.name)).toEqual(['titleTagModifierByOption']);

    // should get both previous settings
    expect(testDevice.setting).toStrictEqual({ crawler: true, ...someSetting });
  });


  test('instance: use', () => {
    const testDevice = new Device();
    const someController = () => {};

    // should register middleware to `_baseStack`
    testDevice.use(someController);
    expect(testDevice._baseStack.has(someController)).toBeTruthy();
  });


  test('instance: hook', () => {
    const testDevice = new Device();
    const someMiddleware = () => {};
    const expectation = { pre: [someMiddleware, someMiddleware], post: [someMiddleware] };

    // should register middleware by valid hook tag
    testDevice.hook('pre', [someMiddleware, someMiddleware]);
    testDevice.hook('post', someMiddleware);
    expect(testDevice._hook).toEqual(expectation);

    // should have no effects on invalid hook tags
    testDevice.hook('some', someMiddleware);
    expect(testDevice._hook).toEqual(expectation);
  });


  test('instance: exec', () => {
    // (1) should throw an Error
    // // if is a mode other than 'HTML' or 'API'
    const testRouter_A = new Device();
    expect(() => testRouter_A.exec('API')).not.toThrowError();
    expect(() => testRouter_A.exec('HTML')).not.toThrowError();
    expect(() => testRouter_A.exec(undefined)).toThrowError(ReferenceError);

    // // if with controller{hashed object} in an invalid http method as a key
    const testRouter_B = new Device([{ route: '/', controller: { some: () => {} } }]);
    expect(() => testRouter_B.exec('HTML')).toThrowError(TypeError);

    // // if given `controller.alias` without the `alias` key
    const testRouter_C = new Device([{ route: '/', controller: { alias: () => {} } }]);
    expect(() => testRouter_C.exec('HTML')).toThrowError(ReferenceError);


    // (2) should expose router with middleware stacked
    const someRules = [{
      route: '/some_route',
      alias: '/alias_route',
      controller: { GET: () => {}, POST: () => {}, alias: () => {} },
      setting: {},
    }];

    // // if method not specified
    someRules[0].setting.method = undefined;
    expect(new Device(someRules).exec('HTML').stack).toHaveLength(3);

    // // if method specified
    someRules[0].setting.method = 'POST';
    const someExposedRouter_4 = new Device(someRules).exec('HTML');
    expect(someExposedRouter_4.stack[0].route.methods.post).toBeTruthy();
    expect(someExposedRouter_4.stack).toHaveLength(1);


    // (3) should expose rules set with `servingAPI === true` under 'API' mode
    const anotherRules = [{
      route: '/some_route_1',
      controller: { GET: () => {} },
      setting: { servingAPI: true },
    }, {
      route: '/some_route_2',
      controller: { GET: () => {} },
      setting: { servingAPI: false },
    }];
    expect(new Device(anotherRules).exec('API').stack).toHaveLength(1);
    expect(new Device(anotherRules).exec('HTML').stack).toHaveLength(2);


    // (4) should expose router with the given express router option
    const routerOption = { mergeParams: true };
    expect(new Device([], routerOption).exec('HTML')).toStrictEqual(expect.objectContaining(routerOption));


    // (5) should stake middleware stored via use
    const testRouter = new Device();
    const someMiddleware = () => {};
    testRouter.use(someMiddleware);
    expect(testRouter.exec('HTML').stack[0].handle.name).toBe('someMiddleware');
  });


  test('class: (static) exec', () => {
    const testDevice = new Device();
    const sypOnInstanceExec = jest.spyOn(testDevice, 'exec');

    // should load receptors (middleware) with respect to the given `mode`
    const entry = [['/', testDevice], ['/test', testDevice]];
    expect(Device.exec('HTML', entry).stack[1].name).toBe('browserReceptor');
    expect(Device.exec('API', entry).stack[1].name).toBe('APIReceptor');

    // should pass the spy state checks
    expect(sypOnInstanceExec).toBeCalledTimes(4);
  });


  test('class: (static, get) renderer', () => {
    // should serve shortcut for renderer symbols
    expect(Object.values(Device.renderer).map(ele => typeof ele === 'symbol')).toBeTruthy();
  });
});
