/**
 * This librairy give unified output / input / method name for Geocoding and mapping
 *
 * To add anaother provider.
 * - Create new directory to ./providers
 * - Create 2 files in this directory (1 for map and 1 for geocoder) that extends abstract class "ProviderGeocoder" or "ProviderMap"
 * - Implement methodes
 * - Add calss names to "geocoderClasses" and "mapClasses" bolow
 */
import GeocoderEngine from './lib/GeocoderEngine';
import MapEngine from './lib/MapEngine';

// ES6
export {
  GeocoderEngine,
  MapEngine
};

// Front
if (window) {
  window.GeocoderEngine = GeocoderEngine;
  window.MapEngine      = MapEngine;
}
