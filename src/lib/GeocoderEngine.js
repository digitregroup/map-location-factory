import _ from "lodash";

import HereGeocoder from "../providers/Here/Geocoder";
import GoogleGeocoder from "../providers/Google/Geocoder";
import MapboxGeocoder from "../providers/Mapbox/Geocoder";

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
GeocoderEngine.TYPE_MAPBOX = 'Mapbox';

const geocoderClasses = {
  [GeocoderEngine.TYPE_HERE]:   HereGeocoder,
  [GeocoderEngine.TYPE_GOOGLE]: GoogleGeocoder,
  [GeocoderEngine.TYPE_MAPBOX]: MapboxGeocoder,
};

// Default config for HERE
// DOM: FRA,GLP,GUF,MTQ,REU,MYT
// TOM: BLM,MAF,NCL,PYF,SPM,ATF,WLF
const defaultCountries = 'FRA,GLP,GUF,MTQ,REU,MYT,BLM,MAF,NCL,PYF,SPM,ATF,WLF';
const defaultLanguage  = 'FR';

// Configs
const geocoderConfig = {
  [GeocoderEngine.TYPE_HERE]:   {
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
