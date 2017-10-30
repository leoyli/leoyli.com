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
- Removed '%' as the replacedment criteria in `.canonicalKey` method (for encoded URL usages).

> UI
- Fxied a typo in 'post' route.


### 0.0.51 / 2017-10-28
> App
- Extend the String method for reading mongo ObjectID.
- Inplemented the 'canonicalKey' feature for the user-friendly URL.
- Changed routing rules to adapt the user-friendly URL. (with the accessing by ObjectID as an alias)
- Fixed a bug in 'middleware'.

> UI
- Fixed the bug of flash message display in 'header'.
- Added the 'canonicalURL' into the template 'header' for SEO.


### 0.0.50 / 2017-10-27
> App
- Fixed markdown compilation erros in `blockquote`, which was due to DB stored `>` as `&gt;`. (in '_viewEngine')

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
- Splitted `setPageTitle` into `prependTitleTag` and `appendTitleTag` middleware.


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
- Inplemented Bootstrap 4.
- Enhanced major UI.


### 0.0.43 / 2017-10-21
- Added a new option for '_viewEngine' for the comment stripping (defaulted in HTML).
- Added `_site.titleTag` as a pre-loaded variable for <title> HTML tag.


### 0.0.42 / 2017-10-19
- Used Promise for codes rearanging in 'middleware'.
- Introduced an new middleware for subtitle setup (also could be used within the endpoint).
- Renamed varialbe `gate` to be `_pre`, and `localVariables` to be `preloadLocals`.
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
- Added addtional validation rule for 'feature' field in 'post' schema.
- Introduced `async/await` from ES2017 for code restructing.
- Bug fixed: Promise chain.


### 0.0.34 / 2017-10-14
- Modified modle schema in demanding data requirements and validations.
- Handled potential '_siteConfig' errors.
- Adapted authentication rules in corresonding to the current schema.
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
- Renameed the partial directory.
- Corrected the data type of `loadedConfig` in 'middleware'.


### 0.0.29 / 2017-10-07
- Switched to a customed doT view engine.


### 0.0.28 / 2017-10-03
- Dried codes in models significantly.
- Bugs fixed.


### 0.0.27 / 2017-10-02
- Bug fixed: redirect loop trigger by `redirect('back')` in a middleware.
- Reconstructed modle methods in terms of Promise. (yet to be dried)
- Applied template literals.


### 0.0.26 / 2017-10-01
- A serious bug in 'console' router fixed. (due to a wrong variable assignment)
- For '[fn] user association with docs': the user is an optional variable, thus the order of argument is changed.


### 0.0.25 / 2017-10-01
- Bug fixed.
- More bugs were found. (yet to be fixed)


### 0.0.24 / 2017-09-30
- Promisified '_siteConfig' model.
- Inplemented dissociation while deleting posts.
- Simplified methods in 'post' and 'media' models.
- Sanitized field 'val' in 'busboy' config.
- Bugs fixed.


### 0.0.23 / 2017-09-30
- Promisified 'busboy' config, 'media' and 'post' models, with callback usage supports.
- Further promisfied 'console' route with commented "callbck ver.".
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
- Inplemented 'security' route for user password updating.


### 0.0.17 / 2017-09-24
- Refined scripts comments.


### 0.0.16 / 2017-09-24
- Refined 'post' and 'media' model for more consistent.
- Handled erros from 'fs' libs.
- introduced "the time-named folder" for grouping uploaded files.
- Renamed some elements for more readability.


### 0.0.15 / 2017-09-23
- Corrected declarations.

Configured Busboy uploader:
- Separate documents 'uploading' and 'creating'.
- Centralized all flash messages.
- Embeded into 'Media' model.


### 0.0.14 / 2017-09-22
- Introduced the "deep parsing" feature for multilayer object constructions


### 0.0.13 / 2017-09-21
- Started to use EC6 syntax.
- Simplified, and added filedsparser into uploader, so the meta of image could be written into DB.


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
- Added post routes and the correspondings.
- Revised seed routes.
- Started to use 'todo', 'tofix', 'option' comments supported by Webstorm as a tool kit.


### 0.0.5 / 2017-09-13
- Added flash messages and the correspondings.
- Typo corrected.


### 0.0.4 / 2017-09-13
- Separated passport configurations.
- Rearranged authentication route.
- Added sign-up testing page, and correspondings.


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
- Restructuralized files & dirs
- As a template
