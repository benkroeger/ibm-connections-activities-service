'use strict';

const parserUtils = require('../../parser-utils');

const configurationSelectors = {
  fileSizeLimit: '/app:service/snx:configuration/snx:filesSizeLimit',
  largeFilesSizeLimit: '/app:service/snx:configuration/snx:largeFilesSizeLimit',
};

const collectionSelectors = {
  overview: '/app:service/app:workspace/app:collection[./atom:title = "Overview"]',
  completed: '/app:service/app:workspace/app:collection[./atom:title = "Completed"]',
  tunedout: '/app:service/app:workspace/app:collection[./atom:title = "Tuned out"]',
  trash: '/app:service/app:workspace/app:collection[./atom:title = "Trash"]',
  public: '/app:service/app:workspace/app:collection[./atom:title = "Public"]',
  everything: '/app:service/app:workspace/app:collection[./atom:title = "Everything"]',
  todos: '/app:service/app:workspace/app:collection[./atom:title = "To Do List"]',
};

function parseServiceDocument(content) {
  const parsedResult = {
    configuration: {},
    collections: {},
  };

  // make sure that we have an XML Document
  const xmlDoc = parserUtils.ensureXMLDoc(content);

  // collect generator information
  const generatorNode = parserUtils.selectXPath('/app:service/atom:generator', xmlDoc, true);
  if (generatorNode) {
    parsedResult.generator = {
      uri: generatorNode.getAttribute('uri'),
      version: generatorNode.getAttribute('version'),
      title: generatorNode.textContent,
    };
  }

  // collect service configuration parameters
  Object.keys(configurationSelectors)
    .reduce((reduced, key) => {
      /* eslint-disable no-param-reassign */
      const xmlNode = parserUtils.selectXPath(configurationSelectors[key], xmlDoc, true);
      if (xmlNode) {
        reduced[key] = {
          type: xmlNode.getAttribute('type'),
          ext: xmlNode.getAttribute('ext'),
          value: xmlNode.textContent,
        };
      }
      return reduced;
      /* eslint-enable no-param-reassign */
    }, parsedResult.configuration);

  // iterate collection selectors and assign their href attribute's value to parsedResult
  Object.keys(collectionSelectors)
    .reduce((reduced, key) => {
      /* eslint-disable no-param-reassign */
      const hrefNode = parserUtils.selectXPath(`${collectionSelectors[key]}/@href`, xmlDoc, true);
      if (hrefNode && hrefNode.value) {
        reduced[key] = hrefNode.value;
      }
      return reduced;
      /* eslint-enable no-param-reassign */
    }, parsedResult.collections);

  // finally return the JSON result
  return parsedResult;
}

module.exports = {
  parseServiceDocument,
};
