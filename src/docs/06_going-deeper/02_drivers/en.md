# Drivers

## Introduction

In Node IoC, the abstraction is one of its main architecture concepts.
Using a complex service must be as easy as possible, without having to drill down to the concrete object that will handle the process.
Drivers are a very important piece of equipment a complex class can use to abstract implementation.

For instance, the logger service does not have to know how a file logger is implemented, and how different it is from the database logger.
It simply uses the correct implementation and calls its methods.

Normally, all drivers of a given service must implement the same "interface", which does not exist in JavaScript.
However, a very convenient way to emulate interfaces is through abstract classes (normally called `Driver` in our case), which still do not exists in JavaScript, but the `NotImplementedError` is used to throw an exception when the method was not implemented by the instantiable class.



## The hasDriver mixin

To start using drivers in your custom classes, the `hasDriver` mixin is the starting point.
It adds all the necessary methods to use drivers.

```javascript
import { mixins }     from '@absolunet/ioc';
import FileDriver     from './drivers/FileDriver';
import DatabaseDriver from './drivers/Database';

const { hasDriver } = mixins;


class TaskService extends hasDriver() {

    static get dependencies() {
        return (super.dependencies || []).concat(['config']);
    }

    init() {
        super.init();
        this.addDriver('file',     FileDriver);
        this.addDriver('database', DatabaseDriver);
    }

    completeTask(task) {
        return this.getDriverByConfig().completeTask(task);
    }

    getDriverByConfig() {
        const store = this.config.get('task.default', 'file');
        const { driver, ...driverConfig } = this.config.get(`task.stores.${store}`);

        return this.driver(driver, { 'driver.config': driverConfig });
    }

}
```

This mixin gives you those methods.

 - `driver()`
    > Get the default driver, or the driver called `"default"`


 - `driver(name)`
    > Get the driver by name.


 - `driver(name, parameters)`
    > Get the driver by name with the given parameters when making the instance through the container.


 - `addDriver(name, class)`
    > Add a driver with a name


 - `setDefaultDriver(name)`
    > Alias the given driver name as `"default"`


 - `setDriverAlias(name, alias)`
    > Alias the given driver name as the given alias


 - `hasDriver(name)`
    > Check if the driver exists by name, either for drivers and aliases


 - `isDriverAlias(name)`
    > Check if the driver name is an alias.


You can also implement a method called `bootDriver`.
It is used the same way as a service decorator would be.
In this method, you will received the driver instance with its name, so you can perform actions before using it.



## Create drivers

To create a driver, there is no restriction.
However, here is a recommended recipe.

First, you will need an abstract driver class.

```javascript
import { NotImplementedError } from '@absolunet/ioc';

/**
 * Abstract driver to handle tasks.
 */
class Driver {

    static get dependencies() {
        // This dependency does not exists in the container.
        // However, we can still declare it as a dependency that must be manually injected.
        return ['driver.config'];
    }

    /**
     * Complete a task.
     *
     * @param {{id: number, label: string, done: boolean}} task - The completed task.
     * @returns {Promise<{id: number, label: string, done: boolean}>} The completed task.
     * @async
     * @abstract
     */
    completeTask(task) {
        // For a "FileDriver" instance, the message will be:
        // "The method [completeTask] must be implemented in [FileDriver].
        // It should return [Promise<task>]."
        // Here is the signature: new NotImplementedError(instance, method, [returnType], [type='method'])
        //
        // To make an accessor or mutator abstract, you can specify a fourth argument, 'accessor' or 'mutator'.
        throw new NotImplementedError(this, 'completeTask', 'Promise<task>');
    }

}
```

Then, you can start implementing the driver with concrete drivers.
You can also use configuration to drive the implementation.


```yaml
# config/task.yaml
default: file

stores:
  file:
    driver: file
    file:   '/path/to/file.json'

  database:
    driver:     database
    connection: default
    table:      tasks
```

