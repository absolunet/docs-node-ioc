# Commands

## Introduction

The commands are the main entry point for CLI users.
It acts as both CLI routes and controllers, for those who work with MVC architecture.

A command is used to handle a CLI request through a structured, standardized and simplified system.
Each command is represented by a `Command` class file, with some methods and accessors that must be implemented to work properly.

We will go through everything you need to get started properly in your Node IoC application.



## Auto-registration

In the application, the commands are located in the `src/app/console/commands` folder.
By default, an application has no command, but Node IoC makes it a breeze to create a command.
To have a quick introduction to commands, you may want to start with the `Create a command` first step.

All the commands in the `commands` folder are automatically loaded by the application kernel (`src/app/console/Kernel.js`), before handling the request.
At the auto-registration point, all the service providers were booted, so all the services are available and can be injected.

For the commands, there are no dynamic namespaces based on the folder structure, so you can organize your commands the way you want in the dedicated folder.



## The Command class

### Basics

Node IoC exposes a `Command` class that all commands should extend.
It offers everything you need to work in the CLI system of Node IoC without any effort.

Some methods and accessors are abstracts and must be implemented.
Let's take a small peak on critical ones.

```javascript
import { Command } from '@absolunet/ioc';


class MyCommand extends Command {

    get name() {
        return 'my:command'
    }

    handle() {
        this.info('Handling my command...');
    }

}


export default MyCommand;
```

The `name` accessor and the `handle` at least method must be implemented.

The `name` accessor is the command name fronted in the CLI system.
When executing `node ioc my:command`, the command registrar understands that the command should be handled by a `MyCommand` instance.
When the command must be handled, the `handle` method is called and awaited.
In the `handle` method, you can do whatever you like.
The `handle` method can be made `async` anytime or can return a promise.

```javascript
class MyCommand extends Command {

    static get dependencies() {
        return ['my.service', 'my.other.service'];
    }

    get name() {
        return 'my:command'
    }

    async handle() {
        try {
            const data = await this.myService.fetchSomething();
            await this.myOtherService.doSomething(data);
    
            this.success('Something was done successfully!');
        } catch (error) {
            this.failure('Please try again, something went wrong...');

            throw error;
        }
    }

}
```

You can also add a description to your command for more verbosity.
By default, the command description is the command name.

```javascript
class MyCommand extends Command {

    get name() {
        return 'my:command'
    }

    get description() {
        return 'Do something awesome!';
    }

}
```



### Arguments

A command can be useful to perform generic actions but are way more powerful when accepting arguments, such as `parameters`, `options` and `flags`.

> A **parameter** is a value that follows the command, without the `--` prefix, such as `name:command parameter`.
>
> An **option** is a value that follows an option name, such as `name:command --option=value`.
>
> A **flag** is a boolean status that is set to `true` when present, such as `name:command --flag`.

By default, some options and flags are available for all commands.

 - `--help`
    > Flag.
    > Display the command signature, description, and available options and flags


 - `--version`
    > Flag.
    > Display the application version, regardless of the executed command


 - `--verbose, -v`
    > Flag, cumulative.
    > Use more verbosity.

   - `--verbose`: 1 
   - `--verbose --verbose`: 2
   - `--verbose --verbose --verbose`: 3
   - `-v`: 1
   - `-vv`: 2
   - `-vvv`: 3



#### Parameters

A parameter has a name that is used for the command signature and inside the command to retrieve its value.

A parameter has a name, can be required, can have a default value and can have a description.

To support an argument, you can use the `parameters` accessor.
By default, there are no parameters.

```javascript
class MyCommand extends Command {

    get name() {
        return 'my:command';
    }

    get parameters() {
        return [
            // { name: "foo", required: true,  defaultValue: null,    description: "" }
            ['foo'],

            // { name: "bar", required: true,  defaultValue: null,    description: "" }
            ['bar', true],

            // { name: "baz", required: false, defaultValue: "value", description: "" }
            ['baz', false, 'value'],

            // { name: "qux", required: false, defaultValue: "other", description: "A useful description" }
            ['qux', false, 'other', 'A useful description']
        ];
    }

    handle() {
        this.info(this.parameter('foo'));
        this.info(this.parameter('bar'));
        this.info(this.parameter('baz'));
        this.info(this.parameter('qux'));
    }

}
```

For this example, the signature would be this:

```
node ioc my:command <foo> <bar> [baz] [qux]
```

The `foo` and `bar` parameters would be required so that the `handle` method is called.
The `baz` and `qux` would be optional.

