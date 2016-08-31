/**
 * Created by st3rn on 08/07/16.
 */


'use strict';

angular.module('addItem', ['ngRoute','naif.base64', 'myAppService'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addItem', {
        templateUrl: '../addItem/addItem.html',
        controller: 'AddItemCtrl'
    });
}])
.controller('AddItemCtrl', ['$scope', 'CommonProp', '$http', '$location', function($scope, CommonProp, $http, $location) {
    $scope.files = [];
    $scope.onLoad = function (e, reader, file, fileList, fileObjects, fileObj) {
        /*alert('this is handler for file reader onload event!');
        //TODO make Post visible
        $('#postButton').addClass()*/
    };
    
    var addItem = function(title,threadid) {
        var auth = CommonProp.getUserAuth();
        var user = CommonProp.getUser();

        $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
        //$http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin"};
        $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
        $http.defaults.headers.common["Cache-Control"] = "no-cache";
        $http.defaults.headers.common.Pragma = "no-cache";
        $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

        //var fileName = filedialog();
        if($scope.img === undefined) {
            $scope.img = {filetype: "", filename: "", filesize: 0, base64: ""};
        }

        $http({         //przesyłanie żądania do API
            method: 'POST',
            cache: false,
            url: 'http://127.0.0.1:5000/item',
            data: {
                name: title,
                user: user,
                image: JSON.stringify($scope.img),
                thread: threadid
            }
        })
            .success(function (data, status, headers, config) {
                $location.path('/userHome');
            })
            .error(function(data, status, headers, config) {
                if(status === 401) {
                    $location.url('/signin');
                }
                console.log(data, status);
            });
    };
    
    $scope.addThread = function(title) {
        var auth = CommonProp.getUserAuth();
        var user = CommonProp.getUser();

        $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
        //$http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin"};
        $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
        $http.defaults.headers.common["Cache-Control"] = "no-cache";
        $http.defaults.headers.common.Pragma = "no-cache";
        $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

        //var fileName = filedialog();
        console.log($scope.img);
        if($scope.img === undefined) {
            $scope.img = {filetype: "", filename: "", filesize: 0, base64: ""};
        }

        $http({         //przesyłanie żądania do API
            method: 'POST',
            cache: false,
            url: 'http://127.0.0.1:5000/thread',      
            //url: 'http://localhost:5000/item',
            data: {
                name: title,
                op: user,
                //firstpost: addItem(title, threadid)
            }
        })
            .success(function (data, status, headers, config) {
                addItem(title,data._id)
                $location.path('/userHome');
            })
            .error(function(data, status, headers, config) {
                if(status === 401) {
                    $location.url('/signin');
                }
                console.log(data, status);
            });
    };
    
}]);