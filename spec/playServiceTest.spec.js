/**
 * Created by pavlheo on 5/31/2016.
 */
var playService = require('./../playService.js');
var polygonService = require('./../polygonService.js');

describe('playService', function() {
    var sizeX = 60;
    var sizeY = 43;
    it('getGameData', function () {
        var data = playService.getGameData();
        var dots = data.dots;
        expect(dots.length).toBe(sizeX);
        for (var i = 0; i < dots.length; i++) {
            expect(dots[i].length).toBe(sizeY);
            for (var j = 0; j < dots[i].length; j++) {
                expect(dots[i][j].color).toBe(0);
                expect(dots[i][j].free).toBe(true);
            }
        }
        var scores = data.scores;
        expect(scores[1].playerName).toBe("red");
        expect(scores[2].playerName).toBe("blue");
        var polys = data.polys;
        expect(polys.length).toBe(0);
        expect(data.remainingMoves).toBe(sizeX * sizeY);
    });
    it('makeTurn single red dot', function () {
        var data = playService.getGameData();
        playService.makeTurn(data, 1, 3, 5);
        expect(data.remainingMoves).toBe(sizeX * sizeY - 1);
        expect(data.dots[3][5].color).toBe(1);
        expect(data.dots[3][5].free).toBeTruthy();
        expect(data.polys.length).toBe(0);
        expect(data.scores[1].playerName).toBe("red");
        expect(data.scores[1].score).toBe(1);
        expect(data.scores[2].playerName).toBe("blue");
        expect(data.scores[2].score).toBe(0);
    });
    it('makeTurn single red dot surrounded by 4 blue dots', function () {
        var data = playService.getGameData();
        playService.makeTurn(data, 1, 3, 5);
        playService.makeTurn(data, 2, 4, 5);
        playService.makeTurn(data, 2, 2, 5);
        playService.makeTurn(data, 2, 3, 6);
        playService.makeTurn(data, 2, 3, 4);
        expect(data.remainingMoves).toBe(sizeX * sizeY - 5);
        expect(data.dots[3][5].color).toBe(2);
        expect(data.dots[3][5].free).toBeTruthy();
        expect(data.polys.length).toBe(1);
        expect(data.polys[0].color).toBe(2);
        expect(data.polys[0].path.length).toBe(4);
        expect(polygonService.checkPointInsidePoly({x: 3, y: 5}, data.polys[0].path)).toBeTruthy();
        expect(polygonService.checkPolygonSelfIntersect(data.polys[0].path)).toBeFalsy();
        expect(data.scores[1].playerName).toBe("red");
        expect(data.scores[1].score).toBe(0);
        expect(data.scores[2].playerName).toBe("blue");
        expect(data.scores[2].score).toBe(5);
    });
    it('makeTurn single red dot surrounded by 4 blue dots and all is surrounded by 8 red dots', function () {
        var data = playService.getGameData();
        playService.makeTurn(data, 1, 5, 5);

        playService.makeTurn(data, 2, 4, 5);
        playService.makeTurn(data, 2, 5, 4);
        playService.makeTurn(data, 2, 5, 6);
        playService.makeTurn(data, 2, 6, 5);

        playService.makeTurn(data, 1, 3, 5);
        playService.makeTurn(data, 1, 4, 4);
        playService.makeTurn(data, 1, 5, 3);
        playService.makeTurn(data, 1, 6, 4);
        playService.makeTurn(data, 1, 7, 5);
        playService.makeTurn(data, 1, 6, 6);
        playService.makeTurn(data, 1, 5, 7);
        playService.makeTurn(data, 1, 4, 6);

        expect(data.remainingMoves).toBe(sizeX * sizeY - 1 - 4 - 8);

        expect(data.dots[5][5].color).toBe(1);

        expect(data.dots[4][5].color).toBe(1);
        expect(data.dots[5][4].color).toBe(1);
        expect(data.dots[5][6].color).toBe(1);
        expect(data.dots[6][5].color).toBe(1);

        expect(data.polys.length).toBe(1);
        expect(data.polys[0].color).toBe(1);
        expect(data.polys[0].path.length).toBe(8);
        expect(polygonService.checkPointInsidePoly({x: 5, y: 5}, data.polys[0].path)).toBeTruthy();
        expect(polygonService.checkPointInsidePoly({x: 4, y: 5}, data.polys[0].path)).toBeTruthy();
        expect(polygonService.checkPointInsidePoly({x: 5, y: 4}, data.polys[0].path)).toBeTruthy();
        expect(polygonService.checkPointInsidePoly({x: 5, y: 6}, data.polys[0].path)).toBeTruthy();
        expect(polygonService.checkPointInsidePoly({x: 6, y: 5}, data.polys[0].path)).toBeTruthy();
        expect(polygonService.checkPolygonSelfIntersect(data.polys[0].path)).toBeFalsy();
        expect(data.scores[1].playerName).toBe("red");
        expect(data.scores[1].score).toBe(13);
        expect(data.scores[2].playerName).toBe("blue");
        expect(data.scores[2].score).toBe(0);
    });
});
