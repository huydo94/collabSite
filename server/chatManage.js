import { Meteor } from 'meteor/meteor';
import '../imports/api/messages.js';
import { messages } from '../imports/api/messages.js';

import { check } from 'meteor/check';

var chatColors = ['red','green','blue','yellow','orange','purple','cyan','magenta','lime','pink','teal','lavender','brown','maroon','navy'];

Accounts.onCreateUser(function(options, user) {
   // Use provided profile in options, or create an empty object
   user.profile = options.profile || {};
   // Assigns first and last names to the newly created user object
   user.profile.color = chatColors[Math.floor(Math.random()*chatColors.length)];
   // Returns the user object
   return user;
});

Meteor.methods({
	addMsg(newMsg){
		check(newMsg, String);
		newMsg = Emojis.parse(newMsg);

			messages.insert({
				color:Meteor.user().profile.color,
				text:newMsg,
				user: Meteor.user().username,
				createdAt: new Date
			});

		}
});
