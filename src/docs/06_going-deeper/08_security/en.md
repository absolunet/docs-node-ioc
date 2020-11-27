# Security

## Introduction

It often happens that some features are restricted to some users or other conditions such as configuration.
Those restrictions are called `policies`, which comes out of the box in Node IoC.
You can define your policies through the `gate` service and use them wherever you want.
Plus, there is already an implementation of gates and policies in commands that you are already using without even noticing it.



## The gate service

The security service provider offers the `gate` service.
It offers basic features to define and use policies through the `policy` and `can` methods.

```javascript
const gate       = app.make('gate');
const dateHelper = app.make('helper.date');

gate.policy('onEvening', () => {
    const hour = dateHelper().hours();

    return hour >= 18;
});

// Given current time = "2020-01-01 19:12:34"
gate.can('onEvening'); // true

// Given current time = "2020-01-01 12:34:56"
gate.can('onEvening'); // false
```

You can also validate multiple policies at the same time.

```javascript
const gate = app.make('gate');

gate.policy('yes', () => { return true; });
gate.policy('no',  () => { return false; });

gate.can(['yes', 'no']); // false
```

You may define policies in your service providers to centralize operations since they will be available by all other services, commands, and controllers.



### Policy arguments

Sometimes, a policy alone is not enough.
You may need to configure them when using them.
For instance, the `env` policy allows or denies depending on the current environment.
It would be unthinkable to create all policies for all possible environments.
Instead, we can use parameters, that follows this syntax: `policy:arg1,arg2,arg3`.

```javascript
const gate = app.make('gate');

// Given the current environment = "local"
gate.can('env:local'); // true
gate.can('env:production'); // false
```

To use arguments, you simply have to accept them in the policy handler.

```javascript
const gate = app.make('gate');

gate.policy('pair', (value) => {
    return parseInt(value) % 2 === 0;
});

gate.can('pair:2'); // true
gate.can('pair:5'); // false


gate.policy('auth.role', (...roles) => {
    const user = app.make('custom.auth').user();

    return roles.every((role) => {
        return user.hasRole(role);
    });
});


// Given authenticated user with "foo" and "bar" roles
gate.can('auth.role:foo');     // true
gate.can('auth.role:bar');     // true
gate.can('auth.role:baz');     // false
gate.can('auth.role:foo,bar'); // true
gate.can('auth.role:foo,baz'); // false
```



## Use policies in commands

By default, the command registrar uses the `gate` service to decide which commands are available in the CLI.
When bootstrapping Yargs, it starts by instantiating all the registered commands and check their `policies` property value.

```javascript
class MyCommand extends Command {

    get policies() {
        return ['env:local'];
    }

}
```

In the above example, the command would be available only if the environment is set to `local`.
For instance, all the commands extending `GeneratorCommand` (those starting by `make:` are extending this class) have the `env:local` policy, at least.



### Policy class

It is sometimes preferable to implement policies in external classes to separate concerns.
The framework offers a base class to implement a policy.
In a policy class, the dependency injection can be used, the same way it is done for all other classes.


```javascript
import { Policy } from '@absolunet/ioc';


class NonProductionPolicy extends Policy {

    static get dependencies() {
        return ['config'];
    }

    get name() {
        return 'non-production';
    }

    passes() {
        return ['prod', 'production'].includes(this.config.get('app.env', 'production'));
    }

}
```

To register a policy class, the `register` method can be used on the gate service.

```javascript
import NonProductionPolicy from './policies/NonProductionPolicy';

const gate = app.make('gate');

gate.register(NonProductionPolicy);
```
