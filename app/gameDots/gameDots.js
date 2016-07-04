'use strict';

angular.module('myApp.gameDots', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/gameDots', {
            templateUrl: 'gameDots/gameDots.html',
            controller: 'GameDotsCtrl'
        });
    }])

.service('playService', ['$http', function ($http) {
        this.getData = function () {
            return $http.get('/api/dots');
        };
        this.makeTurn = function (data, color, indexX, indexY) {
            return $http.post('/api/dots',{data:data,color:color, indexX:indexX, indexY: indexY});
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
                if (typeof(newValue) == 'undefined' || newValue == null){
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
                    self.callback({data: scope.data, player: scope.player, indexX: scope.indexX, indexY: scope.indexY});
                });


            });
            var ctx = element[0].getContext('2d');
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
                player: '=',
                callback: '&'
            },
            link: link,
            template: '<canvas id="myCanvas" width="842px" height="597px" style="border:1px solid #d3d3d3;">' +
            '<img src="images/squarelinedsheet.png" style="display: none"/>' +
            '</canvas>'
        };
    }])

.controller('GameDotsCtrl', ['$scope','playService',function($scope, playService) {
        $scope.stub = 'this is a stub property!';
        $scope.player = 1;
        playService.getData().success(function (data) {
            $scope.data = data;
        })
            .error(function (data, status) {
                console.error('Repos error', status, data);
            })
            .finally(function () {
                console.log("finally finished repos");
            });
        $scope.callback = function (dots, player, indexX, indexY) {
            playService.makeTurn(dots, player, indexX, indexY).success(function (data) {
                if (data.result) {
                    $scope.data = data.data;
                    if ($scope.player == 2) {
                        $scope.player = 1;
                    } else {
                        $scope.player = 2;
                    }
                }
            })
                .error(function (data, status) {
                console.error('Repos error', status, data);
            })
                .finally(function () {
                    console.log("finally finished repos");
                });
        };
    }]);