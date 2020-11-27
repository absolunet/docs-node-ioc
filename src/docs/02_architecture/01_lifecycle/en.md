# Lifecycle

## Introduction

The application has an opinionated bootstrapping process.
You can find all the bootstrapping process within your own application, under `src/bootstrap`.
If you need to alter the bootstrapping process, you can change the behavior in those files.



## Overview

The default Node IoC lifecycle starts from the framework but is mainly dictated by the application bootstrapper.
It starts by loading the application, bootstrapping the service providers, then handling the CLI request, and finally terminating the process.
The next paragraphs explain in depth the different bootstrapping stages.



### Load and configure the application

First, the application is loaded from the framework package.
The package exposes classes and mixins.
You will not find any instances in the exposed items.
The `Application` class can be directly used to make an instance of Node IoC application, with `Applicatiuon.make()` method.

Once the application has been instantiated, the application must give basic information that is configurable for extending and testing purposes.

First, we must give the base folder of the application, which would normally be the current working directory (`process.cwd()`).
However, since the working directory can be altered, in order to keep the code predictable, the working directory is manually given to the application instance.

Second, we give the current Node.js `module` instance, which is the `src/index.js` module reference inside the bootstrapper.
The application container uses this module to require files and packages, so no need to worry about packages tree-shaking issues.
Your packages version will be used, even if it creates conflicts with other required versions.

When the configuration is done, the bootstrapper binds the two main handlers: the `kernel`, which is by default located at `src/app/console/Kernel.js`, and the `exception.handler`, which is by default located at `src/app/exceptions/Handler.js`.

The application instance contains four core bootstrappers that cannot be replaced since they are used by the core items in the framework:

 - EventServiceProvider
 - FileServiceProvider
 - SupportServiceProvider
 - ConfigServiceProvider



### Instantiate the kernel

Now that everything has been configured, the application can run.

The kernel is first instantiated.
When it occurs, it will automatically register the core service providers of the framework.
Those service providers contain all the useful services to bring Node IoC to life.
Here are the core kernel bootstrappers:

 - CacheServiceProvider,
 - LogServiceProvider,
 - HttpServiceProvider,
 - SecurityServiceProvider,
 - DatabaseServiceProvider,
 - TranslationServiceProvider,
 - ValidationServiceProvider,
 - ViewServiceProvider
 - TestServiceProvider (for non-production process)

The Console service provider adds the ConsoleServiceProvider in the bootstrappers list.

However, instantiating the kernel will not boot the service providers.
They will only be registered in the application.

Your application and module service providers are not yet registered in the application.
It will happen when the application boots.



### Bootstrap application

Not that all the core service providers have been registered into the application, we can start the application.

It will first call the `register` method of all the registered service providers, followed by the `boot` method.

Inside the `register` method, we must assume that no services are available yet.
You should expose the services that your application or module is providing.

Inside the `boot` method, all the service providers have been registered, we can now assume that the services are available.
It is a good time to use the configuration, the command registrar, the router, etc.



#### Register service providers

When the application boots, it will first register the four core application service providers.
The last one, the ConfigServiceProvider, will break the rule of assuming that no service is available since it is directly linked to the application bootstrap process and is strongly bound to the good behavior of your application.

It will register all the service providers that are configured under the `app.providers` configuration key.
You can add your service providers under the `config/app.yaml` file.

It will register all the service providers into the application.

Then, the real registration begins.

The application will loop through all the registered service providers to first instantiate them, and then to call the `register` method.
During that time, service providers are allowed to register other service providers.
Those will be put in the current queue.

You will only have two opportunities to register a service provider programmatically: before or during the registering process and after the booting process.
If you need to act after all the services are exposed, you can take a look at the `this.app.onBooted()` hook.

During this phase, you can bind your own services in the application container, and load your configuration.



#### Boot service providers

After all service providers are registered, they are booted through the `boot` method.
During this phase, you can assume that the services are all registered.
Feel free to use `config`, `command`, `file`, `router`, etc.

During this phase, you can either interact with those services or initialize your own services.
Since a service binding will not instantiate the class or call the closure, you will need to use `this.app.make('my.service')` to instantiate and initialize your service at least once (depending on its status as a singleton in the container).

Common tasks done during this phase are registering commands, creating routes, adding translations, etc.



### Handle request

When the application has booted, the kernel will handle the request.
If you are using the console kernel, which is already the case with a default Node IoC application, the handling process goes through `beforeHandling` and `afterHandling` internal hooks.
The default application console kernel already loads the application commands for you, so you don't have to manually register them.

Once the `beforeHandling` hook has been called, the real handling process starts.
The kernel will resolve the current command through the command registrar, which have access to the command repository and the Yargs engine.
It will bootstrap the engine with the commands stored in the repository, and execute the command through the command runner.

When the handling has completed without any error, the `afterHandling` internal hook is called in the console kernel.
If an error occurs during the handling process, it will not be called.



#### Preprocess

First, the command `preprocess` method is called.
This method has the ability to alter the received arguments from the CLI.
By default, the arguments are not altered, but you may change them if you need to.
The returned value will then be passed as the `argv`.



#### Handle

The most common case is that you will need to handle the CLI request.
In the `handle` method, the command process the request.
It may output data in the terminal, call other services, etc.
It plays the same role as a controller (or a handler) in a Web MVC/MVA application.



#### ForwardCall

It may happen that a created command only pre-processes/post-processes data.
In those cases, the `handle` method may not be called.
If a `forward` property exists in the command instance, the value, that represents an underlying command name that will handle the process, will be used to forward the call to the specified command instance.

Let's say for instance that `foo` and `private:foo` command exists, and only `foo` is visible through the CLI since the `private:foo` command has a `private` policy (we will go into this later).
`foo` can then forward the call to `private:foo`, but preprocess the input before calling `private:foo`.

If the signature of `foo` is `foo [--bar]`, where `[--bar]` is an optional flag, and the signature of `private:foo` is `private:foo <type>`, where `<type>` is a required parameter, the `<type>` parameter can be preprocessed from the `[--bar]` flag.

It may be useful when using third party commands that remain private or scope to given policies in order to prevent command pollution in the CLI `list` command.


#### Postprocess

Finally, when the command has handled the request, or an underlying command has handled the request for the current command, the current command can act before the request termination.



### Terminate process

When the kernel has finished handling the request, it terminates the request.
It will first call an internal hook called `terminating`, so you can act before terminating the process.

When terminating, the process will exit, if specified to exit.
By default, the kernel is configured to exit the process when terminating.
You can alter this behavior by calling `kernel.shouldExit(false)` to prevent process exit.
However, if the process should exit, it will exit with code 0 or 1, depending on if an exception has been handled by the `exception.handler` instance.
