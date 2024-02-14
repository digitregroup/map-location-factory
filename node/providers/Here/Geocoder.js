"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

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

var domTomCountryCodes = ['GLP', 'GUF', 'MTQ', 'REU', 'MYT', 'BLM', 'MAF', 'NCL', 'PYF', 'SPM', 'ATF', 'WLF'];

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
      subdistrict: 'district',
      street: 'route',
      houseNumber: 'street_number',
      locality: 'city'
    };
    _this.lookupUrl = 'https://lookup.search.hereapi.com/v1/lookup';
    return _this;
  }

  (0, _createClass2.default)(HereGeocoder, [{
    key: "_formatResponse",
    value: function _formatResponse(json) {
      var _this2 = this;

      return json.items.map(function (result) {
        return {
          type: _this2._getType(result),
          id: result.id,
          position: {
            latitude: result.position.lat,
            longitude: result.position.lng,
            viewport: [[result.position.lat, result.position.lng], [result.position.lat, result.position.lng]]
          },
          address: {
            label: result.address.label,
            district: result.address.district,
            city: result.address.city,
            postal_code: result.address.postalCode,
            department: result.address.postalCode ? _this2.departmentDatas[result.address.postalCode.substring(0, 2)] : null,
            state: result.address.state,
            country: result.address.countryCode,
            route: result.address.street,
            street_number: result.address.houseNumber,
            county: result.address.county
          }
        };
      });
    }
  }, {
    key: "_getUrl",
    value: function _getUrl(type) {
      return this.config[type].baseUrl + this.config[type].resource + '?';
    }
    /**
     *
     * @param suggestion
     * @returns {*} type
     */

  }, {
    key: "_getType",
    value: function _getType(suggestion) {
      var type;

      switch (suggestion.resultType) {
        case 'county':
          type = suggestion.countyType;
          break;

        case 'locality':
          type = suggestion.localityType;
          break;

        case 'administrativeArea':
          type = suggestion.administrativeAreaType;
          break;

        case 'houseNumber':
          type = 'houseNumber';
          break;

        default:
          type = 'houseNumber';
          break;
      }

      return this.mappingAdmLevel[type];
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

        var url, params, buildParametersOptions, countryCodes, response, json, suggestions;
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
                params = 'q=' + encodeURIComponent(query.term) + '&apiKey=' + this.config.apiKey;

                if (query.at) {
                  params += '&at=' + query.at;
                }

                if (this.config.suggest && this.config.suggest.options) {
                  buildParametersOptions = _objectSpread({}, this.config.suggest.options);
                  params += this._buildParameters(buildParametersOptions);
                }

                countryCodes = query.country || this.config.suggest.options.country;
                params += "&in=countryCode:".concat((0, _typeof2.default)(countryCodes) === 'object' ? countryCodes.toString() : countryCodes);
                _context.next = 10;
                return (0, _crossFetch.default)(url + params);

              case 10:
                response = _context.sent;
                _context.next = 13;
                return response.json();

              case 13:
                json = _context.sent;
                suggestions = json.items && json.items // Remove county and state for DOM-TOM
                // (avoids Guadeloupe, Guadeloupe, Guadeloupe)
                .filter(function (suggest) {
                  return domTomCountryCodes.includes(suggest.address.countryCode) ? !['county', 'state'].includes(suggest.address) : true;
                }) // Add department codes before department names
                // (avoid Corrèze-city mistaken for Corrèze-dpt)
                .reduce(function (res, next) {
                  if (next.resultType !== 'county') {
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

                  var labelParts = next.address.label.split(', '); // France, Corrèze => France, (19) Corrèze

                  var newLabel = labelParts.slice(0, -1).concat(['(' + departmentCode[0] + ') ' + labelParts.pop(-1)]).join(', ');
                  return [].concat((0, _toConsumableArray2.default)(res), [_objectSpread({}, next, {
                    label: newLabel
                  })]);
                }, []) // Format response (inverse order label)
                .map(function (suggest) {
                  return {
                    label: suggest.address.label,
                    id: suggest.id,
                    type: _this3._getType(suggest)
                  };
                });
                callback(suggestions || null, response.status);

              case 16:
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
        var url, params, results, response, json;
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

                params = 'at=' + searchRequest.latitude + ',' + searchRequest.longitude + ',100';
                _context2.next = 10;
                break;

              case 8:
                callback(null, 400);
                return _context2.abrupt("return");

              case 10:
                params += '&apiKey=' + this.config.apiKey;

                if (this.config.reverse && this.config.reverse.options) {
                  params += this._buildParameters(this.config.reverse.options);
                }

                _context2.next = 14;
                return this.getResponse(url, params);

              case 14:
                response = _context2.sent;
                _context2.next = 17;
                return response.json();

              case 17:
                json = _context2.sent;
                results = json.items && json.items.length && this._formatResponse(json);
                callback(results, response.status);

              case 20:
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
        var params, url, _params, response, json, dptCode, countryCodes, _url, _response, _json, results;

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
                if (!searchRequest.id) {
                  _context3.next = 17;
                  break;
                }

                url = this._getUrl('lookup');
                _params = 'id=' + searchRequest.id + '&apiKey=' + this.config.apiKey;
                _context3.next = 8;
                return this.getResponse(url, _params);

              case 8:
                response = _context3.sent;
                _context3.next = 11;
                return response.json();

              case 11:
                _context3.t0 = _context3.sent;
                _context3.t1 = [_context3.t0];
                json = {
                  items: _context3.t1
                };
                callback(this._formatResponse(json), response.status);
                _context3.next = 35;
                break;

              case 17:
                if (searchRequest.text) {
                  // (XX) XXXX => Match departments
                  dptCode = searchRequest.text.match(/^\(([\d]+)\)/);

                  if (null !== dptCode) {
                    // Match exact department (called "county" in Here)
                    params = 'q=' + encodeURIComponent(this.departmentDatas[dptCode[1]]);
                    params += '&types=area';
                  } else {
                    params = 'q=' + encodeURIComponent(searchRequest.text);
                  }
                } else if (searchRequest.city) {
                  params = 'q=' + encodeURIComponent(searchRequest.text);
                  params += '&types=city';
                } else {
                  if (searchRequest.label) {
                    if (searchRequest.label == "Vienne") {
                      // Specific case for "Vienne" department name
                      params = 'q=' + encodeURIComponent('Vienne, Nouvelle-Aquitaine');
                      params += '&types=city';
                    } else {
                      params = 'q=' + encodeURIComponent(searchRequest.label);
                    }
                  }
                }

                if (params) {
                  _context3.next = 21;
                  break;
                }

                callback(null, 400);
                return _context3.abrupt("return");

              case 21:
                params += '&apiKey=' + this.config.apiKey;

                if (this.config.geocode && this.config.geocode.options) {
                  params += this._buildParameters(this.config.geocode.options);
                }

                countryCodes = searchRequest.country || this.config.geocode.options.country;
                params += "&in=countryCode:".concat((0, _typeof2.default)(countryCodes) === 'object' ? countryCodes.toString() : countryCodes);
                _url = this._getUrl(this.config.geocode.resource);
                _context3.next = 28;
                return this.getResponse(_url, params);

              case 28:
                _response = _context3.sent;
                _context3.next = 31;
                return _response.json();

              case 31:
                _json = _context3.sent;
                results = [];

                if (_json && _json.items) {
                  results = this._formatResponse(_json);
                }

                callback(results, _response.status);

              case 35:
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
    /**
     * return api response from Here or geocoder cache
     *
     * @url {string} hereUrl
     * @param {obj} params
     * @returns {Promise<Response>}
     */

  }, {
    key: "getResponse",
    value: function () {
      var _getResponse = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(hereUrl, params) {
        var paramsURLSearchParams, cacheUrl;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.config.cacheEnable) {
                  _context4.next = 11;
                  break;
                }

                if (!(!this.config.cacheUrl || !this.config.cacheKey)) {
                  _context4.next = 3;
                  break;
                }

                throw new Error("Missing parameter cacheUrl || cacheKey");

              case 3:
                paramsURLSearchParams = new URLSearchParams(params);
                params = Object.fromEntries(paramsURLSearchParams.entries());
                cacheUrl = urlJoin(this.config.cacheUrl, "geocoder");
                _context4.next = 8;
                return (0, _crossFetch.default)(cacheUrl, {
                  method: "post",
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.cacheKey
                  },
                  body: JSON.stringify({
                    "params": params
                  })
                });

              case 8:
                return _context4.abrupt("return", _context4.sent);

              case 11:
                _context4.next = 13;
                return (0, _crossFetch.default)(hereUrl + params);

              case 13:
                return _context4.abrupt("return", _context4.sent);

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getResponse(_x7, _x8) {
        return _getResponse.apply(this, arguments);
      }

      return getResponse;
    }()
  }, {
    key: "autocompleteAdapter",
    value: function autocompleteAdapter(params, callback) {
      var returnSuggestions = function returnSuggestions(predictions, status) {
        predictions = predictions || [];
        var data = {
          results: []
        };

        if (status !== 200 || !predictions) {
          callback(data);
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
        this.suggest(params, returnSuggestions);
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