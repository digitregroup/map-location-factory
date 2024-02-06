"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _leaflet = _interopRequireDefault(require("leaflet"));

/**
 * In this class you can write all the map methods
 * Spécific provider just load spécific tiles source
 *
 * You can choose to manipulate directly leaflet or write methods here
 */
var ProviderMap =
/*#__PURE__*/
function () {
  function ProviderMap() {
    (0, _classCallCheck2.default)(this, ProviderMap);

    if (this.constructor === ProviderMap) {
      throw new TypeError('Abstract class "ProviderMap" cannot be instantiated directly');
    } // Inject css


    var link = document.createElement("link");
    link.href = "https://unpkg.com/leaflet@1.4.0/dist/leaflet.css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link); // Layer for markers

    this.markerGroup; // Set icon marker source

    _leaflet.default.Marker.prototype.options.icon = _leaflet.default.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
  }
  /**
   * Add marker to map (not to a layer) so if you want to remove it you have to retrive it
   * @param {Array} position [lat,long]
   * @param {Object} map Leaflet map instance
   * @param {Object} options Leaflet options
   */


  (0, _createClass2.default)(ProviderMap, [{
    key: "addMarker",
    value: function addMarker(position, map) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return _leaflet.default.marker(position, options).addTo(map);
    }
    /**
     * Remove marker from the map
     * @param {*} marker Leaflet marker
     * @param {*} map Leaflet map instance
     */

  }, {
    key: "removeMarker",
    value: function removeMarker(marker, map) {
      map.removeLayer(marker);
    }
    /**
     * Add marker to the markerGroup layer (and create it if not exist)
     * @param {Array} position [lat,long]
     * @param {Object} map Leaflet map instance
     * @param {Object} options Leaflet options
     */

  }, {
    key: "addToMarkerGroup",
    value: function addToMarkerGroup(position, map) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!this.markerGroup) {
        this.markerGroup = new _leaflet.default.featureGroup().addTo(map);
      }

      this.markerGroup.addLayer(_leaflet.default.marker(position, options));
    }
    /**
     * Fit map to markers (all markers are showed on the minimal pan/zoom)
     * @param {Object} map Leaflet map instance
     */

  }, {
    key: "fitMarkers",
    value: function fitMarkers(map) {
      if (this.markerGroup) {
        map.fitBounds(this.markerGroup.getBounds());
      }
    }
    /**
     * Remove all markers from the markerGroup layer
     */

  }, {
    key: "removeAllMarkers",
    value: function removeAllMarkers() {
      if (this.markerGroup) this.markerGroup.clearLayers();
    }
    /**
     * Set handler on each markers of the markerGroup layer
     * @param {Function} handler
     */

  }, {
    key: "markersBindClick",
    value: function markersBindClick(handler) {
      if (this.markerGroup) {
        this.markerGroup.eachLayer(function (layer) {
          layer.on('click', handler);
        });
      }
    }
  }]);
  return ProviderMap;
}();

var _default = ProviderMap;
exports.default = _default;