# Helpers

## Introduction

Helpers are objects or functions that cannot be classified as services or any other kind.
They provide useful methods, shortcuts and common packages to make it easier to develop.
They normally don't contain any business or core logic, but might be useful to reuse certain pieces of code that would be considered generic.

Node IoC offers four helpers, the `helper.date`, `helper.file`, `helper.path` and `helper.string`.



## The date helper

The date helper is, in reality, a wrapper over ['Moment.js](https://momentjs.com/).
The `helper.date` simply returns the Moment function to create Moment instance.

```javascript
const dateHelper = app.make('helper.date');

dateHelper().calendar(); // "Today at 1:23 PM"
```

It also configures the global locale based on the application configuration.
If the `app.locale` is set to `fr`, the result would be `Aujourd'hui à 13:23`.



## The file helper

The file helper currently contains two methods to parse or humanize file size, through the [`bytes`](https://github.com/visionmedia/bytes.js) package.

```javascript
const fileHelper = app.make('helper.file');

fileHelper.formatSize(1024); // "1KB"
fileHelper.parseSize('1KB'); // 1024
```



## The path helper

The path helper wraps the core `path` module with [`slash`](https://github.com/sindresorhus/slash) to ensure Windows and Unix the same and predictable behavior.
All `path` methods and properties are accessible through this helper.
This will allow you to use the `path` core module as an injectable, decorable instance.

```javascript
const pathHelper = app.make('helper.path');

pathHelper.join('foo', 'bar'); // "foo/bar", for both Windows and Unix
pathHelper.slash('foo\\\\Bar'); // "foo/bar"
pathHelper.isAbsolute('/foo/bar'); // true
pathHelper.isRelative('/foo/bar'); // false
```



## The string helper

The string helper exposes the [`to-case`](https://github.com/ianstormtaylor/to-case) and [`pluralize`](https://github.com/blakeembrey/pluralize) features.
You can use all the `to-case` methods, as well as `plural(string, count)` and `singular(string)`.

```javascript
const stringHelper = app.make('helper.string');

stringHelper.slug('fooBarBaz'); // "foo-bar-baz"
stringHelper.dot('fooBarBaz');  // "foo.bar.baz"
stringHelper.add('reverse', (string) => {
    return string.split('').reverse().join('');
});
stringHelper.reverse('lorem'); // "merol"
```
