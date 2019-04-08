## Introduction

Le terminal est l'interface utilisateur (UI) principal pour une application CLI. Le kernel Console enregistre par défaut le service provider qui lie le service `terminal`. Il permet d'informer l'usager des actions effectués et des erreurs rencontrées, mais aussi de poser des questions à l'usager, d'effectuer de la validation, de la sélection, et, pour les développeurs, de déboguer. Le service simplifie les processus d'interaction avec l'usager.

## Impression

Plusieurs méthodes ont été mises en place pour afficher de l'information à l'usager. En voici quelques-unes.

```javascript
// Afficher une information
terminal.print('Hello World');
// `Hello World`

// Afficher une information en sautant une ligne
terminal.println('Hello world');
// `Hello World
// `

// Afficher une information en vert avec un crochet
terminal.success('That worked!');
// `✓  That worked!`

// Afficher une information en jaune
terminal.warning('Watch out...');
// `Watch out...`

// Afficher une information en rouge
terminal.error('Whoops!');
// `Whoops!`

// Afficher une erreur avec un X
terminal.failure('Whoops!');
// `✘  Whoops`

// Afficher de l'information sous forme d'un tableau
terminal.table(['foo', 'bar'], [
    ['First Foo', 'First Bar'],
    ['Second Foo', 'Second Bar']
]);
// ╔════════════╤════════════╗
// ║ Foo        │ Bar        ║
// ╟────────────┼────────────╢
// ╟────────────┼────────────╢
// ║ First Foo  │ First Bar  ║
// ╟────────────┼────────────╢
// ║ Second Foo │ Second Bar ║
// ╚════════════╧════════════╝
```

## Interaction

En plus des arguments d'une commande, il peut être utile d'interagir avec l'utilisateur pour retrouver certains segments d'information supplémentaires. Plusieurs méthodes ont aussi été mise en place pour communiquer facilement avec l'usager via le terminal.

```javascript
const answer = await terminal.ask('Question?', 'Default answer');
terminal.print(answer);
// ? This is a question... (Default answer)
// ? This is a question... (Default answer) A custom answer
// A custom answer

const secretAnswer = await terminal.secret('What\'s your password?');
terminal.print(secretAnswer); // Seulement à titre d'exemple...
// ? What's your password?
// ? What's your password? **************
// s3cr3tP4ssword

const shouldContinue = await terminal.confirm('Ar you sure?');
if (shouldContinue) {
    terminal.print('Continue!');
}
// ? Are you sure? (y/N)
// ? Are you sure? (y/N) Y
// Continue!

const choice = await terminal.choice('What is your favorite color?', [
    'red',
    'green',
    'blue'
]);
terminal.print(choice);
// ? What is your favorite color?
// ❯  red
//   green
//   blue
// red

const choice = await terminal.choice('What is your favorite color?', {
    red: 'Fire red',
    green: 'Forest green',
    blue: 'Ocean blue'
});
terminal.print(choice);
// ? What is your favorite color?
// ❯  Fire red
//   Forest green
//   Ocean blue
// red
```

## Verbose

Pour effectuer le déboguage, il est pratique en temps normal d'utiliser des `console.log` un peu partout. Le problème est qu'il faut les retirer au moment du déploiement en production, ce qui complique souvent le déboguage dans l'environnement final.

L'écosystème CLI de Node IoC prend en compte cette problématique et propose une solution en 3 incréments pour le débogage.

Le débogage débute en utilisant le flag additif `--verbose` ou son alias `-v`.

- `-v`: niveau 1
- `-vv`: niveau 2
- `-vvv`: niveau 3

Plus le niveau de verbose est élevé, plus les informations de débogage seront nombreuses, et le type d'information, spécifique et orienté développement.

### Niveau 1: -v et log()

Au niveau 1 et plus haut, le contenu inséré dans `terminal.log()` sera exposé dans le terminal. Au niveau 0, l'affichage est ignoré. On devrait retrouver à ce niveau de l'information au niveau des actions effectuées.

### Niveau 2: -vv et debug()

Au niveau 2 et plus haut, le contenu inséré dans `terminal.debug()` sera exposé dans le terminal. Aux niveaux 0 et 1, l'affichage est ignoré. On devrait retrouver à ce niveau de l'information au niveau des données traitées et reçues, en plus de certains détails d'opération.

### Niveau 3: -vvv et spam()

Au niveau 3, le dernier niveau, le contenu inséré dans `terminal.spam()` sera exposé dans le terminal. Aux niveaux 0, 1 et 2, l'affichage est ignoré. On devrait retrouver à ce niveau de l'information très spécifique au niveau du traitement effectué. Comme il s'agit du niveau le plus haut de verbosité, il ne faut pas hésiter à afficher tout ce qui pourrait un jour servir au débogage en production, tout en conservant à l'esprit qu'il s'agit d'un flag public, donc aucune information sensible ne devrait se retrouver dans cette méthode.
