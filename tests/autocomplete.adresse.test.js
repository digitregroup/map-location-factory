require('jsdom-global')();
require('chai').should();
const {GeocoderEngine} = require('../src/index');
const chai = require("chai");
const expect                 = chai.expect;

const engine = new GeocoderEngine(
  GeocoderEngine.TYPE_ADRESSE, {
      "cacheEnable": false,
      "cacheUrl": "https://geocoder-stage.digitregroup.io",
      "cacheKey": "ytH3v7APgW2c0BQF9UJuf4T6zM01TRLBkY5CiCF2"
    }
  );

describe('GeocoderEngine.autocompleteAdapter', function () {

  it('should interpret departments correctly', async function () {
    return engine.autocompleteAdapter({
      term: 'Montpellier'
    }, (results, status) => {
      console.log('results ', results);
      results.length.should.be.eql(3);
      status.should.be.eql(200);
    });
  });

});

describe('GeocoderEngine.DOM-TOM', function () {

  it('should interpret mayotte correctly', async () => {
    await engine.autocompleteAdapter({
      term: 'mayotte'
    }, (results, status) => {
      console.log('results ', results);
      results.length.should.be.eql(2);
      status.should.be.eql(200);
  });

  });

});
