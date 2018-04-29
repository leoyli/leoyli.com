### 0.9.0-dev.12 / 2018-04-29
> App
- Revised and renamed `asyncWrapper` as `wrapAsync` in 'router' engine.
- Fixed `unhandledPromiseRejection` error in 'fetch' module.
- Used 'domain' to handle upload errors during the uploading stream.
  (note: 'domain' is deprecated, may try `async_hook` to fix it.)


### 0.9.0-dev.11 / 2018-04-27
> App
- Fixed 'fetch' controller bugs.
- Added `toCapitalized` 'string' utility function.
- Unified the named of router devices.

> Test
- Added a unit test for `toCapitalized`.


### 0.9.0-dev.10 / 2018-04-27
> App
- Used no plusplus operators (ESLint).
- Extended the capability for `cloneDeep`, `mergedDeep`, and `freezeDeep` 'object' utilities of operating on `Symbol` primitives.
- Used the reverse for-loop for improving the algorithm in `mergedDeep` and `freezeDeep`.
- Used the global-registered `Symbol.for('UNIT_TEST')` symbol for accessing functions to be unit-tested.

> Test
- Added 5 more unit tests upon `cloneDeep` 'object' utility.
- Loaded the tested module units only from `Symbol.for('UNIT_TEST')`.

> UI
- Used no plusplus operators (ESLint).


### 0.9.0-dev.9 / 2018-04-27
> App
- Updated all dependencies.
- Renamed `hasOwnProperty` as `hasOwnKey` in 'object' utility function.
- Renamed all model in uppercase for the convention as a constructor.
- Rearranged code based on ESLint checking results.

> Test
- Rearranged code based on ESLint checking results.


### 0.9.0-dev.8.1 / 2018-04-26
> App
- Revised 'error' utilities to avoid the magic string.
- Revised 'string' utilities to return `null` if input string is `undefined`.
- Used `typeof ...` only upon checking if a variable is a `function`.
  (in other cases, preferred to use `checkNativeBrand` utility function)
- Renamed some utilities function to be more semantic and consistent.
- Minor code cleaned up.

> Test
- Updated unit tests in utilities.


### 0.9.0-dev.8.1 / 2018-04-24
> App
- Improved readability by unifying code style in all routers.


### 0.9.0-dev.8 / 2018-04-22
> App
- Revised 'error' utilities for improving readability and the use cases.
- Limited code blocks to `require` modules from other files.
- Replaced some `Object` method by `Reflect`.


### 0.9.0-dev.7 / 2018-04-22
> App
- Decoupled magic-strings from 'handler' view controllers via the use of ES6 Symbols.
- Added a static getter method in 'Device' engine for referencing used handler.
- Updated all routers.


### 0.9.0-dev.6.4 / 2018-04-22
> App
- Replaced `Object.assign()` by object spread operator.
  (benchmark shows both have no significant difference in terms of their performance in V8)
- Revised `unnamedWrapper`:
  - wrapped function would be prefixed with `WrappedAsync`;
  - extended `unnamedWrapper` to wrap error middleware i.e. (err, req, res, next).
- Replaced the use of `__proto__` by `Object.getPrototypeOf`.
  (although V8 supports `__proto__` property, but it was recommended avoiding the use of such property other than web browsers)


### 0.9.0-dev.6.3 / 2018-04-21
> App
- Cleaned up codes so that `use strict` can be executed without errors.
  (via a node flag `--use_strict`)


### 0.9.0-dev.6.2 / 2018-04-21
> App
- Revised 'object' utilities:
  - revised `cloneDeep` for checking input types;
  - enhanced `mergeDeep`, `freezeDeep`, `assignDeep` readability;
  - enhanced `freezeDeep` recursion performance.
    (use `for...in` loop instead of `Object.keys().forEach()`)
- Assigned default value of `Device.rules` as `[]` for preventing errors.

> Test
- Updated 'object' unit tests.


### 0.9.0-dev.6.1 / 2018-04-21
> App
- Enhanced code maintainability and readability by using ES6 function default argument assignments.
- Revised 'string' utilities for handling empty arguments properly.
- Used ES6 destruction syntax to simplify 'upload' module.


### 0.9.0-dev.6 / 2018-04-19
> App
- Added `_U_.object.freezeDeep` object utilities.
- Applied `_U_.object.freezeDeep` to prevent mutations of `Device.rules` in 'router' engine.
- Extended `_U_.object.cloneDeep` to clone array object.

> Test
- Added `_U_.object.freezeDeep` unit test
- Added more test for `_U_.object.cloneDeep`.
- Updated testing descriptions.


### 0.9.0-dev.5.1 / 2018-04-19
> App
- Fixed API service breakdown.
- Fixed unfulfilled short cut in `Device.use`.
- Integrated 'service/router' into 'router/index'.
- Updated 'app' settings.


### 0.9.0-dev.5 / 2018-04-18
> App
- Revised 'router' engine:
  - introduced `defaultSetting` device attribute;
    (`defaultSetting` can be overwritten by more specific routing rules)
  - merged `handler` into `defaultSetting`;
  - revised `getMiddlewareChain` for decorating routing HTML title tag value;
  - revised `get setting()` in `Device` class;
    (only `setting.title` method would pre-populated middleware in `this.queue.pre`)
  - revised `getPreprocessor` and improved readability.
    (only property with `boolean` value would be preprocessed)
- Revised 'app' setting file:
  - decoupled the use of 'initial' middleware;
    (handled by routing engine instead)
  - added `upload` property for configuring 'upload' module;
  - updated 'upload' module so the uploading path is independent of the file location.
- Renamed 'middleware' folder as 'modules'.
- Revised `modifyHTMLTitleTag` module for accepting `object/string` in `options`.
- Moved and renamed 'middleware/initial' as 'view/responder'.
- Updated routers w.r.t. the changes.

> Test
- Updated file paths.


### 0.9.0-dev.4 / 2018-04-17
> App
- Extracted middleware as 'adapter' and 'regulator' from 'middleware/index'.
- Renamed some variables and middleware for being more semantic.
- Improved line readability and code style consistency.
- Improved error stack trace readability by assigning middleware names explicitly:
  - router controllers were named after their object path.
  - plugged middleware are named after their accessing name.
- Revised 'router' engine:
  - name of async functions wrapped by `asyncWrapper` are preserved.
  - members in the array returned by `getMiddlewareChain` are unique.
    (ensured by `[...new Set()]` ES6 feature)

> Test
- Updated file paths.


