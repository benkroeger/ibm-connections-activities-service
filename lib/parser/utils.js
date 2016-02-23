'use strict';

const _ = require('lodash');
const xmlUtils = require('oniyi-utils-xml');
const parseXML = xmlUtils.parse;
const xmlNS = require('./xml-namespaces.json');
const selectXPath = xmlUtils.selectUseNamespaces(xmlNS);

function toInteger(val) {
  return parseInt(val, 10);
}

function toDate(val) {
  return Date.parse(val);
}

function ensureXMLDoc(content) {
  let xmlDoc = content;
  if (_.isString(xmlDoc)) {
    xmlDoc = parseXML(xmlDoc);
  }
  return xmlDoc;
}
module.exports = {
  parseXML,
  selectXPath,
  ensureXMLDoc,
  toInteger,
  toDate,
};
