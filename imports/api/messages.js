import { Mongo } from 'meteor/mongo';
 
export const messages = new Mongo.Collection('messages',{ capped: true, size: 100000 });

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('messages', function messages1Publication() {
        return messages.find();
    });
}
