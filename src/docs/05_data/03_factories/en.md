# Factories

## Introduction

Model factories are very useful when it comes to testing and prototyping applications.
It allows you to create random model instances and database records with data that may seem real by using [Faker.js](https://github.com/marak/faker.js).

The `db.factory` service will help you quickly create fake models from your fake model schemas.



## Model factory

A model factory is a simple class that links a model name to a fake schema for a quick scaffold.
It has a `model` accessor, which returns the model identifier in the `db.model` repository.
The `make` method is then used to get a fake data object to create a model instance.

```javascript
class UserFactory extends Factory {

    get model() {
        return 'User'
    }

    make(faker) {
        return {
            name:     faker.name.findName(),
            email:    faker.internet.email(),
            password: faker.internet.password()
        };
    }

}
```



## Auto-registration

By default, all the model factories defined in the `src/database/factories` folders will be automatically registered in the factory service.
Otherwise, the `register` method is defined, so you can manually define model factories.

Given the `UserFactory` that has the `model` set to `User`, the following registration would work.

```javascript
const factory = app.make('db.factory');

factory.register(UserFactory); // By default, will be registered as "User" based on its "model" accessor.
factory.register(UserFactory, 'Admin'); // Instead of being registered as "User", the model factory will be registered as "Admin", for the "Admin model.
```



### The make:factory command

This command will help you quickly scaffold a model factory class file.

```bash
node ioc make:factory UserFactory
```

If you are creating a model, you can also use the `--factory` flag, or the `--all` flag with migration and seeder.

```bash
node ioc make:model User --factory
```

This will create a `src/database/factories/UserFactory` file, linked to the `User` model.

The command will simply assume that the name, without the suffix `Factory`, will be the model name.



## Make a model from a factory

To make a model based on the factory schema, the `db.factory` offers the `make` method, that accepts the following arguments:

```javascript
const factory = app.make('db.factory');

factory.make('User'); // User {}
factory.make('User', { password: '1234567890' }); // User {} with specific password
factory.make('User', 2); // Collection {} with 2 User {}
factory.make('User', { password: '1234567890' }, 3); // Collection {} with 2 User {}, with specific password
```

If you only want the data, without a Model instance, the `get` method will return the model factory instance.

```javascript
const factory = app.make('db.factory');

factory.get('User'); // UserFactory {}
factory.get('User').make(); // { name: "John Smith", email: "john.smith@example.com", password: "3x@mp1e" }
```
