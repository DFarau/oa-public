# @openagenda/react-filters

## Exemple

```html
<html>
  <head></head>
  <body>
    <script>
      // les paramètres qui seront utilisés par le script
      window.oa = {
        // ref,
        res: '/events',
        locale: 'fr',

      };
    </script>
    <script src="https://unpkg.com/@openagenda/react-filters@2.4.2/dist/main.js"></script>
  </body>
</html>
```

Un filtre est défini en plaçant un div avec des paramètres passés en attributs. Exemple d'un filtre "city":

```
<div
  data-oa-filter="unique-filter-id"
  data-oa-filter-params="{&quot;name&quot;:&quot;city&quot;}"
></div>
```

 * L'attribut 'data-oa-filter' doit être unique sur la page.
 * L'attribut 'data-oa-filter-params' prend la configuration du filtre encodé en JSON.

## Paramètres

Le gestionnaire de filtre est configuré à partir des valeurs défines sur window.oa

### `res`

De type chaine de caractères, c'est le chemin de l'api utilisé pour faire un `GET` des agrégations (totaux et valeurs affichées par les filtres).

Exemple:

```
window.oa = {
  // ...
  res: '/events'
  // ...
}
```

### `locale`

La langue à appliquer, en 2 lettres: `fr`, `en`, `es`...

### `locales`

Les messages à ajouter ou surcharger, au format suivant:
```js
const locales = {
  fr: {
    key: 'message'
  }
};
```

Les locales en français de la dernière version se trouvent [ici](https://github.com/OpenAgenda/oa-public/blob/main/react-filters/src/locales/fr.json).

### `aggregations`

L'objet des agrégations utiles aux filtres.

### `total`

Le nombre total d'événements correspondants aux filtres

### `defaultViewport`

Un objet décrivant les limites de la carte lorsqu'aucun événement ne correspond aux filtres, au format suivant:

```js
const defaultViewport = {
  bottomRight: {
    latitude,
    longitude
  },
  topLeft: {
    latitude,
    longitude
  }
};
```

### `query`

L'objet des valeurs des filtres, qui vient généralement de l'url mais peut aussi être utilisé à des fins de test.

### `onFilterChange`

La fonction qui est appelée à chaque changement de filtre, c'est ici qu'il faut mettre à jour l'url, recharger la liste d'événements ou la page.

### `apiClient`

Une instance d'axios, surtout utile pour les tests.

Voir [`@openagenda/axios-mock-adapter`](https://www.npmjs.com/package/@openagenda/axios-mock-adapter).

### `ref`

De type référence React, elle permet d'utiliser le gestionnaire de filtres (`FiltersManager`) pour récupérer ou modifier des données.

Voir `React.createRef()` ou `React.useRef()`

## Paramètres par type de filtres

### definedRange

Affiche des liens cliquables pour filtrer sur des périodes relatives au présent (aujourd'hui, demain...)

 * **staticRanges**: pour préciser la liste à afficher. Valeurs possibles: `['today', 'tomorrow', 'thisWeekend', 'currentWeek', 'currentMonth']`
