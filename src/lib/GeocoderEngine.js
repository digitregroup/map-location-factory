import _ from "lodash";

import HereGeocoder from "../providers/Here/Geocoder";
import GoogleGeocoder from "../providers/Google/Geocoder";

/**
 * Load Geocoder class according to type and config
 */
class GeocoderEngine {
  constructor(type, configOptions = {}) {
    return new geocoderClasses[type](_.defaultsDeep(configOptions, geocoderConfig[type]));
  }
}

GeocoderEngine.TYPE_GOOGLE = 'Google';
GeocoderEngine.TYPE_HERE   = 'Here';

const geocoderClasses = {
  [GeocoderEngine.TYPE_HERE]:   HereGeocoder,
  [GeocoderEngine.TYPE_GOOGLE]: GoogleGeocoder
};

// Default config for HERE
// DOM: FRA,GLP,GUF,MTQ,REU,MYT
// TOM: BLM,MAF,NCL,PYF,SPM,ATF,WLF
const defaultCountries = 'FRA,GLP,GUF,MTQ,REU,MYT,BLM,MAF,NCL,PYF,SPM,ATF,WLF';
const defaultLanguage  = 'fr';

// Configs
const geocoderConfig = {
  [GeocoderEngine.TYPE_HERE]:   {
    suggest: {
      baseUrl:  'https://autocomplete.search.hereapi.com/v1/',
      path:     '',
      resource: 'autocomplete',
      options:  {
        limit: 10,
        lang: defaultLanguage,
        country: defaultCountries,
      }
    },
    lookup: {
      baseUrl: 'https://lookup.search.hereapi.com/v1/',
      path: '',
      resource: 'lookup',
    },
    geocode: {
      baseUrl:  'https://geocode.search.hereapi.com/v1/',
      path:     '',
      resource: 'geocode',
      options:  {
        limit: 5,
        lang: defaultLanguage,
        country: defaultCountries,
      }
    },
    reverse: {
      baseUrl:  'https://revgeocode.search.hereapi.com/v1/',
      path:     '',
      resource: 'revgeocode',
      options:  {
        limit: 5,
        lang: defaultLanguage,
      }
    }
  },
  [GeocoderEngine.TYPE_GOOGLE]: {
    options: {
      types:                 [
        '(regions)'
      ],
      componentRestrictions: {
        country: ['fr', 'mq', 'gp', 'gf', 're', 'yt']
      }
    }
  }
};

export default GeocoderEngine;
