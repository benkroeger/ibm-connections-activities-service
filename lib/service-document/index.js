'use strict';

const _ = require('lodash');
const utils = require('../utils');
const parser = require('./parser');

function loadServiceDocument(httpClient, params, callback) {
  // construct the request parameters
  const requestParams = _.assign({}, params, {
    method: 'GET',
    headers: {
      accept: 'application/atom+xml',
    },
    uri: 'service/atom2/service',
  }, utils.getAuthParams(params));

  return httpClient
    .makeRequest(requestParams, (err, response, body) => {
      if (err) {
        return callback(err);
      }
      return callback(null, parser.parseServiceDocument(body));
    });
}

module.exports = loadServiceDocument;
