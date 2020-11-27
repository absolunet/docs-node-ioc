# Configuration

## Introduction

The configuration system is one of the simplest concepts of Node IoC, but surely one of the most powerful ones.
It allows using module services without caring about passing options or instantiating the same class again and again.

It mainly relies on the files located in the `config` directory and the `config` repository, powered by the evaluator and grammar services.

Parallel to the configuration system, the environment variables are also very useful to use for sensitive data, or configuration that may change over different environments.
The environment variables are, like most of the modern applications, located in the `.env` file.



## Files

The configuration files are by default located in the `config` folder of a Node IoC application.
The configuration is written in `yaml` files, but the repository handles `.yaml`, `.yml`, `.json` and `.js` files.
For the JavaScript files, they must be written in CommonJS since they are not compiled by Babel.

Each file represents a namespace, which name is the file name itself.
For instance, the `app.yaml` file represents the `app` namespace.

```yaml
# config/example.yaml

key: value

options:
    foo: bar
    baz: true
```

Here, we could access the value from the `example.key` key to get `"value"`.
We could also get `example.options` to get an object matching `{ foo: "bar", baz: true }`, and so on.

We could also use folders to create namespaces.

```yaml
# config/namespace/file.yaml

key: value
```

Here, the `namespace` configuration key would match `{ file: { key: "value" } }`, `namespace.file.key` would equal `"value"`.



## The config repository

To access the configuration, the `config` repository can be injected in any makeable class.
It allows us to get values from loaded configuration files, but also to manipulate them.


```javascript
const configRepository = app.make('config');

configRepository.get('app.name'); // "Node IoC"
configRepository.get('view.extensions'); // ["html", "jshtml"]

configRepository.set('app.name', 'My application');
configRepository.get('app.name'); // "My application"

configRepository.get('app.unknown', 'default value'); // "default value"
configRepository.get('app.unknown'); // null
```

This repository allows accessing and mutating configuration, but also to load configuration files.

Given the following file tree:

```
- custom
    - config
        - foo.yaml -> key: value
        - bar.yaml -> key: other value
        - namespace
            - baz.yaml -> key: nested value
```

You can load all configuration files from a single method and keep its relative tree as configuration namespaces.

```javascript
const configRepository = app.make('config');

configRepository.loadConfigFromFolder('/custom/config');
configRepository.get('foo'); // { key: "value" }
configRepository.get('bar'); // { key: "other value" }
configRepository.get('namespace'); // { baz: { key: "nested value" } }
```



## The config.grammar service

To make sure the configuration is mostly static and predictable, YAML files are used by default instead of JavaScript files, which may add dynamic values.
It is not recommended, but still available if you need it.

However, some values are normally based on others, or on application core configuration, such as base path.

The `config.grammar` service is used by default by the configuration repository to parse each value.
It allows using a specific grammar in the configuration, tokens, if you will, to be replaced by dynamic values.

There are mainly three tokens parsed across configuration values:

 - `@/`
    > Represents the root of the application


 - `~/`
    > Represents the root of the home directory


 - `{{...}}`
    > Represents environment variable value


Let's examine each token.



### The @/ token

Given the `/path/to/app` application absolute path, here are the parsed values for given entries:

```yaml
- 'foo/bar'    # "foo/bar"
- '@foo/bar'   # "@foo/bar"
- '@/foo/bar'  # "/path/to/app/foo/bar"
- '/foo/@/bar' # "/foo/@/bar"
- '@/'         # "/path/to/app/"
```

The only way it may be parsed is if the string starts by `"@/"`



### The ~/ token

Given the `/Users/name` root path, here are the parsed values for given entries:

```yaml
- 'foo/bar'    # "foo/bar"
- '~foo/bar'   # "@foo/bar"
- '~/foo/bar'  # "/Users/name/foo/bar"
- '/foo/@/bar' # "/foo/@/bar"
- '~/'         # "/Users/name/"
```

The only way it may be parsed is if the string starts by `"~/"`



### The {{}} token

This token requires the environment repository, which will be explored afterward.

Given the `APP_NAME="Node IoC` environment variable, here are the parsed values for given entries:

```yaml
- '{{APP_NAME}}'                # "Node IoC"
- '{{}}'                        # "{{}}"
- '{{...}}'                     # "{{...}}"
- '{{APP_NAME}}'                # "Node IoC"
- '{{APP_NAME|My Application}}' # "Node IoC"
- '{{UNKNOWN}}'                 # null
- '{{UNKNOWN|Default value}}'   # "Default value"
- '{{UNKNOWN|}}'                # null
- '{{UNKNOWN|Default|Value}}'   # "Default|Value"
```

If the double braces contain alphanumeric or underscore characters (`w+`), it will be parsed as an environment variable.
If the environment variable is followed by a pipe, the following value, from the first character after the pipe until the closing braces, is parsed as the fallback value.



## The env repository

The environment repository is the reference for your application when it seeks environment variable values.
Instead of using `process.env`, we can rely on an injectable repository that can be easily mocked for testing purposes.

The environment repository is used by the `config.grammar` service to evaluate environment tokens.

The environment repository can be used the same way as the configuration repository to get a single value.

```javascript
const environmentRepository = app.make('env');

environmentRepository.get('APP_ENV');                  // "production"
environmentRepository.get('APP_ENV', 'local');         // "production"
environmentRepository.get('UNKNOWN');                  // null
environmentRepository.get('UNKNOWN', 'Default value'); // "Default value"

environmentRepository.all();                 // { APP_ENV: "production", ... }
environmentRepository.all() === process.env; // false

environmentRepository.has('APP_ENV'); // true
environmentRepository.has('UNKNOWN'); // false 
```

It can also be used to load environment files.
By default, it loads the `.env` file at the application root.
You can load another file if you need to.

```javascript
const environmentRepository = app.make('env');

environmentRepository.setFromFile('/path/to/.env.staging');
environmentRepository.get('APP_ENV'); // "staging"
```



## The evaluator service

Finally, the evaluator service is used to parse data that are normally decoded as a string by `dot-env` and `js-yaml`.

It will evaluate a single primitive value and returns its evaluated value.
However, it does not rely on `eval()`, which could lead to injection or unexpected behavior.

Here is the evaluation schema:

```javascript
const evaluator = app.make('evaluator');

evaluator.evaluate('null');         // null
evaluator.evaluate(null);           // null
evaluator.evaluate('NULL');         // "NULL"
evaluator.evaluate('undefined');    // null
evaluator.evaluate();               // null
evaluator.evaluate('true');         // true
evaluator.evaluate('1.23');         // 1.23
evaluator.evaluate('some string');  // "some string"
evaluator.evaluate({ foo: 'bar' }); // { foo: "bar" }
```

It treats all `null` and `undefined` values as `null`, but consider that the values `"null"` and `"undefined"` are also `null`.

Booleans (`true`, `false`, `"true"` and `"false"`) are converts to real booleans, either `true` or `false`.

A `NaN` or `"NaN"` value results in `NaN`.

A parsable number is parsed as a floating number.
An integer value, such as `1`, `"2"` or `"-1"`, and a floating value, such as `1.23`, `"4.56"` and `"-7.89"`, are treated as floating number and are parsed through `parseFloat()`.
Note that the decimal separator must be a point, not a comma.

This service will be used by the `env` repository directly and by the `config` repository through the `config.grammar` service when accessing a value.
