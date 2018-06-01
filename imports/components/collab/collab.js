import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './collab.html';

var currentVid;
var player;

class collabCtrl{
	constructor($scope) {
        $scope.viewModel(this);
        this.helpers({
        });
    }
    like(){
        Meteor.call('likeVid',currentVid);
    }
    dislike(){
        Meteor.call('dislikeVid',currentVid);
    }

    synchronize() {
        synchronize();
    }
    emitTime(){
        Meteor.call("seekTo",player.getCurrentTime());
    }
    turnOn(){
    	Meteor.call("getVidQ", function(error, result) {
            currentVid = result;
            if (Meteor.isClient) {
                onYouTubeIframeAPIReady = function() {
                    player = new YT.Player("channelQ", {
                        // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
                        width: 854,
                        height:480,
                        videoId: currentVid.src,
                        playerVars: {
                            controls: 1,
                            disablekb: 1,
                            rel : 0
                        },
                        // Events like ready, state change, 
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                };
                YT.load();
            }
        });
    }
}

function synchronize(){
    Meteor.call("getVidQ", function(error, result) {
        currentVid = result;
        player.loadVideoById(currentVid.src, 0, "default");
        player.seekTo(currentVid.time, true);
    });
}


function onPlayerStateChange(event) {
    if (event.data == 0) {
        Meteor.call("getVidQ", function(error, result) {
            currentVid = result;
            event.target.loadVideoById(currentVid.src, 0, "default");
        });
    }
}

function onPlayerReady(event) {
    event.target.seekTo(currentVid.time, true);
}

$(function(){
    $( "#sortable" ).sortable({
      start: function(event,ui){
        ui.item.data( 'start-pos', ui.item.index()+1);
      },
      update: function( event, ui ) {
        Meteor.call("swapOrder",ui.item.data( 'start-pos'),ui.item.index()+1);
      }
  });
    $( "#sortable" ).disableSelection();
});


export default angular.module('collab', [
    angularMeteor
    ]).component('collab', {
        templateUrl: 'imports/components/collab/collab.html',
        controller: ['$scope', collabCtrl]
    });