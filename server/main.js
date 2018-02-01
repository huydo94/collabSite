import { Meteor } from 'meteor/meteor';
import '../imports/api/queue.js';
import { theQueue } from '../imports/api/queue.js';

var Fiber = require('fibers');

var curtime = 0;
var curVid;
var lengthCurVid = 0;
var curidx;
var totalVid;


setInterval(function(){
    curtime += 1;
    if(curtime > lengthCurVid){
        curidx++;
        if(curidx > totalVid){
            curidx = 1;
        }
        Fiber(function(){
            curVid = theQueue.findOne({idx:curidx});

            if(curVid == null){
                lengthCurVid = 10; //retry in 10 secs
                console.log("Plz add vids");
            }else{
                lengthCurVid = curVid.time;
            }
            curtime = 0;
        }).run();
    }
},1000);

Meteor.methods({
    addToQueue(src,time){
        totalVid++;
        var convertedSrc = YouTubeGetID(src);
        var vid = {src:convertedSrc,time:time,idx:totalVid};
        theQueue.insert(vid);
    },
    getVidQ(){
        return {src:curVid.src,time:curtime,idx:curidx};
    },
    swapOrder(startIdx,endIdx){
        if(startIdx < endIdx){
            theQueue.update({idx:startIdx},{$set:{idx:-1}});
            theQueue.update({ $and: [ { idx: { $gt: startIdx } }, { idx: { $lte: endIdx } } ] },{$inc:{idx:-1}},{multi:true});
            theQueue.update({idx:-1},{$set:{idx:endIdx}});
        }else{
            theQueue.update({idx:startIdx},{$set:{idx:-1}});
            theQueue.update({ $and: [ { idx: { $gte: endIdx } }, { idx: { $lt: startIdx } } ] },{$inc:{idx:1}},{multi:true});
            theQueue.update({idx:-1},{$set:{idx:endIdx}});
        }
    },
    removefromQ(index){
        totalVid--;
        theQueue.remove({idx:index});
        theQueue.update({idx:{$gt:index}},{$inc:{idx:-1}},{multi:true});
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
    totalVid = theQueue.find().count();
    curidx = 0;
});