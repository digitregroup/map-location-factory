require('jsdom-global')();
require('chai').should();

require('../../../index');

const GoogleGeocoder = require('../../../src/providers/Google/Geocoder').default;

const engine = new GoogleGeocoder();

describe('providers.Google.Geocoder', function () {
  it('should work', async function () {
    return await engine.geocode({
      text: '1 rue de Rivoli, Paris'
    }, (err, data) => {
      data.should.be.eql({
        'lat': 48.85551969999999,
        'lng': 2.3594045
      });
    });
  });


  it('should work with DigitRE address', async function () {
    return await engine.geocode({
      text: '889 Rue de la Vieille Poste, 34000 Montpellier'
    }, (err, data) => {
      data.should.be.eql({
        'lat': 43.616889,
        'lng': 3.910288699999999
      });
    });
  });
});
