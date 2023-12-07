"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _ProviderGeocoder2 = _interopRequireDefault(require("../ProviderGeocoder"));

var _crossFetch = _interopRequireDefault(require("cross-fetch"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var urlJoin = function urlJoin() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.join('/').replace(/[\/]+/g, '/').replace(/^(.+):\//, '$1://').replace(/^file:/, 'file:/').replace(/\/(\?|&|#[^!])/g, '$1').replace(/\?/g, '&').replace('&', '?');
};

var HereGeocoder =
/*#__PURE__*/
function (_ProviderGeocoder) {
  (0, _inherits2.default)(HereGeocoder, _ProviderGeocoder);

  function HereGeocoder(config) {
    var _this;

    (0, _classCallCheck2.default)(this, HereGeocoder);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(HereGeocoder).call(this));
    _this.providerName = 'Here';
    _this.config = config;
    _this.mappingAdmLevel = {
      state: 'state',
      county: 'department',
      country: 'country',
      postalCode: 'postal_code',
      city: 'city',
      district: 'district',
      street: 'route',
      houseNumber: 'street_number'
    };
    return _this;
  }

  (0, _createClass2.default)(HereGeocoder, [{
    key: "_formatResponse",
    value: function _formatResponse(json) {
      var _this2 = this;

      return json.Response.View[0].Result.map(function (result) {
        return {
          type: _this2.mappingAdmLevel[result.MatchLevel],
          id: result.Location.LocationId,
          position: {
            latitude: result.Location.DisplayPosition.Latitude,
            longitude: result.Location.DisplayPosition.Longitude,
            viewport: [[result.Location.MapView.BottomRight.Latitude, result.Location.MapView.BottomRight.Longitude], [result.Location.MapView.TopLeft.Latitude, result.Location.MapView.TopLeft.Longitude]]
          },
          address: {
            label: result.Location.Address.Label,
            district: result.Location.Address.District,
            city: result.Location.Address.City,
            postal_code: result.Location.Address.PostalCode,
            department: result.Location.Address.County,
            state: result.Location.Address.State,
            country: result.Location.Address.Country,
            route: result.Location.Address.Street,
            street_number: result.Location.Address.HouseNumber
          }
        };
      });
    }
  }, {
    key: "_getUrl",
    value: function _getUrl(type) {
      return this.config[type].baseUrl + this.config[type].path + this.config[type].resource + '.json?';
    }
  }, {
    key: "_buildParameters",
    value: function _buildParameters(options) {
      var params = '';

      for (var attribute in options) {
        if (options[attribute] !== null) params += '&' + attribute + '=' + encodeURIComponent(options[attribute]);
      }

      return params;
    }
  }, {
    key: "suggest",
    value: function () {
      var _suggest = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(query, callback) {
        var _this3 = this;

        var url, params, buildParametersOptions, response, json, domTomCountryCodes, suggestions;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (query) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                url = this._getUrl('suggest');
                params = 'query=' + encodeURIComponent(query) + '&app_id=' + this.config.appId + '&app_code=' + this.config.appCode;

                if (this.config.suggest && this.config.suggest.options) {
                  buildParametersOptions = _objectSpread({}, this.config.suggest.options); // Check if the query is a number

                  if (query.trim().match(/^[0-9]*$/) !== null) {
                    // Force result type to postal code if the query is a number
                    buildParametersOptions.resultType = 'postalCode';
                  }

                  params += this._buildParameters(buildParametersOptions);
                }

                _context.next = 7;
                return (0, _crossFetch.default)(url + params);

              case 7:
                response = _context.sent;
                _context.next = 10;
                return response.json();

              case 10:
                json = _context.sent;
                domTomCountryCodes = ['GLP', 'GUF', 'MTQ', 'REU', 'MYT', 'BLM', 'MAF', 'NCL', 'PYF', 'SPM', 'ATF', 'WLF'];
                suggestions = json.suggestions && json.suggestions // Remove county and state for DOM-TOM
                // (avoids Guadeloupe, Guadeloupe, Guadeloupe)
                .filter(function (suggest) {
                  return domTomCountryCodes.includes(suggest.countryCode) ? !['county', 'state'].includes(suggest.matchLevel) : true;
                }) // Add department codes before department names
                // (avoid Corrèze-city mistaken for Corrèze-dpt)
                .reduce(function (res, next) {
                  if (next.matchLevel !== 'county') {
                    return [].concat((0, _toConsumableArray2.default)(res), [next]);
                  }

                  var departmentCode = Object.entries(_this3.departmentDatas).find(function (_ref) {
                    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
                        v = _ref2[1];

                    return v === next.address.county;
                  });

                  if (!departmentCode) {
                    return [].concat((0, _toConsumableArray2.default)(res), [next]);
                  }

                  var labelParts = next.label.split(', '); // France, Corrèze => France, (19) Corrèze

                  var newLabel = labelParts.slice(0, -1).concat(['(' + departmentCode[0] + ') ' + labelParts.pop(-1)]).join(', ');
                  return [].concat((0, _toConsumableArray2.default)(res), [_objectSpread({}, next, {
                    label: newLabel
                  })]);
                }, []) // Format response (inverse order label)
                .map(function (suggest) {
                  return {
                    label: suggest.label.split(', ').reverse().join(', '),
                    id: suggest.locationId,
                    type: _this3.mappingAdmLevel[suggest.matchLevel]
                  };
                });
                callback(suggestions || null, response.status);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function suggest(_x, _x2) {
        return _suggest.apply(this, arguments);
      }

      return suggest;
    }()
  }, {
    key: "reverse",
    value: function () {
      var _reverse = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(searchRequest, callback) {
        var url, params, response, paramsURLSearchParams, _url, json, results;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (searchRequest) {
                  _context2.next = 3;
                  break;
                }

                callback(null, 400);
                return _context2.abrupt("return");

              case 3:
                url = this._getUrl('reverse');

                if (!(searchRequest.latitude && searchRequest.longitude)) {
                  _context2.next = 8;
                  break;
                }

                params = 'prox=' + searchRequest.latitude + ',' + searchRequest.longitude + ',100';
                _context2.next = 10;
                break;

              case 8:
                callback(null, 400);
                return _context2.abrupt("return");

              case 10:
                params += '&app_id=' + this.config.appId + '&app_code=' + this.config.appCode + '&mode=retrieveAddresses';

                if (this.config.reverse && this.config.reverse.options) {
                  params += this._buildParameters(this.config.reverse.options);
                }

                response = {};

                if (!this.config.cacheEnable) {
                  _context2.next = 24;
                  break;
                }

                if (!(!this.config.cacheUrl || !this.config.cacheKey)) {
                  _context2.next = 16;
                  break;
                }

                throw new Error("Missing parameter cacheUrl || cacheKey");

              case 16:
                paramsURLSearchParams = new URLSearchParams(params);
                params = Object.fromEntries(paramsURLSearchParams.entries());
                _url = urlJoin(this.config.cacheUrl, "reverse-geocoder");
                _context2.next = 21;
                return (0, _crossFetch.default)(_url, {
                  method: "post",
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.cacheKey
                  },
                  body: JSON.stringify({
                    "params": params
                  })
                });

              case 21:
                response = _context2.sent;
                _context2.next = 27;
                break;

              case 24:
                _context2.next = 26;
                return (0, _crossFetch.default)(url + params);

              case 26:
                response = _context2.sent;

              case 27:
                _context2.next = 29;
                return response.json();

              case 29:
                json = _context2.sent;
                results = [];

                if (json && json.Response && json.Response.View && json.Response.View.length) {
                  results = this._formatResponse(json);
                }

                callback(results, response.status);

              case 33:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function reverse(_x3, _x4) {
        return _reverse.apply(this, arguments);
      }

      return reverse;
    }()
  }, {
    key: "geocode",
    value: function () {
      var _geocode = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(searchRequest, callback) {
        var url, params, dptCode, response, paramsURLSearchParams, _url2, json, results;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (searchRequest) {
                  _context3.next = 3;
                  break;
                }

                callback(null, 400);
                return _context3.abrupt("return");

              case 3:
                url = this._getUrl('geocode');

                if (searchRequest.id) {
                  params = 'locationid=' + searchRequest.id;
                } else if (searchRequest.text) {
                  // (XX) XXXX => Match departments
                  dptCode = searchRequest.text.match(/^\(([\d]+)\)/);

                  if (null !== dptCode) {
                    // Match exact department (called "county" in Here)
                    params = 'county=' + encodeURIComponent(this.departmentDatas[dptCode[1]]);
                  } else {
                    // Match text
                    if (searchRequest.text.match(/^Bretagne(?:, France)?/i)) {
                      // Specific case for Bretagne
                      params = 'state=' + encodeURIComponent('Bretagne');
                    } else if (searchRequest.text.match(/^Lille(?:, France)?/i)) {
                      // Specific case for "Lille, France", returns L'ille (district)
                      params = 'city=' + encodeURIComponent('Lille');
                    } else if (searchRequest.text.match(/^Nangis(?:, France)?/i)) {
                      // Specific case for "Nangis, France", returns Nangis (district)
                      params = 'city=' + encodeURIComponent('Nangis');
                    } else if (searchRequest.text.match(/-france$/i) && !searchRequest.text.match(/-de-france$/i)) {
                      // DOM-TOM countries appear as 'Guyanne-France', 'X-France', ... But not for "Ile-de-france"
                      params = 'searchtext=' + encodeURIComponent(searchRequest.text.replace(/-france$/i, ''));
                    } else {
                      params = 'searchtext=' + encodeURIComponent(searchRequest.text);
                    }
                  }
                } else {
                  if (searchRequest.label) {
                    if (searchRequest.label == "Vienne") {
                      // Specific case for "Vienne" department name
                      params = 'searchtext=' + encodeURIComponent('Vienne, Nouvelle-Aquitaine');
                    } else {
                      params = 'searchtext=' + encodeURIComponent(searchRequest.label);
                    }
                  }
                }

                if (params) {
                  _context3.next = 8;
                  break;
                }

                callback(null, 400);
                return _context3.abrupt("return");

              case 8:
                params += '&app_id=' + this.config.appId + '&app_code=' + this.config.appCode;

                if (this.config.geocode && this.config.geocode.options) {
                  params += this._buildParameters(this.config.geocode.options);
                }

                response = {};

                if (!this.config.cacheEnable) {
                  _context3.next = 22;
                  break;
                }

                if (!(!this.config.cacheUrl || !this.config.cacheKey)) {
                  _context3.next = 14;
                  break;
                }

                throw new Error("Missing parameter cacheUrl || cacheKey");

              case 14:
                paramsURLSearchParams = new URLSearchParams(params);
                params = Object.fromEntries(paramsURLSearchParams.entries());
                _url2 = urlJoin(this.config.cacheUrl, "geocoder");
                _context3.next = 19;
                return (0, _crossFetch.default)(_url2, {
                  method: "post",
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.cacheKey
                  },
                  body: JSON.stringify({
                    "params": params
                  })
                });

              case 19:
                response = _context3.sent;
                _context3.next = 25;
                break;

              case 22:
                _context3.next = 24;
                return (0, _crossFetch.default)(url + params);

              case 24:
                response = _context3.sent;

              case 25:
                _context3.next = 27;
                return response.json();

              case 27:
                json = _context3.sent;
                results = [];

                if (json && json.Response && json.Response.View && json.Response.View.length) {
                  results = this._formatResponse(json);
                }

                callback(results, response.status);

              case 31:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function geocode(_x5, _x6) {
        return _geocode.apply(this, arguments);
      }

      return geocode;
    }()
  }, {
    key: "autocompleteAdapter",
    value: function autocompleteAdapter(params, callback) {
      var _this4 = this;

      var returnSuggestions = function returnSuggestions(predictions, status) {
        predictions = predictions || [];
        var data = {
          results: []
        };

        if (status !== 200 || !predictions) {
          callback(data);
        } // Get department by code


        var deptCode = params.term.toUpperCase();
        var departementName = _this4.departmentDatas[deptCode];

        if (departementName) {
          data.results.push({
            id: params.term,
            text: '(' + deptCode + ') ' + departementName,
            type: _this4.mappingAdmLevel.county
          });
        }

        for (var i = 0; i < predictions.length; i++) {
          data.results.push({
            id: predictions[i].id,
            text: predictions[i].label,
            type: predictions[i].type
          });
        }

        callback(data);
      };

      if (params.term && params.term !== '') {
        this.suggest(params.term, returnSuggestions);
      } else {
        var data = {
          results: []
        };
        callback(data);
      }
    }
  }]);
  return HereGeocoder;
}(_ProviderGeocoder2.default);

var _default = HereGeocoder;
exports.default = _default;