### 0.9.0-dev.3 / 2018-04-16
> App
- Revised `proxyfiedForCaseInsensitiveAccess` in 'object' utilities.
- Refracted 'router' engine:
  - simplified codes from the need for argument normalization;
  - restricted `controller` parameter, which must be a object that mapped with its method;
  - restricted pseudo method `alias` have to be handled and `alias` parameter have to be provided;
  - enhanced `asyncWrapper` to process both array and function types;
  - renamed `loadRoutePlugins` as `getPreprocessor`;
  - mingled `stackHttpMethods`, `loadViewRenderer` and `Device.run` into `getMiddlewareChain`.
- Updated 'seed' route.


### 0.9.0-dev.2.1 / 2018-04-13
> App
- Revised 'plugin' middleware:
  - renamed file as 'index';
  - reorganized codes;
  - updated 'upload' middleware;
  - encapsulated 'fetch' in `_M_.aggregateFetch` middleware.


### 0.9.0-dev.2.1 / 2018-04-13
> App
- Replaced `array.indexOf('val') !== -1` by `array.includes('val')`. (The ES7 feature)
- Updated CSP rules.

> UI
- CDN source file updates.
- Upgraded from Bootstrap v4.0 to v4.1.


### 0.9.0-dev.2 / 2018-04-12
> App
- Removed unnecessary comments.
- Refactored codes in accordance with code styles:
  - used 'function expressions' over 'function declarations';
    (leveraged 'function name inference' from V8 in using arrow functions)
  - return `this` in `class` methods whenever applicable;
    (allow methods to be chained)
  - removed redundant `else` from `else return` pattern;
  - renamed some variables for better readability;
  - avoided argument mutations;
  - wrapped `default` case by `{}` in all `switch`.
- Refactored `postNormalizer` in 'initial' middleware.
- Refactored 'fetch' middleware and removed 'aggregation.exp' engine.
- Refactored `checkNativeBrand` object utility.
- Added `hasOwnProperty` object utility.

> Test
- Updated tests.
- Added `hasOwnProperty` object utility unit test.


### 0.9.0-dev.1 / 2018-04-12
> App
- Changed from 'API/POST' to 'API/PUT'.


### 0.9.0-dev.0 / 2018-04-09
- Initiated v0.9: 'CMS & UI' development.


### 0.8.0 / 2018-04-09
> Completed v0.8: 'CMS-Panel' development
- Added 'widget' feature in view engine.
- Added 'content stacks' CMS panel.
- Added content recycling mechanism.
- Added API services.
- Enhanced model structures.
- Enhanced view handlers.
- Enhanced 'search' feature.
- Enhanced router engine.
- Enhanced utility functions.
- Enhanced web security.


### 0.8.0-dev.18.etc / 2018-04-08
> .etc
- Added 'aggregation' experimental db query engine.


### 0.8.0-dev.18 / 2018-04-08
> App
- Cleaned 'middleware/fetch'.
- Revised `_M_.doNotCrawled` and `_M_.doNotCached` in `Cache-Control` header.
- Added controlling logic for 'API/POST'.


### 0.8.0-dev.17 / 2018-04-07
> App
- Revised 'engine/router':
  - revised `loadMainControls` to simplified `run` method;
  - added `use` method to bypass the path preset plugins;
  - removed 'API/OPTIONS' router
    (using express default settings instead).
- Revised `proxyfiedForCaseInsensitiveAccess` for checking the native brand of object.

> Test
- Updated 'engine.router.test'.


### 0.8.0-dev.16 / 2018-04-07
> App
- Restructured 'app' configs for better readability and security:
  - extracted non-indexing components out from `router/index`;
  - extracted partial settings and referred as 'passport' and 'router' services agents;
  - added 'securityHeaderAgent' service agent for configuring security-related headers.
  - enabled security cookie function;
    (disabled when under 'test' mode)
- Added `'Cache-Control', 'private'` header in `_M_.doNotCrawled` plugin.
- Added `_M_.doNotCached` plugin to avoid client-side caching.
- Added 'favicon' feature.
- Added `page.landing` router controller.
- Configured 'admin' and 'home' router to avoiding client-side caching.
- Supported 'HEAD' http method for API services.
- Revised 'engine/router' to avoid 'pre/post' hooking contamination.
- Fixed typo in 'view/error' handler.

> Test
- Updated 'engine.router.test'.

> UI
- Fixed typos in variables' name.


### 0.8.0-dev.15.1 / 2018-04-06
> App
- Added `Access-Control-Allow-Methods` http header.
- Updated 'API/OPTIONS' router.
- Changed from 'API/PITCH' to 'API/POST' router.


### 0.8.0-dev.15 / 2018-04-06
> App
- Changed all from 4-spaced indented to 2-spaced.
- Added `APIHttpHeaders` plugin middleware.
- Added `proxyfiedForCaseInsensitiveAccess` object method in utilities.
- Updated 'express' lib.
- Updated `caseInsensitiveQuery` plugin middleware.
- Updated routers:
  - renamed all truthy HTTP methods in upper case for all controllers;
  - revised 'router' engine for handling the method name changes
    (case-insensitive w.r.t. method name);
  - pre-hooked `APIHttpHeaders` on 'api' router;
  - added 'API/OPTIONS' router for handling preflight fetching;
  - added 'API/PATCH' router.
  - added the very last error handler in the case of unhandled/unreachable errors.

> Test
- Added `proxyfiedForCaseInsensitiveAccess` unit test.


### 0.8.0-dev.14.1 / 2018-04-03
> App
- Set 'Access-Control-Allow-Origin' HttpHeader pointed to 'http://localhost:8080' in api router controller.
- Removed unrelated modules from api router controller.


### 0.8.0-dev.14 / 2018-04-03
> App
- Added api router and controller.
- Configured the new api router in 'index' router.
- Changed from 4-spaced indented to 2-spaced.


### 0.8.0-dev.13 / 2018-03-25
> App
- Hydrated the documents returned from aggregation to mongoose documents in `fetch` controller.
- Added `state.recycled` virtual field in 'posts' model.
- Added `posts` virtual field to populate the post under a specific user{mongoose.document} in 'users' model.

> UI
- Ensured the accessibility of mongoose virtual fields in templates.
- Replaced `!state.published` by more readable `state.pended` virtual object.


### 0.8.0-dev.12 / 2018-03-21
> App
- Renamed all time fields lead by `_`.
- Revised 'date range' query from updated-time-based to created-time-based in 'fetch' controller.
- Added `admin.stack.patch` router controller.
- Introduced the 'recycling bin' feature:
  - combined `status` and `visibility` into `state` field;
  - added `admin.stack.patch` router;
  - revised `posts` and `admin` router controllers;
  - revised 'posts' model:
    - added `state.recycled` virtual field in 'posts' model;
    - added `time._expired` virtual field in 'posts' model;
    - hooked `update` event for mongo query modifications in 'posts' model;
  - Revised 'fetch' controller:
    - populated `req.query` in `$$VIEW` for further template usages;
    - revised `exp_matchFilter` for supporting the recycling bin feature;
  - Revised 'template' view handler:
    - split `handler.postHandler` to `handler.posts.singular` and `handler.posts.multiple`.

