/**
 * Created by st3rn on 08/07/16.
 */


'use strict';

angular.module('addItem', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addItem', {
        templateUrl: '../addItem/addItem.html',
        controller: 'AddItemCtrl'
    });
}])
.controller('AddItemCtrl', [function() {
    
}]);