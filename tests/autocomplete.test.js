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
  it('should interpret city correctly', async function () {
    return engine.autocompleteAdapter({
      term: 'Montpellier',
    }, (results, status) => {
      results.length.should.be.eql(5);
      status.should.be.eql(200);
    });
  });
  it('should interpret address correctly', async function () {
    return engine.autocompleteAdapter({
      term: '12 rue de Montpellier',
      at: '43.610483778380875,3.8738222559274296',
    }, (results, status) => {
      results.length.should.be.eql(5);
      status.should.be.eql(200);
    });
  });
  it('should interpret dpt Hérault number', async function () {
    return engine.autocompleteAdapter({
      term: '34',
    }, (results, status) => {
      results.length.should.be.eql(5);
      status.should.be.eql(200);
    });
  });
  it('should interpret dpt Hérault term', async function () {
    return engine.autocompleteAdapter({
      term: 'Hérault',
    }, (results, status) => {
      results.length.should.be.eql(5);
      status.should.be.eql(200);
    });
  });
});
describe('GeocoderEngine.DOM-TOM', function () {

  it('should interpret mayotte correctly', async function () {
    return engine.autocompleteAdapter({
      term: 'Mayotte',
    }, (results, status) => {
      results.length.should.be.eql(5);
      status.should.be.eql(200);
    });
  });

});
