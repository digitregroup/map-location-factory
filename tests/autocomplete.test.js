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

describe('GeocoderEngine.autocompleteAdapter', function () {

  it('should interpret departments correctly', async function () {
    return engine.autocompleteAdapter({
      term: '12 rue de Montpellier',
      at: '43.610483778380875,3.8738222559274296',
    }, (results, status) => {
      results.length.should.be.eql(3);
      status.should.be.eql(200);
    });
  });

});
describe('GeocoderEngine.DOM-TOM', function () {

  it('should interpret mayotte correctly', async function () {
    return engine.autocompleteAdapter({
      term: '12 rue de Montpellier',
    }, (results, status) => {
      results.length.should.be.eql(3);
      status.should.be.eql(200);
    });
  });

});
