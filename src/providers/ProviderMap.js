/**
 * In this class you can write all the map methods
 * Spécific provider just load spécific tiles source
 *
 * You can choose to manipulate directly leaflet or write methods here
 */

import L from 'leaflet';

class ProviderMap {
  constructor() {
    if (this.constructor === ProviderMap) {
      throw new TypeError('Abstract class "ProviderMap" cannot be instantiated directly');
    }

    // Inject css
    const link = document.createElement("link");
    link.href  = "https://unpkg.com/leaflet@1.4.0/dist/leaflet.css";
    link.rel   = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    // Layer for markers
    this.markerGroup;

    // Set icon marker source
    L.Marker.prototype.options.icon = L.icon({
      iconUrl:    'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
      shadowUrl:  'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png',
      iconSize:   [25, 41],
      iconAnchor: [12, 41]
    });
  }

  /**
   * Add marker to map (not to a layer) so if you want to remove it you have to retrive it
   * @param {Array} position [lat,long]
   * @param {Object} map Leaflet map instance
   * @param {Object} options Leaflet options
   */
  addMarker(position, map, options = {}) {
    return L.marker(position, options).addTo(map);
  }

  /**
   * Remove marker from the map
   * @param {*} marker Leaflet marker
   * @param {*} map Leaflet map instance
   */
  removeMarker(marker, map) {
    map.removeLayer(marker);
  }

  /**
   * Add marker to the markerGroup layer (and create it if not exist)
   * @param {Array} position [lat,long]
   * @param {Object} map Leaflet map instance
   * @param {Object} options Leaflet options
   */
  addToMarkerGroup(position, map, options = {}) {
    if (!this.markerGroup) {
      this.markerGroup = new L.featureGroup().addTo(map);
    }
    this.markerGroup.addLayer(L.marker(position, options));
  }

  /**
   * Fit map to markers (all markers are showed on the minimal pan/zoom)
   * @param {Object} map Leaflet map instance
   */
  fitMarkers(map) {
    if (this.markerGroup) {
      map.fitBounds(this.markerGroup.getBounds());
    }
  }

  /**
   * Remove all markers from the markerGroup layer
   */
  removeAllMarkers() {
    if (this.markerGroup) this.markerGroup.clearLayers();
  }

  /**
   * Set handler on each markers of the markerGroup layer
   * @param {Function} handler
   */
  markersBindClick(handler) {
    if (this.markerGroup) {
      this.markerGroup.eachLayer(function (layer) {
        layer.on('click', handler);
      });
    }
  }
}

export default ProviderMap;
