"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _ProviderMap2 = _interopRequireDefault(require("../ProviderMap"));

var _leaflet = _interopRequireDefault(require("leaflet"));

var _leafletGridlayer = _interopRequireDefault(require("../../../vendors/leaflet.gridlayer.googlemutant"));

var GoogleMap =
/*#__PURE__*/
function (_ProviderMap) {
  (0, _inherits2.default)(GoogleMap, _ProviderMap);

  function GoogleMap(config) {
    var _this;

    (0, _classCallCheck2.default)(this, GoogleMap);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(GoogleMap).call(this));
    _this.providerName = 'Google';
    _this.config = config;
    return _this;
  }
  /**
   * Instanciate Leaflet map with Google tiles
   * @param {object} id DOM object id
   * @param {*} options Leaflet options
   */


  (0, _createClass2.default)(GoogleMap, [{
    key: "map",
    value: function map(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var center = options.center || [48.856614, 2.3522219000000177];
      var zoom = options.zoom || 17;
      var googleL = (0, _leafletGridlayer.default)(_leaflet.default);
      var map = googleL.map(id).setView(center, zoom);
      var roads = googleL.gridLayer.googleMutant({
        type: 'roadmap'
      });
      map.addLayer(roads);
      return map;
    }
  }]);
  return GoogleMap;
}(_ProviderMap2.default);

var _default = GoogleMap;
exports.default = _default;