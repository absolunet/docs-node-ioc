## Introduction

Node IoC est un outil de développement Javascript permettant la centralisation les services d'une application, gérer l'injection de dépendance et simplifier le développement des outils CLI, le tout en suivant une syntaxe élégante et simple à utiliser.

Il a été conçu en gardant en tête les développeurs pour leur simplifier la vie et accélérer leur travail, tout en gardant en tête la qualité du code, la testabilité et l'apprentissage facile.


## Prérequis

Pour utiliser et développer dans une application Node IoC, il vous faut certains outils.

- `NodeJS >= 10.0.0`
- `NPM >= 6.0.0` ou `Yarn >= 1.9.0`
- `Git >= 2.0.0`


## Installation

Pour installer l'application NodeJS, il vous faut simplement cloner le dépôt Git dans un dossier de travail.
```bash
$ cd mon/repertoire
$ git clone git@github.com:absolunet/node-ioc-app.git
```

Une fois fait, il reste à installer les dépendances du projet, qui contient entre autre le framework Node IoC

```bash
$ npm install
```
ou
```bash
$ yarn
```

L'application IoC est maintenant installée et prêt à être utilisée.


## Tests

### Tests de fumée
Pour tester que tout fonctionne correctement, vous pouvez effectuer la commande suivante:

```bash
$ node bin/app
```

Vous devriez avoir une liste sommaire des commandes de base si tout se passe bien.


### Tests unitaires

Pour tester de manière unitaire l'application, une commande Node a été créée à cette fin.

```bash
$ npm run test:unit
```
ou
```bash
$ yarn test:unit
```

Jest est le système de tests qui est utilisé par Node IoC.


### Tests de qualité du code (lint)

Un outil de lint a été également utilisé afin de s'assurer d'une qualité continue du code et de l'architecture. Il est recommandé de conserver l'outil d'analise du code et de l'architecture, mais il peut manuellement être enlevé à tout temps.

Une commande Node a été créée à cette fin.

```bash
$ npm run test:lint
```
ou
```bash
$ yarn test:lint
```


### Tests en intégration continue.

Par défaut, la plupart des systèmes d'intégration continue propose l'utilisation de la commande `npm test` pour tester l'application. Comme il est jugé que la qualité du code est aussi important que le fonctionnement du code lui-même, l'application exécute par défaut `npm run test:lint && npm run test:unit` lors des tests d'intégration continue.