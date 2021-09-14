"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _ProviderGeocoder2 = _interopRequireDefault(require("../ProviderGeocoder"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var GoogleGeocoder = /*#__PURE__*/function (_ProviderGeocoder) {
  (0, _inherits2.default)(GoogleGeocoder, _ProviderGeocoder);

  var _super = _createSuper(GoogleGeocoder);

  function GoogleGeocoder(config) {
    var _this;

    (0, _classCallCheck2.default)(this, GoogleGeocoder);
    _this = _super.call(this); // Provider name

    _this.providerName = 'Google'; // Loaded configuration

    _this.config = config; // Mapping of administrative level Google <=> lib

    _this.mappingAdmLevel = {
      administrative_area_level_1: 'state',
      administrative_area_level_2: 'department',
      country: 'country',
      country_code: 'country_code',
      postal_code: 'postal_code',
      locality: 'city',
      route: 'route',
      neighborhood: 'district',
      street_number: 'street_number',
      street_address: 'street_number'
    };
    return _this;
  }
  /**
   * Format administrative level
   * @param {Array} admLevels
   */


  (0, _createClass2.default)(GoogleGeocoder, [{
    key: "_formatAdministativeLevel",
    value: function _formatAdministativeLevel(admLevels) {
      var _this2 = this;

      var formated = JSON.parse(JSON.stringify(this.administativeLevel));
      admLevels.forEach(function (admLevel) {
        var mappedType = _this2.mappingAdmLevel[admLevel.types[0]];

        if (mappedType) {
          formated[mappedType] = admLevel.long_name;

          if (mappedType === 'country') {
            formated['country_code'] = admLevel.short_name;
          }
        }
      });
      return formated;
    }
    /**
     * Format output response
     * @param {Array} results
     */

  }, {
    key: "_formatResponse",
    value: function _formatResponse(results) {
      var _this3 = this;

      return results.filter(function (r) {
        return _this3.mappingAdmLevel[r.types[0]];
      }).map(function (result) {
        var formatedAdmin = _this3._formatAdministativeLevel(result.address_components);

        var address = Object.assign({
          label: result.formatted_address
        }, formatedAdmin);
        return {
          type: _this3.mappingAdmLevel[result.types[0]],
          id: result.place_id,
          position: {
            latitude: result.geometry.location.lat(),
            longitude: result.geometry.location.lng(),
            viewport: [[result.geometry.viewport.getSouthWest().lat(), result.geometry.viewport.getSouthWest().lng()], [result.geometry.viewport.getNorthEast().lat(), result.geometry.viewport.getNorthEast().lng()]]
          },
          address: address
        };
      });
    }
    /**
     * Suggestion for autocomplete
     * @param {string} query
     * @param {function} callback
     */

  }, {
    key: "suggest",
    value: function suggest(query, callback) {
      var _this4 = this;

      var service = new google.maps.places.AutocompleteService();
      var options = this.config.options;
      options.input = query || ' ';
      service.getPlacePredictions(options, function (predictions, status) {
        var formatedPrediction = predictions ? predictions.map(function (prediction) {
          return {
            label: prediction.description,
            id: prediction.place_id,
            type: _this4.mappingAdmLevel[prediction.types[0]]
          };
        }) : null;
        callback(formatedPrediction, status === google.maps.places.PlacesServiceStatus.OK || google.maps.places.PlacesServiceStatus.ZERO_RESULTS ? 200 : 400);
      });
    }
    /**
     * Retrieve address from location
     * @param {object} searchRequest {latitude: ..., longitude: ...}
     * @param {function} callback
     */

  }, {
    key: "reverse",
    value: function reverse(searchRequest, callback) {
      var _this5 = this;

      var geocoder = new google.maps.Geocoder();
      var params = {};

      if (searchRequest.latitude && searchRequest.longitude) {
        params.location = {
          lat: parseFloat(searchRequest.latitude),
          lng: parseFloat(searchRequest.longitude)
        };
      } else {
        callback(null, 400);
        return;
      }

      geocoder.geocode(params, function (results, status) {
        var formatedResults = _this5._formatResponse(results);

        callback(formatedResults, 200);
      });
    }
    /**
     * Retrieve position from address
     * @param {object} searchRequest {id:...} or {label:...}
     * @param {function} callback
     */

  }, {
    key: "geocode",
    value: function geocode(searchRequest, callback) {
      var _this6 = this;

      var geocoder = new google.maps.Geocoder();
      var params = {};
      if (searchRequest.id) params.placeId = searchRequest.id;else if (searchRequest.label) params.address = searchRequest.label;else if (searchRequest.text) params.address = searchRequest.text; // Test empty params object

      if (Object.entries(params).length === 0 && params.constructor === Object) {
        callback(null, 400);
      }

      geocoder.geocode(params, function (results, status) {
        var formatedResults = _this6._formatResponse(results);

        callback(formatedResults, 200);
      });
    }
    /**
     * Adapter for select2
     * @param {object} params
     * @param {function} callback
     */

  }, {
    key: "autocompleteAdapter",
    value: function autocompleteAdapter(params, callback) {
      var _this7 = this;

      var returnSuggestions = function returnSuggestions(predictions, status) {
        predictions = predictions || [];
        var data = {
          results: []
        };

        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          callback(data);
        } // Get department by code


        var deptCode = params.term.toUpperCase();
        var departementName = _this7.departmentDatas[deptCode];

        if (departementName) {
          // Because "Rhone" give the river with Geocoder, why give it the place id
          data.results.push({
            id: params.term === 69 ? _this7.hardDefinedPlaceIds['rhone'] : params.term,
            text: '(' + deptCode + ') ' + departementName
          });
        }

        for (var i = 0; i < predictions.length; i++) {
          data.results.push({
            id: predictions[i].id,
            text: predictions[i].label
          });
        }

        data.results.push({
          id: ' ',
          text: 'Powered by Google',
          disabled: true
        });
        callback(data);
      };

      if (params.term && params.term !== '') {
        this.suggest(params.term, returnSuggestions);
      } else {
        var data = {
          results: []
        };
        data.results.push({
          id: ' ',
          text: 'Powered by Google',
          disabled: true
        });
        callback(data);
      }
    }
  }]);
  return GoogleGeocoder;
}(_ProviderGeocoder2.default);

var _default = GoogleGeocoder;
exports.default = _default;