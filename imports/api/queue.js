import { Mongo } from 'meteor/mongo';

export const theQueue = new Mongo.Collection('theQueue');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('theQueue', function queuePublication() {
    return theQueue.find();
  });
}
