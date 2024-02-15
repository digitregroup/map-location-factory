# map-location-factory

## How to use

### Front-end

- Install the last npm package
- Import the library
- use the autocompleteAdapter plugin


### Back-end

- Install the last npm package
- Import the library
- use the API public function suggest, geocode, reverse.


## The library

### Constructor params :

```
    const engine = new GeocoderEngine(
        'Here', {
        "apiKey":   "API_KEY",
        "cacheEnable": false,
        "cacheUrl": "https://geocoder-stage.digitregroup.io",
        "cacheKey": "CACHE_KEY"
    });
```

***


### Here suggest API

#### params :
| params          | type                  | value                                                                                                                          |
|-----------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------|
| id              | string                | 'here:cm:namedplace:20098349'                                                                                                  |
| term            | string                | A city or postalCode,...                                                                                                       |
| options         | object                | {}                                                                                                                             |
| options.term    | string                | Address, city, postalCode,...                                                                                                  |
| options.country | array_string or array | 'FRA' or 'FRA,DEU' or ['FRA','DEU']<br/> default : 'FRA', 'GLP', 'GUF', 'MTQ', 'REU', 'MYT', 'PYF', 'SPM', 'WLF', 'MAF', 'BLM' |
| options.types   | array_string          | 'area,city,postalCode'                                                                                                         |
| options.limit   | int                   | 10                                                                                                                             |
| options.lang    | string                | 'fr'                                                                                                                           |


#### exemples :
```
    engine.suggest({
      term: 'Montpellier',
      country: 'FRA,GLP,GUF,MTQ,REU,MYT,PYF,SPM,WLF,MAF,BLM' // array or string
    }, (results, status) => {
      results.map(r => r.label)
          .indexOf('Montpellier')
          .should.equal(-1);

      status.should.be.eql(200);
    });
  })
```

### Here Geocode API

#### params :
| params          | type                  | value                                                                                                                          |
|-----------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------|
| id              | string                | Here ID                                                                                                                        |
| text            | string                | An address                                                                                                                     |
| options         | object                | {}                                                                                                                             |
| options.term    | string                | Address, city, postalCode,...                                                                                                  |
| options.country | array_string or array | 'FRA' or 'FRA,DEU' or ['FRA','DEU']<br/> default : 'FRA', 'GLP', 'GUF', 'MTQ', 'REU', 'MYT', 'PYF', 'SPM', 'WLF', 'MAF', 'BLM' | 
| options.types   | array_string          | 'address,area,city,houseNumber,postalCode,street'                                                                              |
| options.limit   | int                   | 10                                                                                                                             |
| options.lang    | string                | 'fr'                                                                                                                           |


#### exemples :
```
    engine.geocode({
        id: 'here:cm:namedplace:20098349'
    });

```

```
    engine.geocode({{
        text: '1 rue de Rivoli, Paris'
        types: "houseNumber",
    });
```

### Here Reverse API

#### params :
| params          | type                  | value                                                                                                                          |
|-----------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------|
| latitude        | number                | latitude coordinate                                                                                                            |
| longitude       | number                | longitude coordinate                                                                                                           |
| options         | object                | {}                                                                                                                             |
| options.types   | array_string          | 'address,area,city,street'                                                                                                     |
| options.limit   | int                   | 10                                                                                                                             |
| options.lang    | string                | 'fr'                                                                                                                           |



#### exemple :
```
    engine.reverse({ latitude: 48.8555, longitude: 2.36039 });
```



For more information : https://www.here.com/docs/bundle/geocoding-and-search-api-v7-api-reference/page/index.html
