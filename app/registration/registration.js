'use strict';

angular.module('myApp.registration', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'registration/registration.html',
            controller: 'RegistrationCtrl',
            controllerAs: 'vm'
        });
    }])

    .directive('uploader', [function() {

        return {
            scope: {
                fileread: "="
            },
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
                $(element).fileinput({
                    overwriteInitial: true,
                    maxFileSize: 1500,
                    showClose: false,
                    showCaption: false,
                    showBrowse: false,
                    browseOnZoneClick: true,
                    previewSettings: {image: {width: "100px", height: attrs['uploaderHeight']}},
                    removeLabel: '',
                    removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
                    removeTitle: 'Cancel or reset changes',
                    elErrorContainer: attrs['uploaderErrorContainer'],
                    msgErrorClass: 'alert alert-block alert-danger',
                    defaultPreviewContent: '<img src="' + attrs['uploaderDefaultImage'] + '" alt="' + attrs['uploaderDefaultImageAlt'] + '" class="kv-preview-data file-preview-image" style="height: ' + attrs['uploaderHeight'] + '"/><h6 class="text-muted">Click to select</h6>',
                    layoutTemplates: {main2: '{preview} {remove} {browse}'},
                    allowedFileExtensions: ["jpg", "png", "gif"]
                });
            }
        };
    }])

    .controller('RegistrationCtrl', ['UserService', '$location', '$rootScope', 'FlashService', function(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;
        vm.goBack = goBack;
        function goBack(){
            window.history.back();
        }
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