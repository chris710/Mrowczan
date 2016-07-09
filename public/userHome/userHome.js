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
    $scope.edit = {};

    var getAllTask = function () {
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
            //console.log(data);
            //console.log(auth);
            //console.log(JSON.parse(data._items[1].image));
            for(var i=0; i<data._items.length; i++) {
                var img = JSON.parse(data._items[i].image);
                console.log(img);
                $scope.tasks.push({
                    'title': data._items[i].name,
                    'id': data._items[i]._id,
                    'tag':data._items[i]._etag,
                    'image':img
                });
            }
        }).
        error(function(data, status, headers, config) {
            if(status === 401) {
                $location.url('/signin');
            }
            console.log(data, status);
        });
    }
    getAllTask();
    
    $scope.editTask = function(title,id,tag){
        $scope.edit.task = title;
        $scope.edit.id = id;
        $scope.edit.tag = tag;
        console.log(tag);
        $('#editModal').modal('show');
    }

    $scope.update = function () {
        $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
        $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
        $http.defaults.headers.common["Cache-Control"] = "no-cache";
        $http.defaults.headers.common.Pragma = "no-cache";
        $http.defaults.headers.common['Authorization'] = 'Basic '+auth;
        $http.defaults.headers.common['If-Match'] = $scope.edit.tag;
        
        $http({
            method: 'PATCH',
            cache: false,
            url: 'http://127.0.0.1:5000/item/'+$scope.edit.id,
            data: {
                name: $scope.edit.task
            }
        }).
        success(function (data,status,headers,config) {
            $('#editModal').modal('hide');
            getAllTask();
        }).
        error(function(data,status,headers,config) {
            console.log(data, status);
        })
    }
    
    $scope.deletion = {};
    
    $scope.confirmDelete = function (id, tag) {
        $scope.deletion.id = id;
        $scope.deletion.tag = tag;
        $('#deleteModal').modal('show');
    }
    
    $scope.deleteTask = function(){
		$http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
        $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
		$http.defaults.headers.common["Cache-Control"] = "no-cache";
        $http.defaults.headers.common.Pragma = "no-cache";
        $http.defaults.headers.common['Authorization'] = 'Basic '+auth;
		$http.defaults.headers.common['If-Match'] = $scope.deletion.tag;

		$http({
            method: 'DELETE',
            cache: false, 
            url: 'http://127.0.0.1:5000/item/'+ $scope.deletion.id}).
		    success(function(data, status, headers, config) {
                $('#deleteModal').modal('hide');
                getAllTask();
		    }).
		    error(function(data, status, headers, config) {
		        console.log(data,status);
		    });	
	}
    
}]);
