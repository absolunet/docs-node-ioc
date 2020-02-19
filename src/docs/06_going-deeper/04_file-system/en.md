# File system

## Introduction

In Node IoC, the file system is way more than the default `fs` module.
It mainly relies on two packages, `@absolunet/fsp` and `@absolunet/fss`, which offers the same methods, one in sync mode and the other in async, promise-based mode.



## The file manager

The file manager is a service that interacts with the file system with some intelligence when it comes to content.
It offers `load`, `loadAsync`, `write` and `writeAsync` methods that will handle the file type and decode it the simplest way possible.

For instance, a `.js` file will be parsed, executed and the exported data will be returned.
However, when writing `.js` file, plain text is used.
`.json`, `.yaml` and `.yml` files return parsed object when read and can write from JSON serializable data, such as an array or an object.

Other helper methods are also exposed, such as `scandir` and `exists`, but it helps a lot when attempting to load files with some logic.

For instance, `findFirst` inspect the file system for the wanted files.
When a file exists, the path is returned, without going any further.
`loadFirst` and `loadFirstAsync` do the exact same thing, except that the file is parsed by the proper driver and the value is returned.

Also, you can load the content of all the files in a given folder with `loadInFolder`.

```javascript
const fileManager = app.make('file');

fileManager.loadInFolder('/path/to/folder');
/*
{
    'file': 'Parsed content', // /path/to/folder/file.txt
    'other': { key: 'value' } // /path/to/folder/other.yaml
}
*/
```

The `loadRecursivelyInFolder` does the exact same thing, but recursively for files in subfolders.



## The file engine

Basically, the `file.engine` service is just a decorator over `file.system.sync`.
It also exposes `async` and `sync` properties that are reflecting the two file systems.



## The async file system

The async file system can be directly injected through `file.system.async`.
This instance exposes all the `@absolunet/fsp` methods, plus some other utilities, which all of them are promise-based.
You can, therefore, use ES2017 `async/await`.
The methods and their parameters are exactly the same as the ones provided in the sync file system.



## The sync file system

The sync file system can be directly injected through `file.system.sync`.
This instance exposes all the `@absolunet/fss` methods, plus some other utilities, which all of them are synchronous.
The methods and their parameters are exactly the same as the ones provided in the async file system.
