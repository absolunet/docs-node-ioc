# Database

## Introduction

Node IoC offers an elegant wrapper over [Knex.js](http://knexjs.org/) to create database connections.
It currently supports configurable and dynamic connections for both single database website or multi-tenant application with many databases.
By default, Node IoC supports `SQLite` connections, but additional connector drivers can be developed to enable Knex.js supported database engines.



## Configuration

To quickly set up a database connection, the `database.yaml` configuration file is already prepared to enable basic environment-driven database connections.

First, you can enable or disabled the database commands from the `enabled` configurable flag. However, setting it to `false` does not mean that all the database features are disabled. They are only disabled from the CLI.
To help you properly use the commands, you can change the commands namespace. By default, `db` will be used, to create `db:migrate`, `db:seed` and so on.

The `default` key represents the default database connection name to use when making a connection.

By default, only the `sqlite` connection name exists, driven by the `sqlite` driver.

The key difference between the name and the driver is that the name is the unique identifier of the configured connection, while the driver is the engine used to establish a database connection with the proper SQL grammar.
You could create an `etl` database connection with the `sqlite` driver for integration processes, for instance. It is your to create the connections that suits you.

To help Knex.js and Node IoC find your different database-related JavaScript files, the `paths` key maps the `factories`, `migrations`, `models` and `seeders` folders. Each key represents the entities, or the folder type, if you will, and the value represent the relative path from the `path.database` absolute path, normally located under `src/database`. So, for the `factories: some/factories` mapping, we would retrieve the model factories under `src/database/some/factories`.

Finally, the `migration_table` will be used for all you databases when using migrations, which will be discuss in a following chapter. By default, the `migrations` table name is used.



## Connection builder

The easiest way to establish a Knex.js connection is through the Connection builder, injectable through `db`. You can instantiate your default connection the easy way.

```javascript
const connection = app.make('db').getConnection(); // Knex {}
```

You can also create a connection by configuration name.

```javascript
const sqliteConnection = app.make('db').getConnection('sqlite');
const etlConnection    = app.make('db').getConnection('etl');
```

Thanks to JavaScript proxies, you can directly use Knex.js connection methods on the connection builder. It will get the default instance and forward the call to it under the hood.

```javascript
const users = await app.make('db').select().table('users');
```


## Connector

If you need to create dynamic connection without using the configuration, the `db.connection` service help you create a Knex.js instance.

```javascript
const connection = app.make('db.connection')
    .driver('sqlite')
    .getOrCreateConnection('custom_name', {
        filename: '/path/to/my/database.sqlite'
    }); // Knex {}

const otherConnection = app.make('db.connection')
    .driver('sqlite')
    .getOrCreateConnection('custom_name', {
        filename: '/path/to/other/database.sqlite'
    }); // Knex {}

const etlConnection = app.make('db.connection')
    .driver('sqlite')
    .getOrCreateConnection('custom_etl', {
        filename: '/path/to/my/etl.sqlite'
    });

// The other connection uses the first given connection since the call retrieved an existing connection by name.
connection === otherConnection; // true

connection === etlConnection; // false
```

The connector has all the available drivers registered in it. You can then establish dedicated connections through the appropriate driver, and then get a database connection.
The configuration for the dedicated drivers can be retrieved in the [official Knex.js documentation](http://knexjs.org/#Installation-client). The configuration object sent in the connection creation methods uses the same schema as the Knex `connection` configuration model. 
