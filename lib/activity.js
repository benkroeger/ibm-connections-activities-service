// POST /service/atom2/activities Creating activities
// GET /service/atom2/activitynode?activityNodeUuid=<uuid> Retrieving activities
// PUT /service/atom2/activitynode?activityNodeUuid=<uuid> Updating activities
// DELETE /service/atom2/activitynode?activityNodeUuid=<uuid> Deleting activities programmatically
// PUT /service/atom2/trashednode?activityNodeUuid=<uuid> Restoring activities

// Begin service function definition
  function getActivity(params, callback) {
    const qsValidParameters = [
      'activityNodeUuid',
    ];

    // construct the request parameters
    const requestParams = _.assign({
      method: 'GET',
      headers: {
        accept: 'application/atom+xml',
      },
      uri: 'service/atom2/activitynode',
      qs: _.pick(params.query || {}, qsValidParameters),
    }, getAuthParams(params));

    return httpClient
      .makeRequest(requestParams, (err, response, body) => {
        if (err) {
          return callback(err);
        }
        return callback(null, parseXML(body));
      });
  }