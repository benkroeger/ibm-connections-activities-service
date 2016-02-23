'use strict';

const _ = require('lodash');

const utils = require('../utils');
const loadServiceDocument = require('../service-document');

const parser = require('../parser/feeds');

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

// This returns a feed of active activities of which you are a member.
// The activities in the feed are the same activities that populate
// the My Activities view in the user interface.
// This feed is also the same as the Overview feed listed in your
// Activities service document. You can work with the activities in this feed
// in the same ways as you could if you retrieved them from the Overview feed
// in the service document.
function loadOverviewFeed(httpClient, params, callback) {
  loadServiceDocument(httpClient, params, (serviceDocErr, serviceDocument) => {
    if (serviceDocErr) {
      return callback(serviceDocErr);
    }

    if (!(serviceDocument && serviceDocument.collections && serviceDocument.collections.overview)) {
      return callback(new Error('no overview service in service document'));
    }

    // construct request parameters
    const authParams = utils.getAuthParams(params);
    const uriParams = utils.getUriParams(httpClient, serviceDocument.collections.overview);
    const requestParams = _.assign({
      method: 'GET',
      headers: {
        accept: 'application/atom+xml',
      },
      qs: _.pick(params.query || {}, qsValidParameters),
    }, authParams, uriParams);

    return httpClient
      .makeRequest(requestParams, (err, response, body) => {
        if (err) {
          return callback(err);
        }
        return callback(null, parser.parse(body));
      });
  });
}

module.exports = loadOverviewFeed;
