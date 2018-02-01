import angular from 'angular';
import angularMeteor from 'angular-meteor';
import collab from '../imports/components/collab/collab';
import chat  from '../imports/components/chat/chat';
import '../imports/startup/accounts-config.js';

angular.module('trilltv', [
  angularMeteor,
  collab.name,
  chat.name,
  'accounts.ui'
]);
