import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './chat.html';
import { messages } from '../../api/messages.js';
import { theQueue } from '../../api/queue.js';
import {parse,toSeconds} from 'iso8601-duration';

class chatCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('messages');
        this.subscribe('theQueue');

        this.helpers({
            messages() {
                return messages.find({});
            },
            queue(){
                return theQueue.find({},{sort:{idx:1}});
            }
        });
    }

    addVid(){
        var videoid = YouTubeGetID(this.src);
        $.getJSON("https://www.googleapis.com/youtube/v3/videos", {
            key: "AIzaSyB2jJKeXzATYjACSJuCju5Chx5B4tmrI3k",
            part: "snippet,contentDetails",
            id: videoid
        }, function(data) {
            var title = data.items[0].snippet.title;
            var imgURL = data.items[0].snippet.thumbnails.medium.url;
            var durationStr = data.items[0].contentDetails.duration;
            var duration = Math.round(toSeconds(parse(durationStr)));
            Meteor.call('addToQueue',videoid,duration,title,imgURL);
        });
        this.src = '';
    }
    deleteVid(idx){
        Meteor.call("removefromQ",idx);
    }

    selectVid(idx){
        Meteor.call("selectVid",idx);
        setTimeout(function() {
            synchronize();
        }, 1000);
    }

    myColor(){
        return Meteor.user().profile.color;
    }

    addMsg(newMsg) {
        // Insert a task into the collection
        if (!Meteor.userId()) {
            alert("You need to log in to do this.");
            return;
        }
        if(newMsg.trim() == ''){
            return;
        }
        Meteor.call('addMsg',newMsg);
        // Clear form
        this.newMsg = '';
        $('#msgBox').stop().animate({
            scrollTop: $('#msgBox')[0].scrollHeight
        }, 800);
    }

    publicBtn(){
        $(".chatBtn")[0].style.background = 'rgba(0, 0, 0, 0)';
        $(".chatBtn")[1].style.background = 'rgba(0, 0, 0, 1)';
    }
    friendBtn(){
        $(".chatBtn")[0].style.background = 'rgba(0, 0, 0, 1)';
        $(".chatBtn")[1].style.background = 'rgba(0, 0, 0, 0)';
    }

}

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

$(function() {
    $(".inputBox").keypress(function (e) {
        if(e.which == 13) {
            $('.submit', $(e.target.form)).click();
            e.preventDefault();
            return false;
        }
    });

    $(".inputBox").focus(function(){
        $('#msgBox').stop().animate({
            scrollTop: $('#msgBox')[0].scrollHeight
        }, 800);
    });
});


export default angular.module('chat', [
    angularMeteor
    ])
.component('chat', {
    templateUrl: 'imports/components/chat/chat.html',
    controller: ['$scope', chatCtrl]
});