These commands would work:

```
node ioc my:command some thing
  some
  thing
  value
  other

node ioc my:command some thing cool
  some
  thing
  cool
  other

node ioc my:command some thing very cool
  some
  thing
  very
  cool
```

These commands would not work:

```
node ioc my:command
  YError: Not enough non-option arguments: got 0, need at least 2

node ioc my:command some
  YError: Not enough non-option arguments: got 1, need at least 2
```

To implement parameters properly, required parameters should always be on the top of the array, and the optional ones, at the bottom, the same way we would do in a function or a method.



#### Options

An option has a name that is used when calling the command and when retrieving its value.
By default, an option is, of course, optional.

An option has a name, can have a default value and can have a description.

To support an option, you can use the `options` accessor.
By default, there are no options.

```javascript
class MyCommand extends Command {

    get name() {
        return 'my:command';
    }

    get options() {
        return [
            // { name: "foo", defaultValue: null,    description: "" }
            ['foo'],

            // { name: "bar", defaultValue: "value", description: "" }
            ['bar', 'value'],

            // { name: "baz", defaultValue: "value", description: "An option description" }
            ['baz', 'quz', 'An option description'],
        ];
    }

    handle() {
        this.info(this.option('foo'));
        this.info(this.option('bar'));
        this.info(this.option('baz'));
    }

}
```

For this example, the signature would be this:

```bash
node ioc my:command [--foo=null] [--bar=value] [--baz=qux]
```

These commands would work:

```
node ioc my:command
  null
  value
  qux

node ioc my:command --foo=
  
  value
  qux

node ioc my:command --foo=something
  something
  value
  qux

node ioc my:command --bar=cool
  null
  cool
  qux

node ioc my:command --baz=awesome
  null
  value
  awesome

node ioc my:command --foo=a --bar=b --baz=c
  a
  b
  c
```

The option declaration order, both in the class and in the CLI command, has no impact whatsoever.



#### Flags

A flag has a name that is used when calling the command and when retrieving its value.
By default, a flag is, optional.
Its default value is always `false`.
It does not accept any value.
When present, its value is `true`.

A flag has a name and can have a description.

To support a flag, you can use the `flags` accessor.
By default, there are no flags.

```javascript
class MyCommand extends Command {

    get name() {
        return 'my:command';
    }

    get flags() {
        return [
            // { name: "foo", description: "" }
            ['foo'],

            // { name: "bar", description: "A flag description" }
            ['bar', 'A flag description']
        ];
    }

    handle() {
        this.info(this.flag('foo'));
        this.info(this.flag('bar'));
    }

}
```

For this example, the signature would be this:

```bash
node ioc my:command [--foo] [--bar]
```

These commands would work:

```
node ioc my:command
  false
  false

node ioc my:command --foo
  true
  false

node ioc my:command --bar
  false
  true

node ioc my:command --foo --bar
  true
  true
```



### Handle command

By default, the only method that must be implemented to properly handle the command request is `handle`.
However, the command lifecycle offers two other methods to act before and after, called `preprocess` and `postprocess`.



#### Pre-process

During the pre-process phase, we can change the Yargs `argv` object.
Let's say that some flags become deprecated over time, and you want to adapt the handling code properly without the deprecated flags in it, you can transform the request object.
It acts as a command middleware.

This method accepts an `argv` object and must return an `argv` object.
By default, it returns it without any manipulation.



#### Handle

This method does not accept any argument, but at this point, you can use the `parameter`, `option` and `flag` methods to get the request parameters.
This method processes the command.
If it returns a promise, the promise is awaited before moving to the next cycle.

By the way, if you need some services to work, don't forget that you can inject services.
If you forgot to do so, or if you need service conditionally, the application is always available with the `app` property, as well as the `terminal`.



#### Post-process

The post-process phase may be used to do additional things after request handling.
Normally, there is nothing to do since everything would be done in the handling phase, but it is useful for commands that are forwarding the request to another command that may have policies that do not expose it.
Forwarding is explained below.



### Forward request

Since some commands can be scoped with policies, which will be explained below, it may be useful to create a "public" command that forwards the call to a private command, with some preprocessing to format the arguments from your command to the private command, and postprocessing to act after the underlying command has properly handled the command.

To forward the call to another command, you can either use the `call` method in your `handle` method or implement the `forward` accessor.

#### The call method

You can call internal commands anytime by using the `call` method.

Given a `baz:qux` private command, here is a simple implementation from a `foo:bar` public command.

