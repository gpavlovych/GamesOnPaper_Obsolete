/**
 * Created by pavlheo on 7/3/2016.
 */
'use strict';

angular.module('myApp.gameChat', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/gameChat', {
            templateUrl: 'gameChat/gameChat.html',
            controller: 'GameChatCtrl'
        });
    }])

    .service('messageService', ['$http', function ($http) {
        this.getMessages = function () {
            return $http.get('/api/chat');
        };
        this.sendMessage = function (message) {
            return $http.post('/api/chat',{'message':message});
        };
    }])

    .controller('GameChatCtrl', ['messageService','$localStorage', '$scope', 'gameSocketFactory', function(messageService, $localStorage, $scope, gameSocketFactory) {
        gameSocketFactory.forward('chat.message');
        $scope.$on('socket:chat.message', function (event, data) {
            console.log('got a message ' + event.name);
            if (!data.payload) {
                console.log('Error: invalid message. event: ' + event + '; data: ' + JSON.stringify(data));
                return;
            }
            loadMessages();
        });

        loadMessages();

        function loadMessages() {
            messageService.getMessages().success(function (data) {
                $scope.messages = data;
            });
        }

        $scope.sendChatMessage = function () {
            $scope.dataLoading = true;
            messageService.sendMessage($scope.message).success(function (result) {
                $scope.dataLoading = false;
            });
        }
    }]);