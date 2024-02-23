require('jsdom-global')();
require('chai').should();

const {GeocoderEngine} = require('../src/index');

const engine = new GeocoderEngine(
  GeocoderEngine.TYPE_HERE, {
      "apiKey":   "LG9WyQQ3DRWuS7Vq5rbKsPNZhp1Ss2Lj9w-jaXKyQ4g",
      "cacheEnable": false,
      "cacheUrl": "https://geocoder-stage.digitregroup.io",
      "cacheKey": "ytH3v7APgW2c0BQF9UJuf4T6zM01TRLBkY5CiCF2"
  });

const fixedFloat = (number, decimals) => +number.toFixed(decimals);

const oneFixed = number => fixedFloat(number, 1);

describe('fixedFloat', function () {

  it('should work', async function () {
    const res = oneFixed(48.85551969999999);
    res.should.be.eql(oneFixed(48.8555));
  });

});

describe('GeocoderEngine addresses', function () {

  it('should geocode addresses', async function () {
    return engine.geocode({
      text: '1 rue de Rivoli, Paris',
      qq:'city=Montpellier&state=Occitanie&country=FRA&county=Corrèze',
      types: "houseNumber",
    }, (results, status) => {
      //status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(oneFixed(48.85554));
      oneFixed(results[0].position.longitude).should.be.eql(oneFixed(2.35927));
    });
  });

  it('should geocode adNOBODY EXPECTS GERMANYdresses', async function () {
    return engine.geocode({
      text: 'Am Wriezener Bahnhof, 10243 Berlin, Germany',
      country: 'DEU'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(52.5);
      oneFixed(results[0].position.longitude).should.be.eql(13.4);
    });
  });

  it('should geocode postal code', async function () {
    return engine.geocode({
      text: '34110'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(43.4);
      oneFixed(results[0].position.longitude).should.be.eql(3.8);
    });
  });

  it('should geocode postal code and id', async function () {
    return engine.geocode({
      text: '34110',
      id: 'here:cm:namedplace:20098349'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(43.6);
      oneFixed(results[0].position.longitude).should.be.eql(3.9);
    });
  });

  it('should geocode by label name', async function () {
    return engine.geocode({label: 'Montpellier, Occitanie, France'},
    (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(43.6);
      oneFixed(results[0].position.longitude).should.be.eql(3.9);
    });
  });

  it('should geocode by id', async function () {
    return engine.geocode({id: 'here:cm:namedplace:20098349'}, function (results, status) {
      if (status === 200) {
        oneFixed(results[0].position.latitude).should.be.eql(43.6);
        oneFixed(results[0].position.longitude).should.be.eql(3.9);
      }
    });
  });

  it('should reverse-geocode', async function () {
    return engine.reverse({latitude: 48.8555, longitude: 2.36039}, (results, status) => {
      status.should.be.eql(200);
      results[0].address.label.should.be.eql('10 Rue de Rivoli, 75004 Paris, France');
    });
  });

  it('should geocode with DigitRE address', async function () {
    return engine.geocode({
      text: '889 Rue de la Vieille Poste, 34000 Montpellier'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(oneFixed(43.616889));
      oneFixed(results[0].position.longitude).should.be.eql(oneFixed(3.910288699999999));
    });
  });

});

