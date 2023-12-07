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

var _leafletTilelayerHere = _interopRequireDefault(require("../../../vendors/Leaflet.TileLayer.HERE/leaflet-tilelayer-here"));

var HereMap =
/*#__PURE__*/
function (_ProviderMap) {
  (0, _inherits2.default)(HereMap, _ProviderMap);

  function HereMap(config) {
    var _this;

    (0, _classCallCheck2.default)(this, HereMap);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(HereMap).call(this));
    _this.providerName = 'Here';
    _this.config = config;
    return _this;
  }
  /**
   * Instanciate Leaflet map with Here tiles
   * @param {object} id DOM object id
   * @param {*} options Leaflet options
   */


  (0, _createClass2.default)(HereMap, [{
    key: "map",
    value: function map(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var center = options.center || [48.856614, 2.3522219000000177];
      var zoom = options.zoom || 17;
      var scheme = options.scheme || 'normal.day';
      var hereL = (0, _leafletTilelayerHere.default)(_leaflet.default);
      var map = hereL.map(id).setView(center, zoom);
      var here = hereL.tileLayer.here({
        appId: this.config.appId,
        appCode: this.config.appCode,
        scheme: scheme
      });
      map.addLayer(here);
      return map;
    }
  }]);
  return HereMap;
}(_ProviderMap2.default);

var _default = HereMap;
exports.default = _default;