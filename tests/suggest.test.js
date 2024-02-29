require('jsdom-global')();
require('chai').should();

const {GeocoderEngine} = require('../src/index');

const engine = new GeocoderEngine(
    'Here', {
      "apiKey": "LG9WyQQ3DRWuS7Vq5rbKsPNZhp1Ss2Lj9w-jaXKyQ4g",
      "suggest": {
        "baseUrl": "https://autocomplete.search.hereapi.com/v1/",
        "path": "",
        "resource": "autocomplete",
        "options": {
          "limit": 2,
          "lang": "fr",
          "country": "FRA,GLP,GUF,MTQ,REU,MYT,BLM,MAF,NCL,PYF,SPM,ATF,WLF",
          "types": "city"
        }
      },
      "lookup": {
        "baseUrl": "https://lookup.search.hereapi.com/v1/",
        "path": "",
        "resource": "lookup"
      },
      "geocode": {
        "baseUrl": "https://geocode.search.hereapi.com/v1/",
        "path": "",
        "resource": "geocode",
        "options": {
          "limit": 2,
          "lang": "fr",
          "country": "FRA,GLP,GUF,MTQ,REU,MYT,BLM,MAF,NCL,PYF,SPM,ATF,WLF"
        }
      },
      "reverse": {
        "baseUrl": "https://revgeocode.search.hereapi.com/v1/",
        "path": "",
        "resource": "revgeocode",
        "options": {
          "limit": 2,
          "lang": "DEU"
        }
      }
    }
  );

describe('GeocoderEngine', function () {
  it('should not output French city with countryCode as array', async function () {
    return engine.suggest({
      term: 'Montpellier',
      country: ['FRA', 'GLP', 'GUF', 'MTQ', 'REU', 'MYT', 'PYF', 'SPM', 'WLF', 'MAF', 'BLM']
    }, (results, status) => {
      results.map(r => r.label)
          .indexOf('Montpellier')
          .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output French city with countryCode as string', async function () {
    return engine.suggest({
      term: 'Montpellier',
    }, (results, status) => {
      results.map(r => r.label)
          .indexOf('Montpellier')
          .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Guadeloupe, Guadeloupe, Guadeloupe', async function () {
    return engine.suggest({term: 'Guadeloupe'}, (results, status) => {
      results.map(r => r.label)
        .indexOf('Guadeloupe, Guadeloupe, Guadeloupe')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Martinique, Martinique, Martinique', async function () {
    return engine.suggest({term:'Martinique'}, (results, status) => {

      results.map(r => r.label)
        .indexOf('Martinique, Martinique, Martinique')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Réunion, Réunion, Réunion', async function () {
    return engine.suggest({term:'Réunion'}, (results, status) => {

      results.map(r => r.label)
        .indexOf('Réunion, Réunion, Réunion')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Guyane, Guyane, Guyane', async function () {
    return engine.suggest({term:'Guyane'}, (results, status) => {

      results.map(r => r.label)
        .indexOf('Guyane, Guyane, Guyane')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Mayotte, Mayotte, Mayotte', async function () {
    return engine.suggest({term: 'Mayotte'}, (results, status) => {

      results.map(r => r.label)
        .indexOf('Mayotte, Mayotte, Mayotte')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });

});
