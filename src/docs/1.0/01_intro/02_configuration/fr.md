## Introduction

Node IoC utilise un système de configuration globale avec laquelle les différents services peuvent fonctionner ou interagir avec l'application en suivant des configurations centralisées.

Les configurations sont entièrement divisées par espace de nom, qui se base sur le nom des fichiers de configuration. Si un fichier de configuration se nomme `foo.yaml`, la configuration de ce fichier sera préfixée par `foo.`.

```yaml
# config/foo.yaml
name: foo # foo.name -> 'foo'
key: value # foo.key -> 'value'
```

## Configurer l'application
Node IoC possède une suite de configuration par défaut. Il y a cependant un fichier de configuration essentiel pour le démarrage de l'application. Il s'agit de `app`, qui contient le nom de l'application ainsi que la suite de modules à charger avant de démarrer l'application.

Il devrait ressembler à ceci:

```yaml
# config/app.yaml

# Le nom d'affichage de votre application.
# Peut contenir des espaces et des caractères supportés par un terminal.
name: 'Mon application'

# L'environnement de travail courant.
# La valeur par défaut est 'production' si la valeur est omise.
env: local

# Les Service Providers nécessaires au bon fonctionnement de l'application
providers:
  - extension
  - @namespace/extension
  - @/lib/modules/my-extension
```

Plus de détails seront fournis sur les service providers plus tard.


## Utiliser les configurations

Le service injectable `config` existe pour accéder et manipuler les configurations.

```javascript
const { app } = require('@absolunet/ioc');
const config = app.make('config');

// Accéder à un objet contenant toutes les configurations
config.get(); // [object Object]

// Accéder à une valeur. Si cette valeur est un objet ou un tableau, cette valeur est retournée
config.get('app.name'); // 'Node IoC'

// Si la valeur n'existe pas, une valeur par défaut peut être proposée
config.get('app.something', 'default value'); // 'default value'

// Une configuration peut aussi être manipulée par programmation
config.set('app.something', 'A new value'); // undefined
```

## Fichiers supportés

Les configurations peuvent être créées dans trois formats différents et peuvent être combiné selon les préférences de développement. Les extensions `.js`, `.json`, `.yml` et `.yaml` sont supportés pour créer les configurations.

## Création de configurations d'application

### Configuration personnalisées
Pour créer une configuration particulière d'application, il est possible d'ajouter des données dans le fichier de config `app.yaml`. Mais question de bien segmenter la portée des configurations, la création d'un nouveau fichier représente une bonne option.

Par défaut, tous les fichiers sous le dossier `[ioc]/config` sont chargés dès la phase d'enregistrement des bootstrappers.

Vous pourriez donc avoir un dossier `[ioc]/config` ressemblant à ceci:

```
[ioc]/
    config/
        app.yaml
        auth.yaml
        gulp.yaml
        s3.yaml
        ssh.yaml
```

### Remplacement de configurations d'un module

Certains modules vont injecter des configurations au moment de l'enregistrement de leur service provider. Il est possible cependant de remplacer certaines valeurs de configuration via les configurations d'application. Il suffit de créer un fichier de configuration ayant le même nom et de supplanter les valeurs à remplacer.

```yaml
# @namespace/extension/lib/config/extension.yaml
name: extension
type: foo

# [ioc]/config/extension.yaml
type: bar
```

En ayant supplanté une valeur, la configuration a été fusionnée avec celle de l'extension.
```javascript
const { app } = require('@absolunet/ioc');
const config = app.make('config');
config.get('extension'); // { name: 'extension', type: 'bar' } 
```