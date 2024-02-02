
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

class HereGeocoder extends ProviderGeocoder {

  constructor(config) {
    super();
    this.providerName = 'Here';
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
      locality: 'city'
    };

    this.lookupUrl = 'https://lookup.search.hereapi.com/v1/lookup';
  }

  _formatResponse(json) {
    return json.items.map(result => {
      return {
        type: this.mappingAdmLevel[result.resultType],
        id: result.id,
        position: {
          latitude: result.position.lat,
          longitude: result.position.lng,
          viewport: [
            [
              result.position.lat,
              result.position.lng
            ],
            [
              result.position.lat,
              result.position.lng
            ]
          ]
        },
        address: {
          label: result.address.label,
          district: result.address.district,
          city: result.address.city,
          postal_code: result.address.postalCode,
          department: this.departmentDatas[result.address.postalCode.substring(0,2)],
          state: result.address.state,
          country: result.address.countryCode,
          route: result.address.street,
          street_number: result.address.houseNumber,
          county: result.address.county
        }
      }
    });
  }

  _getUrl(type) {
    return this.config[type].baseUrl +
      this.config[type].resource + '?';
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

    let params = 'q=' + encodeURIComponent(query) +
      '&apiKey=' + this.config.apiKey;

    if(query.at){
      params += '&at=' + radius;
    }

    if (this.config.suggest && this.config.suggest.options) {
      const buildParametersOptions = { ...this.config.suggest.options };

      // Check if the query is a number
      if (query.trim().match(/^[0-9]*$/) !== null) {

        // Force result type to postal code if the query is a number
        buildParametersOptions.resultType = 'postalCode'
      }
      params += this._buildParameters(buildParametersOptions);
    }

    const response = await fetch(url + params);
    const json = await response.json();

    const domTomCountryCodes = [
      'GLP',
      'GUF',
      'MTQ',
      'REU',
      'MYT',
      'BLM',
      'MAF',
      'NCL',
      'PYF',
      'SPM',
      'ATF',
      'WLF'
    ];

    const suggestions = json.items && json.items

      // Remove county and state for DOM-TOM
      // (avoids Guadeloupe, Guadeloupe, Guadeloupe)
      .filter(suggest =>
        domTomCountryCodes.includes(suggest.address.countryCode)
          ? !['county', 'state'].includes(suggest.address)
          : true)

      // Add department codes before department names
      // (avoid Corrèze-city mistaken for Corrèze-dpt)
      .reduce((res, next) => {
        if (next.resultType !== 'county') {
          return [...res, next];
        }

        const departmentCode = Object.entries(this.departmentDatas)
          .find(([, v]) => v === next.address.county);

        if (!departmentCode) {
          return [...res, next];
        }

        const labelParts = next.address.label.split(', ');

        // France, Corrèze => France, (19) Corrèze
        const newLabel = labelParts.slice(0, -1)
          .concat(['(' + departmentCode[0] + ') ' + labelParts.pop(-1)])
          .join(', ');

        return [...res, { ...next, label: newLabel }];

      }, [])

      // Format response (inverse order label)
      .map(suggest => ({
        label: suggest.address.label.split(', ').reverse().join(', '),
        id: suggest.id,
        type: this.mappingAdmLevel[suggest.resultType],
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
      params = 'at=' + searchRequest.latitude + ',' + searchRequest.longitude + ',100';
    } else {
      callback(null, 400);
      return;
    }

    params += '&apiKey=' + this.config.apiKey;
    if (this.config.reverse && this.config.reverse.options) {
      params += this._buildParameters(this.config.reverse.options);
    }
    let results;
    const response = await this.getResponse(url, params);
    const json = await response.json();
    results = json.items && json.items.length && this._formatResponse(json);

    callback(results, response.status);
  }

  async geocode(searchRequest, callback) {
    if (!searchRequest) {
      callback(null, 400);
      return;
    }

    let params;

    if (searchRequest.id) {
      const url = this._getUrl('lookup');
      const params = 'id=' + searchRequest.id + '&apiKey=' + this.config.apiKey;
      const response = await this.getResponse(url, params);
      const json = { items :  [await response.json()] };

      callback(this._formatResponse(json), response.status);
    } else {
      if (searchRequest.text) {
        // (XX) XXXX => Match departments
        const dptCode = searchRequest.text.match(/^\(([\d]+)\)/);
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
            params = 'q=' + encodeURIComponent(searchRequest.text.replace(/-france$/i, ''));
          } else {
            params = 'q=' + encodeURIComponent(searchRequest.text);
          }
        }
      } else {
        if (searchRequest.label) {
          if (searchRequest.label == "Vienne") {
            // Specific case for "Vienne" department name
            params = 'q=' + encodeURIComponent('Vienne, Nouvelle-Aquitaine');
          } else {
            params = 'q=' + encodeURIComponent(searchRequest.label);
          }
        }
      }

      if (!params) {
        callback(null, 400);
        return;
      }

      params += '&apiKey=' + this.config.apiKey;

      if (this.config.geocode && this.config.geocode.options) {
        params += this._buildParameters(this.config.geocode.options);
      }

      // TODO : Make the country code dynamic
      params += '&in=countryCode:FRA'
      // params += '&qq=houseNumber';
      const url = this._getUrl(this.config.geocode.resource);
      const response = await this.getResponse(url, params);

      const json = await response.json();

      let results = [];
      if (json && json.items) {
        results = this._formatResponse(json);
      }

      callback(results, response.status);
    }


  }

  /**
   * return api response from Here or geocoder cache
   *
   * @url {string} hereUrl
   * @param {obj} params
   * @returns {Promise<Response>}
   */
  async getResponse(hereUrl, params) {
    if (this.config.cacheEnable) {
      if(!this.config.cacheUrl || !this.config.cacheKey) {
        throw new Error("Missing parameter cacheUrl || cacheKey");
      }
      const paramsURLSearchParams = new URLSearchParams(params);
      params = Object.fromEntries(paramsURLSearchParams.entries());

      const cacheUrl = urlJoin(this.config.cacheUrl,"geocoder");
      return await fetch(cacheUrl, {
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
      return await fetch(hereUrl + params);
    }
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
        this.suggest(params, returnSuggestions);
    } else {
      const data = { results: [] };
      callback(data);
    }
  }
}

export default HereGeocoder
