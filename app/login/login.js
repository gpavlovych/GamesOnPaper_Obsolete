'use strict';

angular.module('myApp.login', ['ngRoute', 'ngStorage'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm'
        });
    }])

    .controller('LoginCtrl', ['$location', 'AuthenticationService', 'FlashService', function ($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        }

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (result) {
                if (result === true) {
                    $location.path('/');
                } else {
                    FlashService.Error('Username or password is incorrect');
                    vm.dataLoading = false;
                }
            });
        }
    }]);