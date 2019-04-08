## Introduction

Le langage JavaScript permet maintenant de développer en utilisant une approche orientée objet (POO) avec héritage simple. Plusieurs langages oritentés objet permettent l'héritage multiple. Certains langages orienté objet, comme le PHP, permettent anssi l'héritage simple, mais avec l'utilisation de classes partielles, nommé `trait`.

Comme il peut être utile de pouvoir réutiliser les mêmes fonctionnalités dans plusieurs classes, sans pour autant qu'ils héritent de la même classe, et pour éviter de l'injection redondante d'utilitaires, un système de mixin a été implémenté pour simuler le concept de `trait`.

## Utilisation

Une classe typique, sans héritage, ressemble à ceci:

```javascript
class MyClass {
    
}
```

Une classe typique héritant de `MyClass` ressemble à ceci:

```javascript
class MyChildClass extends MyClass {
    
}
```

Maintenant, imaginons une situation où on a une classe permettant d'obtenir des traductions, et une autre où on peut obtenir des URL basés sur une langue.

```javascript
class TranslationService extends BaseTranslationService{
    
    getLocale() {
        return config.get('app.locale', 'fr');
    }
    
    translate(key) {
        return translationRepository.get(key, this.getLocale());
    }

}

class LocalizedUrlService extends UrlService {
    
    getLocale() {
        return config.get('app.locale', 'fr');
    }
    
    getLocalizedUrl(url) {
        return urlRepository.getFromLocale(url, this.getLocale());
    }

}
```

Il y a ici un peu de redondance pour la méthode `getLocale()`. Il serait alors judicieux de faire étendre chaque classe d'une classe commune. Le problème, c'est que chacune de ces classes en étendent déjà une, qui est possiblement dans une extension externe, et donc immutable.

Le mixin permet de résoudre ce genre de cas.

```javascript
const { mixins:{ factory } } = require('@absolunet/ioc');

const hasLocale = factory((SuperClass) => {
    return class HasLocale extends SuperClass {
        
        getLocale() {
            return config.get('app.locale', 'fr');
        }

    }
});

class TranslationService extends hasLocale(BaseTranslationService) {
    
    translate(key) {
        return translationRepository.get(key, this.getLocale());
    }

}

class LocalizedUrlService extends hasLocale(UrlService) {
    
    getLocalizedUrl(url) {
        return urlRepository.getFromLocale(url, this.getLocale());
    }

}
```

La méthode `getLocale()` est maintenant dans une seule _classe_, et peut être utilisée par plusieurs autres classes sans affecter le système d'héritage.

Au final, ça donne quelque chose comme ça, une fois déconstruit:

```javascript
class BaseTranslationService {
    // quelques méthodes
}

class HasLocale_A extends BaseTranslationService {
    
    getLocale() {
        return config.get('app.locale', 'fr');
    }

}

class TranslationService extends HasLocale_A {

    translate() {
        return translationRepository.get(key, this.getLocale());
    }

}

class UrlService {
    // quelques méthodes
}

class HasLocale_B extends UrlService {
    
    getLocale() {
        return config.get('app.locale', 'fr');
    }

}

class LocalizedUrlService extends HasLocale_B {

    getLocalizedUrl(url) {
        return urlRepository.getFromLocale(url, this.getLocale());
    }

}
```

On a maintenant des morceaux de classes réutilisable facilement lors de l'implémentation d'une classe, pour ainsi réduire le code et prévenir la création inutile de liaisons ayant pour seul but de compléter d'autres classes.

### extends mixin()

L'approche minimale d'utilisation d'un mixin ressemble beaucoup à un _extends_ normal, à l'exception du fait qu'on étend sur la résultante d'une fonction, soit un constructeur, plutôt que sur un constructeur directement.

```javascript
class MyClass extends myMixin() {
    
}
```

### extends mixin(ParentClass)

L'approche plus classique d'une utilisation d'une classe partielle est en l'intégrant avec une autre classe parente, injectée directement cette fois.

```javascript
class MyClass extends myMixin(MyParentClass) {
    
}
```

De cette façon, on étend sur MyParentClass, tout en ajoutant les fonctionnalités de myMixin()

### extends mixin(otherMixin())

Une approche encore plus poussée pour utiliser plusieurs mixins d'un coup est de les enchaîner un à la suite de l'autre.

```javascript
class MyClass extends myMixin(myOtherMixin()) {
    
}
```

La classe `MyClass` utilise maintenant les fonctionnalités de `myMixin()` et de `myOtherMixin()`.

On peut maintenant combiner les concepts entre eux:

```javascript
class MyClass extends myMixin(myOtherMixin(anotherMixin(MyParentClass))) {
    
}
```

Ici, `MyClass` étend sur `MyParentClass` en utilisant, en ordre, les fonctionnalités de `myMixin()`, `myOtherMixin()` et `anotherMixin()`.

## Création d'un mixin

Node IoC a prévu une fonction simple d'utilisation ainsi qu'une recette pour créer un mixin.

```javascript
// [app]/lib/mixinx/myMixin.js
const { mixins:{ factory }} = require('@absolunet/ioc');

module.exports = factory((SuperClass) => {
    return class MyMixin extends SuperClass {
        
        getSomething() {
            return 'something';
        }

    }
});

// [app]/lib/services/MyService.js

const myMixin = require('./../mixins/myMixin');

class MyService extends myMixin() {
    
    getEverything() {
        return [this.getSomething()]; // ['something']
    }

}
```
