'use strict';

/* App Module */

/*/

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',

  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/phones'
      });
  }]);

//*/

var App = angular.module('App', [
  'ngRoute',

  'Controllers',
]);

App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/Home', {
        templateUrl: 'partials/Home.html',
        controller: 'HomeCtrl'
      }).
	  when('/History', {
        templateUrl: 'partials/History.html',
        controller: 'HistoryCtrl'
      }).
    when('/Tag/:transactionid', {
      templateUrl: 'partials/EditTag.html',
      controller: 'EditTagCtrl'
    }).
    when('/Split/:transactionid', {
        templateUrl: 'partials/Split.html',
        controller: 'SplitCtrl'
      }).
      otherwise({
        redirectTo: '/Home'
      });
  }]);

