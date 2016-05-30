'use strict';

angular.module('myApp.view3', ['ngRoute', 'myApp.geometry'])

.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view3', {
            templateUrl: 'view3/view3.html',
            controller: 'View3Ctrl'
        });
    }])

.service('playService', ['polygonService', function (polygonService) {
        this.getDots = function () {
            var sizeX = 60;
            var sizeY = 43;
            var dots = new Array(sizeX);
            for (var i = 0; i < sizeX; i++) {
                dots[i] = new Array(sizeY);
                for (var j = 0; j < sizeY; j++) {
                    dots[i][j] = {color: 0, free: true};
                }
            }
            dots.polys = [];
            return dots;
        }
        this.makeTurn = function (dots, color, indexX, indexY) {
            function isBoundaryReachable(i, j, dots, color, markedProperty, enemyDots) {
                if ((i < 0 || i >= dots.length) || (j < 0 || j >= dots[i].length)) {
                    return true;
                }
                if (dots[i][j].hasOwnProperty(markedProperty)) {
                    return false;
                }
                if (dots[i][j].color == 3 - color) {
                    if (dots[i][j].free) {
                        enemyDots.push({x: i, y: j});
                    }
                    return false;
                }
                dots[i][j][markedProperty] = true;
                markedValues.push(dots[i][j]);
                var result = isBoundaryReachable(i - 1, j, dots, color, markedProperty) ||
                    isBoundaryReachable(i, j - 1, dots, color, markedProperty) ||
                    isBoundaryReachable(i + 1, j, dots, color, markedProperty) ||
                    isBoundaryReachable(i, j + 1, dots, color, markedProperty);
                if (result) {
                    return true;
                }
                delete dots[i][j][markedProperty];
                return false;
            }

            function wave(i, j, markedProperty, enemyVertices) {
                var waveFront = [];
                var goalReached = false;
                var marked = [];

                function pushIfAccessible(item) {
                    if ((item.x < 0 || item.x >= dots.length) || (item.y < 0 || item.y >= dots[item.x].length)) {
                        goalReached = true;
                        return;
                    }
                    var currentCell = dots[item.x][item.y];
                    if (currentCell.color == 3 - dots[i][j].color) {
                        enemyVertices.push(item);
                        return;
                    }
                    if (!currentCell.hasOwnProperty(markedProperty)) {
                        marked.push(currentCell);
                        currentCell[markedProperty] = true;
                        waveFront.push(item);
                    }
                }

                pushIfAccessible({x: i, y: j});
                while (!goalReached && waveFront.length > 0) {
                    var item = waveFront.pop();
                    pushIfAccessible({x: item.x + 1, y: item.y});
                    pushIfAccessible({x: item.x, y: item.y + 1});
                    pushIfAccessible({x: item.x - 1, y: item.y});
                    pushIfAccessible({x: item.x, y: item.y - 1});
                }
                while (marked.length > 0) {
                    delete marked.pop()[markedProperty];
                }
                return goalReached;
            }

            function searchFor(list) {
                function isConnected(u, v) {
                    return u != v &&
                        ((list[u].x - list[v].x) * (list[u].x - list[v].x) <= 1) &&
                        ((list[u].y - list[v].y) * (list[u].y - list[v].y) <= 1);
                }

                function findCycle(u, v) {
                    marked[v] = true;
                    for (var w in list) {
                        if (cycle) return;
                        if (isConnected(v, w)) {
                            if (!marked.hasOwnProperty(w)) {
                                edgeTo[w] = v;
                                findCycle(v, w);
                            }
                            else if (w != u) {
                                edgeTo[w] = v;
                                cycle = [];
                                for (var x = v; x != w && x !== undefined; x = edgeTo[x]) {
                                    cycle.push(x);
                                }
                                cycle.push(w);
                            }
                        }
                    }
                }

                function removeDuplicates() {
                    var u = {}, a = [];
                    for (var i = 0, l = list.length; i < l; ++i) {
                        var propName = list[i].x + "_" + list[i].y;
                        if (u.hasOwnProperty(propName)) {
                            continue;
                        }
                        a.push(list[i]);
                        u[propName] = 1;
                    }
                    list = a;
                }

                var result = [];
                var marked;
                var edgeTo;
                var cycle;

                removeDuplicates();
                for (var listIndex in list) {
                    var cycleStart = listIndex;
                    marked = {};
                    edgeTo = {};
                    cycle = null;
                    findCycle(-1, cycleStart);
                    if (cycle) {
                        var poly = [];
                        while (cycle.length > 0) {
                            poly.push(list[cycle.pop()]);
                        }
                        result.push(poly);
                    }
                }
                return result;
            }

            function poly1ContainsInPoly2(poly1Path, poly2Path) {
                var contains = true;
                for (var vert1PathIndex in poly1Path) {
                    var vert1 = poly1Path[vert1PathIndex];
                    contains = contains && polygonService.checkPointInsidePoly(vert1, poly2Path);
                }
                return contains;
            }

            function addPolyAndRemoveAllWhichFullyBelongTo(poly) {
                if (poly.path.length <= 2) return;
                for (var i = 0; i < dots.polys.length; i++) {
                    if ((poly1ContainsInPoly2(dots.polys[i].path, poly.path))) {
                        dots.polys.splice(i, 1);
                        i--;
                    }
                }
                dots.polys.push(poly);
            }

            function countScores() {
                dots.scores = {1: {playerName: 'red', score: 0}, 2: {playerName: 'blue', score: 0}};
                for (var i = 0; i < dots.length; i++) {
                    for (var j = 0; j < dots[i].length; j++)
                        if (dots.scores.hasOwnProperty(dots[i][j].color)) {
                            dots.scores[dots[i][j].color].score++;
                        }
                }
            }

            if (dots[indexX][indexY].color == 0) {
                var containsInPoly = false;
                for (var polyIndex in dots.polys) {
                    var poly = dots.polys[polyIndex];
                    var path = poly.path;
                    containsInPoly = containsInPoly || polygonService.checkPointInsidePoly({
                        x: indexX,
                        y: indexY
                    }, path);
                }
                if (!containsInPoly) {
                    dots[indexX][indexY].color = color;
                    var lostPoints = [];
                    for (var i = 0; i < dots.length; i++) {
                        for (var j = 0; j < dots[i].length; j++) {
                            if (dots[i][j].color == 3 - color) {
                                var markedValues = [];
                                var enemyVertices = [];
                                var markedProperty = "marked" + Math.floor(Math.random() * 10000000000000001);
                                if (!wave(i, j, markedProperty, enemyVertices)) {
                                    lostPoints.push({x: i, y: j, enemyVertices: enemyVertices});
                                }
                            }
                        }
                    }
                    while (lostPoints.length > 0) {
                        var pointInfo = lostPoints.pop();
                        dots[pointInfo.x][pointInfo.y].color = 3 - dots[pointInfo.x][pointInfo.y].color;
                        var polys = searchFor(pointInfo.enemyVertices);
                        while (polys.length > 0) {
                            var path = polys.pop();
                            addPolyAndRemoveAllWhichFullyBelongTo({
                                path: path,
                                color: dots[pointInfo.x][pointInfo.y].color
                            });
                        }
                    }
                    countScores();
                    return true;
                }
            }
            return false;
        };
    }])

