## Introduction

Un service provider est le principal fichier exposé d'un module, autant externe que d'application. Son rôle consiste principalement à lier des services, à enregistrer des commandes, des politiques, à offrir les configurations du module et à effectuer certaines opérations au moment du bootstrap. Ils peuvent à la fois être enregistré dans votre application par configuration, sous le fichier `config/app.yaml`, sous la clé `providers`.

## Cycle d'enregistrement

Un service provider est enregistré par l'application en suivant le même processus. Il est tout d'abord attaché au conteneur, et au moment du boot de l'application, il construit, dans l'ordre configuré, les service providers, les enregistre dans l'application, puis les boot.

### constructor()

Au moment de l'instantiation du service provider, il est possible d'effectuer des opérations. Cependant, l'application n'est pas encore accessible à ce point. C'est principalement pour attacher des instances et/ou valeurs à l'instance courante.

### register()

La première phase exécutée au moment d'attacher un service provider est l'enregistrement. À cette phase, `this.app` existe, ce qui nous permet de faire principalement deux choses.

On peut attacher d'autres sous service providers (pourrait être une bonne approche pour découpler certaines parties d'un module du service provider global).

On peut également enregistrer des services et des configurations. Les services ne sont pas tous accessibles à ce moment-là, mais les bootstrappers ont passé le cycle `register()` un peu auparavant. On peut donc utiliser le service `config`, par exemple.

### boot()

La deuxième phase exécutée au moment d'attacher un service provider est le démarrage. Tous les service providers ont été attachés et sont en phase de démarrage à ce moment. C'est donc à ce moment où il faut exécuter des opérations d'initialisation, que ce soit avec nos propres services ou avec des services principaux ou tiers.

## Service provider d'application

Les service providers d'application sont à votre disposition pour effectuer les opérations spécifiques à votre application et à enregistrer vos dépendances. Il existe plusieurs service providers d'application, qui découpent les parties distincts nécessaire au bon fonctionnement de votre application Node IoC.

### AppServiceProvider

`AppServiceProvider` est le service provider qui vous sera utile pour toutes les opérations génériques de votre application, en passant d'une configuration par programmation jusqu'à l'enregistrement de vos dépendances spécifiques à votre application. Vous pouvez aussi, depuis ce service provider, ajouter d'autres modules par programmation si vous devez utiliser certaines conditions.

### ConsoleServiceProvider

Le service provider de console, au niveau de l'application, permet principalement de renseigner l'application des commandes que vous offrez.

Il devrait étendre le `ConsoleServiceProvider` de Node IoC. Vous n'avez alors qu'à renseigner le `dir` à utiliser pour enregistrer automatiquement les commandes. Autant les commandes au premier niveau que celles dans des sous-dossiers seront prises en compte.

## Service provider de module

L'avantage d'utiliser des service providers est qu'on peut facilement créer des extensions de Node IoC et les enregistrer si désiré. Le module pourra alors exposer le service provider pour une utilisation rapide et intuitive.

### ExtensionServiceProvider

Une extension possède toujours un service provider exposé. Son nom dépend principalement du nom du module. Nous l'appellerons `ExtensionServiceProivider` ici.

Son rôle, tout comme le `AppServiceProvider`, est d'enregistrer tout ce qui est spécifique non pas à l'application, mais à l'extension courante. Pour une petite extension, il servira principalement à attacher les dépendances exposées par l'application. Pour une extension plus grande, il servira principalement à enregistrer d'autres service providers qui auront des tâches plus spécifiques. Un service provider qui revient régulièrement cependant est le `ConsoleServiceProvider`.

### ConsoleServiceProvider

Tout comme le `ConsoleServiceProvider` de l'application, son rôle est d'enregistrer des commandes depuis le dossier d'extension cette fois. Il étend aussi le `ConsoleServiceProvider` de Node IoC, en suivant la même logique. Les commandes devraient, cependant, être exposé à l'application interne seulement, via les politiques. De cette façon, les commandes pourront être exposées ou non selon les besoins du développeur bâtissant l'application.

### Service provider spécifique

Dans le but de simplifier le code et de respecter le principe de responsabilité unique, il est recommandé, surtout pour les plus grandes applications et extensions, d'utiliser plusieurs service providers selon les besoins.

On peut créer autant de service providers que nécessaire et les enregistrer au sein d'un service provider centrale.

## Enregistrement

Il existe deux approches pour enregistrer un service provider: par configuration et par programmation.

La première approche devrait être privilégiée pour donner une plus grande flexibilité au développeur. Cependant, par moment, un service provider peut nécessiter d'autres service providers en tant que dépendances. C'est à ce moment que l'enregistrement par programmation devient intéressant.

### Par configuration

Il est assez simple d'enregistrer un service provider par configuration. La grande partie du bootstrapping de l'application se base sur cette approche.

Depuis le fichier de configuration de l'application, sous le dossier `config` (le fichier se nomme `app.yaml`, `app.yml`,`app.json` ou `app.js` selon votre approche), une clé `providers` devrait contenir un tableau listant l'ensemble des service providers à lier à l'application, dans l'ordre nécessaire.

### Par programmation

Dans le cas où un service provider doit enregistrer d'autres serevice providers, l'approche par programmation devient une option incontournable pour maintenir l'intégrité. de ce service provider.

Pour enregistrer un service provider par programmation, simplement effectuer, depuis la méthode `register()` de votre service provider, ceci:

```javascript
'use strict';

const { classes:{ ServiceProvider } } = require('@absolunet/ioc');
const MyChildServiceProvider = require('./MyChildServiceProvider');

class MyServiceProvider extends ServiceProvider {

    register() {
        this.app.register(MyChildServiceProvider);
    }

}

module.exports = MyServiceProvider;
```

À ce moment, le service provider enfant se retrouvera au bas de la liste des service providers à enregistrer. Il sera donc traiter à la fin de la liste actuelle.
