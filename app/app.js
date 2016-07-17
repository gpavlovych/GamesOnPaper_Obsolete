'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute','ngStorage',
  'btford.socket-io',
  'myApp.services',
  'myApp.registration',
  'myApp.login',
  'myApp.gameTicTacToe',
  'myApp.gameDots',
  'myApp.gameChat',
  'myApp.version'
])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/gameTicTacToe'});
    }])

.factory('gameSocketFactory', ['socketFactory', '$localStorage', function (socketFactory, $localStorage) {
        var socket = socketFactory({'ioSocket': io.connect('http://localhost:8188/')});
        socket
            .on('connect', function () {
                console.log("connected");
                socket.emit('authenticate', {token: $localStorage.currentUser.token}); // send the jwt
            });
        return socket;
    }])

.run(['$rootScope', '$http', '$location', '$localStorage', function ($rootScope, $http, $location, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common['x-access-token'] = $localStorage.currentUser.token;
            $rootScope.username = $localStorage.currentUser.username;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function () {
            var publicPages = ['/login', '/register'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/login');
            }
        });
    }]);
