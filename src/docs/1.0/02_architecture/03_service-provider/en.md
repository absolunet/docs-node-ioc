# Service provider

## Introduction

In Node IoC, as some other platforms do (Laravel, Angular.js, Java, .NET, etc), the main way to expose services and to be part of the bootstrapping process is through the service providers. Essentially, they act as their own module managers. They bind the services into the application, propose basic configuration, register commands, models, views, routes, controllers and other entities.



## Writing service providers

Writing a service provider is very simple. You can do it in two ways. The first is by creating a file containing a single service provider class that extends the `ServiceProvider` class provided by the framework.

```javascript
import { ServiceProvider } from '@absolunet/ioc';

class SomeServiceProvider extends ServiceProvider {

    /**
     * Register the service provider.
     */
    register() {
        //
    }

    /**
     * Register the service provider.
     */
    boot() {
        //
    }

}

export default SomeServiceProvider;
```

The other way requires that you have proper local configuration (`app.env` configuration must be `local`). You can the use the following command:

```bash
node ioc make:provider SomeServiceProvider
```

This will create a service provider scaffold inside `src/app/providers`.

All you have to do is to implement the wanted methods, `register` and `boot`.



### The `register` method

The register method is called during the first step of the application booting process.
When the application boots, it starts by registering the core service providers, that also add the configured service providers in the application to be booted.

In this method, as explained a little bit earlier, you should consider that no services are available yet.

You should only bind your own services in the application container to make them available to other during the booting process.

You can also, if necessary, register other service providers during this phase. Nevertheless, it is a better practice to use the `app.provider` configuration to register service providers.

However, since you are using the application that bootstraps the providers that bind `event`, `file`, `config` and `env`, you can assume that they will be available. However, don't forget to check that the services exist before using them during the registering process.

Considering this, the base service provider class offers a `loadConfigFromFolder` method that accepts path segments as arguments. This method will search in the given folder for any configuration file and merge them in the configuration within the repository.

```javascript
import { ServiceProvider }  from '@absolunet/ioc';
import OtherServiceProvider from '@namespace/ioc-module';
import SomeService          from './services/SomeService';

class SomeServiceProvider extends ServiceProvider {

    register() {
        this.app.register(OtherServiceProvider);
        this.loadConfigFromFolder(__dirname, '..', 'config');
        this.app.bind('some.service', SomeService);
    }

}
```



### The `boot` method

After all the service providers have been properly registered, the booting phase begins. In the same order, the service providers are booted. Those who have been registered in the application during the registering process will be put at the end of the queue.

During this phase, all services are available and ready to use. You can bootstrap your own services, use other services and interact with them.

An easy example would be to register custom commands. By default, the console kernel registers them for you, but if you are developing a module, for instance, you would have to register the commands manually.

```javascript
import { ServiceProvider } from '@absolunet/ioc';
import SomeCommand         from './commands/SomeCommand';

class SomeServiceProvider extends ServiceProvider {

    boot() {
        this.loadCommands([
            SomeCommand
        ]);
        this.app.make('some.service').prepare();
    }

}
```



## Registering service providers

To register service providers, there are two ways to do it.

The first one is by using the application `register` method. It accepts any resolvable as value (class, instance, factory or requireable string). It should be used only if necessary, like if it needs some logic before registering it.

The other way to do it, considered a better practice, would be from the configuration.

In your `config` folder, you can find the `app.yaml` configuration file. The `providers` key in this file contains an array of paths, each path pointing to a service provider.

By default, you will have your two application service providers:

- AppServiceProvider
- RouteServiceProvider

The grammar used to include those files are made such as you can either fill a resolvable module, an absolute path or a relative path fro the base path of the application, prefixed by `@/`.

```yaml
# config/app.yaml
# ...
providers:
  - '@namespace/ioc-module' # This module main file exposes the service provider as a default export
  - '/path/to/my/ServiceProvider'
  - '@/dist/node/app/providers/AppServiceProvider' # The '@/' portion at the beginning indicates 'the application base path'
  - '@/dist/node/app/providers/RouteServiceProvider'
```
