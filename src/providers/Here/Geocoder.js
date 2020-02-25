import ProviderGeocoder from '../ProviderGeocoder';
import fetch from 'cross-fetch'

class HereGeocoder extends ProviderGeocoder {

  constructor(config) {
    super();
    this.providerName = 'Here';
    this.config       = config;

    this.mappingAdmLevel = {
      state:       'state',
      county:      'department',
      country:     'country',
      postalCode:  'postal_code',
      city:        'city',
      district:    'district',
      street:      'route',
      houseNumber: 'street_number'
    }
  }

  _formatResponse(json) {
    return json.Response.View[0].Result.map(result => {
      return {
        type:     this.mappingAdmLevel[result.MatchLevel],
        id:       result.Location.LocationId,
        position: {
          latitude:  result.Location.DisplayPosition.Latitude,
          longitude: result.Location.DisplayPosition.Longitude,
          viewport:  [
            [
              result.Location.MapView.BottomRight.Latitude,
              result.Location.MapView.BottomRight.Longitude
            ],
            [
              result.Location.MapView.TopLeft.Latitude,
              result.Location.MapView.TopLeft.Longitude
            ]
          ]
        },
        address:  {
          label:         result.Location.Address.Label,
          district:      result.Location.Address.District,
          city:          result.Location.Address.City,
          postal_code:   result.Location.Address.PostalCode,
          department:    result.Location.Address.County,
          state:         result.Location.Address.State,
          country:       result.Location.Address.Country,
          route:         result.Location.Address.Street,
          street_number: result.Location.Address.HouseNumber
        }
      }
    });
  }

  _getUrl(type) {
    return this.config[type].baseUrl +
      this.config[type].path +
      this.config[type].resource + '.json?';
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

    let params = 'query=' + encodeURIComponent(query) +
      '&app_id=' + this.config.appId +
      '&app_code=' + this.config.appCode;

    if (this.config.suggest && this.config.suggest.options) {
      const buildParametersOptions = {...this.config.suggest.options};

      // Check if the query is a number
      if (query.trim().match(/^[0-9]*$/) !== null) {
        
        // Force result type to postal code if the query is a number
        buildParametersOptions.resultType = 'postalCode'
      }
      params += this._buildParameters(buildParametersOptions);
    }

    const response = await fetch(url + params);
    const json     = await response.json();

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

    const suggestions = json.suggestions && json.suggestions

    // Remove county and state for DOM-TOM
    // (avoids Guadeloupe, Guadeloupe, Guadeloupe)
      .filter(suggest =>
        domTomCountryCodes.includes(suggest.countryCode)
        ? !['county', 'state'].includes(suggest.matchLevel)
        : true)

      // Add department codes before department names
      // (avoid Corrèze-city mistaken for Corrèze-dpt)
      .reduce((res, next) => {
        if (next.matchLevel !== 'county') {
          return [...res, next];
        }

        const departmentCode = Object.entries(this.departmentDatas)
          .find(([, v]) => v === next.address.county);

        if (!departmentCode) {
          return [...res, next];
        }

        const labelParts = next.label.split(', ');

        // France, Corrèze => France, (19) Corrèze
        const newLabel = labelParts.slice(0, -1)
          .concat(['(' + departmentCode[0] + ') ' + labelParts.pop(-1)])
          .join(', ');

        return [...res, {...next, label: newLabel}];

      }, [])

      // Format response (inverse order label)
      .map(suggest => ({
        label: suggest.label.split(', ').reverse().join(', '),
        id:    suggest.locationId,
        type:  this.mappingAdmLevel[suggest.matchLevel],
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
      params = 'prox=' + searchRequest.latitude + ',' + searchRequest.longitude + ',100';
    } else {
      callback(null, 400);
      return;
    }

    params += '&app_id=' + this.config.appId + '&app_code=' + this.config.appCode + '&mode=retrieveAddresses';
    if (this.config.reverse && this.config.reverse.options) {
      params += this._buildParameters(this.config.reverse.options);
    }

    const response = await fetch(url + params);
    const json     = await response.json();

    let results = [];
    if (json && json.Response && json.Response.View && json.Response.View.length) {
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
          params = 'searchtext=' + encodeURIComponent(searchRequest.text.replace(/-france$/i, ''));
        } else {
          params = 'searchtext=' + encodeURIComponent(searchRequest.text);
        }
      }
    } else {
      if (searchRequest.label) params = 'searchtext=' + encodeURIComponent(searchRequest.label);
    }

    if (!params) {
      callback(null, 400);
      return;
    }

    params += '&app_id=' + this.config.appId + '&app_code=' + this.config.appCode;

    if (this.config.geocode && this.config.geocode.options) {
      params += this._buildParameters(this.config.geocode.options);
    }

    const response = await fetch(url + params);
    const json     = await response.json();

    let results = [];
    if (json && json.Response && json.Response.View && json.Response.View.length) {
      results = this._formatResponse(json);
    }

    callback(results, response.status);
  }

  autocompleteAdapter(params, callback) {
    const returnSuggestions = (predictions, status) => {
      predictions = predictions || [];
      const data  = {results: []};
      if (status !== 200 || !predictions) {
        callback(data);
      }

      // Get department by code
      const deptCode        = params.term.toUpperCase();
      const departementName = this.departmentDatas[deptCode];
      if (departementName) {
        data.results.push({
          id:   params.term,
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
      const data = {results: []};
      callback(data);
    }
  }
}

export default HereGeocoder
