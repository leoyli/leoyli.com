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
- Added router.test.js for unit testing.
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
- Replaced `req.locals._render` by `req.session.view` for much dryer codes.


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
- Switched from HTTP1.1 to HTTP2 protocol. (currently by 'spdy' lib)

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
