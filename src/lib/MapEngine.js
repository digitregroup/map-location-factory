import HereMap from "../providers/Here/Map";
import GoogleMap from "../providers/Google/Map";

/**
 * Load Map class according to type and config
 */
class MapEngine {
  constructor(type, configOptions) {
    return new mapClasses[type](configOptions)
  }
}

MapEngine.TYPE_HERE   = 'Here';
MapEngine.TYPE_GOOGLE = 'Google';

const mapClasses = {
  [MapEngine.TYPE_HERE]:   HereMap,
  [MapEngine.TYPE_GOOGLE]: GoogleMap
};

export default MapEngine;
