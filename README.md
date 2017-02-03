# captains-log

[![NPM version](https://badge.fury.io/js/captains-log.svg)](http://badge.fury.io/js/sails) &nbsp; [![Build Status](https://travis-ci.org/balderdashy/captains-log.svg?branch=master)](https://travis-ci.org/balderdashy/captains-log) &nbsp; [![Build status on Windows](https://ci.appveyor.com/api/projects/status/x80uq1asenhkmwit/branch/master?svg=true)](https://ci.appveyor.com/project/mikermcneil/captains-log/branch/master)


Lightweight logger with a simple pass-through configuration for use with fancier logging libraries.  Used by the [Sails framework](http://github.com/balderdashy/sails).  Optional support for colorized output, custom prefixes, and log levels (using [npm's logging conventions](https://github.com/isaacs/npmlog#loglevelprefix-message-).)


## Installation

```shell
$ npm install captains-log
```


## Usage

```javascript
var log = require('captains-log')();

log('hi');
```


##### Logging at a particular level

By default, if you just call `log()`, captains-log will write your log output at the "debug" log level. You can achieve the same effect by writing `log.debug()`.

> IMPORTANT NOTE: npm calls this level `log.http()`, but we call it `debug`.
> If you use `log()`, the logger sees this as a call to `log.debug()`)

Here are all of the log-level-specific methods which are available in captains-log out of the box:

```javascript
log.silly();

log.verbose();

log.info();

log.debug()

log.warn();

log.error();
```



## Configuring a custom logger

To use a different library, `overrides.custom` must already be instantiated and ready to go with (at minimum) an n-[ary](http://en.wikipedia.org/wiki/Arity) `.debug()` method.

##### Implementing the simplest possible override

```javascript
var log = require('captains-log')({ custom: customLogger });

log('hello', 'world');
// yields => "Hello world"
```

This assumes `customLogger` works as follows:

```javascript
customLogger.debug()
customLogger.debug('blah')
customLogger.debug('blah', 'foo')
customLogger.debug('blah', 'foo', {bar: 'baz'})
customLogger.debug('blah', 'foo', {bar: 'baz'}, ['a', 3], 2, false);
// etc.
```

For example:

```javascript
var customLogger = console.log.bind(console);
```

##### Configure inspect

When an object is passed, and inspect is set to true (it is true, by default), you can configure the inner inspect function options, by passing an `inspectOptions` parameter:

```javascript
var log = require('captains-log')({inspectOptions: {colors: true, depth: null}});

log('hello', 'world', {this:'is', a: 'nice', object: new Date()});

```

The previous code renders the object with colors.

![result](https://cloud.githubusercontent.com/assets/453120/16435457/863c912e-3d6c-11e6-85a4-1c93f4340e2b.png)


##### Using Winston

Formerly, this module encapsulated [winston](https://github.com/flatiron/winston), a popular logger by [@indexzero](https://github.com/indexzero) and the gals/guys over at [Nodejitsu](https://www.nodejitsu.com/). But eventually, we made Winston optional to make captains-log as lightweight as possible and reduce the number of `npm install`s and `require()`s necessary for its usage in other modules.

But Winston is awesome!  And it's a great fit for many apps, giving you granular control over how log output is handled, including sending emails, logging to multiple transports, and other production-time concerns.

To boot up a captains-log that writes to Winston, do the following:

```javascript
var log = require('captains-log')({
  custom: new (require('winston').Logger)({
    levels     : ...,
    transports : ...
  })
});
```


> ### Why use a custom logger?
> It it can useful to configure a custom logger-- particularly for regulatory compliance and organizational requirements (i.e. if your company is using a particular logger in other apps.)  In the context of Sails, configuring a custom logger also allows you to intercept all log messages automatically created by the framework, which is a quick way to set up email notifications about errors and warnings.
>
> That said, don't feel like you _have_ to use a custom logger if you want these sorts of notifications.  In fact, there are usually more straightforward ways to implement features like Slack, SMS, or email notifications.  For example, in Sails, consider customizing your `responses/serverError.js` file.  Or check out a product like [Papertrail](https://papertrailapp.com/).



## Help

If you have further questions or are having trouble, click [here](http://sailsjs.com/support).


## Bugs &nbsp; [![NPM version](https://badge.fury.io/js/captains-log.svg)](http://npmjs.com/package/captains-log)

To report a bug, [click here](http://sailsjs.com/bugs).


## Contributing &nbsp; [![Build Status](https://travis-ci.org/balderdashy/captains-log.svg?branch=master)](https://travis-ci.org/balderdashy/captains-log)

Please observe the guidelines and conventions laid out in the [Sails project contribution guide](http://sailsjs.com/documentation/contributing) when opening issues or submitting pull requests.

[![NPM](https://nodei.co/npm/captains-log.png?downloads=true)](http://npmjs.com/package/captains-log)


## License

This package, like the [Sails framework](http://sailsjs.com), is free and open-source under the [MIT License](http://sailsjs.com/license).
