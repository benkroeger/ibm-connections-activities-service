'use strict';

const parserUtils = require('../utils');

function parseActivityEntry(entryNode) {
  const parsedResult = {};

  // parse nodes with a simple mapping. API allows for either "string" value or "object literal".
  // When of type "string", must be valid XPath expression
  // When of type object literal, it must provide "selector" of type "string" and "transform" of type "function".
  // The transform function will be passed the extracted value and is expected to return synchronously.
  const textValueSelectors = {
    id: 'atom:id',
    title: 'atom:title[@type="text"]',
    updated: {
      selector: 'atom:updated',
      transform: parserUtils.toDate,
    },
    published: {
      selector: 'atom:published',
      transform: parserUtils.toDate,
    },
    duedate: {
      selector: 'snx:duedate',
      transform: parserUtils.toDate,
    },
    activity: 'snx:activity',
    position: {
      selector: 'snx:position',
      transform: parserUtils.toInteger,
    },
    depth: {
      selector: 'snx:depth',
      transform: parserUtils.toInteger,
    },
    permissions: {
      selector: 'snx:permissions',
      transform: (val) => {
        return val
          .split(',')
          .map((member) => {
            return member.trim();
          });
      },
    },
    icon: 'snx:icon',
    content: 'snx:content[@type="text"]',
  };

  Object.keys(textValueSelectors).forEach((key) => {
    const spec = textValueSelectors[key];
    const selector = typeof spec === 'string' ? spec : spec.selector;
    const node = parserUtils.selectXPath(selector, entryNode, true);
    if (node) {
      parsedResult[key] = typeof spec.transform === 'function' ? spec.transform(node.textContent) : node.textContent;
    }
  });

  // parse entry type
  const typeSelector = 'atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/type" and @term]';
  const typeNode = parserUtils.selectXPath(typeSelector, entryNode, true);
  if (!typeNode) {
    throw new Error('Can not find typeNode in entry');
  }
  parsedResult.type = {
    term: typeNode.getAttribute('term'),
    label: typeNode.getAttribute('label'),
  };

  // collect activity flags in an array
  // flag nodes are transformed into an object literal with properties "term" and "label"
  const flagsSelector = 'atom:category[@scheme="http://www.ibm.com/xmlns/prod/sn/flags" and @term and @label]';
  parsedResult.flags = Array.prototype.map.call(parserUtils.selectXPath(flagsSelector, entryNode), (flagNode) => {
    return {
      term: flagNode.getAttribute('term'),
      label: flagNode.getAttribute('label'),
    };
  });

  // parse link nodes
  // link nodes are transformed into an object literal with properties "href" and "type"
  const linkSelectors = {
    memberList: 'atom:link[@rel="http://www.ibm.com/xmlns/prod/sn/member-list" and @type="application/atom+xml"]',
    history: 'atom:link[@rel="http://www.ibm.com/xmlns/prod/sn/history" and @type="application/atom+xml"]',
    templates: 'atom:link[@rel="http://www.ibm.com/xmlns/prod/sn/templates" and @type="application/atom+xml"]',
    edit: 'atom:link[@rel="edit" and @type="application/atom+xml"]',
    self: 'atom:link[@rel="self" and @type="application/atom+xml"]',
    activityview: 'atom:link[@rel="activityview" and @type="application/xhtml+xml"]', // this takey you to the activity outline view
    alternate: 'atom:link[@rel="alternate" and @type="application/xhtml+xml"]', // this takes you to the recent updated view
    // <link rel="alternate" type="text/html" href="https://apps.na.collabserv.com/activities/service/html/activity/recent?activityUuid=eef8c430-25db-4e03-9a2e-a573ae964f23" />
    // <link rel="activityview" type="text/html" href="https://apps.na.collabserv.com/activities/service/html/activityview?activityUuid=eef8c430-25db-4e03-9a2e-a573ae964f23" />
  };
  parsedResult.links = Object.keys(linkSelectors).reduce((reduced, key) => {
    const selector = linkSelectors[key];
    /* eslint-disable no-param-reassign */
    const linkNode = parserUtils.selectXPath(selector, entryNode, true);
    if (!linkNode) {
      return reduced;
    }
    reduced[key] = {
      href: linkNode.getAttribute('href'),
      type: linkNode.getAttribute('type'),
    };
    return reduced;
    /* eslint-enable no-param-reassign */
  }, {});

  return parsedResult;
}

module.exports = parseActivityEntry;