> Test
- Updated 'fetch.test' and 'app.test' w.r.t. the changes.

> UI
- Revised 'stack/media' and 'stack/posts' templates:
  - added the 'bin mode' whenever `?access=bin` URL query options is met;
  - added `recycle` and `permanently delete` actions in the 'bin mode'.
- Updated other templates w.r.t. the changes.


### 0.8.0-dev.11 / 2018-03-20
> App
- Revised 'template' view handler to accommodate dynamic template assignment based on `req.params`.
- Updated 'admin' router setting.

> UI
- Adjusted widths of table cell in '/stack/media' nad '/stack/posts' template.
- Updated the dropdown menu in `_navibar` template.


### 0.8.0-dev.10 / 2018-03-20
> App
- Revised `exp_matchFilter` to accommodate different queried collections.
- Revised `fetch` function to take by db name instead of the model name.
- Updated 'admin' router setting.

> Test
- Added a new test item in `exp_matchFilter` test.

> UI
- Added 'media' and 'posts' template under 'stack' directory.


### 0.8.0-dev.9 / 2018-03-19
> App
- Added a 'pre' hook on 'update' event to auto-update all posts associated with the author in dark.
- Modified `home.profile.patch` by also submitting the current user nickname(`_nickname`) for the later comparison.
- Updated the format of comments in all models.


### 0.8.0-dev.8.6 / 2018-03-18
> App
- Removed 'schema' utilities:
  - updated 'posts', 'media', and 'users' models with the changes;
  - updated 'seed', 'admin', and 'posts' router controllers with the changes;


### 0.8.0-dev.8.5 / 2018-03-18
> App
- Renamed `req.session._view` as `req.session.chest`.
- Renamed template variables in a form of `$${UPPERCASE}`.

> UI
- Updated with the changes.
- Fixed typos.


### 0.8.0-dev.8.4 / 2018-03-18
> App
- Added `_view.route` population into 'initial' middleware.
- Removed `meta.route` property from 'fetch' controller.

> Test
- Skipped `getAggregationQuery` unit test temporarily.

> UI
- Updated 'pagination' widget.


### 0.8.0-dev.8.3 / 2018-03-17
> App
- Renamed `exp_postFiledMask` as `exp_docFieldMask`.
- Renamed `configModel`, `userModel` and `postModel` in plural.
- Revised `fetch` middleware.
- Revised `admin.stack` controller.
- Added 'pages' controller.

> Test
- Updated, moved, and renamed `search.test.js` as `fetch.test.js`.


### 0.8.0-dev.8.2 / 2018-03-17
> UI
- Fixed broken link in `upload` template.


### 0.8.0-dev.8.1 / 2018-03-17
> App
- Revised 'router' engine:
  - combined `pre` and `post` device method into `hook`.
  - updated 'account' router associated with the changes.


### 0.8.0-dev.8 / 2018-03-16
> App
- Revised 'router' engine:
  - added `_handler` as a private property;
  - added `Device.setting` getter ans setter;
  - added `handler` as an argument for `loadViewRenderer()`;
  - renamed `settings` as `setting`;
  - updated many routers associated with the changes.
- Revised fetching mask for stack-type query.
- Revised `templateHandler` with the newly added `handler` switching feature.

> Test
- Updated `search.test.js` and `engine.router.test.js`.

> UI
- Updated 'stack' template.


### 0.8.0-dev.7.1 / 2018-03-15
> App
- Renamed all `req.session.view` as `req.session._view`.
- Renamed 'post' as 'posts' if it is characterized in plural.
- Extract `list` from the `post` view object.
- Revised 'templateHandler' view handler.
- Fixed bug in 'initial' middleware.
- Fixed Typos in `HISTORY`.

> Test
- Updated `search.test.js` and `app.test.js`.

> UI
- Added 'Posts Management' into dropdown menu in '_navibar' template.
- Fixed `NAN` displaying error if password never being changed in 'info' template.
- Renamed all 'post' as 'posts'.


### 0.8.0-dev.7 / 2018-03-14
> App
- Renamed 'search' as 'fetch' with updates:
  - removed arguments' default value in `fetch` middleware (assigned individually);
  - rearranged and added '$project' stage for field masking in `getAggregationQuery`;
  - renamed outputted meta `baseURL` property as `route`;
  - corrected value of meta `route` property.
  - renamed 'expression' functions;
  - simplified `exp_matchFilter` in dated ranging query.
  - added `exp_postFiledMask` for masking returning contents.
- Added content managing 'stack' feature (temporarily only for 'posts'):
  - added '/stack/:stackType' route under 'admin' router.
  - added `admin.stack` controller.
  - revised 'page' router.
- Renamed `tag` property as `tags` in PostModel.
- Stacked author by `nickname` instead of by `username` in PostModel.

> Test
- Update `search.test.js`:
  - corrected input types in tests.
  - added `exp_sortRule` unit test.

> UI
- Widgetified '_pagination' template.
- Removed 'manager' directory and it contains files.
- Added 'stack' template.


### 0.8.0-dev.6.1 / 2018-03-13
> App
- Extracted 'admin' from 'home' router and controller.

> Test
- Updated pathname in `app.test.js`.

> UI
- Restructured files and directories.
- Added empty temples: 'media', 'post', and 'user' into 'manager' directory.
- Updated pathname in '_navibar' and 'configs' templates.


### 0.8.0-dev.6 / 2018-03-12
> App
- Added new runtime helper functions called 'widget' in view engine.
- Revised and renamed `home.setting` as `home.configs`.
- Updated 'admin' router.

> Test
- Updated pathname in `app.test.js`.

> UI
- Revised and renamed 'setting' template as 'configs'.
- Added 'website settings' dropdown link in '_navibar' template.
- Added '_widget' directory with 'CDN' and 'meta' widgets.


### 0.8.0-dev.5.2 / 2018-03-11
> App
- Updated router settings based on renamed files.

> UI
- Renamed files.


### 0.8.0-dev.5.1 / 2018-03-11
> App
- Added a check of the existence of `req.session.user` after `req.isAuthenticated()`.


### 0.8.0-dev.5 / 2018-03-11
> App
- Fixed `HISTORY` typos.
- Added `redirect` branch in 'error' handler.
- Extracted authentication retrying logic from middleware to error handler:
  - added `redirect.signInRetry` to mange clientError retrying logic;
  - added `action` tag in `req.flash` in 'initial' middleware;
  - removed `pass` tag from `req.flash` in 'initial' middleware;
  - centralized error messages;
  - revised 'account' controller.


