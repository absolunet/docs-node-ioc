## Introduction

Node IoC possède, comme pratiquement tous les système IoC, un conteneur centrale qui est utilisée pour la gestion des opérations globales. Cest lui qui est, entre autre, chargé de la résolution des dépendances, l'enregistrement de services, les singletons, l'enregistrement des modules tierces, les événements globaux et les paramètres nécessaires au bon fonctionnement de l'application.

Le conteneur possède un système de liaison d'instances et de valeurs, qui se compare à un gros objet litéral (`global` ou `window`, à titre d'exemple). Lorsqu'on veut rendre _public_ une instance ou une valeur aux autres éléments de l'application, on ferait, en temps normal, quelque chose du genre:

```javascript
const monService = {
    maMethode() {
        return 'foo';
    }
};

global.monService = monService;

// ...

global.monService.maMethode(); // 'foo'
```

Les dangers avec cette pratique? `monService` est entièrement public et aucunement protégé d'une quelconque modification. Bien sur, un objet litéral ou une instance de classe peut à tout moment être modifié, mais l'idéal est qu'il soit impossible de modifier la valeur de `global.monService`. Et allons plus loin! Il serait encore mieux que tous nos services soient attachés à une variable qui n'est pas publique, qui devrait être accessible sur demande seulement.

Allons encore plus loin! Si ce service a besoin, pour fonctionner, d'un autre service, et que cette dépendance n"existe pas encore? Si le service est un service contextuel, devant être créé sur le coup? Si le service nécessite une configuration avant de s'initialiser? Si l'application possède 2000 services et qu'on veut gérer adéquatement la mémoire? Si on veut obtenir les services dédiés à un contexte précis dynamiquement? Le conteneur résout tous ces problèmes!


## Liaison

On peut lier une valeur au conteneur en lui donnant un nom (appelé un _abstract_ en programmation orienté objet, qui se résumerait normalement par une interface ou une valeur unique). Une liaison de base se fait de cette façon:

```javascript
const { app } = require('@absolunet/ioc');

const obj = { foo: 'bar' };

app.bind('foo', obj);
```

Maintenant, le conteneur connait `foo`, qui est en réalité un objet définit juste avant.

Si, dans un autre fichier, voire un autre module, on veut accéder à l'objet facilement, on fait ceci:

```javascript
const { app } = require('@absolunet/ioc');

app.make('foo'); // { foo: 'bar' }
```

On peut donc retrouver une valeur lié au conteneur très facilement que par son nom.


### Types de liaison

Il existe deux type de liaison au niveau du conteneur: un `bind` et un `singleton`. La grande différence est qu'une liaison de type singleton, lors d'une résolution normale, retourne la même instance à tout moment, et ne créera pas de nouvelle instance lorsque demandée à deux moments. Une liaison `bind` retourne une nouvelle instance à tout moment, sauf si la valeur lié n'est pas une fonction (resolver/factory) ou un constructeur. À ce moment, la valeur retounée sera la même.

#### bind()

Un `bind` associe un nom à un _concrete_, soit à une valeur résolvable. Il peut s'agir d'une fonction, d'un type primitif, d'un constructeur, d'un objet/instance, d'un Symbol, etc.

Lorsque cette liaison sera demandé à travers le conteneur, que ce soit via `make()` ou par injection de dépendance, une instance sera résolue. La façon dont une instance est résolue sera traitée un peu plus tard.

#### singleton()

Un singleton est exactement comme un `bind()`, à la différence que la valeur résolue est stocké par le conteneur pour éviter de retourner une nouvelle instance à chaque demande. Un `bind()` peut alors sembler inutile, mais dans certaines circonstances, on veut pouvoir obtenir une nouvelle instance, ou à tout le moins avoir le choix, au moment de résoudre l'instance. Un singleton est souhaitable lorsqu'on veut la même instance à travers l'application en entier.


### Traitement des liaisons

Une liaison peut être résolue de différentes façons, dépendamment du type qui a été lié. Le retour sera différent entre une chaîne de caractère et une classe, par exemple. Voici les principales différences entre les types.

#### Valeur primitive

Une valeur primitive est retournée tel quel, sans traitement.

```javascript
app.bind('foo', 'Foo');
app.make('foo'); // 'Foo'

app.bind('bar', true);
app.make('bar'); // true

app.bind('symbol', Symbol('baz'));
app.make('symbol'); // Symbol(baz)
```

#### Objet

Un objet est traité comme un singleton. Il est donc retourné tel quel, sans traitement, mais comme il s'agit d'une instance, il peut être manipulé à travers l'application. Si ce résultat n'est pas souhaité, l'utilisation d'une fonction pourrait être utile.

