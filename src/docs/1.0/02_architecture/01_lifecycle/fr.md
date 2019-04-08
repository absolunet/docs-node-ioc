## Aperçu

L'application IoC possède un cycle de vie bien précis qui suit un cours régulier qui permet d'effectuer les opérations au bon moment en tout temps.

En plus du noyau central qu'est le conteneur IoC, une application est composée (généralement) d'un kernel, d'un gestionnaire d'erreur et d'une série de modules (via les Service Providers), de commandes/routes accessibles publiquement et de services.

Il est important pour les modules, tout comme pour l'application de suivre un rythme aussi précis qu'une horloge suisse.

L'application commence donc par être construite comme une entitée unique applée _singleton_. Une fois qu'elle est accessible, elle est exposée pour une interaction immédiate. À ce moment, seulement des modules devraient être enregistrés. En temps normal, aucune interaction n'est nécessaire, à l'exception de l'assignation du chemin ainsi que du module de référence, qui est déjà géré dans le bootstrap vanille.

Une fois les opérations initiales effectués, l'application attend un _tick_ (représentant le délai d'exécution entre l'appel d'un `setTimeout` de 0 milliseconde et son exécution). C'est à ce moment que le **boot** débute


## Kernel

Le **kernel** est le premier service à être construit par l'application. Il s'agit du point central de votre application, qui dicte le genre d'application à être démarrer. Un IoC peut servir, en principe, autant sur un serveur Web que dans un outil CLI, voire même dans une application Web client. Le kernel joue donc le rôle de démarrer en force l'application en ayant les services essentiels à sa disposition.

Les services essentiels sont enregistrés grâce à des bootstrappers, qui sont en fait des service providers faisant partie de la librairie de base.

C'est également le kernel qui va gérer la requête en cours, qu'il s'agisse d'une route appelée sur un serveur Web, d'une commande appelée sur un CLI ou d'un démarrage d'application Web.

Par défaut, un kernel enregistre, dans l'ordre, les service providers suivants:

- FileServiceProvider
    - `file` -> Permet d'utiliser le filesystem avec une couche d'abstraction
- ConfigServiceProvider
    - `config` -> Contient l'ensemble des configurations
    - `config.grammar` -> Permet de décoder certains token dans les configurations 
- HttpServiceProvider
    - `http` -> Décorateur pour le client HTTP Axios
- SecurityServiceProvider
    - `gate` -> Permet de gérer les politiques d'accès

### Console Kernel

Le kernel de la console permet principalement d'exécuter une commande depuis un CLI. Au moment de gérer la requête CLI, il enregistre les commandes publiques de l'application et il délègue l'ensemble des commandes à Yargs. Une fois que tout a bien été compilé par Yargs, la commande est exécutée.


## Service Provider

Un **service provider** est une classe qui a pour rôle d'enregistrer les services, les configurations, les commandes et les autres outils dans l'application, en plus d'exécuter certaines opérations au cours du cycle de vie.

Un service provider devrait, comme son nom l'indique, s'occuper de fournir des services (classes et fonctionnalités). Il ne devrait en aucun cas interrompre le cycle naturel de l'application.

Il y a deux façons d'enregister un service provider dans l'application.
On peut l'ajouter dans les configuration de l'application, sous `app.providers`.
On peut aussi l'ajouter par programmation de cette façon:
```javascript
const { app } = require('@absolunet/ioc');
const MyServiceProvider = require('./providers/MyServiceProvider');
app.register(MyServiceProvider);
```
