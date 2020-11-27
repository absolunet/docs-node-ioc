# Log

## Introduction

Logging messages can be quite useful when debugging or inspecting jobs.
The Node IoC logger offers everything you need to log messages for a specific level in configurable channels.
Out of the box, you can log in a file or in a database, but you can easily implement a driver to log into Logstash, Papertrail, Sentry or Bugsnag.



## Configuration

The logging service provider offers a configuration that enumerates available channels.
By default, there are three channels: `stack`, `single` and `database`, each of them containing a driver and its configuration.
Those channels will be detailed later in this page.



## The logger service

The logger service offers a fluent way to log messages for a specific level.
It follows the PHP's [PSR-3 LoggerInterface](https://www.php-fig.org/psr/psr-3/#3-psrlogloggerinterface) which specifies these methods for a logger:

 - `emergency(message, context = {})`
 - `alert(message, context = {})`
 - `critical(message, context = {})`
 - `error(message, context = {})`
 - `warning(message, context = {})`
 - `notice(message, context = {})`
 - `info(message, context = {})`
 - `debug(message, context = {})`
 - `log(level, message, context = {})`

Like other services in Node IoC, the logger uses drivers that handle logging implementation.
The logger service exposes all those methods to call the driver's `log` method, with the appropriate level.



### Level threshold

For each channel, a `level` configuration can be set to prevent to log level that you don't need to log.
For instance, you may want to log everything in your `single` channel but prevent any log under the `error` level to be logged in the database.



## Channels

Channels are basically drivers with a custom configuration.
Node IoC offers three drivers, and three channels using each of the drivers.
You can, of course, create your own channels with existing drivers, or create your own driver and create one or many channels with it.



### Single channel

The `single` channel uses the `file` driver to log into the `storage/logs/ioc.log` file.
It writes in a single file, specified by the `path` configuration, but limits its size based on the `limit` configuration, which is `10mb` by default.



### Database channel

The `database` channel, through the `database` driver, logs in a configured table, based on the `table` configuration, through the configured connection, based on the `connection` configuration.
The connection refers to the `database.connections` available connections.
The `default` value can be used to use the default configured database connection.
It also offers to limit the record count through the `limit` configuration, which is a thousand by default.



#### The log:table command

In order to use the `database` driver, you will need to run a migration that creates the configured table name with the expected columns.
The `log:table` will create a scaffold of the needed migration for your `database` channel.
If you need more than one log table, you will need to manually duplicate the migration and change the table name.



### Stack channel

The `stack` channel is very interesting since it uses the `stack` driver, which logs through other channels, all at the same time.

By default, the stack channel logs through the `single` channel.
You can add or change the channels through the `channels` configuration.

Let's say for instance that you want to log into the database, so you can display the records on an administrator page, but you also want to write in a file that you can easily download for debugging, without having to fetch the database records.
The stack channel is then the perfect choice.

If you need to log in multiple channels but change the channels depending on the environment, you can create multiple stack channels, with different channels in them, and change the default channel through the `LOG_CHANNEL` environment variable.
