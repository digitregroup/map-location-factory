"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GeocoderEngine", {
  enumerable: true,
  get: function get() {
    return _GeocoderEngine.default;
  }
});
Object.defineProperty(exports, "MapEngine", {
  enumerable: true,
  get: function get() {
    return _MapEngine.default;
  }
});

var _GeocoderEngine = _interopRequireDefault(require("./lib/GeocoderEngine"));

var _MapEngine = _interopRequireDefault(require("./lib/MapEngine"));

/**
 * This librairy give unified output / input / method name for Geocoding and mapping
 *
 * To add anaother provider.
 * - Create new directory to ./providers
 * - Create 2 files in this directory (1 for map and 1 for geocoder) that extends abstract class "ProviderGeocoder" or "ProviderMap"
 * - Implement methodes
 * - Add calss names to "geocoderClasses" and "mapClasses" bolow
 */
// ES6
// Front
if (window) {
  window.GeocoderEngine = _GeocoderEngine.default;
  window.MapEngine = _MapEngine.default;
}