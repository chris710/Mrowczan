/**
 * Created by st3rn on 07/07/16.
 */

'use strict';

angular.module('userHome', ['ngRoute', 'myAppService'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/userHome', {
        templateUrl: '../userHome/userHome.html',
        controller: 'UserHomeCtrl'
    });
}])
.controller('UserHomeCtrl', ['$scope', 'CommonProp', '$http', '$location', function($scope, CommonProp, $http, $location) {
    var auth = CommonProp.getUserAuth();
    var user = CommonProp.getUser();

    $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
    $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
    $http.defaults.headers.common["Cache-Control"] = "no-cache";
    $http.defaults.headers.common.Pragma = "no-cache";
    $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

    $scope.tasks = [];
    $http({             //wysyłanie żądania do API
        method: 'GET',
        cache: false,
        url: 'http://127.0.0.1:5000/item?where={"username":"'+user+'"}'
    }).
    success(function(data, status, headers, config){
        console.log(data);
        for(var i=0; i<data._items.length; i++) {       //TODO doczytaj jeszcze zdjęcia
            $scope.tasks.push({
                'title': data._items[i].name
            });
        }
    }).
    error(function(data, status, headers, config) {
    console.log(data, status);
    });
}]);
