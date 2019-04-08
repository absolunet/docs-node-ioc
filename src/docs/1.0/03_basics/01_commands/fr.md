## Introduction

La création d'une commande est souvent quelque chose de complexe et de difficile à standardiser au sein d'une application, sans compter le fait qu'il est souvent complexe de l'exposer facilement.

Node IoC a rendu l'implémentation d'une commande CLI très simple à faire grâce à un écosystème de classes, d'enregistrement dynamique et du paramétrage intuitif.

## Commande

Une commande est une classe qui étend sur la `Command` de base de Node IoC. Elle se gère toute seule au moment de l'enregistrement, de sa signature CLI et de son exécution.

```javascript
const { classes:{ Command } } = require('@absolunet/ioc');

class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }
    
    get description() {
        return 'This is my command';
    }
    
    handle() {
        this.info('I just executed something!');
    }

}
```

### Nom

La propriété `name`, qui est la seule à être obligatoire, renseigne l'application de sa signature minimaliste. Elle devrait, en temps normal, être composée d'une chaîne de caractère sans espace:
- `test`
- `test:foo`
- `test:foo:bar`

Le paramétrage se fera ailleurs.

Il est recommandé d'implémenter le `name` via un accesseur:

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }

}
```

### Description

La description de la commande est surtout pour une question d'expérience utilisateur. Elle permet, lors du listing ou du `--help`, de renseigner l'utilisateur de l'objectif de la ligne de commande et de son impact.

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }
    
    get description() {
        return 'This is my command';
    }

}
```

Par défaut, la description est simplement la valeur de la propriété `name`.

### Arguments

Les arguments permettent de configurer la commande. Elle peut être utile pour passer des valeurs obligatoires pour contextualiser la commande, ou simplement pour ajouter ou enlever une partie du processus.

On dénombre trois types d'arguments: les paramètres, les options et les flags.

#### Paramètre

Un paramètre est une valeur suivant l'appel de la commande. Il peut être obligatoire ou facultatif. On lui donne un nom pour la signature ainsi que pour retrouver sa valeur au moment de l'exécution de la commande.

On peut configurer les paramètres via la propriété `parameters`.

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }
    
    get parameters() {
        return [
            ['type', true, null, 'The type of something']
        ];
    }
    
    handle() {
        this.info(`The value of parameter "type" is ${this.parameter('type')}`);
    }
    
}
```

Si on exécute la commande suivante: `node [app]/bin/app my:command foo`, nous aurons ceci comme affichage depuis la console:

````
The value of parameter "type" is foo
````

La propriété `parameters` devrait contenir un tableau de tableau, contenant, dans l'ordre, les valeurs suivantes:

- Le nom du paramètre (requis)
- S'il est requis (optionel, `true` par défaut)
- Sa valeur par défaut (optionel, `null` par défaut)
- Sa description (optionel, le nom par défaut)

Depuis une commande, on peut accéder à la valeur d'un paramètre grâce à la méthode `parameter(name)`.

Donc, pour créer un paramètre _project_ obligatoire ainsi qu'un autre paramètre optionel _branch_ ayant comme valeur par défaut "master", on aurait ceci:

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }

    get parameters() {
        return [
            ['project', true, null, 'The project name'],
            ['branch', false, 'master', 'The branch to checkout']
        ];
    }

} 
```

Dans ce cas-ci, si la commande `node [app]/bin/app my:command my-project` est exécutée, on obtiendrait ceci:

```javascript
console.log(this.parameter('project')); // 'my-project'
console.log(this.parameter('branch')); // 'master'
```

#### Options

Une option se définit dans une commande par le préfix `--`, comme dans `node [app]/bin/app my:command --my-option=my-value`. Il s'agit d'un argument optionel permettant de paramétrer une commande.