describe('GeocoderEngine departments', function () {

  it('should geocode 34 correctly', async function () {
    return engine.geocode({
      text: 'Hérault'
    }, (results, status) => {
      results[0].type.should.be.eql("department");
      results[0].address.county.should.be.eql("Hérault");
    });
  });
  it('should geocode multiple infos', async function () {
    return engine.geocode({
      text: '889 Rue de la Vieille Poste, 34000 Montpellier',
      city: 'Montpellier',
      //county: 'Hérault',
      state: 'Occitanie'
    }, (results, status) => {
      results[0].type.should.be.eql("street_number");
      results[0].address.city.should.be.eql("Montpellier");
    });
  });
  // TODO : Optimize this !
  it('should geocode 19 correctly', async function () {
    return engine.geocode({
      text: '(19) Corrèze, France'
    }, (results, status) => {
      results[0].type.should.be.eql("city");
      results[0].address.city.should.be.eql("Corrèze");
    });
  });

  it('should geocode 13 correctly', async function () {
    return engine.geocode({
      text: '(13) Bouches-du-Rhône'
    }, (results, status) => {
      results[0].type.should.be.eql("department");
      results[0].address.county.should.be.eql("Bouches-du-Rhône");
    });
  });

  it('should geocode 87 correctly', async function () {
    return engine.geocode({
      text: '(87) Haute-Vienne'
    }, (results, status) => {
      results[0].type.should.be.eql("department");
      results[0].address.state.should.be.eql("Nouvelle-Aquitaine");
    });
  });

  it('should geocode 06 correctly', async function () {
    return engine.geocode({
      text: '(06) Alpes-Maritimes'
    }, (results, status) => {
      results[0].type.should.be.eql("department"); //replace by county
      results[0].address.state.should.be.eql("Provence-Alpes-Côte d'Azur");
    });
  });

});

describe('GeocoderEngine arrondissements', function () {

  it('should geocode 10e arrondissement', async function () {
    return engine.geocode({
      text: '20e Arrondissement, Paris, Île-de-France, France '
    }, (results) => {
      results[0].type.should.be.eql("district");
      results[0].address.city.should.be.eql("Paris");
      results[0].address.district.should.be.eql("20e Arrondissement");
    });
  });

});

describe('GeocoderEngine regions', function () {

  it('should geocode occitanie', async function () {
    return engine.geocode({
      text: 'Occitanie'
    }, (results) => {
      results[0].type.should.be.eql("state");
      results[0].address.state.should.be.eql("Occitanie");
    });
  });

  // TODO : to optimize research by region/area
  it('should geocode bretagne', async function () {
    return engine.geocode({
      text: 'Bretagne'
    }, (results) => {
      results[0].type.should.be.eql("city");
      results[0].address.state.should.be.eql("Bourgogne-Franche-Comté");
    });
  });
  it('should geocode bretagne, france', async function () {
    return engine.geocode({
      text: 'Bretagne, France'
    }, (results) => {
      results[0].type.should.be.eql("city");
      results[0].address.state.should.be.eql("Bourgogne-Franche-Comté");
    });
  });

});

describe('GeocoderEngine cities', function () {

  it('should geocode lille', async function () {
    return engine.geocode({
      text: 'Lille, France'
    }, (results) => {
      results[0].type.should.be.eql("city");
      results[0].address.city.should.be.eql("Lille");
    });
  });

});
describe('GeocoderEngine Nangis', function () {

  it('should geocode Nangis', async function () {
    return engine.geocode({
      text: 'Nangis, France'
    }, (results) => {
      results[0].type.should.be.eql("city");
      results[0].address.city.should.be.eql("Nangis");
    });
  });

});


describe('GeocoderEngine DOM-TOM', function () {

  it('should geocode guadeloupe', async function () {
    return engine.geocode({
      text: 'guadeloupe'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guadeloupe");
    });
  });
  it('should geocode guyane', async function () {
    return engine.geocode({
      text: 'guyane'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guyane");
    });
  });
  it('should geocode martinique', async function () {
    return engine.geocode({
      text: 'martinique'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Martinique");
    });
  });
  it('should geocode reunion', async function () {
    return engine.geocode({
      text: 'reunion'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Réunion");
    });
  });
  it('should geocode mayotte', async function () {
    return engine.geocode({
      text: 'mayotte'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Mayotte");
    });
  });

});

describe('GeocoderEngine DOM-TOM ', function () {

  it('should geocode guadeloupe', async function () {
    return engine.geocode({
      text: 'guadeloupe'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guadeloupe");
    });
  });
  it('should geocode guyane', async function () {
    return engine.geocode({
      text: 'guyane'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guyane");
    });
  });
  it('should geocode martinique', async function () {
    return engine.geocode({
      text: 'martinique',
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Martinique");
    });
  });
  it('should geocode reunion', async function () {
    return engine.geocode({
      text: 'reunion'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Réunion");
    });
  });
  it('should geocode mayotte', async function () {
    return engine.geocode({
      text: 'Mayotte'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Mayotte");
    });
  });

});
