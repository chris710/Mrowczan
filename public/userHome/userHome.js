/**
 * Created by st3rn on 07/07/16.
 */

'use strict';

angular.module('userHome', ['ngRoute'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/userHome', {
        templateUrl: '../userHome/userHome.html',
        controller: 'UserHomeCtrl'
    });
}])
.controller('UserHomeCtrl', ['$scope', function($scope) {

}]);
