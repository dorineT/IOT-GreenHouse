
# Portager application compagnon

## Fonctionnalités

- Gestion des plantes du portager
    - Ajout d'une plante
    - Résumé des emplacements
    - Alertes personnalisées pour chaque plante
- Arrosage du portager
- Informations sur le dernier arrosage
- Vérification de la connexion au raspberry pi
- Collecte des données des capteurs phidgets
- Création de la base de données à la première ouverture de l'application (mode build) + utilisation de l'async storage


> Plantes disponibles localement dans la base de données tirées du site Ooreka :https://jardinage.ooreka.fr/plante/liste
> Modifier le fichier \src\dbHelper\db-service.js 



## Technologies

- Expo [sdk 46] - https://docs.expo.dev/
- React Native [v6]
- Base Native - https://nativebase.io/
- SQLite

## Lancement
/!\ Non disponible sur le navigateur, uniquement Android
Dans le dossier ReactApp\my-app
```bach
yarn install
```
```bach
yarn start
```
ou :     
(Ajouter l'option --tunnel si vous rencontrez des problème)
```bach
expo start
```
ou : 
```
npx start
```

## Build
/!\ Vous devez posséder un compte Expo
```
eas build -p android --profile preview
```
Modifier le fichier eas.json pour d'autres configurations (Actuellement, build Android)
