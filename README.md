captains-log
============

Simple wrapper around Winston to allow for declarative configuration


#### Default log levels

Based on [npm's log levels](https://github.com/isaacs/npmlog#loglevelprefix-message-)


+ `log.silly()`
+ `log.verbose()`
+ `log.info()`
+ `log.debug()`
  + (npm calls this level `log.http()`, but we call it `debug`.  If you use `log()`, the logger sees this as a call to `log.debug()`)
+ `log.warn()`
+ `log.error()`