```javascript
app.bind('foo', { foo: 'bar' });
app.make('foo'); // { foo: 'bar' }
```

#### Fonction

La fonction, ou la _factory_, est une façon typique de retournée une valeur similaire de manière contrôlée. La fonction est simplement exécutée, en recevant comme paramètres le conteneur ainsi que le contexte (voir _résolution contextuelle_)

```javascript

const factory = (container, context) => {
    const foo = container.make('foo');
    
    return {
        foo: foo,
        get isFoo() {
            return this.foo === 'Service Foo';
        }
    };
};

app.bind('bar', factory);

app.make('bar'); // { foo: 'Service Foo', get isFoo: (true) }

```

#### Constructeur

Une classe, ou un fonction de type constructeur, est l'outil le plus puissant à utiliser avec Node IoC. On peut d'une part lier le constructeur sans créer d'instance, laisser ce soin au conteneur, mais aussi utiliser l'injection de dépendances.

Voici comment on peut lier une classe simple au conteneur:

```javascript
let instances = 0;

class Baz {
    
    init() {
        instances++;
    }

}

console.log(instances); // 0
app.bind('baz', Baz);
console.log(instances); // 0
app.make('baz'); // Baz {}
console.log(instances); // 1
app.make('baz'); // Baz {}
console.log(instances); // 2
```

La fonction `init()` est appelée automatiquement lorsque l'inastantiation est complétée. À ce moment, beaucoup d'automatisation a été fait au niveau de l'instance, entre autre au niveau de l'injection de dépendances.

Il est tout de même possible de créer la fonction `constructor()` et d'utiliser les dépendances passées en arguments pour effectuer les premières opérations. Mais dans tous les cas, `init()` sera appelée.

## Injection de dépendances

Le système par défaut de résolution de liaison peut être utilisée manuellement, mais devient rapidement un iritant pour plusieurs dépendances dans une instance de classe. C'est pourquoi l'injection de dépendance devient rapidement une option intéressante.

En utilisant un constructeur, on peut créer la propriété statique `dependencies`, soit via `static get dependencies()`, `static dependencies` ou `MyConstructor.dependencies`. Cette propriété devra être, ou retourner, un tableau de noms de liaisons.

```javascript
class MyConstructor {
    
    static get dependencies() {
        return ['foo', 'bar'];
    }

    init() {
        console.log(this.foo); // 'Service Foo'
        console.log(this.bar); // { foo: 'Service Foo', isFoo: (true) }
    }

}

app.bind('myService', MyConstructor);

console.log(app.make('myService')); // MyConstructor {}
```

ou

```javascript
const MyConstructor = function() {};
MyConstructor.prototype.init = function() {
    console.log(this.foo); // 'Service Foo'
    console.log(this.bar); // { foo: 'Service Foo', isFoo: (true) }
};
MyConstructor.dependencies = ['foo', 'bar'];

app.bind('myService', MyConstructor);

console.log(app.make('myService')); // MyConstructor {}
```

### Injection par le constructeur

L'injection est accessible dès la construction de l'objet. Les dépendances sont passées, dans l'ordre, dans l'appel de construction.

```javascript
class MyConstructor {
    
    static get dependencies() {
        return ['foo', 'bar'];
    }
    
    constructor(foo, bar, baz) {
        console.log(foo); // 'Service Foo'
        console.log(bar); // { foo: 'Service Foo', get isFoo: (true) }
        console.log(baz); // undefined
        console.log(this.foo); // undefined
        console.log(this.bar); // undefined
    }
    
    init() {
        console.log(this.foo); // 'Service Foo'
        console.log(this.bar); // { foo: 'Service Foo', isFoo: (true) }
    }

}
```

### Injection par des accesseurs dynamiques

Par défaut, une instance utilisant l'injection de dépendances sera manipulé par le conteneur.

Dans le cas-type où l'injection de `foo` est demandée par une instance de `MyConstructor`, le conteneur va automatiquement créée une propriété en lecture seule sur l'instance. Le nom de la propriété sera `foo`, soit le même nom que celle de l'instance.

Dans le but de pouvoir utiliser la notation en point (`myService.myProperty`), le nom est transformé en _camelCase_ avec des caractères suivant l'expression régulière suivante: `/^[a-z][a-zA-Z]+$/`. Donc la dépendance `foo.repository.default` pour l'instance de MyConstructor, nommé `myService`, serait accessible de cette façon: `myService.fooRepositoryDefault`.


### Injection par le répertoire privé.

Une fois que l'instance est résolue et que l'injection a été faite, les valeurs injectées se retrouvent dans un répertoire privé via `@absolunet/provate-registry`. On peut donc, à tout moment, récupérer les valeurs injectées.