Tout comme les paramètres, les options se définissent depuis la classe de la commande, via la propriété `options`.

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }

    get options() {
        return [
            ['type', null, 'Type of the command']
        ];
    }
    
    handle() {
        this.info(`The value of option "type" is ${this.option('type')}`);
    }

}
```

Si on exécute la commande suivante: `node [app]/bin/app my:command --type=foo`, nous aurons ceci comme affichage depuis la console:

```
The value of option "type" is foo
```

Si on exécute la commande suivante: `node [app]/bin/app my:command`, nous aurons ceci comme affichage depuis la console:

```
The value of option "type" is null
```

La propriété `options` devrait contenir un tableau de tableau, contenant, dans l'ordre, les valeurs suivantes:

- Le nom de l'option (requis)
- Sa valeur par défaut (optionel, `null` par défaut)
- Sa description (optionel, le nom par défaut)
- Son alias (optionel, `null` par défaut)

Depuis une commande, on peut accéder à la valeur d'une option grâce à la méthode `option(name)`.

Donc, pour créer une option _project_ ayant comme valeur par défaut "my-project", ainsi qu'une autre option optionel _branch_ ayant comme valeur par défaut "master" associé à l'alias `-b`, on aurait ceci:

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }

    get options() {
        return [
            ['project', 'my-project', 'The project name'],
            ['branch', 'master', 'The branch to checkout', 'b']
        ];
    }

} 
```

Dans ce cas-ci, si la commande `node [app]/bin/app my:command --project=my-project` est exécutée, on obtiendrait ceci:

```javascript
console.log(this.option('project')); // 'my-project'
console.log(this.option('branch')); // 'master'
```

#### Flag

Un flag ressemble beaucoup à une option. La principale différence est qu'il n'accepte aucune valeur. S'il est présent, il faut `true`, sinon `false`.

Un flag se définit dans une commande par le préfix `--`, comme dans `node [app]/bin/app my:command --force`.

