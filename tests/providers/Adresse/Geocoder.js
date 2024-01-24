require('jsdom-global')();
require('chai').should();

require('../../../browser/index');

const AdresseGeocoder = require('../../../src/providers/Adresse/Geocoder').default;

// Configs
const geocoderConfig = {
  // appId: '',
  // appCode: '',
  suggest: {
    baseUrl:  'https://api-adresse.data.gouv.fr',
    path:     '/search/',
    resource: 'q',
    options:  {
      autocomplete: 1,
      limit: 50,
      type: 'locality'
    }
  },
  geocode: {
    baseUrl:  'https://api-adresse.data.gouv.fr',
    path:     '/search/',
    resource: 'q',
    options:  {
      autocomplete: 0,
      limit: 50,
      type: 'locality'
    }
  },
  reverse: {
    baseUrl:  'https://reverse.geocoder.api.here.com',
    path:     '/reverse/',
    resource: ['lon','lat'],
  }
};

const engine = new AdresseGeocoder({
  ...geocoderConfig,
});

describe('providers.Adresse.Geocoder', function () {
  it('should work', async function () {
    return engine.geocode({
      text: '1 rue de Rivoli, Paris'
    }, (err, data) => {
      data.should.be.eql({
        'lat': 48.85551969999999,
        'lng': 2.3594045
      });
    });
  });

  it('should work with DigitRE address', async function () {
    return engine.geocode({
      text: '889 Rue de la Vieille Poste, 34000 Montpellier'
    }, (err, data) => {
      data.should.be.eql({
        'lat': 43.616889,
        'lng': 3.910288699999999
      });
    });
  });
});
