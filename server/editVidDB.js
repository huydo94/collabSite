import { Meteor } from 'meteor/meteor';
import '../imports/api/vidFav.js';

import { likes } from '../imports/api/vidFav.js';
import { dislikes } from '../imports/api/vidFav.js';
import {theQueue} from "../imports/api/queue.js";


Meteor.methods({
	likeVid(currentVid){
		var alreadyliked = likes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();
		var alreadydisliked = dislikes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();
		if(alreadyliked){
			return;
		}
		if(alreadydisliked){
			dislikes.remove({user:Meteor.userId(),vid:currentVid.src});
			likes.insert({user:Meteor.userId(),vid:currentVid.src});

			theQueue.update({src: currentVid.src},{$inc:{likes:1,dislikes:-1}});

			return;

		}
		likes.insert({user:Meteor.userId(),vid:currentVid.src});
        theQueue.update({src: currentVid.src},{$inc:{likes:1}});

	},
	dislikeVid(currentVid){
		var alreadyliked = likes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();
		var alreadydisliked = dislikes.find({user:Meteor.userId(),vid:currentVid.src},{limit:1}).count();

		if(alreadydisliked){
			return;
		}
		if(alreadyliked){
			likes.remove({user:Meteor.userId(),vid:currentVid.src});
			dislikes.insert({user:Meteor.userId(),vid:currentVid.src});
			theQueue.update({src: currentVid.src},{$inc:{likes:-1,dislikes:1}});
			return;

		}
		dislikes.insert({user:Meteor.userId(),vid:currentVid.src});
        theQueue.update({src: currentVid.src},{$inc:{dislikes:1}});

	}
});

Meteor.startup(() => {
  // code to run on server at startup
});
