/**
 * Created by st3rn on 28/08/16.
 */

'use strict';

angular.module('b', ['ngRoute', 'myAppService'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/b', {
            templateUrl: '../b/b.html',
            controller: 'BCtrl'
        });
    }])
    .controller('BCtrl', ['$scope', 'CommonProp', '$http', '$location', function($scope, CommonProp, $http, $location) {
        var auth = CommonProp.getUserAuth();
        var user = CommonProp.getUser();
        var nextlink;
        var previouslink;
        var next = false;
        var prev = false;
        $scope.edit = {};
        $scope.user = CommonProp.getUser();
        
        
        //TODO get all threads
        var getAllThreads = function() {
            $scope.threads = [];
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
            $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
            $http.defaults.headers.common["Cache-Control"] = "no-cache";
            $http.defaults.headers.common.Pragma = "no-cache";
            $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

            $http({             //wysyłanie żądania do API
                method: 'GET',
                cache: false,
                url: 'http://127.0.0.1:5000/thread?sort=[("_created",-1)]&max_results=5'
            }).
            success(function(data, status, headers, config){
                console.log(data);
                for(var i=0; i<data._items.length; i++) {
                    //var img = JSON.parse(data._items[i].image);
                    $scope.threads.push({
                        /*'title': data._items[i].name,
                        'id': data._items[i]._id,
                        'tag':data._items[i]._etag,
                        //'image':img,
                        'op':data._items[i].op*/
                        'name': data._items[i].name,
                        'op':data._items[i].op,
                        'tasks': [],
                        'id': data._items[i]._id,
                        'tag':data._items[i]._etag,
                    });
                    getAllTasks(data._items[i]._id, i)
                }
                if(data._links.next != null) {
                    $scope.next = true;
                    nextlink = data._links.next.href;
                } else {
                    $scope.next = false;
                }
                if(data._links.prev != null) {
                    $scope.prev = true;
                    previouslink = data._links.prev.href;
                } else {
                    $scope.prev = false;
                }
            }).
            error(function(data, status, headers, config) {
                if(status === 401) {
                    $location.url('/signin');
                }
                console.log(data, status);
            });
            
        };
        getAllThreads();

        var getAllTasks = function (thread, index) {
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
            $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
            $http.defaults.headers.common["Cache-Control"] = "no-cache";
            $http.defaults.headers.common.Pragma = "no-cache";
            $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

            $http({             //wysyłanie żądania do API
                method: 'GET',
                cache: false,
                url: 'http://127.0.0.1:5000/item?where={"thread":"'+thread+'"}&max_results=5'
            }).
            success(function(data, status, headers, config){
                for(var i=0; i<data._items.length; i++) {
                    var img = JSON.parse(data._items[i].image);
                    $scope.threads[index].tasks.push({
                        'title': data._items[i].name,
                        'id': data._items[i]._id,
                        'tag':data._items[i]._etag,
                        'image':img,
                        'username':data._items[i].username
                    });
                }
                //console.log($scope.threads[i]);
                //console.log(data._links.next.href);
                /*if(data._links.next != null) {
                    $scope.next = true;
                    nextlink = data._links.next.href;
                } else {
                    $scope.next = false;
                }
                if(data._links.prev != null) {
                    $scope.prev = true;
                    previouslink = data._links.prev.href;
                } else {
                    $scope.prev = false;
                }*/
            }).
            error(function(data, status, headers, config) {
                if(status === 401) {
                    $location.url('/signin');
                }
                console.log(data, status);
            });
        };

        $scope.editTask = function(title,id,tag){
            $scope.edit.task = title;
            $scope.edit.id = id;
            $scope.edit.tag = tag;
            console.log(tag);
            $('#editModal').modal('show');
        };

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
                getAllThreads();
            }).
            error(function(data,status,headers,config) {
                console.log(data, status);
            })
        };

        $scope.deletion = {};

        $scope.confirmDelete = function (id, tag) {
            $scope.deletion.id = id;
            $scope.deletion.tag = tag;
            $('#deleteModal').modal('show');
        };

        $scope.deleteThread = function(){     //TODO delete thread
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
            $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
            $http.defaults.headers.common["Cache-Control"] = "no-cache";
            $http.defaults.headers.common.Pragma = "no-cache";
            $http.defaults.headers.common['Authorization'] = 'Basic '+auth;
            $http.defaults.headers.common['If-Match'] = $scope.deletion.tag;

            $http({
                method: 'DELETE',
                cache: false,
                url: 'http://127.0.0.1:5000/thread/'+ $scope.deletion.id}).
            success(function(data, status, headers, config) {
                $('#deleteModal').modal('hide');
                getAllThreads();
            }).
            error(function(data, status, headers, config) {
                console.log(data,status);
            });
        };

        $scope.loadNext = function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
            $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
            $http.defaults.headers.common["Cache-Control"] = "no-cache";
            $http.defaults.headers.common.Pragma = "no-cache";
            $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

            $scope.threads = [];
            $http({             //wysyłanie żądania do API
                method: 'GET',
                cache: false,
                url: "http://127.0.0.1:5000/"+nextlink
            }).
            success(function(data, status, headers, config){
                console.log(data);
                for(var i=0; i<data._items.length; i++) {
                    $scope.threads.push({
                        'name': data._items[i].name,
                        'op':data._items[i].op,
                        'tasks': [],
                        'id': data._items[i]._id,
                    });
                    getAllTasks(data._items[i]._id, i)
                }
                if(data._links.next != null) {
                    $scope.next = true;
                    nextlink = data._links.next.href;
                } else {
                    $scope.next = false;
                }
                if(data._links.prev != null) {
                    $scope.prev = true;
                    previouslink = data._links.prev.href;
                } else {
                    $scope.prev = false;
                }
            }).
            error(function(data, status, headers, config) {
                if(status === 401) {
                    $location.url('/signin');
                }
                console.log(data, status);
            });
        };

        $scope.loadPrev = function(){
            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
            $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
            $http.defaults.headers.common["Cache-Control"] = "no-cache";
            $http.defaults.headers.common.Pragma = "no-cache";
            $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

            $scope.threads = [];
            $http({             //wysyłanie żądania do API
                method: 'GET',
                cache: false,
                url: "http://127.0.0.1:5000/"+previouslink
            }).
            success(function(data, status, headers, config){
                console.log(data);
                for(var i=0; i<data._items.length; i++) {
                    $scope.threads.push({
                        'name': data._items[i].name,
                        'op':data._items[i].op,
                        'tasks': [],
                        'id': data._items[i]._id,
                    });
                    getAllTasks(data._items[i]._id, i)
                }
                if(data._links.next != null) {
                    $scope.next = true;
                    nextlink = data._links.next.href;
                } else {
                    $scope.next = false;
                }
                if(data._links.prev != null) {
                    $scope.prev = true;
                    previouslink = data._links.prev.href;
                } else {
                    $scope.prev = false;
                }
            });

        };
        
        $scope.addItem = function(title, thread) {
            var auth = CommonProp.getUserAuth();
            var user = CommonProp.getUser();

            $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
            //$http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin"};
            $http.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
            $http.defaults.headers.common["Cache-Control"] = "no-cache";
            $http.defaults.headers.common.Pragma = "no-cache";
            $http.defaults.headers.common['Authorization'] = 'Basic '+auth;

            //var fileName = filedialog();
            console.log(thread);
            if(thread.img === undefined) {
                thread.img = {filetype: "", filename: "", filesize: 0, base64: ""};
            }

            $http({         //przesyłanie żądania do API
                method: 'POST',
                cache: false,
                url: 'http://127.0.0.1:5000/item',      
                data: {
                    name: title,
                    user: user,
                    image: JSON.stringify(thread.img),
                    thread: thread.id                               //TODO dodawanie threada
                }
            })
                .success(function (data, status, headers, config) {
                    //$location.path('/b');
                    getAllThreads();
                })
                .error(function(data, status, headers, config) {
                    if(status === 401) {
                        $location.url('/signin');
                    }
                    console.log(data, status);
                });
        }
    }]);
