## Introduction

La gestion des fichiers physiques est souvent un enjeu, autant au niveau des systèmes Web que CLI. Node IoC fournit un service ainsi qu'une séries de drivers permettant la manipulation simplifiée des fichiers.


## _fs_ vs _file_

Le _file system_ ('fs') de Node.js fournit un API très intéressant pour lire et manipuler des fichiers et des dossiers, bien que simpliste et basé sur des callbacks plutôt que sur des promesses.

L'utilisation de _@absolunet/fss_ et _@absoplunet/fsp_ ajoute une petite couche intéressante d'abstraction pour utiliser _fs_ et _fs-extra_ avec un décorateur synchrone et asynchrone.

Dans l'esprit d'utiliser un système simplifié, intelligent et flexible, Node IoC fournit un autre décorateur à ces services via le service _file_.

Donc tout ce que _file_ fait, il finit par le déléguer à _fs_ ou à _fs-extra_.


## Drivers

 Plusieurs drivers ont été mis en place. Par défaut, un driver est associé à une extension de fichier. Par exemple, le driver 'yaml' est associé à tout fichier réponsant au pattern '*.yaml'.
 
 
### Text

Le driver `text` est le driver par défaut. Il permet de lire et d'écrire sur des fichiers quelconques.


### JavaScript

Le driver `js` permet de lire et d'interpréter les fichiers JavaScript, en plus de faire de l'écriture standard. Si un fichier `.js` doit être lu sans être interprété, l'utilisation du driver 'text' est préférable.


### JSON

Le driver `json` permet d'interpréter le contenu d'un fichier comme un objet JavaScript.


### YAML

Le driver `yaml`, tout comme le driver `json`, permet d'interpréter un fichier `.yml` et `.yaml` comme un objet JavaScript.