## Introduction

Les configurations permettent de centraliser et d'adapter les options des différents modules utilisées. Ils se retrouvent normalement sous le dossier `config`. Ils peuvent être à la fois en format YAML, JSON ou JavaScript.

## Accès aux configuration

Essentiellement, la configuration de l'application est comme un objet littéral, accessible via un repository. Chaque fichier représente une clé dans cet objet, et le contenu du fichier, une fois converti en objet JavaScript, est la valeur de cette clé.

Prenons un exemple quelconque.

```yaml
# config/test.yaml
foo: foo
bar: true
baz:
    hello: world
    list:
      - foo
      - bar
      - baz
```

La configuration aurait l'air alors de ceci:

```javascript
const configValues = {
    test: {
        foo: 'foo',
        bar: true,
        baz: {
            hello: 'world',
            list: ['foo', 'bar', 'baz']
        }
    }
};
```

Dans le cadre où on veut accéder à une propriété à un niveau assez profond, il est souvent complexe d'y arriver. Node IoC propose donc un repository pour simplifier les opération. Ce repository est injectable sous le nom `config`.

```javascript
const config = app.make('config'); // ConfigRepository {}

// Pour accéder à l'objet configValues représenté plus haut
console.log(config.get());

// Pour accéder à une valeur dans cet objet,
// on utilise une chaîne de caractère avec une notation en point.
console.log(config.get('test.foo')); // 'foo'
console.log(config.get('test.bar')); // true
console.log(config.get('test.baz.list')); // ['foo', 'bar', 'baz']
console.log(config.get('test.unexisting')); // null
```

On peut aussi, dans le cas où la configuration n'existe pas, définir une valeur par défaut à utiliser. On le donne donc en second argument.

```javascript
console.log(config.get('test.foo', 'bar')); // 'foo'
console.log(config.get('test.unexisting', 'I am here!')); // 'I am here!'
```

## Chargement de configurations

Pour charger une configuration, il existe plusieurs façons de procéder.

Par défaut, les configurations sont chargées depuis le dossier `[app]/config`. Tous les fichiers qui s'y retrouvent sont chargés, interprétés et stocké depuis le nom du fichier.

On peut aussi, depuis un module par exemple, charger un autre dossier en plus du dossier par défaut.

Si, dans un dossier `my-config-folder`, on retrouve un fichier `custom.yaml` et qu'on veut le charger comme configuration (permettant de faire `config.get('custom.foo')`), on pourrait charger le fichier de cette façon:

```javascript
const config = app.make('config');

config.loadConfigFromFolder(path.join(__dirname, 'custom-folder'));
```

Il est aussi possible de charger un seul fichier à la fois.

```javascript
const config = app.make('config')

// On charge le fichier 'my-config.yaml' en utilisant l'index 'custom'
config.loadConfig('custom', path.join(__dirname, 'my-config.yaml'));
```

On peut aussi, par programmation, créer ou écraser une configuration existante de cette façon:

```javascript
const config = app.make('config');

config.set('custom.foo', 'bar');
```

## Écraser une configuration d'un module

Par défaut, les configurations sous `[app]/config` ont priorité sur les configurations ajouté par des modules externes. Pour modifier le comportement d'un module par configuration, il suffit seulement de dupliquer le fichier de configuration original et l'ajouter sous `[app]/config` et effectuer les modifications souhaitées.
