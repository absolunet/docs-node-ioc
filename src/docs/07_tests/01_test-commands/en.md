# Commands

## Introduction

Tests are a key point when it comes to maintain and scale applications.
Node IoC kept that in mind all the way from the start to make extensions and applications easy to test.

There is an out-of-the-box command that allows testing the application, which is called `test`.
It runs tests from classes instead of callbacks for more scalability and verbosity, with a PHPUnit lookalike architecture.

Paired with this enhanced testing system, the `@absolunet/tester` package will wrap Node IoC tests within NPM commands to test both the features and the logic, as well as the code itself.
It comes by default with a folder validator (`package.json` content, `CHANGELOG.md` structure, CI files such as `.travis.yml` and `bitbucket-pipelines.yml`, etc.) and the power of `ESLint` for the best code quality.

All those tests are powered by [`Jest`](https://jestjs.io/), developed by Facebook.
As always, you can implement your own test engine, such as Ava or Jasmine, but Jest is the recommended one here.

However, all the `@absolunet/tester` tests are driven by Jest, without any possible configuration to change the engine.



## NPM commands

By default, it is strongly recommended using the given NPM commands to run tests, since the `@absolunet/tester` package will properly handle it.

Your `package.json` file should contain those scripts:

```json
{
  "scripts": {
    "test": "node test --scope=all",
    "test:standards": "node test --scope=standards",
    "test:unit": "node test --scope=unit",
    "test:feature": "node test --scope=feature",
    "test:integration": "node test --scope=integration",
    "test:endtoend": "node test --scope=endtoend"
  }
}
```

As you can see, it simply runs the `test/index.js` file with a `scope` option.
This command will then be handled by the Node Tester package.

The standards tests will be handled by the Node Tester, while all the other tests will be handled by Node IoC.

Of course, `npm test` will run all tests.



## The test command

The `test` command is used to bootstrap all the application tests and run them with the configured engine, with a high-level abstraction over the engine implementation.

```bash
node ioc test
```

You can run all tests in your application with this simple command.
You can also scope your tests by type.
By default, four types are supported: `unit`, `feature`, `endtoend` and `integration`.
Each one of them is represented by a folder in the `test` folder.

To run a single folder, you can use a flag representing the folder, or the `type` option.

```bash
node ioc test --unit
node ioc test --type=unit
```

You can also pass `--type=all` as an option.
This is the default behavior.



## The make:test command

To quickly scaffold a test class, the `make:test` is perfect.
It also allows you to create the wanted test in the proper folder.

```bash
node ioc make:test MyClassTest
node ioc make:test MyClassFeatureTest --feature
```

The first command will create `MyClassTest.js` in the `test/unit` folder.
The second one, more explicitly, will create `MyClassFeatureTest.js` in the `test/feature` folder.

You can also scope the test file by the class it's supposed to test.

```bash
node ioc make:test CreatePostTest --for=services/PostService --feature
```

This will create the `CreatePostTest.js` file in a scoped folder for the `services/PostService` class, as a feature test.
Its destination will then be `test/feature/services/PostService/CreatePostTest.js`.
This will help you create tests and keep them structured over time.
