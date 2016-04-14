'use strict';

function getAuthParams(params) {
  // extract possible credentials
  // OAuth - AccessToken
  const accessToken = params.accessToken || params.bearer || (params.auth && params.auth.bearer);
  // Basic Credentials
  const username = params.user || params.username || (params.auth && (params.auth.user || params.auth.username));
  const password = params.pass || params.password || (params.auth && (params.auth.pass || params.auth.password));

  if (accessToken) {
    // apply accessToken according to the "request" documentation https://github.com/request/request#http-authentication
    return {
      auth: {
        bearer: accessToken,
      },
    };
  }

  if (username && password) {
    // apply basic credentials according to the "request" documentation https://github.com/request/request#http-authentication
    return {
      auth: {
        username,
        password,
      },
      jar: params.jar,
    };
  }

  return {
    jar: params.jar,
  };
}

function getUriParams(defaults, uri) {
  // @TODO: check implications of possible hostname rewrites / ssl offloading in in IBM Connections environments

  // when there is a default baseUrl defined on httpClient, it doesn't allow absolute uri
  // values.

  // httpClient merges default params with request params on each request.
  // if there is no baseUrl set, we can use the plain provided uri
  if (!(defaults && defaults.baseUrl)) {
    return {
      uri,
    };
  }

  const baseUrl = defaults.baseUrl;

  // remove baseUrl substring from uri to allow "normal operation"
  if (uri.startsWith(baseUrl)) {
    return {
      uri: uri.replace(baseUrl, ''),
    };
  }

  // uri is absolute and doesn't start with httpClient's baseUrl.
  // disable baseUrl in order to execute request successfully
  return {
    uri,
    baseUrl: false,
  };
}

function makeServiceMethod(httpClient, fn) {
  return (params, callback) => {
    return fn.call(null, httpClient, params, callback);
  };
}

module.exports = {
  getAuthParams,
  getUriParams,
  makeServiceMethod,
};
