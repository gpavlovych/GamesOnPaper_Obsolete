/**
 * Created by pavlheo on 5/30/2016.
 */
var polygonService = require('./polygonService.js');

module.exports= {
    getGameData: function () {
        var sizeX = 60;
        var sizeY = 43;
        var dots = new Array(sizeX);
        for (var i = 0; i < sizeX; i++) {
            dots[i] = new Array(sizeY);
            for (var j = 0; j < sizeY; j++) {
                dots[i][j] = {color: 0, free: true};
            }
        }
        var remainingMoves = sizeX * sizeY; //total amount of moves
        var polys = [];
        var scores = {1: {playerName: 'red', score: 0}, 2: {playerName: 'blue', score: 0}};
        return {dots: dots, polys: polys, scores: scores, remainingMoves: remainingMoves};
    },
    makeTurn: function (data, color, indexX, indexY) {
        function wave(i, j, markedProperty, enemyVertices) {
            var waveFront = [];
            var goalReached = false;
            var marked = [];

            function pushIfAccessible(item) {
                if ((item.x < 0 || item.x >= data.dots.length) || (item.y < 0 || item.y >= data.dots[item.x].length)) {
                    goalReached = true;
                    return;
                }
                var currentCell = data.dots[item.x][item.y];
                if (currentCell.color == 3 - data.dots[i][j].color) {
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
            data.polys = data.polys || [];
            for (var i = 0; i < data.polys.length; i++) {
                if ((poly1ContainsInPoly2(data.polys[i].path, poly.path))) {
                    data.polys.splice(i, 1);
                    i--;
                }
            }
            data.polys.push(poly);
        }

        function countScores() {
            for (var scoreIndex in data.scores) {
                data.scores[scoreIndex].score = 0;
            }

            for (var i = 0; i < data.dots.length; i++) {
                for (var j = 0; j < data.dots[i].length; j++)
                    if (data.scores.hasOwnProperty(data.dots[i][j].color)) {
                        data.scores[data.dots[i][j].color].score++;
                    }
            }
        }

        function canDoAMove(indexX, indexY) {
            if (data.dots[indexX][indexY].color == 0) {
                var containsInPoly = false;
                for (var polyIndex in data.polys) {
                    var poly = data.polys[polyIndex];
                    var path = poly.path;
                    containsInPoly = containsInPoly || polygonService.checkPointInsidePoly({
                        x: indexX,
                        y: indexY
                    }, path);
                }
                if (!containsInPoly) {
                    return true;
                }
            }
            return false;
        }

        function countRemainingMoves() {
            data.remainingMoves = 0;
            for (var i = 0; i < data.dots.length; i++) {
                for (var j = 0; j < data.dots[i].length; j++)
                    if (canDoAMove(i, j)) {
                        data.remainingMoves++;
                    }
            }
        }

        if (canDoAMove(indexX, indexY)) {
            data.dots[indexX][indexY].color = color;
            var lostPoints = [];
            for (var i = 0; i < data.dots.length; i++) {
                for (var j = 0; j < data.dots[i].length; j++) {
                    if (data.dots[i][j].color == 3 - color) {
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
                data.dots[pointInfo.x][pointInfo.y].color = 3 - data.dots[pointInfo.x][pointInfo.y].color;
                var polys = searchFor(pointInfo.enemyVertices);
                while (polys.length > 0) {
                    var path = polys.pop();
                    addPolyAndRemoveAllWhichFullyBelongTo({
                        path: path,
                        color: data.dots[pointInfo.x][pointInfo.y].color
                    });
                }
            }
            countScores();
            countRemainingMoves();
            return true;
        }
        return false;
    }
};