```javascript
class FooBarCommand extends Command {

    get name() {
        return 'foo:bar';
    }

    async handle() {
        await this.call('baz:qux --option=value --flag');
    }

}
```

A command can be easily called without spawning any process under the hood.
The command registrar will resolve the command and execute it with the whole lifecycle.



#### The forward accessor

The `forward` accessor is simply an easy way to `call` a command without having to handle it manually.

If this accessor is implemented, the `handle` method will not be called in favor of a forwarding.

```javascript
class FooBarCommand extends Command {

    get name() {
        return 'foo:bar';
    }

    get forward() {
        return 'baz:qux';
    }

}
```

When forwarding a command call, the whole arguments are sent, in the same order, to the underlying command.
The whole argument configuration is taken from the underlying command instead of the current one.
So, implementing the `parameter`, `options` and `flags` accessors will not impact how the command will be parsed when building it into Yargs.

Consider the following `baz:qux` signature, here is the `foo:bar` command signature.

```
node ioc baz:qux <one> [two] [--three=null] [four]
node ioc foo:bar <one> [two] [--three=null] [four]
```

The signature will be identical.
By default, if a command forwards to a command that also forwards to another command, the three commands will have the same signature, except for their name.
Their policies will be different too, so their public appearance will be different.



### Policies

The policies can be very useful to prevent commands to be publicly accessible from the CLI.
They are scoping access to the different commands from public access.
However, their policies can be ignored when calling them by the code.

The policies can be set from the `policies` accessor.

```javascript
class MyCommand extends Command {

    get policies() {
        return ['env:local'];
    }

}
```

In this case, the `env` policy must pass, with the `local` argument, so the command can appear in the commands list.

All the policies are checked with the `gate` service.
Policies can also be defined with this service.

By default, a Node IoC application defines the `public`, `private`, `env`, `db` and `http` policies.
You can read about it on the security page.

Before bootstrapping Yargs, each registered command policies are checked before adding the command's signature to Yargs for public access.
If the policies fail, the command is ignored from Yargs bootstrapping.



## Terminal

The terminal is an extended version of the `@absolunet/terminal` package that offers a log of useful methods to print in the terminal, but also to prompt the user for information or to display data in tables.

In a command, the terminal is automatically injected without an explicit dependency injection directive, as well as the application.
However, some useful methods were created that abstracts the terminal to quickly use common command features.

 - `write(...parameters)`
    > Echo a message


 - `info(...parameters)`
    > Display a message with the primary color


 - `log(...parameters)`
    > Display a message with the primary color when the verbose level is greater than or equal to 1


 - `debug(...parameters)`
    > Display a message with the primary color when the verbose level is greater than or equal to 2


 - `spam(...parameters)`
    > Display a message with the primary color when the verbose level is greater than or equal to 3


 - `success(...parameters)`
    > Display a success message


 - `warning(...parameters)`
    > Display a warning message


 - `failure(...parameters)`
    > Display a failure message


 - `ask(question, defaultAnswer)`
    > Ask a question to the user


 - `secret(question)`
    > Ask a question to the user with a secret answer that does not show up in the CLI


 - `confirm(statement)`
    > Ask the user for confirmation


 - `choice(question, choices, defaultAnswer)`
    > Ask a question to the user with answer choices


 - `table(header, data)`
    > Echo data in a table


 - `tables(data)`
    > Echo data set in multiple tables



## Interceptor

Sometime, third parties may print data directly in the console through `console.log` or `process.stdout.write`, which may be an issue.
Or sometimes, we want their output, but with some formatting, translations, etc.
A service was designed to handle these issues, called the `terminal.interceptor`.

It offers some nice features, such as adding and removing interceptors, enabling and disabling interception, manipulating output from interceptors, capturing output data into an array and get the output from the time it starts capturing, muting the console and remove the colors.

One of the features you may want to use more often in a command class is the capture.
When using third parties that may output in the CLI, you can start the output capture, by calling the `captureOutput` method, and finally calling `stopCaptureOutput`, which will return the captured output, ordered by call in an array.

```javascript
class MyCommand extends Command {

    /* ... */

    async handle() {
        await this.app.make('third-party').doSomething(); // outputs "Something was done!"

        this.captureOutput();
        await this.app.make('third-party').doSomething(); // outputs nothing
        const output = this.stopCaptureOutput();
        if (output.includes('Something was done')) {
            this.success('Completed without error!');
        } else {
            this.failure('An error may have occurred...');
            this.log(...output); // verbose level >= 1
        }
    }

}
```
