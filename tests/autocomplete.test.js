require('jsdom-global')();
require('chai').should();

const {GeocoderEngine} = require('../src/index');

const engine = new GeocoderEngine(
  GeocoderEngine.TYPE_HERE
  );

describe('GeocoderEngine.autocompleteAdapter', function () {

  it('should interpret departments correctly', async function () {
    return engine.autocompleteAdapter({
      term: 'Hérault'
    }, (results, status) => {
      results.length.should.be.eql(3);
      status.should.be.eql(200);
    });
  });

});
describe('GeocoderEngine.DOM-TOM', function () {

  it('should interpret mayotte correctly', async function () {
    return engine.autocompleteAdapter({
      term: 'mayotte'
    }, (results, status) => {
      results.length.should.be.eql(3);
      status.should.be.eql(200);
    });
  });

});
