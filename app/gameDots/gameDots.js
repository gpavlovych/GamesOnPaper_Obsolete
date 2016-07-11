'use strict';

angular.module('myApp.gameDots', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/gameDots', {
            templateUrl: 'gameDots/gameDots.html',
            controller: 'GameDotsCtrl'
        });
    }])

.service('userService', ['$http', '$localStorage',function ($http, $localStorage) {
        this.getCurrentUser = function () {
            return $localStorage.currentUser;
        };
        this.getAllUsers = function () {
            return $http.get('/api/users');
        };
    }])

.service('playService', ['$http', function ($http) {
        this.get = function () {
            return $http.get('/api/dots');
        };
        this.invite = function (data) {
            return $http.post('/api/dots/invite', data);
        };
        this.accept = function (data) {
            return $http.post('/api/dots/accept', data);
        };
        this.decline = function (data) {
            return $http.post('/api/dots/decline', data);
        };
        this.play = function (data) {
            return $http.post('/api/dots/play', data);
        };
        this.giveup = function (data) {
            return $http.post('/api/dots/giveup', data);
        };
    }])

.directive('ngCanvas',[function() {
        function link(scope, element, attrs) {
            console.info('element: ' + element);//scope.$watch()
            scope.$watch('data', function (newValue, oldValue) {
                var ppi = 72;//
                var pixelMm = ppi / 25.4;
                var pixelGridSize = pixelMm * 5;
                var dotSize = 6;
                ctx.drawImage(element[0].childNodes[0], 0, 0);
                if (typeof(newValue) == 'undefined' || newValue == null) {
                    return;
                }
                for (var indexX = 0; indexX < newValue.dots.length; indexX++) {
                    for (var indexY = 0; indexY < newValue.dots[indexX].length; indexY++) {
                        if (newValue.dots[indexX][indexY].color == 2 && newValue.dots[indexX][indexY].free) {
                            ctx.fillStyle = "blue";
                        } else if (newValue.dots[indexX][indexY].color == 1 && newValue.dots[indexX][indexY].free) {
                            ctx.fillStyle = "red";
                        } else if (!newValue.dots[indexX][indexY].free) {
                            ctx.fillStyle = "gray";
                        }
                        else {
                            continue;
                        }
                        ctx.fillRect(indexX * pixelGridSize - dotSize / 2, indexY * pixelGridSize - dotSize / 2, dotSize, dotSize);
                    }
                }
                for (var polyIndex in newValue.polys) {
                    var poly = newValue.polys[polyIndex];
                    var path = poly.path;
                    ctx.beginPath();
                    ctx.moveTo(path[0].x * pixelGridSize, path[0].y * pixelGridSize);
                    for (var i = 1; i <= path.length; i++)
                        ctx.lineTo(path[i % path.length].x * pixelGridSize, path[i % path.length].y * pixelGridSize);
                    ctx.stroke();
                }
            }, true);
            element.bind('mousedown', function (event) {
                var lastX, lastY;
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else { // Firefox compatibility
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }
                var ppi = 72;//
                var pixelMm = ppi / 25.4;
                var pixelGridSize = pixelMm * 5;
                var dotSize = 2;
                var indexX = Math.round(lastX / pixelGridSize);
                var indexY = Math.round(lastY / pixelGridSize);
                console.log('x ' + indexX + ' y ' + indexY);
                // begins new line

                scope.$apply(function (self) {
                    scope.indexX = indexX;
                    scope.indexY = indexY;
                    self.callback({indexX: scope.indexX, indexY: scope.indexY});
                });


            });
            var ctx = element[0].getContext('2d');
            ctx.drawImage(element[0].childNodes[0], 0, 0);
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
                callback: '&'
            },
            link: link,
            template: '<canvas id="myCanvas" width="842px" height="597px" style="border:1px solid #d3d3d3;">' +
            '<img src="images/squarelinedsheet.png" style="display: none"/>' +
            '</canvas>'
        };
    }])