### 0.8.0-dev.4.1 / 2018-03-10
> App
- Moved template assignment from 'account' and 'admin' controllers to the routers.


### 0.8.0-dev.4 / 2018-03-10
> App
- Added logic into `editor.post.get` router controller.
- Split handler into 'error' and 'template' controllers.
- Extracted `templateHandler` from `postHandler` in 'template' controllers.

> Test
- Skipped 'PATCH user nickname' in `app.test.js` temporarily.


### 0.8.0-dev.3.2 / 2018-03-10
> UI
- Renamed files.


### 0.8.0-dev.3.1 / 2018-03-07
> UI
- Moved and revised 'security' template.


### 0.8.0-dev.3 / 2018-03-07
> App
- Revised 'view' engine:
  - added `source` parameter into `getRuntimeMethods()` and `getBlueprint()`;
  - revised `loadPartial()` to accept: (1) relative partial; (2) default path (__root__); or (3) theme path.
- Removed `_status` property from `res.locals._view` in initial middleware.
- Removed `app.set('partials')` app setting.
- Updated 'users' model:
  - added `time._changePassword` field;
  - renamed `_lastTimeSignIn` as `_signIn`;
  - revised `changePassword()` to update `time._changePassword`;
  - redefined `UpdateSignInLog()` as `updateLastTimeLog()` in 'users' model.
- Renamed page title of `home/security` router.

> Test
- Updated `app.test.js`.

> UI
- Renamed 'root' as '__root__'.
- Removed 'Account Settings' option from dropdown menu in '_navibar' template.
- Added 'profile' directory with '_sidebar' template.


### 0.8.0-dev.2 / 2018-03-06
> App
- Added `profile_editor` controller and router.
- Rename `residence` as `residency` in 'users' model.
- Rename 'post/editor' route as 'post/edit' route.

> Test
- Updated user mock in `app.test.js`.

> UI
- Added 'profile_editor' template in root.
- Updated 'profile' template in root.


### 0.8.0-dev.1 / 2018-03-06
> App
- Updated 'users' model schema:
  - added `time._lastTimeSignIn` field;
  - added `UpdateSignInLog()` document method;
  - added `info:{ gender, residence, timezone, birthday }` fields;
  - moved `firstName` and `lastName` into info.
- Applied `UpdateSignInLog()` in 'account.signin' controller.
- Populated whole user document in `home.profile.get` route.
- Updated 'seed' route.

> Test
- Updated user mock in `app.test.js`.

> UI
- Updated '_navibar' in 'root'.
- Updated fileNames in 'signup'.


### 0.8.0-dev.0 / 2018-03-04
- Initiated v0.8: 'CMS-Panel' development.
- Fixed typos in HISTORY.


### 0.7.0 / 2018-03-04
- Completed v0.7: 'tofix-fix-up' & 'error-handling' development.


### 0.7.0-dev.13 / 2018-03-04
> App
- Added [eCODE: 20003] into ClientError dictionary.
- Fixed `_M_.isSignedIn` message display bug.
- Fixed 'upload' controller bugs.
- Identified multiple place to be fixed.


### 0.7.0-dev.12 / 2018-02-27
> App
- Handled most of potential error source in view engine.
- Added `TransferableError` proto-error class.
- Limited `ExtendableError` only to `TransferableError`.
- Renamed 'dictionary' utilities as 'error-code'.


### 0.7.0-dev.11 / 2018-02-27
> App
- Renamed `AccountError` as `ClientError`.
- Centralized all `ServerError` messages in 'ServerError' dictionary.
- Enhanced `ErrorDictionary.find()` class method to map string placeholders with reference.


### 0.7.0-dev.10 / 2018-02-27
> App
- Changed to dynamic env-variables to populate website configs. (performance improvement)
- Renamed 'settings' to 'configs' model, 'settingModel' to 'configModel'.
- Added `language` website-config parameter.
- Fixed bugs: malfunctioned pagination url.
- Added `serverErrorDictionary`.

> Test
- Adapted to the changes.


### 0.7.0-dev.9 / 2018-02-27
> App
- Codified AccountError messages.
- Extracted HttpError code-message mapping into the 'dictionary' utility.
- Used dictionaryProxy as an agent to do message assignment in the 'dictionary' utility'.


### 0.7.0-dev.8.4 / 2018-02-26
> App
- Renamed 'modules' folder as 'utilities'.
- Renamed `_$` module function leading variable to be `_U_` in utilities.
- Renamed `_md` leading variable to be `_M_` in middleware.


### 0.7.0-dev.8.3 / 2018-02-25
> App
- Rearranged codes for better error handling.


### 0.7.0-dev.8.2 / 2018-02-22
> App
- Rearranged codes for better readability and consistency.


### 0.7.0-dev.8.1 / 2018-02-21
> App
- Split 'helper' module into 'schema', 'string', 'object' files.
- Renamed `_fn` module function leading variable to be `_$`.

> Test
- Split 'helper' module test files correspondingly.


### 0.7.0-dev.8 / 2018-02-21
> App
- Restructured the directories.


### 0.7.0-dev.7.3 / 2018-02-21
> App
- Used switch for controlling 'AccountError' terminal.
- Revised 'AccountError' error class.


### 0.7.0-dev.7.2 / 2018-02-20
> App
- Revised `unhandledRejection` event emitter in `app.js`.
- Hooked ServerError around errors form 'fs' module.
- Identified more client errors to be handled.
- Simplified errorHandler core.
- Simplified 'admin' router.
- Added 'TemplateError' terminal in error handler.
- Added supporting of http code 500 in 'HttpError' error class.


### 0.7.0-dev.7.1 / 2018-02-20
> App
- Fixed bugs in `.setTitleTag` middleware plugin.


### 0.7.0-dev.7 / 2018-02-20
> App
- Used ES6 Class syntax for all constructors.
- Renamed 'renderer' controller as 'handler'.
- Split `.use` method into `.pre` and `.post` hooks in router driver.
- Added new function into `AccountError` class, which allows to repack an error.
- Added an anonymous post-hooked to repack errors from 'passport-local-mongoose' lib in 'account' model.

> UI
- Changed to the corrected variable name.


### 0.7.0-dev.6.1 / 2018-02-19
> App
- Added supported code: 400, 401, 403 status in `HttpError` error class.
- Fixed minor issue in `checkNativeBrand` helper function.
- Renamed 'renderer' controller as 'handler'.

> UI
- Renamed the default view path as 'root'.


### 0.7.0-dev.6 / 2018-02-19
> App
- Added `errors.js` controller for managing all customized error objects.
- Renamed 'user' router and rule as 'account'.
- Restructured 'helpers' controller.
- Added 3 terminals into error handlers.

