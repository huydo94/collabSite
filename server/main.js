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
    addToQueue(src,time,title,imgURL){
        totalVid++;
        var vid = {src:src,time:time,idx:totalVid,title:title,imgURL:imgURL};
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
    },
    seekTo(newTime){
        curtime = newTime;
    },
    selectVid(index){
        lengthCurVid = 0;
        curtime = 0;
        curidx = index-1;
    }
});

Meteor.startup(() => {
    // code to run on server at startup
    totalVid = theQueue.find().count();
    curidx = 0;
});