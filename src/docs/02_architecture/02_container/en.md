# Container

## Introduction

In any IoC application, the Container is the central point of action when it comes to dependency resolving.
Its role is to store the different bindings, to resolve those bindings, to manage the dependency injection process, etc.
Node IoC makes no exception about this and offers all the basic features a container should provide.

The container is in fact the base class of the application.
You can directly use the container features through the application.



## Bindings and singletons

First, the container offers two main methods to bind elements: the `bind` and the `singleton` methods.

When using `bind`, we associate an abstract (a string) to a concrete (a class, a factory, an instance, a primitive type value, etc.).
If a value was already bind with the same abstract, it is overwritten at this moment.
When making the abstract, the concrete is resolved.
The resolving algorithm is describe below.

When using `singleton`, the same thing happen.
The key difference is that when making the instance, the first made instance will be stored as a singleton and returned each time the container is asked to make this abstract instead of making the instance every time.

```javascript
class SomeServiceProvider extends ServiceProvider {

    register() {
        this.app.bind('foo', 'Foo'); // The 'foo' abstract will result in 'Foo' as concrete.
        this.app.bind('bar', { key: 'value' }); // The 'bar' abstract will result in the object as concrete.
        this.app.bind('baz', () => { // The 'baz' abstract will result in a newly created object each time it will be made.
            return { key: 'value' };
        });
        this.app.bind('qux', QuxService); // The 'qux' abstract will result in a QuxService instance.
        this.app.singleton('once', SomeService); // The 'once' abstract will result in a SOmeService instance, but if made twice, the same instance will be returned both time.
    }

    boot() {
        console.log(this.app.make('bar') === this.app.make('bar')); // true, since the concrete is an object.
        console.log(this.app.make('baz') === this.app.make('baz')); // false, the closure is called twice to create two distinct objects that serialize to the same string.
        console.log(this.app.make('qux') === this.app.make('qux')); // false, the class will is instantiated twice.
        console.log(this.app.make('qux').constructor === this.app.make('qux').constructor); // true, the class remains the same for all the instances.
        console.log(this.app.make('once') === this.app.make('once')); // true, 'once' is treated as a singleton and will not be instantiated twice, except if specified.
    }

}
```



## Resolve abstracts

### The make method

When binding an concrete to an abstract, it is to be resolved by another entity through the container.

The container offers a simple method to get the concrete from an abstract: `make`.
It accepts the abstract name as an argument and will process everything for us, from the resolving to the instantiation with dependency injection.

If you have bound `{ key: 'value' }` to the `bar` abstract, then `app.make('bar')` will results in `{ key: 'value' }`.

```javascript
app.make('some.service'); // SomeService {}
```

You can make any bound abstract and the container will resolve it for you.

However, if you need to use all the rich container features when it comes to instantiation, you can use the `make` method with a concrete instead of an abstract.

If you have a `SomeService` class that you need to instantiate on the fly, simply make it, it will returns you a `SomeService` instance by following all the resolving steps.

```javascript
app.make(SomeService); // SomeService {}
```

To push it further more, let's say that you have a singleton of the `once` abstract.
Making `once` twice will not create a new instance.
If you need another one regardless of the binding state, you could do something like `app.make(app.make('once').constructor)`.
It will create a new instance of the `once` concrete class.

```javascript
app.singleton('once', SomeService);
const once = app.make('once'); // SomeService {}
once === app.make('once'); // true
const other = app.make(app.make('once').constructor); // SomeService {}
once === other; // false
```



### The resolve method

The `resolve` method does the same thing as the `make` method.
If the given abstract should be a singleton, it will be stored as a singleton.
However, it won't consider the singleton when resolving the abstract, so don't expect to receive the same concrete twice.

```javascript
app.singleton('once', SomeService);
const once = app.resolve('once'); // SomeService {}
const other = app.resolve('once'); // SomeService {}
once === other; // false
once === app.make('once'); // true, the first instance will still be kept as a singleton
```



## Aliases

Aliasing an abstract can be useful to keep simple abstract names, while still having the binding secured with a namespaced abstract.

Let's say that you have a binding called `namespace.foo.bar.baz` and you want to have it available with `baz`.
Simply call `app.alias('baz', 'namespace.foo.bar.baz')`.
When making `baz`, the `namespace.foo.bar.baz` concrete will be returned.
It still handle singleton as it would be with the original abstract.

```javascript
app.singleton('foo', SomeService);
app.alias('bar', 'foo');
app.alias('baz', 'bar');
app.make('foo') === app.make('bar'); // true
app.make('foo') === app.make('baz'); // true
```



## Decorators

Decorators are a very effective way to enhance the available features within a class instance.
In Node IoC, the decorators are simply closures in which we transform the value to either a new one, or in the same one with enhanced or transformed behavior.
It acts the same way as a reducer, so you must return a value at the end of the decorator.