.directive('ngCanvas',[function(polygonService) {
        function link(scope, element, attrs) {
            console.info('element: ' + element);//scope.$watch()
            scope.$watch('dots', function (newValue, oldValue) {
                var ppi = 72;//
                var pixelMm = ppi / 25.4;
                var pixelGridSize = pixelMm * 5;
                var dotSize = 6;
                ctx.drawImage(element[0].childNodes[0], 0, 0);
                for (var indexX = 0; indexX < newValue.length; indexX++) {
                    for (var indexY = 0; indexY < newValue[indexX].length; indexY++) {
                        if (newValue[indexX][indexY].color == 2 && newValue[indexX][indexY].free) {
                            ctx.fillStyle = "blue";
                        } else if (newValue[indexX][indexY].color == 1 && newValue[indexX][indexY].free) {
                            ctx.fillStyle = "red";
                        } else if (!newValue[indexX][indexY].free) {
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
                    self.callback({dots: scope.dots, player: scope.player, indexX: scope.indexX, indexY: scope.indexY});
                });


            });
            var ctx = element[0].getContext('2d');
        }

        return {
            restrict: 'E',
            replace: true,
            scope: {
                dots: '=',
                player: '=',
                callback: '&'
            },
            link: link,
            template: '<canvas id="myCanvas" width="842px" height="597px" style="border:1px solid #d3d3d3;">' +
            '<img src="images/squarelinedsheet.png" style="display: none"/>' +
            '</canvas>'
        };
    }])

.controller('View3Ctrl', ['$scope','polygonService','playService',function($scope, polygonService, playService) {
        $scope.stub = 'this is a stub property!';
        $scope.player = 1;
        $scope.dots = playService.getDots();
        $scope.callback = function (dots, player, indexX, indexY) {
            if (playService.makeTurn(dots, player, indexX, indexY)) {
                if ($scope.player == 2) {
                    $scope.player = 1;
                } else {
                    $scope.player = 2;
                }

            }
        };
    }]);