Tout comme les paramètres et les options, les flags se définissent depuis la classe de la commande, via la propriété `flags`.

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }
    
    get flags() {
        return [
            ['force', 'Force the command to run', 'f']
        ];
    }
    
    handle() {
        this.info(`The value of flag "force" is ${this.flag('force')}`);
    }

}
```

Si on exécute la commande suivante: `node [app]/bin/app my:command`, nous aurons ceci comme affichage depuis la console:

```
The value of flag "force" is false
```

Si on exécute la commande suivante: `node [app]/bin/app my:command --force` ou `node [app]/bin/app my:command -f`, nous aurons ceci comme affichage depuis la console:

```
The value of flag "force" is true
```

La propriété `flags` devrait contenir un tableau de tableau, contenant, dans l'ordre, les valeurs suivantes:

- Le nom du flag (requis)
- Sa description (optionel, le nom par défaut)
- Son alias (optionel, `null` par défaut)

Depuis une commande, on peut accéder à la valeur d'une option grâce à la méthode `flag(name)`.

Donc, pour créer une flag _force_ ayant comme alias `-f` ainsi qu'un flag _dry_ ayant comme alias `-d`, on aurait ceci:

```javascript
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }

    get flags() {
        return [
            ['force', 'Force the command to run', 'f'],
            ['dry','Fake attempt to run the command and expose the result that would happend', 'd']
        ];
    }

} 
```

Dans ce cas-ci, si la commande `node [app]/bin/app my:command -d` est exécutée, on obtiendrait ceci:

```javascript
console.log(this.flag('force')); // false
console.log(this.flag('dry')); // true'
```

#### Arguments globaux

Certains arguments globaux existent pour simplifier les options/flags récurents d'une commande à l'autre.

##### help

Le flag `help` global permet d'obtenir des renseignements sur la commande courante et les commandes enfants.

Il s'agit en réalité du flag `help` de Yargs par défaut.
Il affiche la signature de la commande, sa description ainsi qu'une liste des options, qui mélange les _options_ et les _flags_.

##### verbose

Le flag `verbose`, alias `v`, permet d'établir le niveau de verbosité souhaité au moment de l'exécution de la commande. Il s'agit d'un flag particulié puisqu'il offre la possibilité d'être ajouté plus d'une fois pour en augmenter la valeur.

`my:command` offre un niveau 0 de verbosité
`my:command --verbose` offre un niveau 1 de verbosité
`my:command --verbose --verbose` offre un niveau 2 de verbosité
`my:command --verbose --verbose --verbose` offre un niveau 3 de verbosité

On peut l'écrire dans sa version courte (et plus sympathique) aussi:

`my:command` offre un niveau 0 de verbosité.
`my:command -v` offre un niveau 1 de verbosité.
`my:command -vv` offre un niveau 2 de verbosité.
`my:command -vvv` offre un niveau 3 de verbosité.

Le niveau maximum géré par l'application est de 3. Il est toutefois possible d'aller plus loin sans problème. Le niveau sera alors considéré comme valant 3.

Plus le niveau de verbosité est élevé, plus les logs de développement apparaîtront.

`info` s'affichera à tout moment
`log` s'affichera au niveau 1 et plus
`debug` s'affichera au niveau 2 et plus
`spam` s'affichera au niveau 3 seulement.

Il peut donc être pratique de laisser des traces des opérations dans une commande et d'exposer les logs au niveau de verbosité souhaité.

### Exécution

L'exécution d'une commande se passe principalement en 3 phases. Il y a une phase de preprocess où on peut modifier les paramètres d'entrée avant de bâtir complètement la commande et de pouvoir en exploiter les valeurs. Ensuite vient la phase importante, l'exécution elle-même, où on effectue les opérations souhaitées. Puis finalement, on peut effectuer des opérations à la toute fin si on veut segmenter des opérations à la toute fin, sans considérer le contexte de la commande.

#### preprocess()

La méthode `preprocess` est appelée avant l'exécution. Le seul argument passé à la méthode est une liste des arguments passées, mais sous forme d'objet quelconque fournis par Yargs.

La méthode doit retourner une liste d'arguments. Par défaut, la liste des arguments est directement retournée.

#### handle()

Il s'agit de la méthode principale d'une commande. Tout se joue ici au niveau de l'exécution.

À ce moment-ci, les arguments sont accessibles via les méthodes `parameter`, `option` et `flag`.

La méthode peut à la fois être synchrone et être `async` ou retourner une promesse.

#### postprocess()

C'est dans cette méthode que les dernières opérations peuvent être effectuées. Dans le cas d'une commande quelconque, c'est peu utile. Il s'agit surtout d'offrir une option aux commandes utilisant la délégation complète pour pouvoir effectuer certaines opérations à la suite de l'exécution via la commande en délégation.

## Exposition d'une commande

Une commande est par défaut cachée aux yeux de l'utilisateur. L'idée derrière est qu'une commande pourrait être créée par un module et le développeur pourrait ne pas vouloir que la commande soit exposée. Il est aussi envisageable que la commande soit exposée selon certaines conditions, appelées _politiques_.

### Politiques

Les politiques d'une commande jouent un rôle important au niveau de leur exposition à l'usager. Elles peuvent être définies au niveau de la propriété `policies`.

```javascript
class MyCommand extends Command {
    
    get policies() {
        return ['public'];
    }
    
