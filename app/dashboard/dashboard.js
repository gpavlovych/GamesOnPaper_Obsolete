/**
 * Created by pavlheo on 8/25/2016.
 */
/**
 * Created by pavlheo on 7/3/2016.
 */
'use strict';

angular.module('myApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])
.controller("DashboardCtrl", ['$scope', '$rootScope', function($scope, $rootScope){
        $scope.gamesToBeCreated = [
            "Dots",
            "TicTacToe"
        ];
        $scope.incomingInvitations = [
            {
                "userPic": "http://www3.pictures.zimbio.com/gi/Lisa+Ann+Adult+Video+News+Awards+Hard+Rock+HLm94w9bJBel.jpg",
                "userName": "Lisa",
                "gameName": "Dots"
            },
            {
                "userPic": "http://www3.pictures.zimbio.com/gi/Lisa+Ann+Adult+Video+News+Awards+Hard+Rock+HLm94w9bJBel.jpg",
                "userName": "Lisa",
                "gameName": "TicTacToe"
            },
            {
                "userPic": "images/user-unknown.png",
                "userName": "Anonymous",
                "gameName": "TicTacToe"
            }
        ];
        $scope.outgoingInvitations = [
            {
                "userPic": "http://dzwnexfz53ofs.cloudfront.net/headshots/mandingo_m_mandingo_adt_c%20.jpg",
                "userName": "Mandingo",
                "gameName": "Dots"
            },
            {
                "userPic": "http://www3.pictures.zimbio.com/gi/Lisa+Ann+Adult+Video+News+Awards+Hard+Rock+HLm94w9bJBel.jpg",
                "userName": "Lisa",
                "gameName": "TicTacToe"
            },
            {
                "userPic": "images/user-unknown.png",
                "userName": "Anonymous",
                "gameName": "TicTacToe"
            }
        ];
        $scope.activeGames = [
            {
                "userPic": "http://www3.pictures.zimbio.com/gi/Lisa+Ann+Adult+Video+News+Awards+Hard+Rock+HLm94w9bJBel.jpg",
                "userName": "Lisa",
                "gameName": "Dots",
                "yourScore": 3,
                "opponentScore": 4
            },
            {
                "userPic": "images/user-unknown.png",
                "userName": "Anonymous",
                "gameName": "TicTacToe",
                "yourScore": 4,
                "opponentScore": 4
            },
            {
                "userPic": "http://dzwnexfz53ofs.cloudfront.net/headshots/mandingo_m_mandingo_adt_c%20.jpg",
                "userName": "Mandingo",
                "gameName": "TicTacToe",
                "yourScore": 14,
                "finishedBy": "Mandingo",
                "opponentScore": 4
            },
            {
                "userPic": "http://dzwnexfz53ofs.cloudfront.net/headshots/mandingo_m_mandingo_adt_c%20.jpg",
                "userName": "Mandingo",
                "gameName": "TicTacToe",
                "yourScore": 15,
                "finishedBy": $rootScope.user.username,
                "opponentScore": 4
            }
        ];
        $scope.finishedGames = [
            {
                "userPic": "http://www3.pictures.zimbio.com/gi/Lisa+Ann+Adult+Video+News+Awards+Hard+Rock+HLm94w9bJBel.jpg",
                "userName": "Lisa",
                "gameName": "Dots",
                "yourScore": 3,
                "opponentScore": 4,
                "endDate": new Date()
            },
            {
                "userPic": "images/user-unknown.png",
                "userName": "Anonymous",
                "gameName": "TicTacToe",
                "yourScore": 4,
                "opponentScore": 4,
                "endDate": new Date()
            },
            {
                "userPic": "http://dzwnexfz53ofs.cloudfront.net/headshots/mandingo_m_mandingo_adt_c%20.jpg",
                "userName": "Mandingo",
                "gameName": "TicTacToe",
                "yourScore": 14,
                "endDate": new Date(),
                "opponentScore": 4
            },
            {
                "userPic": "http://dzwnexfz53ofs.cloudfront.net/headshots/mandingo_m_mandingo_adt_c%20.jpg",
                "userName": "Mandingo",
                "gameName": "TicTacToe",
                "yourScore": 15,
                "endDate": new Date(),
                "opponentScore": 4
            }
        ];
        $scope.top100Players = [
            {
                "userPic": "http://dzwnexfz53ofs.cloudfront.net/headshots/mandingo_m_mandingo_adt_c%20.jpg",
                "userName": "Mandingo"
            },
            {
                "userPic": "http://www3.pictures.zimbio.com/gi/Lisa+Ann+Adult+Video+News+Awards+Hard+Rock+HLm94w9bJBel.jpg",
                "userName": "Lisa"
            }
        ];

    }]);