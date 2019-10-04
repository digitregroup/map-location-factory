require('jsdom-global')();
require('chai').should();

require('../../../index');

const HereGeocoder = require('../../../src/providers/Here/Geocoder').default;

// Default config for HERE
// DOM: FRA,GLP,GUF,MTQ,REU,MYT
// TOM: BLM,MAF,NCL,PYF,SPM,ATF,WLF
const defaultCountries = 'FRA,GLP,GUF,MTQ,REU,MYT,BLM,MAF,NCL,PYF,SPM,ATF,WLF';
const defaultLanguage  = 'FR';

// Configs
const geocoderConfig = {
  // appId: '',
  // appCode: '',
  suggest: {
    baseUrl:  'https://autocomplete.geocoder.api.here.com',
    path:     '/6.2/',
    resource: 'suggest',
    options:  {
      country:    defaultCountries,
      language:   defaultLanguage,
      maxresults: 50,
      resultType: 'areas'
    }
  },
  geocode: {
    baseUrl:  'https://geocoder.api.here.com',
    path:     '/6.2/',
    resource: 'geocode',
    options:  {
      country:    defaultCountries,
      language:   defaultLanguage,
      maxresults: 5
    }
  },
  reverse: {
    baseUrl:  'https://reverse.geocoder.api.here.com',
    path:     '/6.2/',
    resource: 'reversegeocode',
    options:  {
      language:   defaultLanguage,
      maxresults: 5
    }
  }
};

const engine = new HereGeocoder({
  ...geocoderConfig,
  appId:   process.env.appId,
  appCode: process.env.appCode,
});

describe('providers.Here.Geocoder', function () {
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