> UI
- Updated `error.dot` template.


### 0.7.0-dev.5.2 / 2018-02-19
> App
- Renamed and moved files.
- Renamed variables.


### 0.7.0-dev.5.1 / 2018-02-19
> App
- Removed unused `visibility` Mongo index.

> UI
- Separated pagination into `_pagination.dot` for reusing.
- Moved `search.dot` file.


### 0.7.0-dev.5 / 2018-02-18
> App
- New feature: added `visibility` and `status` post parameters in the model.
  - visibility 'hidden': hide the post from the searching result, and only can be accessed by its URL;
  - visibility 'pinned': pin the post at the top level result, but have no effects if 'hidden' to be truthy;
  - visibility 'protected': a holder parameter for password protection feature. (to be added);
  - status 'published': published post;
  - status 'drafted': unpublished post that can not be accessed publicly. (auto saving to be added);
  - status 'recycled': user deleted post that can not be accessed publicly. (recycle data damping to be added);
- New feature: added `sets` parameters in 'settings' for hosting dynamic default parameters.
- Added `tag` and `visibility` Mongo indexes.
- Added `meta.baseUrl` from `req.baseUrl` in search controller.
- Added authentication-dependent query in post controller, only status is `published` and visibility is not `hidden` are displayed.

> Test
- Updated the 'search' to cover these changes.

> UI
- Added pagination toolbar in 'index' and 'search' template.
- Added the post-state icons and title prefix.
- Upgraded packages with the newest CDN.


### 0.7.0-dev.4 / 2018-02-17
> App
- Upgraded Bootstrap v4.0.0.
- Added `status` and `visibility` fields in 'post' model.

> UI
- Added `status` and `visibility` selection box into 'editor'.
- Used `formaction` attribute to supporting multiple actions in one form.


### 0.7.0-dev.3 / 2018-02-17
> App
- Removed some out-of-dated comments.
- Removed escaping space characters in `escapeChars`.
- Updated setting schema for hosting setting parameters.


### 0.7.0-dev.2 / 2018-02-16
> App
- Adapted and simplified codes in models and 'app' from the new ver.5 'Mongoose' lib.


### 0.7.0-dev.1 / 2018-02-16
- Initiated v0.7: 'tofix-fix-up' development.

> App
- Fixed 'canonical' value escaping issue by added `postNormalizer` middleware.
- Added `inspectFileURL` string helper function and its unit test.
- Removed dependency on 'validator' lib.
- Simplified 'setting' and 'post' model.


### 0.6.0 / 2018-02-15
- Completed v0.6: 'unit-testing' development.


### 0.6.0-dev.12 / 2018-02-15
> App
- Updated packages.
- Renamed file names for a better readability.
- Fixed the double loading issue in `settingModel.init()` by renamed as `settingModel.initialize()`.
- Improved settingModel.


### 0.6.0-dev.11 / 2018-02-14
> App
- Recovered `asyncWrapper` test in `driver.test.js`.
- Added `search.test.js`.
- Added `caseInsensitiveQuery` middleware(proxy) for allowing case insensitive access to `req.query`. (hooked by default)
- Added 'date' searching parameters.
- Added new Mongo indexes 'category' and 'time.updated' for indexing query.
- Fixed prev HTML meta-tag controlled by 'template' view controller.
- Simplified names of optional parameters in 'router' view controller.


### 0.6.0-dev.10 / 2018-02-11
> App
- Moved and rewired 'search' controller so that it can be more readable and maintainable.
- Moved pagination-related codes from 'search' to 'template' controller.
- Removed `type` argument in 'search' controller, where only returns `meta` and `post{array}`.
- Renamed `res` to `result` in `app.test.js` to avoid misunderstanding.
- Adapted 'post' routing rules with changes in 'search' controller.
- Changed 'driver' controller for a better scope management.


### 0.6.0-dev.9.1 / 2018-02-09
> App
- Added `helper.test.js` for unit testing on string and object helper functions.
- Fixed potential weakness in conditional express: !!0 is false, but sometime is an acceptable value.
- Fixed unexpected behaviour in `readMongoId` if no matched value were provided.
- Allowed `escapeChars` to accept `null` or `undefined` argument and return `undefined`.
- Applied `escapeChars` on all properties in `req.body.post` (except for title temporarily).
- Changed the error message in generic if no website configs were found.


### 0.6.0-dev.9 / 2018-02-08
> App
- Rearranged 'helpers' controller so that it can be unit tested.
- Removed the dependency of the 'lodash' lib in helper functions.
- Renamed some helper functions.
- Fixed testing errors in `upload.test.js` with a mock function.
- Corrected `app.test.js` due to HTML-escaping-related issues.
- Corrected RegExp in 'post' router.


### 0.6.0-dev.8.3 / 2018-02-04
> App
- Added `upload.test.js` for unit testing on functions.
- Removed unnecessary describe grouping in `driver.test.js`.
- Simplified the name of properties in media model.


### 0.6.0-dev.8.2 / 2018-02-04
> App
- Restructured the directories.


### 0.6.0-dev.8.1 / 2018-02-01
> App
- Suspended some test tasks in 'router.test'
- Extracted recyclable methods from 'busboy' to 'method'.
- Added JSDoc in 'busboy'.
- Shorten some variables.


### 0.6.0-dev.8 / 2018-02-01
> App
- Rewrote file uploading parser (busboy controller & middleware) so that it can be unit tested and more readable.
- Most mutations in `Object/Array` were avoided in the newly written busboy controller.
- Adapted 'admin' router controller as a response of changing in busboy controller.


### 0.6.0-dev.7.2 / 2018-01-29
> App
- Corrected the testing scheme by using `.mockImplementation` method.


### 0.6.0-dev.7.1 / 2018-01-29
> App
- Resolved `engine.test.js` skipped tests.
- Added a line of code so that `fs.readFileAsync` can be mocked.


### 0.6.0-dev.7 / 2018-01-28
> App
- Rearranged the viewEngine and made it more readable.
- Added `engine.test.js` for unit testing. (failed in checking async functions due to an unresolved Promise.)


### 0.6.0-dev.6.1 / 2018-01-27
> App
- Rearranged the viewEngine and fixed `loadPartials` bugs.


### 0.6.0-dev.6 / 2018-01-26
> App
- Rearranged the viewEngine so that it could be unit-tested.
- Added the JSDoc descriptions in the viewEngine.


### 0.6.0-dev.5.1 / 2018-01-25
> App
- Bugs patched.


### 0.6.0-dev.5 / 2018-01-25
> App
- Added `router.test.js` for unit testing.
- Polished the JSDoc descriptions in router.js.
- Extended the functionality of checkNativeBrand{fn}.
- Avoided repeated stacking in middlewareQueue{fn}.
- Fixed bugs in getViewRenderQueue{fn}.


