
import ProviderGeocoder from '../ProviderGeocoder';
import fetch from 'cross-fetch'
const urlJoin = (...args) =>
  args
    .join('/')
    .replace(/[\/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?');

class AdresseGeocoder extends ProviderGeocoder {

  constructor(config) {
    super();
    this.providerName = 'Adresse';
    this.config = config;

    this.mappingAdmLevel = {
      state: 'state',
      county: 'department',
      country: 'country',
      postalCode: 'postal_code',
      city: 'city',
      district: 'district',
      street: 'route',
      houseNumber: 'street_number',
      municipality: 'city'
    }
  }

  _formatResponse(json) {
    return json.features.map(result => {
      const context = result.properties.context.split(', ');
      return {
        type: this.mappingAdmLevel[result.properties.type],
        id: result.properties.id,
        position: {
          latitude: result.geometry.coordinates[0],
          longitude: result.geometry.coordinates[1],
        },
        address: {
          label: result.properties.label,
          //district: result.properties.Address.District,
          city: result.properties.city,
          postal_code: result.properties.postcode,
          department: this.departmentDatas[result.properties.postcode.substring(0, 2)],
          state: context[context.length - 1],
          country: 'France',
          route: result.properties.street,
          street_number: result.properties.housenumber && result.properties.housenumber,
          county: 'France',
        }
      }
    });
  }

  _getUrl(type) {
    return this.config[type].baseUrl +
      this.config[type].path + '?';
  }

  _buildParameters(options) {
    let params = '';
    for (const attribute in options) {
      if (options[attribute] !== null) params += '&' + attribute + '=' + encodeURIComponent(options[attribute]);
    }
    return params;
  }

  async suggest(query, callback) {
    if (!query) return;

    const url = this._getUrl('suggest');

    let params = 'q=' + encodeURIComponent(query);

    if (this.config.suggest && this.config.suggest.options) {
      const buildParametersOptions = { ...this.config.suggest.options };

      // Check if the query is a number
      if (query.trim().match(/^[0-9]*$/) !== null) {

        // Force result type to postal code if the query is a number
        buildParametersOptions.resultType = 'postal_code';
      }
      params += this._buildParameters(buildParametersOptions);
    }

    const response = await fetch(url + params);
    const json = await response.json();

    const suggestions = json.features && json.features
      // Format response (inverse order label)
      .map(suggest => ({
        label: suggest.properties.label,
        id: suggest.properties.id,
        type: this.mappingAdmLevel[suggest.properties.type],
      }));

    callback(suggestions || null, response.status);
  }

  async reverse(searchRequest, callback) {
    if (!searchRequest) {
      callback(null, 400);
      return;
    }

    const url = this._getUrl('reverse');

    let params;
    if (searchRequest.latitude && searchRequest.longitude) {
      params = 'lat=' + searchRequest.latitude + '&lon=' + searchRequest.longitude + '&type=' + searchRequest.type;
    } else {
      callback(null, 400);
      return;
    }

    if (this.config.reverse && this.config.reverse.options) {
      params += this._buildParameters(this.config.reverse.options);
    }

    let response = {};

    if (this.config.cacheEnable) {
      if(!this.config.cacheUrl || !this.config.cacheKey) {
        throw new Error("Missing parameter cacheUrl || cacheKey");
      }
      const paramsURLSearchParams = new URLSearchParams(params);
      params = Object.fromEntries(paramsURLSearchParams.entries());
      const url = urlJoin(this.config.cacheUrl,"reverse-geocoder");
      response = await fetch(url, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.cacheKey
        },
        body: JSON.stringify({
          "params": params
        })
      });
    } else {
      response = await fetch(url + params);
    }
    const json = await response.json();

    let results = [];
    if (json && json.features && json.features && json.features.length) {
      results = this._formatResponse(json);
    }

    callback(results, response.status);
  }

  async geocode(searchRequest, callback) {
    if (!searchRequest) {
      callback(null, 400);
      return;
    }

    const url = this._getUrl('geocode');

    let params;
    if (searchRequest.id) {
      params = 'locationid=' + searchRequest.id;
    } else if (searchRequest.text) {
      params = 'q=' + encodeURIComponent(searchRequest.text);
    } else {
      if (searchRequest.label) {
          params = 'q=' + encodeURIComponent(searchRequest.label);
      }
    }

    if (!params) {
      callback(null, 400);
      return;
    }

    if (this.config.geocode && this.config.geocode.options) {
      params += this._buildParameters(this.config.geocode.options);
    }

    let response = {};
    if (this.config.cacheEnable) {
      if(!this.config.cacheUrl || !this.config.cacheKey) {
        throw new Error("Missing parameter cacheUrl || cacheKey");
      }
      const paramsURLSearchParams = new URLSearchParams(params);
      params = Object.fromEntries(paramsURLSearchParams.entries());

      const url= urlJoin(this.config.cacheUrl,"geocoder");
      response = await fetch(url, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.cacheKey
        },
        body: JSON.stringify({
          "params": params
        })
      });
    } else {
      response = await fetch(url + params);
    }
    const json = await response.json();

    let results = [];
    if (json && json.features && json.features.length) {
      results = this._formatResponse(json);
    }

    callback(results, response.status);
  }

  autocompleteAdapter(params, callback) {
    const returnSuggestions = (predictions, status) => {
      predictions = predictions || [];
     
      const data = { results: [] };
      if (status !== 200 || !predictions) {
        callback(data);
      }
      // Get department by code
      const deptCode = params.term.toUpperCase();
      const departementName = this.departmentDatas[deptCode];
      if (departementName) {
        data.results.push({
          id: params.term,
          text: '(' + deptCode + ') ' + departementName,
          type: this.mappingAdmLevel.county
        });
      }

      for (let i = 0; i < predictions.length; i++) {
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
      const data = { results: [] };
      callback(data);
    }
  }
}

export default AdresseGeocoder
