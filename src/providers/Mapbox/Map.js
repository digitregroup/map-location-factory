import ProviderMap from '../ProviderMap';
import L from 'leaflet';

class MapboxMap extends ProviderMap {
  constructor(config) {
    super();
    this.providerName = 'Mapbox';
    this.config       = config;

    // Inject css
    const link = document.createElement('link');
    link.href  = 'https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css';
    link.rel   = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  /**
   * Instanciate Leaflet map with Here tiles
   * @param {object} id DOM object id
   * @param {*} options Leaflet options
   */
  map(id, options = {}) {
    const center = options.center || [48.856614, 2.3522219000000177];
    const zoom   = options.zoom || 17;

    L.mapbox.accessToken = this.config.mapboxToken;

    var mapboxTiles = L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${L.mapbox.accessToken}`,
      {
        attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 512,
        zoomOffset: -1
      }
    );

    const map = L.map(id).addLayer(mapboxTiles).setView(center, zoom);

    return map;
  }
}

export default MapboxMap;