    get name() {
        return 'my:command';
    }

}
```

Les politiques sont déclarées au niveau des service providers ou d'un fichier délégé par le service provider.

Il existe par défaut 3 politiques:

- `public`
- `private`
- `env`

La politique `public` fait en sorte d'exposer la commande.
La politique `private`, au contraire, n'expose pas la commande.
La politique `env`, qui accepte un argument, expose la commande sous un environnement précis. `env:local` expose la commande seulement si l'environnement de l'application est `local`.

Par défaut, une commande est privée. Une commande publique doit avoir la valeur de `policies` à `['public']` ou une autre politique retournant `true`.

### Délégation

En pouvant restreindre l'exposition des commandes, il pourrait être intéressant de manuellement exposer une commande et de demander à une autre commande, privée ou non-exposé par une politique quelconque, de prendre le relai au moment de l'exécution.

Prenons l'exemple où une commande provenant d'un module externe servirait à créer un nouvel usager. Par défaut, la commande n'est pas exposée. Mais nous voulons, dans notre application, exposer la commande. Il serait un peu mal vu de charger la commande et de changer son prototype, ou effectuer une opération tordue de ce genre.

On pourrait alors simplement créer une nouvelle commande, l'exposer publiquement, et récupérer l'ensemble des fonctionnalités de la commande directement.

L'approche typique serait alors d'étendre sur la classe et d'effectuer des changements.

La problématique avec cette approche est qu'il faudrait alors exposer, via le système de module JavaScript, exposer chaque commande, ce qui commence à être un peu complexe, d'autant plus que ça ne suit pas du tout le modèle IoC.

On procède donc par délégation, où on indique que la commande va en exécuter une autre, tout en récupérant sa définition (ou pas!).

#### Délégation complète

Une délégation complète est une façon d'exposer une commande tel quel.

```javascript
// Commande privée, non exposée
class MyModuleCommand extends Command {
    
    get name() {
        return 'module:my:command';
    }
    
    get parameter() {
        return [
            ['type', true, null, 'The type.']
        ];
    }
    
    handle() {
        this.info('Running module:my:comand');

        return this.app.make('type').execute(this.parameter('type'));
    }

}

// Commande publique, exposée
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }
    
    get forward() {
        return 'module:my:command';
    }
    
    preprocess(argv) {
        this.info('preprocessing my:command');
        
        return argv;
    }
    
    postprocess() {
        this.info('postprocessing my:command');
    }

}
```

Ici, un module offre la commande `module:my:command <type>` mais en ne l'exposant pas. Elle n'apparaîtra pas dans la liste des commandes proposées à l'usager.

On offre aussi, publiquement, la commande `my:command <type>`. La signature est automatiquement celle de la commande de délégation. La commande peut ainsi récupérer dynamiquement les paramètres, les options et les flags définis.

Dans ce cas-ci, si on exécute la commande `node [app]/bin/app my:command`, une erreur surviendra puisque le paramètre `type` est manquant (même si non défini dans la classe elle-même).

Si on exécute `node [app]/bin/app my:command sometype`, on obtiendrait ceci dans la console:

```
preprocessing my:command
Running module:my:comand
postprocessing my:command
```

#### Délégation partielle

La délégation partielle est utile lorsqu'on veut exposer une commande pour en exécuter une autre, mais en effectuant certaines opérations demandant plus de code, ou tout simplement pour changer la signature ou la façon dont la commande est appelée.

```javascript
class MyModuleCommand extends Command {
    
    get name() {
        return 'module:my:command';
    }
    
    get parameter() {
        return [
            ['type', true, null, 'The type.']
        ];
    }
    
    handle() {
        this.info('Running module:my:comand');

        return this.app.make('type').execute(this.parameter('type'));
    }

}

// Commande publique, exposée
class MyCommand extends Command {
    
    get name() {
        return 'my:command';
    }
    
    handle() {
        const type = this.app.make('some.dependency').getType();

        return this.call(`module:my:command ${type}`);
    }

}
```

Ici, plutôt que de déléguer entièrement la commande à une autre, elle a été appelée par programmation et manuellement, en reconstruisant l'appel de la commande telle qu'on aimerait qu'elle soit exécutée.

Il peut être pratique d'utiliser cette stratégie si on veut utiliser une commande existante mais en ajustant des arguments ou en ajoutant quelques processus avant. On peut même aller jusqu'à exécuter plusieurs commandes de manière successive dans une super commande.
