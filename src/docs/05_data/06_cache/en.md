# Cache

## Introduction

Cache in Node IoC is very simple to use, configuration-driven and makes it easy to store data in multiple backends.
It offers out-of-the-box runtime, file and database caching drivers, but makes implementing Redis or Memcached very simple if you want or need it.



## Configuration

To use the cache system, it must be configured first.
You can find the cache configuration in the `config/cache.yaml` file.

By default, the file cache store is used, under `default`.
There is three different stores available: `runtime`, `file` and `database`.
Each of them has a dedicated driver, so you can reuse those drivers with other cache stores, with another configuration.

Let's say for instance that you need to cache in a different file for a certain type of data.
You could have this configuration.

```yaml
stores:
  file:
    driver: file
    path: '/path/to/folder'

  other:
    driver: file
    path: '/path/to/other/folder'
```

Also, you can specify the global configuration, under the `common` key.
You can configure the cache prefix with the `common.prefix` key.
It may be very useful if using a common cache system such as Redis.
Also, you can specify a default expiration time, in seconds.
If data was cached without specific expiration time, this time will be used.



## The cache manager

The cache manager, injectable through `cache`, will help to resolve the cache driver instance through configuration.
With the proxy wrapper, you can directly access the default driver instance from it, or you can get the driver for the store you want.

```javascript
const cache = app.make('cache'); // CacheManager {}
cache.resolveDefault(); // FileDriver {}
cache.resolve('runtime'); // RuntimeDriver {}
cache.resolve('other'); // FileDriver {}, if the above configuration were used

const value      = await cache.resolveDefault().get('key');
const otherValue = await cache.get('key'); // Same thing as the above line is done under the hood
```

You can also build your custom cache driver through the `build` method.

```javascript
const cache = app.make('cache');

const store = cache.build('file', {
    path: '/path/to/folder'
}); // FileDriver {}
```



## Commands

### The cache:clear command

If you want to clear the whole cache, the `cache:clear` will use the default store and flush it.
If you need to clear a specific cache store, you can use `cache:clear store-name`, such as `cache:clear file`.



### The cache:forget command

If you need to remove a single cached key from the store, you can use `cache:forget key`.
If you need to forget a key in a specific cache store, you can use `cache:forget key store-name`, such as `cache:clear key file`.



## Cache drivers

The cache drivers extend the same interface-like class, which contains the same base methods: `get`, `put`, `forever`, `increment`, `decrement`, `delete` and `flush`

```javascript
const cache = app.make('cache').resolveDefault();

await cache.get('key', 'default value'); // "default value" is returned since nothing is cached under the "key" key

await cache.put('key', 'new value'); // "new value" cached for 10 minutes (configured as 600 seconds) under the "key" key
await cache.get('key', 'default value'); // "new value" is returned
await cache.put('other.key', 'other value', 1200); // "other value" cached for 20 minutes under the "other.key" key

await cache.forever('foo', 10); // 10 cached forever, without expiration date, under the "foo" key

await cache.increment('foo');
await cache.get('foo'); // 11
await cache.decrement('foo');
await cache.get('foo'); // 10
await cache.increment('foo', 4);
await cache.get('foo'); // 14

await cache.delete('foo');
await cache.get('foo'); // null, the key "foo" was deleted moments earlier

await cache.flush(); // All the keys, including the forever cached data, are flushed from the store.
```



### Runtime driver

The runtime cache driver is a simple store handled by a JavaScript object, without any permanent save.
This cache is working through the process runtime.
When the process has exited, the cache is flushed.
It is a good driver for testing purposes, or if you need to cache simple data, but is not suggested for production.
It does not need any configuration.



### File driver

The file driver saves the cached values in JSON files in a configured folder.
By default, the application suggests that the cached values go in the `storage/framework/cache/data`.



### Database driver

The database driver uses a database connection (configured in `config/database.yaml`, under the `connections` key), through the `connection` configuration key.
To use the default connection, simply use the `connection: "default"` configuration
The table name can be configured through the `table` configuration key.
By default, `cache` is the table that will be used.



### The cache:table command

To quickly create your database cache table, the `cache:table` command will create a database migration that creates the cache table by using the configured table name.
Don't forget to run `db:migrate` after creating the cache table migration.