.controller('GameDotsCtrl', ['$scope','$uibModal','$timeout','$log','playService','userService','gameSocketFactory',function($scope,$uibModal,$timeout, $log, playService,userService, gameSocketFactory) {
        gameSocketFactory.forward('dots.invited', $scope);
        gameSocketFactory.forward('dots.accepted', $scope);
        gameSocketFactory.forward('dots.declined', $scope);
        gameSocketFactory.forward('dots.played', $scope);
        gameSocketFactory.forward('dots.givenup', $scope);
        $scope.currentUser = userService.getCurrentUser();
        $scope.$on('socket:dots.invited', function (event, data) {
            console.log('got a message ' + event.name);
            console.log('data: ' + JSON.stringify(data));
            $scope.game = data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "invited.html",
                controller: "InvitedModalInstanceCtrl",
                resolve: {
                    gameDots: function () {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function (gameDots) {
                playService
                    .accept({gameId: gameDots._id})
                    .success(function (data) {
                        $scope.game = data;
                    });
            }, function () {
                playService
                    .decline({gameId: gameDots._id})
                    .success(function () {
                        $scope.game = null;
                    });
            });
        });
        $scope.$on('socket:dots.accepted', function (event, data) {
            console.log('got a message ' + event.name);
            console.log('data: ' + JSON.stringify(data));
            $scope.game = data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "accepted.html",
                controller: "AcceptedModalInstanceCtrl",
                resolve: {
                    gameDots: function () {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function () {
                $log.info('Modal confirmed at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        });
        $scope.$on('socket:dots.declined', function (event, data) {
            console.log('got a message ' + event.name);
            console.log('data: ' + JSON.stringify(data));
            $scope.game = data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "declined.html",
                controller: "DeclinedModalInstanceCtrl",
                resolve: {
                    gameDots: function () {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function (gameDots) {
                $log.info('Modal confirmed at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        });
        $scope.$on('socket:dots.played', function (event, data) {
            console.log('got a message ' + event.name);
            console.log('data: ' + JSON.stringify(data));
            $scope.game = data;
            //TODO: if finished, notify user about
        });
        $scope.$on('socket:dots.givenup', function (event, data) {
            console.log('got a message ' + event.name);
            console.log('data: ' + JSON.stringify(data));
            $scope.game = data;
            //TODO: congratulations you've won, opponent just has given up.
        });
        playService
            .get()
            .success(function (data) {
                $scope.game = data;
            })
            .error(function (data, status) {
                $scope.game = null;
            })
            .finally(function () {
                if (!$scope.game) {
                    userService.getAllUsers().success(function (data) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: "invite.html",
                            controller: "InviteModalInstanceCtrl",
                            resolve: {
                                users: function () {
                                    return data;
                                }
                            }
                        });

                        modalInstance.result.then(function (selectedItem) {
                            playService
                                .invite({userId: selectedItem._id})
                                .success(function (data) {
                                    $scope.game = data;
                                })
                                .error(function () {
                                    $scope.game = null;
                                });
                        }, function () {
                            $scope.game = null;
                        });
                    });
                }
            });

        $scope.callback = function (indexX, indexY) {
            playService
                .play({gameId: $scope.game._id, indexX: indexX, indexY: indexY})
                .success(function (data) {
                    if (data) {
                        $scope.game = data;
                        //TODO: when finished, notify user about
                    }
                })
                .error(function (data, status) {
                    console.error('Repos error', status, data);
                })
                .finally(function () {
                    console.log("finally finished repos");
                });
        };
        $scope.giveUp = function () {
            playService
                .play({gameId: $scope.game._id})
                .success(function (data) {
                    if (data) {
                        $scope.game = data;
                        //TODO: sadly, you so weak to give up
                    }
                })
                .error(function (data, status) {
                    console.error('Repos error', status, data);
                })
                .finally(function () {
                    console.log("finally finished repos");
                });
        };
    }])
    .controller('InvitedModalInstanceCtrl', function ($scope, $uibModalInstance, gameDots) {

        $scope.gameDots = gameDots;

        $scope.ok = function () {
            $uibModalInstance.close($scope.gameDots);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('InviteModalInstanceCtrl', function ($scope, $uibModalInstance, users) {

        $scope.users = users;
        $scope.selected = {
            item: $scope.users[0]
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.user);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('AcceptedModalInstanceCtrl', function ($scope, $uibModalInstance, gameDots) {
        $scope.gameDots = gameDots;
        $scope.ok = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('DeclinedModalInstanceCtrl', function ($scope, $uibModalInstance, gameDots) {
        $scope.gameDots = gameDots;
        $scope.ok = function () {
            $uibModalInstance.close($scope.gameDots);
        };
    });