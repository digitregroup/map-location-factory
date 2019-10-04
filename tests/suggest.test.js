require('jsdom-global')();
require('chai').should();

const {GeocoderEngine} = require('../src/index');

const engine = new GeocoderEngine(
  GeocoderEngine.TYPE_HERE, {
    "appId":   "xxxxxxxxxxxxxxxx",
    "appCode": "xxxxxxxxxxxxxxxxx"
  });

describe('GeocoderEngine', function () {

  it('should not output Guadeloupe, Guadeloupe, Guadeloupe', async function () {
    return engine.suggest('Guadeloupe', (results, status) => {

      results.map(r => r.label)
        .indexOf('Guadeloupe, Guadeloupe, Guadeloupe')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Martinique, Martinique, Martinique', async function () {
    return engine.suggest('Martinique', (results, status) => {

      results.map(r => r.label)
        .indexOf('Martinique, Martinique, Martinique')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Réunion, Réunion, Réunion', async function () {
    return engine.suggest('Réunion', (results, status) => {

      results.map(r => r.label)
        .indexOf('Réunion, Réunion, Réunion')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Guyane, Guyane, Guyane', async function () {
    return engine.suggest('Guyane', (results, status) => {

      results.map(r => r.label)
        .indexOf('Guyane, Guyane, Guyane')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });
  it('should not output Mayotte, Mayotte, Mayotte', async function () {
    return engine.suggest('Mayotte', (results, status) => {

      results.map(r => r.label)
        .indexOf('Mayotte, Mayotte, Mayotte')
        .should.equal(-1);

      status.should.be.eql(200);
    });
  });

});