```javascript
const __ = require('@absolunet/private-registry');

class MyConstructor {
    
    static get dependencies() {
        return ['foo'];
    }

    doSomething() {
        console.log(__(this).get('foo')); // 'Service Foo'
    }

}

app.bind('myService', MyConstructor);
app.make('myService').doSomething();
```

Le répertoire privé est utilisé pour stocké les dépendances injectées, mais il peut à tout moment être utilisé à des fins autres. Il sert principalement à gérer l'encapsulation (`private` en orienté objet) d'une instance de classe. On peut y stocker ce qu'on veut, en lui donnant un nom.


## Résolution contextuelle

Il peut arriver une situation où vous voulez obtenir une instance de classe via le conteneur, mais en injectant manuellement des dépendances requises dans un contexte donnée. On peut obtenir un objet lié en lui envoyant un objet, ou tableau associatif, contenant les dépendances que vous voulez supplanter.

```javascript

class MyConstructor {
    
    static get dependencies() {
        return ['foo'];
    }

}

app.bind('myService', MyConstructor);

// Résolution normale, avec injection normale.
const myService = app.make('myService');
console.log(myService.foo); // 'Service Foo'

// On vient ici injecter manuellement la dépendance 'foo'
// pour supplanter la dépendance originale.
const myOtherService = app.make('myService', { foo: 'Un service personnalisé' });
console.log(myOtherService.foo); // 'Un service personnalisé'
```

Cependant, comme une résolution contextuelle vient altérer la façon dont une classe se comporte, elle ne sera pas considérée comme un singleton, même si liée comme tel.

```javascript
app.singleton('myService', MyConstructor);
app.make('myService') === app.make('myService'); // true
app.make('myService') === app.make('myService', {
    foo: 'Un service personnalisé'
}); // false
```

## Résolution instantanée

Il peut être redondant de lier une classe au conteneur s'il ne va servir qu'à un seul endroit. Il peut aussi ne pas être souhaitable d'exposer une dépendance, mais qu'il est nécessaire de la résoudre dans un module précis. La résolution instantanée permet de résoudre à la volée une classe pour en obtenir une instance sans passer par une liaison.

```javascript
class MyConstructor {
    
    static get dependencies() {
        return ['foo', 'bar'];
    }

}

const myService = app.make(MyConstructor);
console.log(myService.foo); // 'Service Foo'
console.log(myService.bar); // { foo: 'Service Foo', get isFoo: (true) }
```

## Étiquette

Il peut être pratique à l'occasion de grouper différentes liaisons sous un groupe. Si on crée un service permettant d'obtenir des informations sur un serveur AWS et un autre pour un serveur DigitalOcean, et que les deux ont plusieurs méthodes en commun (pour les adeptes de l'orienté objet, les deux services implémenteraient la même interface, donc serait tout à fait approprié en TypeScript), il serait intéressant de pouvoir les obtenir en même temps. L'utilisation des étiquettes permettent justement de grouper des liaisons ensemble.

```javascript
class AWSServerService {
    
    getAvailableServers() {
        return ['server_a', 'server_b'];
    }

}

app.bind('server.aws', AWSServerService);


class DigitalOceanServerService {
    
    getAvailableServers() {
        return ['server_c'];
    }

}

app.bind('server.do', DigitalOceanServerService);


app.tag(['server.aws', 'server.do'], 'server');

/*
 * {
 *  'server.aws': AWSServerService {},
 *  'server.do': DigitalOceanServerService {}
 * }
 */
const serverServices = app.make('server');

const availableServers = [];
Object.values(serverServices).forEach((serverService) => {
    availableServers.splice(0, 0, ...serverService.getAvailableServers());
});

console.log(availableServers); // ['server_a', 'server_b', 'server_c']
```

## Décorateur 

Il peut aussi être pratique de pouvoir manipuler des classes existantes avant qu'elles ne soient entièrement résolues. On peut à la fois modifier une instance résolue, la décorer avec une classe englobante, retourner un autre objet, etc.

```javascript
class MyService {
    
    doSomething() {
        return true;
    }

}

app.bind('myService', MyService);


class MyServiceDecorator {
    
    constructor(myService) {
        this._myService = myService;
    }
    
    doSomething() {
        const value = this._myService.doSomething();
        
        return value || this.doSomethingElse();
    }
    
    doSomethingElse() {
        return false;
    }

}
app.decorate('myService', (myService) => {
    return new MyServiceDecorator(myService);
});

console.log(app.make('myService')); // MyServiceDecorator {} 
```

Si une classe a été liée comme un singleton, la décoration va manipuler l'objet qui sera stocké en tant que singleton. Donc le décorateur ne sera appelé qu'une seule fois lors de la génération du singleton.
