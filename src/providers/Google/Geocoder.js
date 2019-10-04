/**
 * The goal is to implement methods defined in ProviderGeocoder abstract class
 * with unified output and input
 */

import ProviderGeocoder from '../ProviderGeocoder';

class GoogleGeocoder extends ProviderGeocoder {
  constructor(config) {
    super();

    // Provider name
    this.providerName = 'Google';

    // Loaded configuration
    this.config = config;

    // Mapping of administrative level Google <=> lib
    this.mappingAdmLevel = {
      administrative_area_level_1: 'state',
      administrative_area_level_2: 'department',
      country:                     'country',
      country_code:                'country_code',
      postal_code:                 'postal_code',
      locality:                    'city',
      route:                       'route',
      neighborhood:                'district',
      street_number:               'street_number',
      street_address:              'street_number'
    }
  }

  /**
   * Format administrative level
   * @param {Array} admLevels
   */
  _formatAdministativeLevel(admLevels) {
    let formated = JSON.parse(JSON.stringify(this.administativeLevel));
    admLevels.forEach(admLevel => {
      const mappedType = this.mappingAdmLevel[admLevel.types[0]];
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
  _formatResponse(results) {
    return results.filter(r => this.mappingAdmLevel[r.types[0]]).map(result => {
      const formatedAdmin = this._formatAdministativeLevel(result.address_components);
      const address       = Object.assign({label: result.formatted_address}, formatedAdmin);

      return {
        type:     this.mappingAdmLevel[result.types[0]],
        id:       result.place_id,
        position: {
          latitude:  result.geometry.location.lat(),
          longitude: result.geometry.location.lng(),
          viewport:  [
            [
              result.geometry.viewport.getSouthWest().lat(),
              result.geometry.viewport.getSouthWest().lng()
            ],
            [
              result.geometry.viewport.getNorthEast().lat(),
              result.geometry.viewport.getNorthEast().lng()
            ]
          ]
        },
        address:  address
      }
    });
  }

  /**
   * Suggestion for autocomplete
   * @param {string} query
   * @param {function} callback
   */
  suggest(query, callback) {
    const service = new google.maps.places.AutocompleteService();
    const options = this.config.options;
    options.input = query || ' ';
    service.getPlacePredictions(options, (predictions, status) => {
      const formatedPrediction = (predictions) ? predictions.map((prediction) => {
        return {
          label: prediction.description,
          id:    prediction.place_id,
          type:  this.mappingAdmLevel[prediction.types[0]],
        };
      }) : null;

      callback(formatedPrediction, (status === google.maps.places.PlacesServiceStatus.OK || google.maps.places.PlacesServiceStatus.ZERO_RESULTS) ? 200 : 400);
    });
  }

  /**
   * Retrieve address from location
   * @param {object} searchRequest {latitude: ..., longitude: ...}
   * @param {function} callback
   */
  reverse(searchRequest, callback) {
    const geocoder = new google.maps.Geocoder;

    let params = {};
    if (searchRequest.latitude && searchRequest.longitude) {
      params.location = {
        lat: parseFloat(searchRequest.latitude),
        lng: parseFloat(searchRequest.longitude)
      }
    } else {
      callback(null, 400);
      return;
    }

    geocoder.geocode(params, (results, status) => {
      const formatedResults = this._formatResponse(results);
      callback(formatedResults, 200);
    });
  }

  /**
   * Retrieve position from address
   * @param {object} searchRequest {id:...} or {label:...}
   * @param {function} callback
   */
  geocode(searchRequest, callback) {
    const geocoder = new google.maps.Geocoder;

    let params = {};
    if (searchRequest.id) params.placeId = searchRequest.id;
    else if (searchRequest.label) params.address = searchRequest.label;
    else if (searchRequest.text) params.address = searchRequest.text;

    // Test empty params object
    if (Object.entries(params).length === 0 && params.constructor === Object) {
      callback(null, 400);
    }

    geocoder.geocode(params, (results, status) => {
      const formatedResults = this._formatResponse(results);
      callback(formatedResults, 200);
    });
  }

  /**
   * Adapter for select2
   * @param {object} params
   * @param {function} callback
   */
  autocompleteAdapter(params, callback) {
    const returnSuggestions = (predictions, status) => {
      predictions = predictions || [];
      const data  = {results: []};
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
        callback(data);
      }

      // Get department by code
      const deptCode        = params.term.toUpperCase();
      const departementName = this.departmentDatas[deptCode];
      if (departementName) {

        // Because "Rhone" give the river with Geocoder, why give it the place id
        data.results.push({
          id:   (params.term === 69) ? this.hardDefinedPlaceIds['rhone'] : params.term,
          text: '(' + deptCode + ') ' + departementName
        });
      }

      for (let i = 0; i < predictions.length; i++) {
        data.results.push({id: predictions[i].id, text: predictions[i].label});
      }
      data.results.push({id: ' ', text: 'Powered by Google', disabled: true});

      callback(data);
    };

    if (params.term && params.term !== '') {
      this.suggest(params.term, returnSuggestions);
    } else {
      const data = {results: []};
      data.results.push({id: ' ', text: 'Powered by Google', disabled: true});
      callback(data);
    }
  }
}

export default GoogleGeocoder;