### 0.6.0-dev.4 / 2018-01-24
> App
- Fragmented router controller so that it could be unit-tested.


### 0.6.0-dev.3 / 2018-01-22
> App
- Renamed backend dashboard as 'home' (for path) or 'admin' (for controller).
- Renamed method .activate as to be .run.
- Updated dependencies.


### 0.6.0-dev.2 / 2017-12-07
> App
- Simplified part of test descriptions.
- Added additional tests, resulted in a 91%(+6%) code coverage.
- Updated the password validation middleware module.
- Simplified some minor codes.


### 0.6.0-dev.1 / 2017-12-07
> App
- Added 'post' route test, resulted in a 85%(+10%) code coverage.
- Removed unnecessary 'error' route.
- Removed unnecessary logs in 'HISTORY.md'.

> UI
- Corrected the filed name in 'editor'.


### 0.5.0 / 2017-12-02
> App
- Added `alias(get)` routing method into `router`.
- Integrated controller functions in 'post' route into 'post' controller.
- Enhanced 'search' controller for being called without `next`.
- Fixed $match query for `ObjectId` in `search` controller.
- Error handled by `errorHandler` now prints in console in dev mode.
- Completed and closed '0.5' subversion branch.


### 0.5.0-dev.8 / 2017-12-01
> App
- Restructured the file paths.
- Renamed 'console' files, folders, variable names for avoiding conflicts of JS `console` object.
- Renamed 'middleware' as 'modules' controller.
- Improved the readability of router controllers.


### 0.5.0-dev.7 / 2017-11-30
> App
- Generalized 'router' for some usage scenario.
- Mounted `unhandledRejection` event for error locating.
- Improved 'post' router, 'editor' controller, and `render.post`.


### 0.5.0-dev.6 / 2017-11-29
> App
- Removed all `.wrapAsync` for its no needs.
- Rewired 'router' for enhancements and readability.


### 0.5.0-dev.5 / 2017-11-28
> App
- Separated most controller logic from router files.
- Enhanced `RouterHub` with a feature of automatic http method selection.
- Provided `RouterHub.use` as a short cut to wire pre-used middleware.
- Changed the login http method from 'patch' to 'post'.
- Set in correspondence with the http method change in the test mode.

> UI
- Set in correspondence with the http method change in 'signin' template.


### 0.5.0-dev.4 / 2017-11-27
> App
- Split 'middleware' files: removed `_end`, renamed `_pre` into `_md`.
- Combined two section title handlers into one `.setTitleTag` with options.
- Added controller 'render' as a communicator of view.


### 0.5.0-dev.3 / 2017-11-26
> App
- Restructured 'post' route with 'router' controller.


### 0.5.0-dev.2 / 2017-11-25
> App
- Extracted routing rules from 'page' into a controller module 'router'.


### 0.5.0-dev.1 / 2017-11-24
> App
- Rearranged files into the MVC fashion.
- Adapted 'A successful Git branching model' as the version control working flow.
- Adapted semantic versioning with a build metadata `dev` for versioning ongoing developments.


### 0.4.0 / 2017-11-24
> App
- Rewired 'app' for preventing static view from establishing sessions.
- Enhanced the code manageability in routing rules and used middleware.
- Adapted more to ES6 syntax in setting function default arguments with destructuring.
- Completed and closed '0.4' subversion branch.


### 0.3.8 / 2017-11-22
> App
- Empowered the aggregation pipeline for calculating the pagination on the fly.
- Simplified `search.find` in 'search'.
- Hooked error handler middleware into 'page' route.

> UI
- Accessing a page greater than the last page now returns its last page.


### 0.3.7 / 2017-11-22
> App
- Added pagination into 'search' controller.
- Introduced mongo aggregation pipeline for more efficient db query.
- Renamed some router params for db query integrations.
- Rewired 'search' controller with ES6 destructuring with defaults.

> UI
- Added pagination tags into '_header' (for SEO).


### 0.3.6 / 2017-11-21
> App
- Rewired 'search' controller for integrations of 'post' route. (on progress)


### 0.3.5 / 2017-11-20
> App
- Rewired 'search' controller for preventing memory leaking.


### Debugged 0.3.4 / 2017-11-20
> Bug
- Rejected promise catching by `_end.wrapAsync` for `_end.next.postRender`.


### 0.3.4 / 2017-11-20
> App
- Rewired schema and 'search' controller.

> UI
- Adjusted the corresponding to the change in schema.


### 0.3.3 / 2017-11-19
> App
- Added 'search' controller.


### 0.3.2 / 2017-11-17
> App
- Issued the 'LICENCE' file in 'Apache License 2.0'.
- Created MongoDB index for full text search from 'post' model.
- Created corresponding route rules for MongoDB full text search.
- Temporarily applied `_fn.string.HTMLEscape` method onto `req.body.post` for content escaping.

> UI
- Added 'search' template.


### 0.3.1 / 2017-11-17
> App
- Used the conventional environment variable name `NODE_ENV`.
- Renamed files.


### 0.3.0 / 2017-11-17
> App
- Developed in the new '0.3 branch'.
- Renamed and restructured files.


### 0.2.7 / 2017-11-16
> App
- Dried up 'post' route.
- Fixed authorization error as visiting by `canonicalKey`.


### 0.2.6 / 2017-11-15
> App
- Customized validation error messages.


### 0.2.5 / 2017-11-14
> App
- Fixed the sign-out flash message.
- Rearranged 'authentication' route.


### 0.2.4 / 2017-11-14
> App
- Removed the Mongo's anti-pattern as in `docList` schema.
- Authorization was replaced by `Model.count()` method due to the removal of the anti-pattern.
- Replaced `req.locals._render` by `req.session._view` for much dryer codes.


### 0.2.3 / 2017-11-14
> App
- Restructured 'methods'.
- Fixed 'app.test'.


### 0.2.2 / 2017-11-13
> App
- Restructured 'middleware' and 'app'.
- Recombined 'passport' config file into 'app'.
- Renamed `_siteConfigSchema.siteInitialization` into `_siteConfigSchema.dbInitialize`.
- Grouped local variables into `_view`.
- Fixed 'seed' route.

> UI
- Renamed variables with respect to the changes in the app.
- Set default as checked for 'Stay sign-in for 14 days.' option in 'signin'.


### 0.2.1 / 2017-11-12
> App
- Rewired 'passport' configs so only pages needed authentications will use the passport to generate `req.user` object.
- After a successful authentications, the required user info will be populated into `req.session.user` object.
- Used `req.flash('pass')` for replacing `req.session.justSignOut`.


