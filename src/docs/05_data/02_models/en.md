# Models

## Introduction

Database model may be very useful for simple relations, creation and manipulation of database entities.
Along with [Knex.js](http://knexjs.org), Node IoC offers an implementation of [Bookshelf.js](https://bookshelfjs.org) ORM with class-based models.
The real models that will drive the queries will be the Bookshelf models, but the Node IoC model acts as a decorator that can evolve very easily and can inherit from other classes and mixins.

All the models are by default in the `src/database/models` folder.



## Auto-registration

By default, the `db.model` repository loads the whole models folder and automatically register them.
The name is used to retrieve the model unique name, in `camelCase`.
So, the `User` model will be called `"user"`.



## The make:model command

To create a model class file, the `make:model` generator command is very useful.

```bash
node ioc make:model User
```

This example would create the `src/database/models/User.js` model file.

Since the model is normally your key source for database query, the command offers multiple scaffolding at once with additional flags.

```bash
node ioc make:model User --migration
```

The `--migration` flag will create the `CreateUsersTable` migration at the same time.

```bash
node ioc make:model User --factory
```

The `--factory` flag will create the `UserFactory` model factory at the same time.

```bash
node ioc make:model User --seeder
```

The `--seeder` flag will create the `UsersTableSeeder` seeder at the same time.

If you want all these files at the same time, instead of giving all the flags, the `--all` works the same way.

```bash
node ioc make:model User --all
```

This command creates these files:

 - `src/database/factories/UserFactory.js`
 - `src/database/migrations/CreateUsersTable.js`
 - `src/database/models/User.js`
 - `src/database/seeds/UsersTableSeeder.js`



## The Model class

A normal model class will define the different attributes of a Bookshelf model, in a way that you can be more verbose and use "private" methods and attributes if you need them.
A regular scaffold generates the model, which extends the base Node IoC `Model` class.



### Default attributes

To set default attributes, the `defaults` accessor can be implemented, which should return an object of column-value pairs.
By default, the `defaults` accessor returns an empty object.



### Timestamps

A regular model would normally have timestamps, with `created_at` and `updated_at` columns.
If, for any reason, your model does not have those columns, you can set the `timestamps` accessor to `false`.
It is set to `true` by default.



### Primary key

To use a specific primary key column name, you can implement the `key` accessor.
It is set to `"id"` by default.



### Primary key type

Node IoC assume that your application would need to scale.
It offers `uuid` as primary key type by default.
If you want another type, such as `integer`, you can specify it in the `keyType` accessor.



### Table name

The table name is guessed by the model based on the class name.
It simply converts it from PascalCase to snake_case and pluralize it, so `CustomProduct` table would be guessed as `custom_products`.
To explicitly set it, you can implement the `tableName` accessor.



### Relations

Relations are a huge part of any SQL architecture.
Node IoC offers a verbose way to define relations.
Bookshelf normally accept functions like `roles()`, `categories()` and so on, directly in the definition object.

The model automatically take the methods that ends with `Relation` as relation definition.


```javascript
class User extends Model {

    accountRelation(model) {
        return model.hasOne('account');
    }

    rolesRelation(model) {
        return model.belongsToMany('role');
    }

}
```

All those methods will be used to define relations, so they can be eager-loaded when fetching data.

```javascript
const User = app.make('db.model').get('user');

const { models: [user] } = await User.fetchAll();
user.relations.roles; // Collection {}
```



### Initialize model

You can take action when the model is initialized by Bookshelf by implementing the `boot` method.
It is empty by default.
