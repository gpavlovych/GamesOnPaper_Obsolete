'use strict';

angular.module('myApp.registration', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'registration/registration.html',
            controller: 'RegistrationCtrl',
            controllerAs: 'vm'
        });
    }])

    .controller('RegistrationCtrl', ['UserService', '$location', '$rootScope', 'FlashService', function(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }]);