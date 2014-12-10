'use strict';

/*/ Controllers *

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);

*/

var Controllers = angular.module('Controllers', []);

Controllers.controller('HomeCtrl', ['$scope', '$http',
  function($scope, $http) {

/*
	d3.json("./phones/testdata.json", function(data) {
	  custom_bubble_chart.init(data, "vis");
	});
  */
  $http({method: 'GET', url: '/tags'}).success(function(Tags){

  $http({method: 'GET', url: '/transactions'}).
    success(function(data, status, headers, config) {
      $scope.data = data;

      custom_bubble_chart.init(data, "vis", Tags);

    }).
    error(function(data, status, headers, config) {
      alert('error retrieving data');
    });

  });

	/*
    $('#view_selection a').click(function() {
      var view_type = $(this).attr('id');
      $('#view_selection a').removeClass('active');
      $(this).toggleClass('active');
      custom_bubble_chart.toggle_view(view_type);
      return false;
    });*/

  }]);

Controllers.controller ('HistoryCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.loadData = function() {
      $http({
        method: 'GET',
        url: '/transactions'
      }).success(function(data, status, headers, config) {
        $scope.data = data;
      }).error(function(data, status, headers, config) {
        alert('error retrieving data');
      });
    }

    $scope.loadData();
    
  }]);

Controllers.controller('EditTagCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

    $scope.LoadTransaction = function(){
      $http({
        method: 'GET',
        url: '/transactions/' + $routeParams.transactionid
      }).success(function(data){
        $scope.transaction = data;
      }).error(function(err){
        alert(err);
      });
    }

    $scope.ChangeTag = function() {

      $http({
        method: "put",
        url: "/transactions/" + $routeParams.transactionid + "/tags",
        data: {
          tags: $scope.tag
        }
      }).success(function(data) {
        $scope.LoadTransaction();

        $scope.result = data.msg;

      }).error(function(err){
        console.log(err);
      });

    }

    $scope.LoadTransaction();

}]);

Controllers.controller('NavCtrl', ['$scope', '$location', 
  function($scope, $location) {

    $scope.GoTo = function(Page) {
      $location.path(Page);
    };

}]);

Controllers.controller('SplitCtrl', ['$scope', '$location', '$routeParams', '$http', '$route',
  function($scope, $location, $routeParams, $http, $route) {

     $http({
        method: "get",
        url: "/transactions/" + $routeParams.transactionid,
        
      }).success(function(data) {
        $scope.transaction_id = data._id;
        $scope.Amount1 = data.amount;
        $scope.Amount2 = 0;
        $scope.tag1 = data.tags;
        $scope.tag2 = data.tags;
        $scope.transaction_amount = data.amount;
      }).error(function(err){
        console.log(err);
      });

    $scope.GoTo = function(Page) {
      $location.path(Page);
      $route.reload();
    };

    $http({
      method: "get",
      url: "/tags"

    }).success(function(data) {
      $scope.tags = data.sort();
    }).error(function(err){

    });

    $scope.Balance1 = function() {
      var a1 = parseFloat($scope.Amount1);
      if (a1<=0) {
        console.log("I'm sorry, that is an invalid amount, please try again");
      }
      $scope.Amount2 = $scope.transaction_amount - a1;
    };

    $scope.Balance2 = function() {
      var a2 = parseFloat($scope.Amount2);
      if (a2<=0) {
        console.log("I'm sorry, that is an invalid amount, please try again");
      }
      $scope.Amount1 = $scope.transaction_amount - a2;
    };

    $scope.SubmitSplit = function(){

      $http({
        method: "POST",
        url: "/transactions/" + $scope.transaction_id + "/split",
        data: {
          amount1: $scope.Amount1,
          tag1: $scope.tag1,
          tag2: $scope.tag2
        }
      }).success(function(data){
        $scope.GoTo('/Home');
      }).error(function(err) {
        $scope.err = err;
      });
    };

}]);

Controllers.controller('NavCtrl', ['$scope', '$location', '$route',
  function($scope, $location, $route) {

    $scope.GoTo = function(Page) {
      $location.path(Page);
      $route.reload();
    };

}]);



