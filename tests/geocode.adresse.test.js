require('jsdom-global')();
require('chai').should();

const {GeocoderEngine} = require('../src/index');

const engine = new GeocoderEngine(
    GeocoderEngine.TYPE_ADRESSE, {
      "cacheEnable": false,
      "cacheUrl": "https://geocoder-stage.digitregroup.io",
      "cacheKey": "ytH3v7APgW2c0BQF9UJuf4T6zM01TRLBkY5CiCF2"
    }
);

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
      text: '1 rue de Rivoli, Paris'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(oneFixed(2.3));
      oneFixed(results[0].position.longitude).should.be.eql(oneFixed(48.9));
    });
  });

  it('should geocode department codes', async function () {
    return engine.geocode({
      text: '75001'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(2.3);
      oneFixed(results[0].position.longitude).should.be.eql(48.9);
    });
  });

  it('should geocode department name', async function () {
    return engine.geocode({
      text: '34 Hérault France'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(3.4);
      oneFixed(results[0].position.longitude).should.be.eql(43.6);
    });
  });

  it('should reverse-geocode', async function () {
    return engine.reverse({latitude: 48.8555, longitude: 2.36039, type: 'street'}, (results, status) => {
      status.should.be.eql(200);
      results[0].address.label.should.be.eql('Passage Charlemagne 75004 Paris');
    });
  });

  it('should geocode with DigitRE address', async function () {
    return engine.geocode({
      text: '889 Rue de la Vieille Poste, 34000 Montpellier'
    }, (results, status) => {
      status.should.be.eql(200);
      oneFixed(results[0].position.latitude).should.be.eql(oneFixed(3.9));
      oneFixed(results[0].position.longitude).should.be.eql(oneFixed(43.6));
    });
  });

});


describe('GeocoderEngine arrondissements', function () {

  it('should geocode 10e arrondissement', async function () {
    return engine.geocode({
      text: '20e Arrondissement, Paris, Île-de-France, France'
    }, (results) => {
      results[0].type.should.be.eql("municipality");
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

  it('should geocode bretagne', async function () {
    return engine.geocode({
      text: 'Hérault'
    }, (results) => {
      results[0].type.should.be.not.eql("state");
      results[0].address.state.should.be.eql("Occitanie");
    });
  });

  it('should geocode bretagne, france', async function () {
    return engine.geocode({
      text: '34'
    }, (results) => {
      results.should.be.empty;
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
describe('GeocoderEngine Montpellier', function () {

  it('should geocode Montpellier', async function () {
    return engine.geocode({
      text: 'Montpellier'
    }, (results) => {
      results[0].type.should.be.eql("city");
      results[0].address.city.should.be.eql("Montpellier");
    });
  });

});


describe('GeocoderEngine DOM-TOM', function () {

  it('should geocode guadeloupe', async function () {
    return engine.geocode({
      text: 'guadeloupe'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guadeloupe-France");
    });
  });
  it('should geocode guyane', async function () {
    return engine.geocode({
      text: 'guyane'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guyane-France");
    });
  });
  it('should geocode martinique', async function () {
    return engine.geocode({
      text: 'martinique'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Martinique-France");
    });
  });
  it('should geocode reunion', async function () {
    return engine.geocode({
      text: 'reunion'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Réunion-France");
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

describe('GeocoderEngine DOM-TOM -france', function () {

  it('should geocode guadeloupe', async function () {
    return engine.geocode({
      text: 'guadeloupe-france'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guadeloupe-France");
    });
  });
  it('should geocode guyane', async function () {
    return engine.geocode({
      text: 'guyane-france'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Guyane-France");
    });
  });
  it('should geocode martinique', async function () {
    return engine.geocode({
      text: 'martinique-france'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Martinique-France");
    });
  });
  it('should geocode reunion', async function () {
    return engine.geocode({
      text: 'reunion-france'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Réunion-France");
    });
  });
  it('should geocode mayotte', async function () {
    return engine.geocode({
      text: 'mayotte-france'
    }, (results) => {
      results[0].type.should.be.eql("country");
      results[0].address.label.should.be.eql("Mayotte");
    });
  });

});
