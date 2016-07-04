'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.services',
  'myApp.registration',
  'myApp.login',
  'myApp.gameTicTacToe',
  'myApp.gameDots',
    'myApp.gameChat',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/gameTicTacToe'});
}]).
run(['$rootScope', '$http', '$location', '$localStorage', function ($rootScope, $http, $location, $localStorage) {
      // keep user logged in after page refresh
      if ($localStorage.currentUser) {
          $http.defaults.headers.common['x-access-token'] = $localStorage.currentUser.token;
          $rootScope.username = $localStorage.currentUser.username;
      }

      // redirect to login page if not logged in and trying to access a restricted page
      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login', '/register'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.currentUser) {
          $location.path('/login');
        }
      });
}]);
