'use strict';

const assert = require('assert');
const ibmConnectionsActivitiesService = require('../lib');

const activitiesService = ibmConnectionsActivitiesService('https://apps.na.collabserv.com/activities', {});

/* eslint-disable max-len */
const accessToken = '2e3257a24b60e074dc54644fc781128191689d84545c582639283ec586a0f9264f364bf7068b9199c1077afc61dae16df8bff54683459ff2229be857e966508f971aff2651bba052a142f7446a43f32fa45782b17d339ad3aa94e3f0498f5001f459c633bf00fec96ae9b680db3d9c08b7c1e781c91f6092275d6cc1b82b1fa';
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
