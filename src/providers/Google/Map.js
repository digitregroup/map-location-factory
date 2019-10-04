import ProviderMap from '../ProviderMap';
import L from 'leaflet';
import addGoogleTileLayer from '../../../vendors/leaflet.gridlayer.googlemutant';

class GoogleMap extends ProviderMap {
  constructor(config) {
    super();
    this.providerName = 'Google';
    this.config       = config;
  }

  /**
   * Instanciate Leaflet map with Google tiles
   * @param {object} id DOM object id
   * @param {*} options Leaflet options
   */
  map(id, options = {}) {
    const center = options.center || [48.856614, 2.3522219000000177];
    const zoom   = options.zoom || 17;

    const googleL = addGoogleTileLayer(L);

    const map   = googleL.map(id).setView(center, zoom);
    const roads = googleL.gridLayer.googleMutant({
      type: 'roadmap'
    });

    map.addLayer(roads);

    return map;
  }
}

export default GoogleMap;
