# Migrations and seeders

## Introduction

Migrations are mostly used to build your database schema in an incremental, _agile_ approach.
It allows you to build the schema of your database one table, one column at the time, and ensure that it can evolve over time when you are adding new features that requires your schema to change.

Seeders, on the other hand, are used to feed your database with data, mostly factoried, fake data, for developing purpose.
It helps you quickly create a prototype with hundreds or thousands table entries with a single command.
It also allows you to test the impact of a large database without being in production yet.


## Migrations

### The make:migration command

To create a migration class file, you can use the following command.

```bash
node ioc make:migration CreateUsersTable
```

This will create the `12345678901234_CreateUsersTable.js` file, under the `src/database/migrations` folder.
The prefix is the date it was created, in order to prevent running migrations that were created later to run before mode recent migrations.

This will create a file that contains two methods: `up` and `down`.
The `up` method is used when running the migration, while the `down` method will be used when rollbacking.

If your migration class name starts with both `Create`, `Drop` or `Delete`, there will be a default scaffold so you can quickly craft your table schema.

To implement the migration, you can use the `this.connection.schema` Knex.js schema instance and either create a table with `createTable()`, alter it with `table()` or drop it with `dropTableIfNotExists()`.
For further explanation and API documentation, you can read the [official Knex.js documentation](http://knexjs.org/#Schema).

```javascript
class CreateUsersTable extends Migration {

    async up() {
        await this.connection.schema.createTable('users', (table) => {
            table.uuid('id').primary();
            // Other columns you would like
            table.timestamps();
        });
    }

    async down() {
        await this.connection.schema.dropTableIfExists('users');
    }

}
```



### The db:migrate command

To run your latest migrations, the `db:migrate` command will run, from the least to the most recent class, based on their names (a simple `sort()` is done under the hood), the `up` method.
However, the database keeps track of all the migrations that were already run, so the same migration will never be run twice.

```
node ioc db:migrate

  Migrating latest migrations

 ✔  Migrated: 12345678901234_CreateUsersTable.js


node ioc db:migrate

  Migrating latest migrations

  Already up to date
```



### The db:migrate:rollback command

You can, instead of running up the migration, running them down, to rollback their actions.
This command, unlike the `db:migrate` that uses the `up` method, uses the `down` method on all migrations that were already run.
It will start by the last ran migration to the first one.

```
node ioc db:migrate

  Migrating latest migrations

  ✔  Migrated: 12345678901234_CreateUsersTable.js


node ioc db:migrate:rollback

  Migration #1 rollback successful!

  ✔  Rolled back: 12345678901234_CreateUsersTable.js


node ioc db:migrate:rollback

  Rolling back last migration batch

  No migration rollback to run
```



### The db:migrate:refresh command

If you need to restart all over your database schema, the `db:migrate:refresh` will start by rollbacking all ran migrations, like `db:migrate:rollback` does, until no migration rollback can be run.
Then, all available migrations will run up, like `db:migrate` does.



### The db:migrate:fresh command

This command simply flushes the entire database to run all migrations afterwards.
This is very useful when working in a local environment to restore the database to the most recent state without having to worry about rollback issues.



### The db:migrate:status command

This command helps you get a quick overview of the migrations that were ran and those which are pending to run up.
It simply prints a table with all the migrations and their status.



## Seeders

When the migrations are run, you have a database schema ready to be used for insertion.
To quickly insert fake data in your database, the `src/database/seeds/DatabaseSeeder.js` class may come in help.
This class will be run with the `db:seed` command, and this class can, and should, run other seeders.

A seeder only have the `seed` method, unlike the migrations with `up` and `down`.
When running a seeder, insertion of fake records in the database can be done.



### The make:seeder command

To create a seeder, the `make:seeder` command will create a small scaffold to quickly implement a table seeder.

```bash
node ioc make:seeder UsersTableSeeder
```

In a seeder, you have access to the model factories and the models, with the `factory` and the `model` methods.

```javascript
class UsersTableSeeder extends Seeder {

    async seed() {
        await this.factory('user', 100).save(); // Generate 100 User {} in a Collection {}, then save it in the database
    }

}
```

To call a seeder, go in your `DatabaseSeeder` class and implement the `seed` method by calling the `run` method, which will run other seeders by either name or class instance.

```javascript
class DatabaseSeeder extends Seeder {

    async seed() {
        await this.run([
            'UsersTableSeeder'
        ]);
    }

}
```



### The db:seed command

To run your database seeder, simply run the `db:seed` command.
It will, by default, run the `DatabaseSeeder.js` file and ignore all the others.

```
node ioc db:seed

  Seeding database

  Seed successful!

  ✔  Seeded: DatabaseSeeder.js
```

Since you have used the `run` method, with the `"UsersTableSeeder"`, your custom seeder was run as well.


You can, however, manually run a single seeder file, with the `--file` option.


```
node ioc db:seed --file=UsersTableSeeder

  Seeding database

  Seed successful!

  ✔  Seeded: UsersTableSeeder.js
```
