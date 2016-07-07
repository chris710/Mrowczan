/**
 * Created by st3rn on 07/07/16.
 */

angular.module('myApp', [
    'ngRoute',
    'home',
    'signin',
    'userHome'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/home'});
}]);