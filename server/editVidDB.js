import { Meteor } from 'meteor/meteor';
import '../imports/api/vidFav.js';

import { likes } from '../imports/api/vidFav.js';
import { dislikes } from '../imports/api/vidFav.js';


Meteor.methods({
	likeVid(currentChannel,currentVid){
		var alreadyliked = likes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();
		var alreadydisliked = dislikes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();
		console.log(alreadyliked);
		if(alreadyliked){
			return;
		}
		if(alreadydisliked){
			dislikes.remove({user:Meteor.userId(),vid:currentVid.src});
			likes.insert({user:Meteor.userId(),vid:currentVid.src});

			switch (currentChannel) {
				case '1':
				videoDB1.update({src: currentVid.src},{$inc:{likes:1,dislikes:-1}});
				break;
				case '2':
				videoDB2.update({src: currentVid.src},{$inc:{likes:1,dislikes:-1}});
				break;
				case '3':
				videoDB3.update({src: currentVid.src},{$inc:{likes:1,dislikes:-1}});
				break;
			}
			return;

		}
		likes.insert({user:Meteor.userId(),vid:currentVid.src});
		switch (currentChannel) {
			case '1':
			videoDB1.update({src: currentVid.src},{$inc:{likes:1}});
			break;
			case '2':
			videoDB2.update({src: currentVid.src},{$inc:{likes:1}});
			break;
			case '3':
			videoDB3.update({src: currentVid.src},{$inc:{likes:1}});
			break;
		}

	},
	dislikeVid(currentChannel,currentVid){
		var alreadyliked = likes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();
		var alreadydisliked = dislikes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();

		if(alreadydisliked){
			return;
		}
		if(alreadyliked){
			likes.remove({user:Meteor.userId(),vid:currentVid.src});
			dislikes.insert({user:Meteor.userId(),vid:currentVid.src});

			switch (currentChannel) {
				case '1':
				videoDB1.update({src: currentVid.src},{$inc:{likes:-1,dislikes:1}});
				break;
				case '2':
				videoDB2.update({src: currentVid.src},{$inc:{likes:-1,dislikes:1}});
				break;
				case '3':
				videoDB3.update({src: currentVid.src},{$inc:{likes:-1,dislikes:1}});
				break;
			}
			return;

		}
		dislikes.insert({user:Meteor.userId(),vid:currentVid.src});
		switch (currentChannel) {
			case '1':
			videoDB1.update({src: currentVid.src},{$inc:{dislikes:1}});
			break;
			case '2':
			videoDB2.update({src: currentVid.src},{$inc:{dislikes:1}});
			break;
			case '3':
			videoDB3.update({src: currentVid.src},{$inc:{dislikes:1}});
			break;
		}

	}
});

function YouTubeGetID(url) {
	var ID = '';
	url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[2] !== undefined) {
		ID = url[2].split(/[^0-9a-z_\-]/i);
		ID = ID[0];
	} else {
		ID = url;
	}
	return ID;
}

Meteor.startup(() => {
  // code to run on server at startup
});
