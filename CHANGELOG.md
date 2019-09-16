# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## v2.0.2 2019-09-16

* Ensure initialized is reset after a `setViews` calls

## v2.0.1 2019-09-16

* Allow exclusions from reset/destroy functions

## v2.0.0 2018-06-25

* Breaking: Change API for initialisation so that views can be "managed" after they’re called.

## v1.1.5 2018-04-23

### Fixed

* Add --standalone flag to browserify build script. Follows UMD import pattern and makes it available in the browser.

## v1.1.4 2018-04-19

### Change

* Change `dist/viewloader.js` to files for use be used by unpkg.

## v1.1.3 2018-04-19

### Added

* Add pre-bundled version to `dist/viewloader.js` for use without build tools.

## v1.1.2 2016-10-08

### Fixed

* Replace `matches` with `hasAttribute` (@axelbloc) to accommodate older browser.