```javascript
import Driver from './Driver';


class FileDriver extends Driver {

    static get dependencies() {
        return (super.dependencies || []).concat(['file']);
    }

    async completeTask(task) {
        task.done = true;

        const tasks = await this.file.loadAsync(this.driverConfig.file);

        const exists = tasks.some((t) => {
            if (t.id === task.id) {
                Object.assign(t, task);

                return true;
            }

            return false;
        });

        if (!exists) {
            throw new TypeError('The given task does not exists.');
        }

        await this.file.writeAsync(this.driverConfig.file, tasks);

        return task;
    }

}
```

In this example, the driver reads a JSON file, alter its data and overwrite it with fresh data.
Fun fact, the `file` manager uses drivers to properly load the file by its type.
That is the reason why we don't have to `JSON.parse` it, the driver does it by itself.
Same thing happen when writing the file, it encodes the data for us.


Now, we can easily use the driver in our service.

```javascript
import FileDriver from './drivers/FileDriver';

class TaskService extends hasDriver() {

    static get dependencies() {
        return (super.dependencies || []).concat(['config']);
    }

    init() {
        super.init();
        this.addDriver('file', FileDriver);
    }

    completeTask(task) {
        const { driver, ...driverConfig } = this.config.get('task.stores.file');

        return this.driver(driver, { 'driver.config': driverConfig }).completeTask(task);
    }

}
```

Now, let's implement another driver, the `DatabaseDriver`.
The implementation will change, but the same method will be implemented.

```javascript
import Driver from './Driver';

class DatabaseDriver extends Driver {

    static get dependencies() {
        return (super.dependencies || []).concat(['db']);
    }

    async completeTask(task) {
        task.done = true;

        const connection = this.db.getConnection(this.driverConfig.connection);

        await connection(this.driverConfig.table)
            .where({ id: task.id })
            .update({ ...task });

        return task;
    }

}
```

As we can see, the same thing is done, but through the database connection.

Now, the only think left is to handle the proper driver to use.
The first code example shows an acceptable implementation.

Node IoC uses this concept a lot in order to minimize the code that must be written, in favor of configuration.
Code can still be used for edge-cases, but most of normal implementations can use the features just with simple code lines and configuration.



## Forward calls to the default driver

Drivers are a very nice way to abstract complex and configurable features.
However, there is still the `.driver()` call to use all the time, which can be annoying.
How can we assume that a service has drivers, or handles itself the implementation?

Fortunately, thanks to the ES2015 [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), we can remove the `.driver()` statement to directly use the default driver methods.

Node IoC offers a proxy handler that makes this forwarding implementation very easy to do, the `ForwardProxy` handler.


```javascript
import { ForwardProxy } from '@absolunet/ioc';

class TaskService extends hasDriver() {

    /* ... */

    constructor(...parameters) {
        super(...parameters);

        return new Proxy(this, new ForwardProxy());
    }

    /* ... */

    /**
     * This method will be used by the proxy handler to forward all calls and property access.
     * Here, we simply indicates that the driver should be used as the default instance.
     */
    getForward() {
        return this.driver();
    }

}
```

The only method to implement to make the forwarding works is `getForward`.
The `ForwardProxy` handler will first look into the trapped instance to see if the property or the method exists.
If it does, then the trapped instance's property value is returned.
Otherwise, the object returned by the `getForward` method is used and the forwarded object's property value is returned.
If the result is a function, it binds the object on it.



## Framework drivers

The framework offers a lot of services that use drivers to allow either configuration-driven behaviour or separated implementation for specific behaviour.

Here are the services that use drivers and their drivers:

 - `cache`
   - `database`
   - `file`
   - `runtime`

 - `db.connection`
   - `sqlite`

 - `db.orm`
   - `bookshelf` (default)

 - `event`
   - `emitter` (default)
   - `pubsubjs`

 - `file`
   - `text` (default)
   - `js`
   - `json`
   - `yaml`
   - `yml` (alias for `yaml`)
   - `null`

 - `exception.handler`
   - `ouch`
   - `prettyError`
   - `view`
   - `console` (alias for `prettyError`)
   - `http.debug` (alias for `ouch`)
   - `http.production` (alias for `view`)

 - `log`
   - `database`
   - `file`
   - `stack`

 - `translator`
   - `file` (default)

 - `view.engine`
   - `jsrender` (default)
   - `null`
