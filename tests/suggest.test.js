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
      country: 'FRA,GLP,GUF,MTQ,REU,MYT,PYF,SPM,WLF,MAF,BLM'
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
