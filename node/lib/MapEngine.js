"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _Map = _interopRequireDefault(require("../providers/Here/Map"));

var _Map2 = _interopRequireDefault(require("../providers/Google/Map"));

var _mapClasses;

/**
 * Load Map class according to type and config
 */
var MapEngine = function MapEngine(type, configOptions) {
  (0, _classCallCheck2.default)(this, MapEngine);
  return new mapClasses[type](configOptions);
};

MapEngine.TYPE_HERE = 'Here';
MapEngine.TYPE_GOOGLE = 'Google';
var mapClasses = (_mapClasses = {}, (0, _defineProperty2.default)(_mapClasses, MapEngine.TYPE_HERE, _Map.default), (0, _defineProperty2.default)(_mapClasses, MapEngine.TYPE_GOOGLE, _Map2.default), _mapClasses);
var _default = MapEngine;
exports.default = _default;