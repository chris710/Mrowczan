/**
 * Created by st3rn on 28/08/16.
 */

'use strict';

angular.module('signup', ['base64', 'ngRoute', 'myAppService'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/signup', {
        templateUrl: '../signup/signup.ejs',
        controller: 'SignUpCtrl'
    });
}])
.controller('SignUpCtrl', ['$scope', '$http', '$base64', '$window', '$location', 'CommonProp', function($scope, $http, $base64, $window, $location, CommonProp){
    $scope.signUp = function() {
        var error = null;
        var firstname = $scope.firstname;
        var lastname = $scope.lastname;
        var username = $scope.username;
        var password = $scope.password;
        var phone = $scope.phone.toString();
        var authdata = $base64.encode('admin:admin');
        //var authdata = $base64.encode(admin+':'+admin);
        //var authdata = $base64.encode(username+':'+password);
        $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
        $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
        $http.defaults.headers.common["Cache-Control"] = "no-cache";
        $http.defaults.headers.common.Pragma = "no-cache";
        $http.defaults.headers.common['Authorization'] = 'Basic '+authdata;
        $http({
            method: 'POST',
            cache: false,
            url: 'http://127.0.0.1:5000/user/',
            data: {
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: password,
                phone: phone
            }
        }).
        success(function(data, status, headers, config) {
            console.log(data);
            CommonProp.setUser(data._id);
            CommonProp.setUserAuth(authdata);
            $location.path('/signin');
        }).
        error(function(data, status, headers, config) {
            console.log(data, status);
            if (data._error.code == '400') {
                    $scope.error = 'Username Already Exists!'
            }
            $scope.error = data._issues.username;
        });
    };
}]);
