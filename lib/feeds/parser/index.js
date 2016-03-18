'use strict';

const parserUtils = require('../../parser-utils');
const logger = require('../../logger');

const entrySelector = '/atom:feed/atom:entry';

// load entry-type parsers
const entryTypeParsers = ['activity', 'todo'].reduce((reduced, key) => {
  /* eslint-disable no-param-reassign */
  reduced[key] = require(`./entry-type-${key}`);
  return reduced;
  /* eslint-enable no-param-reassign */
}, {});

function parseFeed(content) {
  const parsedResult = {};

  // make sure that we have an XML Document
  const xmlDoc = parserUtils.ensureXMLDoc(content);

  const linkSelectors = {
    self: '/atom:feed/atom:link[@rel="self"]',
    alternate: '/atom:feed/atom:link[@rel="alternate"]',
    tagCloud: '/atom:feed/atom:link[@rel="http://www.ibm.com/xmlns/prod/sn/tag-cloud"]',
  };

  parsedResult.links = Object.keys(linkSelectors)
    .reduce((reduced, key) => {
      /* eslint-disable no-param-reassign */
      const hrefNode = parserUtils.selectXPath(`${linkSelectors[key]}/@href`, xmlDoc, true);
      if (hrefNode && hrefNode.value) {
        reduced[key] = hrefNode.value;
      }
      return reduced;
      /* eslint-enable no-param-reassign */
    }, {});

  // find all entry nodes, detect their type and forward to type-specific parser
  const entryTypeSelector = 'atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term]';
  parsedResult.entries =
    Array.prototype.reduce.call(parserUtils.selectXPath(entrySelector, xmlDoc), (reduced, entryNode) => {
      const typeNode = parserUtils.selectXPath(entryTypeSelector, entryNode, true);

      if (typeNode) {
        const type = typeNode.getAttribute('term');
        if (typeof entryTypeParsers[type] === 'function') {
          reduced.push(entryTypeParsers[type](entryNode));
          return reduced;
        }
        logger.warn(`No parser for entry-type "${type}" available`);
      }

      return reduced;
    }, []);

  // finally return the JSON result
  return parsedResult;
}

module.exports = {
  parseFeed,
};
