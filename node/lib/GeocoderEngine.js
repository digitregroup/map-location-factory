"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defaultsDeep2 = _interopRequireDefault(require("lodash/defaultsDeep"));

var _Geocoder = _interopRequireDefault(require("../providers/Here/Geocoder"));

var _Geocoder2 = _interopRequireDefault(require("../providers/Google/Geocoder"));

var _geocoderClasses, _geocoderConfig;

/**
 * Load Geocoder class according to type and config
 */
var GeocoderEngine = function GeocoderEngine(type) {
  var configOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _classCallCheck2.default)(this, GeocoderEngine);
  return new geocoderClasses[type]((0, _defaultsDeep2.default)(configOptions, geocoderConfig[type]));
};

GeocoderEngine.TYPE_GOOGLE = 'Google';
GeocoderEngine.TYPE_HERE = 'Here';
var geocoderClasses = (_geocoderClasses = {}, (0, _defineProperty2.default)(_geocoderClasses, GeocoderEngine.TYPE_HERE, _Geocoder.default), (0, _defineProperty2.default)(_geocoderClasses, GeocoderEngine.TYPE_GOOGLE, _Geocoder2.default), _geocoderClasses); // Default config for HERE
// DOM: FRA,GLP,GUF,MTQ,REU,MYT
// TOM: BLM,MAF,NCL,PYF,SPM,ATF,WLF

var defaultCountries = 'DEU,FRA,GLP,GUF,MTQ,REU,MYT,BLM,MAF,NCL,PYF,SPM,ATF,WLF';
var defaultLanguage = 'FR'; // Configs

var geocoderConfig = (_geocoderConfig = {}, (0, _defineProperty2.default)(_geocoderConfig, GeocoderEngine.TYPE_HERE, {
  // appId: '',
  // appCode: '',
  suggest: {
    baseUrl: 'https://autocomplete.geocoder.api.here.com',
    path: '/6.2/',
    resource: 'suggest',
    options: {
      country: defaultCountries,
      language: defaultLanguage,
      maxresults: 50,
      resultType: 'areas'
    }
  },
  geocode: {
    baseUrl: 'https://geocoder.api.here.com',
    path: '/6.2/',
    resource: 'geocode',
    options: {
      country: defaultCountries,
      language: defaultLanguage,
      maxresults: 5
    }
  },
  reverse: {
    baseUrl: 'https://reverse.geocoder.api.here.com',
    path: '/6.2/',
    resource: 'reversegeocode',
    options: {
      language: defaultLanguage,
      maxresults: 5
    }
  }
}), (0, _defineProperty2.default)(_geocoderConfig, GeocoderEngine.TYPE_GOOGLE, {
  options: {
    types: ['(regions)'],
    componentRestrictions: {
      country: ['fr', 'mq', 'gp', 'gf', 're', 'yt']
    }
  }
}), _geocoderConfig);
var _default = GeocoderEngine;
exports.default = _default;