### 0.2.0 / 2017-11-12
> App
- Removed unused dependencies 'cookieParser'.
- Configured 'express-session' for allowing to sign-in persistently.
- Implemented 'connect-mongo' as the session store.

> UI
- Added 'stay sign-in for 14 days' checkbox into 'sign-in' template.


### 0.1.6 / 2017-11-11
> App
- Added `x-robots-tag = none` header into static path and pages needed authentications for preventing crawling from searching engine robots.
- Added `_pre.doNotCrawled` into 'middleware'.
- Added `option` as an argument into runtime functions in '_viewEngine'.
- Separate the the default partials path between console and others.
- Renamed some variables.


### 0.1.5 / 2017-11-10
> App
- Added new testing items (for the console route).
- Renamed and rearranged some files and directories.
- Used environment variables for pointing SSL documents.
- Promisified `.changePassword` method in the user schema.


### 0.1.4 / 2017-11-09
> App
- Added 'Route - Seed' and 'Route - Authentication' for testing.
- Replaced conditional syntax from `var !== ''` by `!!var`.
- Renamed folder 'model' to be 'schema'.
- Added 'schema/test.js' for destructuring for modules loading.
- Updated 'seed' route.

> UI
- Adapted the method changing in 'signin'.


### 0.1.3 / 2017-11-08
> App
- Started to use Jest as testing frameworks.
- Adjusted `_siteConfig.siteInitialization` method.


### 0.1.2 / 2017-11-06
> App
- Added a method function `.promisify` for promisification.
- Rename middleware from `_pre.wrapAsync` to `_end.wrapAsync`.
- Fixed the 'authentication' route.

> UI
- Updated 'singup' template.


### 0.1.1 / 2017-11-05
> App
- Simplified code structures in 'middleware' and 'authentication' route.


### 0.1.0 / 2017-11-02
> App
- Categorized 'middleware' based on the triggering positions as `._pre` or `._end`.
- Greatly restructured many 'router' by using `async/await` ES2017 features to replace most of Promises.
- Used `_end.error.clientError` end-ware to handle error messages.
- Used `res.locals._render` to collaborate with `_end.next.postRender` end-ware.

> UI
- Adapted `Date` type of variable in corresponding with the change in server side.
- Removed redundant `page` variable as in 'editor'.


### 0.0.58 / 2017-11-01
> App
- Removed the anti-pattern as adding methods into `String.prototype` and restructured the corresponding calls.
- Replaced some methods by 'lodash'.


### 0.0.57 / 2017-11-01
> App
- Withdrew the dependency of 'express.sanitizer'.
- Used property name '$_' to collect all customized `String.prototype` methods.
- Added `String.prototype._$.sanitize` to avoid basic code injections.
- Corrected regex in '_viewEngine'.
- Fixed typos in 'HISTORY.md'.


### 0.0.56 / 2017-10-31
> App
- 'busboy' was transformed into a middleware.
- `.correlateAsCreateOrDelete` was renamed as `.updateThenCorrelate`.
- Promisified correlation methods in models.


### 0.0.55 / 2017-10-30
> App
- Improved code efficiency and accuracy in the 'busboy'.

> UI
- Corrected the field name for the 'busboy' to parse.


### 0.0.54 / 2017-10-29
> App
- Fixed a bug in 'methods'.
- Added user profile picture filed in 'user' schema.

> UI
- Added more social linkages.
- User profile was now displayed.
- Polished the dropdown menu in nav-bar.


### 0.0.53 / 2017-10-29
> App
- Added 'HISTORY.md' tracking logs.
- Restructured '_viewEngine'.

> UI
- Renamed the run-time function from `_fn.partial` to `_fn.loadPartial`.


### 0.0.52 / 2017-10-28
> App
- Restructured minor architecture. (String proto-method pre-defined.)
- Removed '%' as the replacement criteria in `.canonicalKey` method (for encoded URL usages).

> UI
- Fixed a typo in 'post' route.


### 0.0.51 / 2017-10-28
> App
- Extend the String method for reading mongo ObjectID.
- Implemented the 'canonicalKey' feature for the user-friendly URL.
- Changed routing rules to adapt the user-friendly URL. (with the accessing by ObjectID as an alias)
- Fixed a bug in 'middleware'.

> UI
- Fixed the bug of flash message display in 'header'.
- Added the 'canonicalURL' into the template 'header' for SEO.


### 0.0.50 / 2017-10-27
> App
- Fixed markdown compilation errors in `blockquote`, which was due to DB stored `>` as `&gt;`. (in '_viewEngine')

> UI
- Used 'highlight.JS' lib as the code highlighter. (running on client side)
- Improved minor UI issues.


### 0.0.49 / 2017-10-26
> App
- Replaced compile-time evaluation by run-time evaluation in '_viewEngine', which allows the usage of run-time variables.
- Introduced 'marked' library for run-time markdown compilation.
- Used ES6 syntax to simplify codes in 'config/methods'.

> UI
- Added links of social media.
- Enhanced HTML 5 semantic structure.
- Added ARIA (accessibility) supports.
- Fixed bug in 'editor'.
- Fixed other minor UI issues.


### 0.0.48 / 2017-10-25
> App
- Switched from HTTP1.1 to HTTP2 use. (currently by 'spdy' lib)

> UI
- Introduced 'font-awesome' as the site font icons provider (from CDN).
- Declared licences for contents on the site.


### 0.0.47 / 2017-10-23
> App
- Added `_role` property into 'user' schema.
- Removed `x-powered-by` tag from the header.
- Adapted ES6 syntax into 'bin/www'.
- Split `setPageTitle` into `prependTitleTag` and `appendTitleTag` middleware.


> UI
- Introduced 'colors-css' as the site palette (from CDN).
- Choose 'SCSS' for css interpretations.
- Added sitemap and copyright sections into 'footer'.


### 0.0.46 / 2017-10-22
- Rearranged file directories.
- Fine-tuned some codes.


### 0.0.45 / 2017-10-21
- Added `passwordValidation` middleware.
- Simplified unnecessary 'div' tags in templetes.
- Improved minor UI.


### 0.0.44 / 2017-10-21
- Implemented Bootstrap 4.
- Enhanced major UI.


### 0.0.43 / 2017-10-21
- Added a new option for '_viewEngine' for the comment stripping (defaulted in HTML).
- Added `_site.titleTag` as a pre-loaded variable for <title> HTML tag.


### 0.0.42 / 2017-10-19
- Used Promise for codes rearranging in 'middleware'.
- Introduced an new middleware for subtitle setup (also could be used within the endpoint).
- Renamed variable `gate` to be `_pre`, and `localVariables` to be `preloadLocals`.
- Fine-tuned some minor parts.


### 0.0.41 / 2017-10-18
- Dried '_viewEngine'.
- Supported multi-layered partial files in the templates.


