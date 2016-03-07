'use strict';

const assert = require('assert');
const ibmConnectionsActivitiesService = require('../lib');

const activitiesService = ibmConnectionsActivitiesService('https://apps.na.collabserv.com/activities', {});

/* eslint-disable max-len */
const accessToken = '4748d9baef4bd41685f750243c1e3f1d992f8dbc67ce696f1dfe5fb1425d69dcac94a490d39637b432bdbca1c1822fa91395407bd9c3015dca250af2a9e66ddd516f7a2d568c553243b94cad602c5bf69e4b048c4f6c8a8ee87e458fda6dea2b23280ee788c9cb48102499e63d53f67cf8dac8c2648cb8feed7758227fe67cde';
/* eslint-enable max-len */


// activitiesService.serviceDocument({
//   accessToken,
// }, (err, serviceDocument) => {
//   if (err) {
//     throw err;
//   }
//   console.log('received service document');
//   console.log(serviceDocument);
//   // console.log(err);
//   // console.log(serviceDocument.toString());
// });

activitiesService.feeds.overview({
  accessToken,
}, (err, overviewDocument) => {
  if (err) {
    throw err;
  }
  console.log('received overview document \n', overviewDocument);
});
// describe('ibm-connections-activities-service', () => {
//   it('should retrieve a service document', (done) => {
//     activitiesService.serviceDocument({
//       accessToken,
//     }, (err, serviceDocument) => {
//       if (err) {
//         return done(err);
//       }
//       assert(typeof serviceDocument.toString === 'function', 'must have a toString function');
//       return done();
//     });
//   });

//   // it('should retrieve an activities feed', (done) => {
//   //   activitiesService.getActivitiesFeed({
//   //     accessToken,
//   //   }, (err, activitiesFeed) => {
//   //     if (err) {
//   //       return done(err);
//   //     }
//   //     assert(typeof activitiesFeed.toString === 'function', 'must have a toString function');
//   //     return done();
//   //   });
//   // });
// });
