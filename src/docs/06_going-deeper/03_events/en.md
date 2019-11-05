# Events

## Introduction

Events are part of a lot of JavaScript packages and frameworks.
In Node.js, the `EventEmitter` from the `events` core package can be used to subscribe and dispatch events.
However, a singleton is needed in order to work across multiple files or packages.

Node IoC makes it very simple to use events in an application or in a module without having to worry about singleton or event the concrete engine under it.



## The event dispatcher

The `event` dispatcher can be injected anywhere in your application.
This is the first service to be attached to the container.
It implements an interface similar to the original `EventEmitter`.

 - `on(event, listener)`
 - `off(event, listener)`
 - `once(event, listener)`
 - `emit(event, payload = {})`
 - `removeListeners(event)`
 - `removeAllListeners()`

You can choose the implementation from the `events.default` configuration key, between `emitter` to use the default `EventEmitter`, or `pubsubjs` to use [PubSubJS](https://github.com/mroderick/PubSubJS).



## Lifecycle events

Since some packages, or even your own application, could want to bind to the lifecycle events, and the `event` dispatcher would normally not be attached yet, the application offers two methods to listen to events before the lifecycle starts:

 - `app.onBooting(listener)`
    > Will attach listener to the `application.booting` event


 - `app.onBooted(listener)`
    > Will attach listener to the `application.booted` event

Also, some hooks are available in the console kernel.
By default, they are declared in your application's console kernel.
The only one that is implemented in a fresh application is `beforeHandling`, to load application commands.
Here are the different hooks: 

 - `beforeHandling`
 - `afterHandling`
 - `terminating`
