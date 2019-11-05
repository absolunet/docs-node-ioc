# Translation

## Introduction

Node IoC offers a custom translation system that all the common cases, from simple translation to pluralization and tokens.
Most of the existing _i18n_ systems are either async, only rely on JSON files or does not handle complex use cases.
The `translator` service uses drivers for its implementation, which add a lot of flexibility.
By default, only the `file` driver is provided, but feel free to implement your own, such as a database translation driver.



## The translator service

The translator service allows to easily translate strings, for both current and specific locales.
You can also easily add a translation, or even a batch of translations.
By default, translations are loaded by the kernel to ensure sync translations afterwards.
All translation implementation is in fact offered by its drivers.

However, it abstracts their methods for simple and verbose usage.

```javascript
const translator = app.make('translator');

await translator.loadTranslations();
translator.setLocale('fr');
translator.setFallbackLocale('es');

translator.addTranslation('Thanks', 'Merci');
translator.addTranslation('Thanks', 'Gracias', 'es');

translator.translate('Thanks'); // "Merci"
translator.translateForLocale('es', 'Thanks'); // "Gracias"

translator.addTranslations({ 'This is a sentence': 'C\'est une phrase' });
translator.addTranslations({ 'This is a sentence': 'Esta es una frase' }, 'es');

translator.addTranslation('Only translated into Spanish', 'Solo traducido al español', 'es');

translator.translate('Only translated into Spanish'); // "Solo traducido al español", as fallback locale is Spanish
translator.translate('Unexisting translation'); // "Unexisting translation", as no translation was provided
```

The default locale and fallback locale can be set in configuration, in the `config/app.yaml`.

```yaml
# config/app.yaml

# ...

locale: fr

fallback_locale: es
```



### The file driver

The file driver is the default one.
It uses `.yaml` files to fetch existing translations.
As always, feel free to use both `.yaml`, `.yml`, `.json` and `.js` files.
All the translations can be found in your application, under the `resources/lang` folder.

By default, the `translations.yaml` file is used as the default one.
All the existing translations in this file can be directly referred.

```yaml
Hello, world!:
  en: Hello, world!
  fr: Bonjour, le monde!
  es: ¡Hola, mundo!
```

```javascript
// Given `app.locale` config set as "fr"
const fileDriver = app.make('translator').driver('file');

await fileDriver.loadTranslations();

fileDriver.translate('Hello, world!'); // "Bonjour, le monde!"
```

As you can see in the `translations.yaml` example above, the translations are all done within the same file.
This approach was taken after long debates regarding the translation files structure for large-scale projects.
Since an application evolves over time, translations do too.
This strategy prevents missing translations for a single locale and is easy to track over time.

You can also use multiple files that will be used as namespaces.
For instance, if a `foo.yaml` was located in the `resources/lang` folder, all its translation keys would be prefixed by `foo`.

```yaml
# resources/lang/foo.yaml
bar:
  en: Bar in english
  fr: Bar en français
  es: Bar en español
```

```javascript
fileDriver.translate('foo.bar'); // Bar en français
```

A lot of developers like to work with translation keys instead of plain sentences or words translations.
You can do both with the `translations.yaml` file that can be used for full word(s) translations, and other files for namespaces translation keys.

All the translations in the `translations.yaml` file will not contain namespace prefix.

An interesting strategy would also be to create sub-namespaces within namespaced file.

```yaml
# resources/lang/foo.yaml

bar:
  baz:
    qux:
      en: Qux in english
      fr: Qux en français
      es: Qux en español
```

```javascript
fileDriver.translate('foo.bar.baz.qux'); // "Bar en français"
```
