# captains-log

Lightweight logger with a simple pass-through configuration for use with fancier logging libraries.  Used by the [Sails framework](http://github.com/balderdashy/sails).  Optional support for colorized output, custom prefixes, and log levels (using [npm's logging conventions](https://github.com/isaacs/npmlog#loglevelprefix-message-).)


### Usage

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



### Configuring a custom logger

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

##### Using Winston

Formerly, this module encapsulated [winston](https://github.com/flatiron/winston), a popular logger by [@indexzero](https://github.com/indexzero) and the gals/guys over at [Nodejitsu](https://www.nodejitsu.com/). Recently, we made Winston optional to make captains-log as lightweight as possible and reduce the number of `npm install`s and `require()`s necessary for its usage in other modules.

But Winston is awesome!  And it's a great fit for many apps, giving you granular control over how log output is handled, including sending emails, logging to multiple transports, and other production-time concerns.

To use boot up a captains-log that writes to Winston, do the following:

```javascript
var log = require('captains-log')({
  custom: new (require('winston').Logger)({
    levels     : ...,
    transports : ...
  })
});
```



### License

MIT
