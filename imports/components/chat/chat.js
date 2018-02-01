import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './chat.html';
import { messages1 } from '../../api/messages.js';
import { messages2 } from '../../api/messages.js';
import { messages3 } from '../../api/messages.js';
import { friendships } from '../../api/friendsDB.js';
import { privateMsgs } from '../../api/messages.js';
import { Session } from 'meteor/session'

var currentFriend = null;
var currentChannel;
var timeloggedin = new Date;
var guest = {
  "background" : "rgba(137, 255, 47, 0.3)",
  "display": "inline-block",
  "float" : "right",
  "clear" : "both",
  //"word-wrap": "break-word",
  //"width":"49%",
  "border-radius":"7px",
  "margin":"5px",
  "margin-left":"50px",
  "padding":"5px"
};
var owner = {
  "background" : "rgba(255, 255, 255, 0.3)",
  "display": "inline-block",
  "float" : "left",
  "clear" : "both",
  //"word-wrap": "break-word",
  //"width":"49%",
  "border-radius":"7px",
  "margin":"5px",
  "margin-right":"50px",
  "padding":"5px"
};

class chatCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    this.subscribe('messages1');
    this.subscribe('messages2');
    this.subscribe('messages3');
    this.subscribe('friendships');
    this.subscribe('privateMsgs', function() {
      var init = privateMsgs.find({createdAt:{$gt:timeloggedin}}).observeChanges({
        added: function(id, doc) {
          if(!init) return;
          var sender = privateMsgs.findOne({_id:id}).sender;
          console.log(currentFriend);
          if(sender != Meteor.user().username && sender != currentFriend){
            $(".chatBtn").eq(1).html('Friends (*)');
            $('.convo:contains("'+sender+'")').css('background-color', 'red');
            //alert(sender+" sent you a message.");
          }
        }
      });
    });
    this.helpers({
      messages() {
        currentChannel = Session.get('currentChannel');
        switch(currentChannel){
          case '1':
          return messages1.find({});
          break;
          case '2':
          return messages2.find({});
          break;
          case '3':
          return messages3.find({});
          break;
          default:
          break;
        }
      },

      privatemessages(){
        currentFriend = Session.get('currentFriend');
        return privateMsgs.find({$or:[{sender:currentFriend},{receiver:currentFriend}]},{sort:{createdAt:1}});
      },

      friendships(){
        return friendships.find({});
      }

    });
  }
  channel(){
    return currentChannel;
  }
  selectFriend(friend){
    $('.convo:contains("'+friend+'")').css('background-color', 'transparent');
    Session.set('currentFriend',friend);
  }
  addprivateMsg(newPM){
    if (!Meteor.userId()) {
      alert("You need to log in to do this.");
      return;
    }
    if(newPM.trim() == ''){
      return;
    }  
    if(currentFriend){
      Meteor.call('addprivateMsg',newPM,currentFriend);
    }
    this.newPM ='';
    $('#privatemsgBox').stop().animate({
      scrollTop: $('#privatemsgBox')[0].scrollHeight
    }, 800);
  }
  myColor(){
    return Meteor.user().profile.color;
  }

  PMdiv(user){
    if (user == Meteor.user().username){
      return owner;
    }
    return guest;
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
    var currentChannel = Session.get('currentChannel');
    Meteor.call('addMsg',newMsg,currentChannel);
    // Clear form
    this.newMsg = '';
    $('#msgBox').stop().animate({
      scrollTop: $('#msgBox')[0].scrollHeight
    }, 800);
  }

  requestFriend(username){
    if (!Meteor.userId()) {
      alert("You need to log in to do this.");
      return;
    }    
    if(Meteor.user().username == username){
      return;
    }
    if(confirm("Send a friend request to "+username+"?") == true){
      Meteor.call('requestFriend',username);
    }else{
      return;
    }   
  }

  acceptFriend(username){
    Meteor.call('acceptFriend',username);
  }

  denyFriend(username){
    Meteor.call('denyFriend',username);
  }

  removeFriend(username){
    if(confirm("Are you really unfriending "+username+"?") == true){
      Meteor.call('removeFriend',username);
    }else{
      return;
    } 
  }
  publicBtn(){
    $(".chatBtn")[0].style.background = 'rgba(0, 0, 0, 0)';
    $(".chatBtn")[1].style.background = 'rgba(0, 0, 0, 1)';
  }
  friendBtn(){
    $(".chatBtn")[0].style.background = 'rgba(0, 0, 0, 1)';
    $(".chatBtn")[1].style.background = 'rgba(0, 0, 0, 0)';
    $(".chatBtn").eq(1).html('Friends');
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
    $('#privatemsgBox').stop().animate({
      scrollTop: $('#privatemsgBox')[0].scrollHeight
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