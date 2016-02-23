'use strict';

// url's in this service are the same, no matter which auth mechanism is used

const _ = require('lodash');
const OniyiHttpClient = require('oniyi-http-client');

// const logger = require('./logger');
const utils = require('./utils');
const serviceDocument = require('./service-document');
const feeds = require('./feeds');

module.exports = function IbmConnectionsActivitiesService(baseUrl, serviceOptions) {
  // options we'll use across the module
  const options = _.merge({
    defaults: {
      // make sure our base url ends with a "/", url.resolve doesn't work correctly otherwise
      baseUrl: baseUrl.charAt(baseUrl.length - 1) === '/' ? baseUrl : `${baseUrl}/`,
      headers: {},
      followRedirect: false,
    },
  }, serviceOptions);

  // create a http client to be used throughout this service
  const httpClient = new OniyiHttpClient(options);

  function makeServiceMethod(fn) {
    return utils.makeServiceMethod(httpClient, fn);
  }

  // finally return the service object
  return {
    serviceDocument: makeServiceMethod(serviceDocument),
    feeds: Object.keys(feeds)
      .reduce((result, key) => {
        /* eslint-disable no-param-reassign */
        result[key] = makeServiceMethod(feeds[key]);
        return result;
        /* eslint-enable no-param-reassign */
      }, {}),
  };
};
