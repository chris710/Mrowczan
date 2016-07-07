/**
 * Created by st3rn on 07/07/16.
 */

'use strict';

angular.module('home', ['ngRoute'])
    
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: '../home/home.html',
        controller: 'HomeCtrl'
    });
}])


.controller('HomeCtrl', [function() {

}]);