### 0.0.40 / 2017-10-18
- Cleaned up all expired comments.
- Major errors handled.


### 0.0.39 / 2017-10-17
- Altered form username by email as primary field for authentication.
- Set 'username' is optional, which can be used in replacement of email.
- Limited the fields to be stored into the section (as `req.user`).
- Pre-hooked  the nickname field by the name of user in 'user' schema.


### 0.0.38 / 2017-10-16
- Type fixed: the `.correlateAsCreateOrDelete` method is actually a function rather than a constructor.


### 0.0.37 / 2017-10-16
- Dried up codes by using a pre hook in 'post' and 'media' schema.


### 0.0.36 / 2017-10-16
- Fixed typos.
- Dried up `CreateAndAssociate` and `DeleteAndDissociate` by `CorrelateAsCreateOrDelete` constructor in multiple models.


### 0.0.35 / 2017-10-15
- Added additional validation rule for 'feature' field in 'post' schema.
- Introduced `async/await` from ES2017 for code restructuring.
- Bug fixed: Promise chain.


### 0.0.34 / 2017-10-14
- Modified modle schema in demanding data requirements and validations.
- Handled potential '_siteConfig' errors.
- Adapted authentication rules in corresponding to the current schema.
- Replaced PUT by PATCH.
- Included other minor twits...


### 0.0.33 / 2017-10-12
- Bug in 'editor' fixed.
- Rearranged 'post' route.


### 0.0.32 / 2017-10-10
- Added error handlers, and rearranged codes in 'busboy' for better readability.
- Minor changed in '_viewEngine'.
- Applied more template literals.


### 0.0.31 / 2017-10-09
- Improved data structure in `_local` variables for security enhancement.


### 0.0.30 / 2017-10-08
- Updated dependent packages.
- Restructured '_viewEngine', and added more error handlers.
- Renamed the partial directory.
- Corrected the data type of `loadedConfig` in 'middleware'.


### 0.0.29 / 2017-10-07
- Switched to a customized doT view engine.


### 0.0.28 / 2017-10-03
- Dried codes in models significantly.
- Bugs fixed.


### 0.0.27 / 2017-10-02
- Bug fixed: redirect loop trigger by `redirect('back')` in a middleware.
- Reconstructed model methods in terms of Promise. (yet to be dried)
- Applied template literals.


### 0.0.26 / 2017-10-01
- A serious bug in 'console' router fixed. (due to a wrong variable assignment)
- For '[fn] user association with docs': the user is an optional variable, thus the order of argument is changed.


### 0.0.25 / 2017-10-01
- Bug fixed.
- More bugs were found. (yet to be fixed)


### 0.0.24 / 2017-09-30
- Promisified '_siteConfig' model.
- Implemented dissociation while deleting posts.
- Simplified methods in 'post' and 'media' models.
- Sanitized field 'val' in 'busboy' config.
- Bugs fixed.


### 0.0.23 / 2017-09-30
- Promisified 'busboy' config, 'media' and 'post' models, with callback usage supports.
- Further promisified 'console' route with commented "callback ver.".
- Bug fixed.


### 0.0.22 / 2017-09-29
- Promisified 'post' and 'console' (partial) routes.
- Busboy bugs fixed.


### 0.0.21 / 2017-09-29
- Shorten codes on 'editor.ejs'.


### 0.0.20 / 2017-09-28
- Greatly used arrow functions for improving codes readability.
- Removed redundant 'return' keywords.


### 0.0.19 / 2017-09-27
- Restructured 'authentication' and 'post' routes to meet the stander of REST.
- Reversed the order of post list (newest first).


### 0.0.18 / 2017-09-25
- Implemented 'security' route for user password updating.


### 0.0.17 / 2017-09-24
- Refined scripts comments.


### 0.0.16 / 2017-09-24
- Refined 'post' and 'media' model for more consistent.
- Handled errors from 'fs' libs.
- introduced "the time-named folder" for grouping uploaded files.
- Renamed some elements for more readability.


### 0.0.15 / 2017-09-23
- Corrected declarations.

Configured Busboy uploader:
- Separate documents 'uploading' and 'creating'.
- Centralized all flash messages.
- Embedded into 'Media' model.


### 0.0.14 / 2017-09-22
- Introduced the "deep parsing" feature for multilayer object constructions


### 0.0.13 / 2017-09-21
- Started to use EC6 syntax.
- Simplified, and added fields parser into uploader, so the meta of image could be written into DB.


### 0.0.12 / 2017-09-20
- Recycled frequently used query into the schema.
- Restructured ‘Seed’ and ‘post’ route.
- Introduced Busboy module.
- Costumed a busboy-base image uploader.
- Implemented 'const’ declaration.


### 0.0.11 / 2017-09-18
- Added two meta data into 'header'.
- Added routing rules for 'setting' and 'profile' with CRUD chains.
- Improved the readability in 'seed' route by reducing callback hells.
- Redced redundancy in codes for more readability.


### 0.0.10 / 2017-09-17
- Combined middleware '.isAuthorized' method with '.isSignedIn' method to reduce redundancy.
- Reordering codes in '_siteConfig' schema.
- Enhanced code readability in 'post' route.


### 0.0.9 / 2017-09-17
- Data from '_SITECONFIG' collection in DB are now accessible as local variables, so (todo:) user can change website name through the backsite 'console'.


### 0.0.8 / 2017-09-16
- Restructured files.
- Updated console routes.
- Added post-author association.
- Added _siteConfig schema with 'new site registration' feature.


### 0.0.7 / 2017-09-15
- Fixed Bootstraps can not be normally loaded due to missing security parameters.
- Fixed flash messages error in authentication route.
- Some bugs fixed.


### 0.0.6 / 2017-09-14
- Added new middleware for authorization checking, and script sanitizing.
- Simplified names in variables in DB data structure.
- Fixed bugs in authentication route so it can pass the correct message.
- Added post routes and the corresponding.
- Revised seed routes.
- Started to use 'todo', 'tofix', 'option' comments supported by Webstorm as a tool kit.


### 0.0.5 / 2017-09-13
- Added flash messages and the corresponding.
- Typo corrected.


### 0.0.4 / 2017-09-13
- Separated passport configurations.
- Rearranged authentication route.
- Added sign-up testing page, and corresponding.


### 0.0.3 / 2017-09-12
- Added basic local authentications with PASSPORT package.


### 0.0.2 / 2017-09-11
- Added user & post schema (initial).
- Added seed routes (for dev. Only).
- Introduced passport(local).
- Separated error routes.
- Minor safety-related issues improved.


### 0.0.1 / 2017-09-11
- Added additional npm packages
- Restructured files & dirs
- As a template
