'use strict';

// GET /service/atom2/service Retrieving the Activities service document
// GET /service/atom2/activities Getting the My Activities feed
// GET /service/atom2/completed Getting a feed of completed activities
// GET /service/atom2/everything Getting a feed of all activities
// GET /service/atom2/todos Getting a feed of entries in the to-do list
// GET /service/atom2/tags Getting a list of the tags assigned to all activities
// GET /service/atom2/entrytemplates?activityUuid=<uuid> Retrieves a feed of entry templates
// GET /service/atom2/trash Retrieves a feed of the activities and entries in the trash

module.exports = {
  overview: require('./overview'),
};
