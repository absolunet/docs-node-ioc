## Introduction

Le model joue un rôle primordiale dans la gestion des données d'une application. Node IoC propose une classe de base permettant la manipulation simple et flexible de données provenant d'une source quelconque, autant d'une base de données que d'un API distant, voire même de la machine elle-même.

## Role du model

Le model permet principalement à contenir de l'information sur une entité de manière standardisée. À plus grande échelle, il s'agit de la source de données pour une application: chaque entité a son model, des relations peuvent être faits d'un model à un autre, etc. Certains systèmes, comme les ORM, permettent de lier des models dans un langage donné à une table, un segment de table ou à plusieurs tables d'une base de données. C'est le cas de Doctrine (PHP), de Eloquent (Laravel), de Entity Framework (.NET) et plusieurs autres.

Dans le cas de Node IoC, les models ne sont pas liés par défaut à une table, voire même à une base de données. Il peut simplement s'agit d'une source d'information standardisée pour une entité quelconque.


## Attributs

Un `attribute` est une propriété du model. Elle permet de stocker et de retrouver une valeur donnée en suivant certains concepts d'accesseurs, de mutateurs ainsi que de sécurité.

Voici une liste d'attributs affectées à un objet quelconque:

```javascript
const model = {};
model.id = Symbol(1);
model.name = 'A name';
model.type = Types.TYPE_A;
model.created_at = new Date();

app.make('mymodel.repository').save(model);
```

Simple à utiliser, mais aucune valeur n'est vérifiée, rien n'est automatisée, aucune méthode n'existe pour simplifier la manipulation, en plus du fait que la sauvegarde a toute les chances de ne pas fonctionner avec un objet quelconque.

Voici donc une alternative:

```javascript
const model = new MyModel();
model.setId(Symbol(1));
model.setName('A name');
model.setType(Types.TYPE_A);
model.setCreatedAt(new Date());

app.make('mymodel.repository').save(model.getAttributes());
```

Déjà, une couche de sécurité a été mise en place en proposant des méthodes pour interagir avec le model. Le hic? Un model devient rapidement surchargé de méthodes en théorie inutile. L'idéal est de proposer le model du haut tout en s'assurant que les opérations avant les mutations et les accès peuvent être prises, en plus d'assurer une couche d'automatisation.

```javascript
const model = new MyModel();
model.name = 'A name';
model.type = Types.TYPE_A;
model.save();
```

C'est ce que le model de Node IoC propose. Voici comment une classe model est implémenté en temps normal.

```javascript
class MyModel extends hasRepository(Model) {
    
    get repository() {
        return 'mymodel.repository';
    }

    get fillable() {
        return ['name', 'type'];
    }
    
    setTypeAttribute(type) {
        const types = Object.values(Types);
        if (types.includes(type)) {
            __(this).get('attributes').type = type;
        } else {
            throw new TypeError(`Type must be in [${types.join(', ')}]`);
        }
    } 

}
```

### Attribut dynamique

Un attribut par défaut fonctionne en 1 pour 1.
```javascript
const model = new Model();
model.foo = 'bar';
console.log(model.foo); // 'bar'
console.log(model.bar); // undefined
```

On peut également utiliser les méthodes génériques:

```javascript
const model = new Model();
model.setAttribute('foo', 'bar');
console.log(model.getAttribute('foo')); // 'bar'
console.log(model.getAttribute('bar')); // undefined
```

### Accesseur / mutateur

Cependant, le 1 pour 1 ne fait pas toujours l'affaire. Autant pour effectuer de la validation que pour modifier la valeur avant de la stocker ou de la retourner, il est souvent nécessaire d'implémenter une sorte d'intercepteur avant le stockage.

En suivant une syntaxe donnée, on peut facilement créer des accesseurs et mutateurs dynamiques sans passer par les `get` et `set` JavaScript, pour permettre plus de flexibilité pour le processus interne du model.

La syntaxe `get[attributeName]Attribute` et `set[attributeName]Attribute` permet de créer des hooks selon l'opération. Si on voudrait créer un accesseur et un mutateur pour l'attribut `is_done`, pour un model `Task`, on aurait quelque chose comme ça:

```javascript
class Task extends Model {
    
    getIsDoneAttribute(attributes) {
        return Boolean(attributes.done_at);
    }
    
    setIsDoneAttribute(value, attributes) {
        if (this.is_done !== Boolean(value)) {
            attributes.done_at = value ? new Date() : null;
        }
    }

}
```

Il s'agit ici d'un champ inexistant, se basant sur un champ existant `done_at`, qui contient une date. l'accesseur retourne `true` si le champ `done_at` contient une valeur interprétable comme `true`, sinon `false`. À l'inverse, si on veut dire `task.is_done = true`, comme le champ n'existe pas, on utilise cette valeur pour attribuer une valeur à `done_at`, si nécessaire.

```javascript
const task = new Task();
console.log(task.done_at); // null
console.log(task.is_done); // false

// La tâche est maintenant done!
task.is_done = true;

console.log(task.done_at); // Tue Apr 09 2019 10:00:00 GMT-0400 (UTC−04:00)
console.log(task.is_done); // true

// ...

// Rien ne change
task.is_done = true;

// Aucun changement ici
console.log(task.done_at); // Tue Apr 09 2019 10:00:00 GMT-0400 (UTC−04:00)
console.log(task.is_done); // true

// ...

// On retourne à l'ancienne valeur
task.is_done = false;

console.log(task.done_at); // null
console.log(task.is_done); // false
```
## Guard

Un model, par défaut, est protégé par configuration pour éviter l'ajout de propriétés inattendues. Il faut cependant renseigner les propriétés attendus pour que la protection soit utilisé efficacement.

Pour renseigner les attributs attendus, il faut donner une valeur à la propriété `fillable`.

```javascript
class MyModel extends Model {
    
    get fillable() {
        return ['foo', 'bar'];
    }

}
```

La protection fonctionne principalement avec la fonction `fill()`, qui fusione un objet simple au model.

```javascript

const model = new MyModel();
model.fill({
    foo: 'foo',
    bar: true
});

console.log(model.foo); // 'foo'
console.log(model.bar); // true

model.fill({
    foo: 'other foo',
    bar: false,
    baz: 'test'
});

console.log(model.foo); // 'other foo'
console.log(model.bar); // false
console.log(model.baz); // null
```

Donc, si un attribut tente d'être assigné via `fill()`, il est simplement ignoré.

Cependant, un attribut assigné manuellement, comme `model.foo = 'foo';`, n'utilisera pas la protection, étant donné qu'il peut s'agit d'une mutation dynamique ou d'une relation.

```javascript
model.baz = 'test';
console.log(model.baz); // 'test'
```

## Mixins



### hasRepository