```javascript
app.bind('foo', SomeService);
app.decorate('foo', (someService) => {
    someService.prepareSomething();

    return someService;
});
app.decorate('foo', (someService) => {
    return new SomeServiceDecorator(someService);
});
```



## Tags

Tagging is a feature that allows abstract grouping.
In OOP, with interfaces, it is usually used to group concretes that share the same interface.

The best example would be loggers: one that logs into a file and another that logs through ElasticSearch.
Both of them exposes the same API that returns the same value types but are implement in two different ways.

```javascript
app.singleton('logger.file', FileLogger);
app.singleton('logger.elasticsearch', ElasticSearchLogger);
app.tag(['logger.file', 'logger.elasticsearch'], 'loggers');

const loggers = app.make('loggers');
/*
 * It returns a dictionary that pairs abstract to resolved concretes attached to the resolved tag.
 *
 * {
 *     'logger.file':          FileLogger {},
 *     'logger.elasticsearch': ElasticSearchLogger {}
 * }
 */
await Object.values(loggers).map(async (logger) => {
    await logger.log('Something to log');
});
```



## Dependency injection

The most powerful tool in the Node IoC container is the dependency injection system.
It was mostly inspired by the [Angular.js](https://docs.angularjs.org/guide/di#-inject-property-annotation) dependency injection approach in term of usage, but some magic was added to the recipe for easier user-end implementation.

To request dependencies in a class instance, you must implement a static getter called `dependencies`.

```javascript
class SomeService  {

    static get dependencies() {
        return ['app', 'config']
    }

    constructor(...parameters) {
        console.log(parameters);
    }

}

app.make(SomeService); // console -> [Application {}, ConfigRepository {}]

```

If a dependency cannot be resolved, it will throw an error.

This is where the `make` and the `resolve` methods adds a new feature: dependency injection overwriting.

```javascript
class SomeService  {

    static get dependencies() {
        return ['app', 'config'];
    }

    constructor(...parameters) {
        console.log(parameters);
    }

}

class FakeConfigRepository {} // To be implemented...


app.make(SomeService, {
    config: app.make(FakeConfigRepository)
}); // console -> [Application {}, FakeConfigRepository {}]
```


When overwriting dependency injection, the required dependency concrete bound in the container will not be instantiated.

The fun part is that the container automatically binds the different injected concrete in the class instance as accessors.
The name is transformed to a `camelCase` representation of the abstract.

```javascript
class SomeService  {

    static get dependencies() {
        return ['app', 'config', 'router.handler'];
    }

}

const someService = app.make(SomeService);
console.log(someService.app);          // Application {}
console.log(someService.config);       // ConfigRepository {}
console.log(someService.routerHander); // Handler {}
```

It also bind the application to the instance with the `[@absolunet/private-registry](https://github.com/absolunet/node-private-registry)` library.

```javascript
import __ from '@absolunet/private-registry';

class SomeService  {

    static get dependencies() {
        return ['app', 'config', 'router.handler'];
    }

}

const someService = app.make(SomeService);
__(someService).get('app');            // Application {}
__(someService).get('config');         // ConfigRepository {}
__(someService).get('router.handler'); // Handler {}
```



## Resolving algorithm

The main resolving algorithm handle all the previously described features, but has much more power under the hood.

 - Abstract resolution
 - Tag resolution
 - Alias resolution
 - Concrete resolution
 - File path resolution (through `require()`)
 - Class instantiation
 - Factory call
 - Object extension
 - Concrete decoration
 - Singleton management

First, when trying to make a concrete from either an abstract or an object, the contains checks if a singleton exists with the given abstract name.
If the abstract is not a string, it will always return a fresh instance.
If a singleton exists, it is returned without going any further.

If a singleton is not found, then the concrete is resolved.

To resolve the concrete, it starts by checking if the given abstract is bound to the container, either as an abstract or as an alias.
If it is the case, the concrete is retrieve, along with a singleton flag.

Otherwise, if the abstract is a valid tag, the tagged concrete are resolve through the same process within a loop to resolve all the tagged abstracts.

Otherwise, if the abstract is a string, it assumes that it must be either a path or a module that is requireable.
It attempts to require it.

Otherwise, the abstract is considered a concrete.

Then, when a concrete has been found, it builds it by following those rules:

 - If it is a class or a regular function, it returns a new instance with dependency injection, if present.
 - Otherwise, if it is a function, it calls it and return the received value.
 - Otherwise, it treats it as an object and merge the dependency overwrites in it, if provided.
 
Now that the build has been done, all the decorators, in order of bindings, decorates the built instance.

After the final object has been created, if the abstract was bound as a singleton, the object is stored in order to be retrieved later.

Finally, the instance is returned.
