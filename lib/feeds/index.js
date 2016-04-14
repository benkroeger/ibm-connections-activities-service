'use strict';

// node core modules

// npm modules
const _ = require('lodash');

// other modules
const utils = require('../utils');
const loadServiceDocument = require('../service-document');
const parser = require('./parser');

const qsValidParameters = [
  'page',
  'ps',
  'sortBy',
  'sortOrder',
  'email',
  'userid',
  'nodetype',
  'priority',
  'public',
  'search',
  'tag',
  'templates',
];

function makeFeedLoader(feedName) {
  return function loadFeed(httpClient, params, callback) {
    loadServiceDocument(httpClient, params, (serviceDocErr, serviceDocument) => {
      if (serviceDocErr) {
        return callback(serviceDocErr);
      }

      if (!(serviceDocument && serviceDocument.collections && serviceDocument.collections[feedName])) {
        return callback(new Error(`no collection found in service document for "${feedName}"`));
      }

      // construct request parameters
      const authParams = utils.getAuthParams(params);
      const uriParams = utils.getUriParams(httpClient.getDefaults(), serviceDocument.collections[feedName]);
      const requestParams = _.assign({}, params, {
        method: 'GET',
        headers: {
          accept: 'application/atom+xml',
        },
        qs: _.pick(params.query || {}, qsValidParameters),
      }, authParams, uriParams);

      return httpClient
        .makeRequest(requestParams, (feedErr, response, body) => {
          if (feedErr) {
            return callback(feedErr);
          }
          return callback(null, parser.parseFeed(body));
        });
    });
  };
}

module.exports = [
  'overview',
  'completed',
  'tunedout',
  'trash',
  'public',
  'everything',
  'todos',
].reduce((reduced, feedName) => {
  /* eslint-disable no-param-reassign */
  reduced[feedName] = makeFeedLoader(feedName);
  return reduced;
  /* eslint-enable no-param-reassign */
}, {});


// GET /service/atom2/service Retrieving the Activities service document
// GET /service/atom2/activities Getting the My Activities feed
// GET /service/atom2/completed Getting a feed of completed activities
// GET /service/atom2/everything Getting a feed of all activities
// GET /service/atom2/todos Getting a feed of entries in the to-do list
// GET /service/atom2/tags Getting a list of the tags assigned to all activities
// GET /service/atom2/entrytemplates?activityUuid=<uuid> Retrieves a feed of entry templates
// GET /service/atom2/trash Retrieves a feed of the activities and entries in the trash
