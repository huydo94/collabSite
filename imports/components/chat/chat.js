import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './chat.html';
import { messages } from '../../api/messages.js';
import {theQueue} from "../../api/queue";

class chatCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('messages');

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
        var totalMins = this.min * 60 + this.sec - 1;
        Meteor.call('addToQueue',this.src,totalMins);
        this.src = '';
        this.min = '';
        this.sec = '';
    }
    deleteVid(idx){
        Meteor.call("removefromQ",idx);
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