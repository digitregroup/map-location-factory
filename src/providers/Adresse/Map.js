import ProviderMap from '../ProviderMap';
import L from 'leaflet';
import addHereTileLayer from '../../../vendors/Leaflet.TileLayer.HERE/leaflet-tilelayer-here';

class HereMap extends ProviderMap {
  constructor(config) {
    super();
    this.providerName = 'Here';
    this.config       = config;
  }

  /**
   * Instanciate Leaflet map with Here tiles
   * @param {object} id DOM object id
   * @param {*} options Leaflet options
   */
  map(id, options = {}) {
    const center = options.center || [48.856614, 2.3522219000000177];
    const zoom   = options.zoom || 17;
    const scheme = options.scheme || 'normal.day';

    const hereL = addHereTileLayer(L);

    const map  = hereL.map(id).setView(center, zoom);
    const here = hereL.tileLayer.here({appId: this.config.appId, appCode: this.config.appCode, scheme: scheme});

    map.addLayer(here);

    return map;
  }
}

export default HereMap;
