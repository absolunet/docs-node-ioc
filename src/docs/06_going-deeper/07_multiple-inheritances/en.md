# Multiple inheritances

## Introduction

Inheritance in JavaScript allows us to extend a class or to modify the prototype object of an instance.
By default, it does not allow multiple inheritances, unlike some Object-Oriented languages such as C++.
However, Node IoC offers a simple way to define mixins, a simple way to add some features in a class.
They act somehow like traits in PHP.
We will take a look at how they work, the existing mixins and how to define one.



## Mixin pattern

A mixin is a function that accepts an optional class as its only argument.
It returns another class that extends the given one, or a plain class by default if no parent class is provided.
You can then extend this new class without any problem.
With this in mind, it must be understood that `A extends someMixin(B)` results in `A extends SomeClass` and `SomeClass extends B`.

```javascript
import { mixins } from '@absolunet/ioc';

const { hasDriver } = mixins;


class MyService extends hasDriver() {

}
```

In this example, `MyService` class extends a dynamic class called `HasDriverMixin`.
After this dynamic call, `MyService` has some methods offered by the mixin.

 - `driver(name, parameters = {})`
 - `addDriver(name, driver)`
 - `setDefaultDriver(name)`
 - `setDriverAlias(name, alias)`
 - `hasDriver(name)`
 - `isDriverAlias(name)`

However, this mixin alone does nothing special.
It simply creates a dynamic class that you could have made "static".
The interesting thing happens when extending another class, but by still using the mixin.

```javascript
class MyService {

    doSomething() {
        //
    }

}


class MySpecialService extends hasDriver(MyService) {

}
```

In this scenario, `MySpecialService` inherit from `HasDriverMixin`, but the mixin returns a class that extends `MyService`.
Then, `MySpecialService` inherits from both `HasDriverMixin` and `MyService`.

We can go further and use two mixins with a base class at the same time.

```javascript
class MySpecialService extends hasDriver(forwardsCalls(MyService)) {

}
```



## Existing mixins

There are five available mixins that are used across framework classes:

 - `checksTypes`
 - `forwardsCalls`
 - `getsMethods`
 - `hasDriver`
 - `hasEngine`

All of these mixins are available in the `mixins` exported value.

```javascript
import { mixins } from '@absolunet/ioc';

const {
    checksTypes,
    forwardsCalls,
    getsMethods,
    hasDriver,
    hasEngine
} = mixins;
```



### checksTypes

The `checksTypes` mixin exposes four methods that help to validate types.

 - `isInstantiable(object)`
    > Returns `true` if the given argument can be called with the `new` keyword


 - `isFunction(object)`
    > Returns `true` if the given argument is a regular or arrow function


 - `isObject(object)`
    > Returns `true` if the given argument is a non-null object


 - `methodExists(method)`
    > Returns `true` if the given method name exists in the current instance



### forwardsCalls

The `forwardsCalls` mixin exposes a single method, and declare an abstract method that must be implemented.

 - `forwardCall(method, parameters = [])`
    > Call the given method on the forward instance with the given parameters as arguments.


 - `getForward()`
    > _Abstract_ method that must be implemented.
    > Should return an object on which the call should be forwarded.



### getsMethods

The `getsMethods` mixin exposes a single method.

 - `getMethods(instance)`
    > Returns a list of all available methods in the given instance, including instance methods, prototype methods, and inherited methods, sorted alphabetically.



### hasDriver

The `hasDriver` mixin exposes all the necessary features to use drivers.

 - `driver(name = 'default', parameters = {})`
    > Returns the driver instance by name, made by the container with the given parameters.


 - `bootDriver(driver, name)`
    > Method that can be overridden to boot a driver.
    > Returns the booted driver.


 - `addDriver(name, driver)`
    > Add a driver instance or class with a name that acts as a unique identifier.


 - `setDefaultDriver(name)`
    > Set default driver by name.
    > The driver will then be aliased as "default"


 - `setDriverAlias(name, alias)`
    > Set a driver's alias, so it can be resolved with both names.


 - `hasDriver(name)`
    > Returns `true` if the driver exists or is an alias.


 - `isDriverAlias(name)`
    > Returns `true` if the driver is an alias.



### hasEngine

The `hasEngine` mixin exposes a single method, paired with an accessor.

 - `setEngine(engine)`
    > Set the current engine


 - `get engine()`
    > Current engine accessor.



## Define mixin

To define a new mixin, the `mixins` exposed object from Node IoC contains a `factory` function, for standalone mixins, and `add` function, for registered and reusable mixins.

The `add` method accepts a name, and a factory function, while `factory` only accepts a factory function.


```javascript
// Reusable mixin
import __         from '@absolunet/private-registry';
import { mixins } from '@absolunet/ioc';


mixins.add('hasUser', (SuperClass) => {
    return class HasUserMixin extends SuperClass {
    
        static get dependencies() {
            return (super.dependencies || []).concat(['event']);
        }

        init() {
            if (super.init) {
                super.init();
            }

            this.setUser(null);
        }

        getUser() {
            return __(this).get('user');
        }

        setUser(user) {
        	__(this).set('user', user);
            this.event.emit(`user.${user ? 'set' : 'unset'}`, { user });

            return this;
        }

    }
});

const { hasUser } = mixins;
hasUser(); // HasUserMixin {}
```

```javascript
// Standalone mixin
import __         from '@absolunet/private-registry';
import { mixins } from '@absolunet/ioc';


export default mixins.factory((SuperClass) => {
    return class HasUserMixin extends SuperClass {
    
        static get dependencies() {
            return (super.dependencies || []).concat(['event']);
        }

        init() {
            if (super.init) {
                super.init();
            }

            this.setUser(null);
        }

        getUser() {
            return __(this).get('user');
        }

        setUser(user) {
        	__(this).set('user', user);
            this.event.emit(`user.${user ? 'set' : 'unset'}`, { user });

            return this;
        }

    }
});

const { hasUser } = mixins; // undefined;
```

The callback will always receive a `SuperClass`.
It can be a class that is passed in parameter or a plain empty class.

Notice that, when implementing the `init` method, we attempt to initialize the parent, if it implements the `init` method too.
Also, we inject the `event` dispatcher.
However, the parent class may also inject services.
We must ensure that its dependencies are resolved and in the same order.
That is the reason why the current class dependencies are appended instead of prepended.

This is one of the few items that cannot be injected by Node IoC since it allows us to change an exported value that can be used for further definitions.

If you want to create mixins, they should be done before loading any classes.

```javascript
// [your Node IoC application/src/bootstrap/index.js

import './mixins';
import handlers  from './handlers';
import lifecycle from './lifecycle';

/* ... */
```

```javascript
// [your Node IoC extension]/src/index.js

import './mixins';
import ExtensionServiceProvider from './ExtensionServiceProvider';


export default ExtensionServiceProvider;
```
