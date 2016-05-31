/**
 * Created by pavlheo on 5/31/2016.
 */
var polygonService = require('./../polygonService.js');

describe('poly service', function(){
    it('checkPolygonSelfIntersect should return false for square', function() {
        expect(polygonService.checkPolygonSelfIntersect([{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeFalsy();
    });
    it('checkPolygonSelfIntersect should return true for 8-like shape', function() {
        expect(polygonService.checkPolygonSelfIntersect([{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeTruthy();
    });
    it('checkPointInsidePoly should return false for square(0,0->10,10) and point (5,15)', function() {
        expect(polygonService.checkPointInsidePoly({x:5, y: 15}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeFalsy();
    });
    it('checkPointInsidePoly should return true for square(0,0->10,10) and point (5,5)', function() {
        expect(polygonService.checkPointInsidePoly({x:5, y: 5}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeTruthy();
    });
    it('checkPointInsidePoly should return true for square(0,0->10,10) and point (5,0)', function() {
        expect(polygonService.checkPointInsidePoly({x:5, y: 0}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeTruthy();
    });
    it('checkPointInsidePoly should return true for square(0,0->10,10) and point (0,0)', function() {
        expect(polygonService.checkPointInsidePoly({x:0, y: 0}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeTruthy();
    });
    it('checkPointInsidePoly should return false for 8-like shape(0,0->10,10) and point (5,15)', function() {
        expect(polygonService.checkPointInsidePoly({x:5, y: 15}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeFalsy();
    });
    it('checkPointInsidePoly should return true for  8-like shape(0,0->10,10) and point (5,5)', function() {
        expect(polygonService.checkPointInsidePoly({x:5, y: 5}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeTruthy();
    });
    it('checkPointInsidePoly should return true for  8-like shape(0,0->10,10) and point (2,5)', function() {
        expect(polygonService.checkPointInsidePoly({x:2, y: 5}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeTruthy();
    });
    it('checkPointInsidePoly should return true for  8-like shape(0,0->10,10) and point (5,2)', function() {
        expect(polygonService.checkPointInsidePoly({x:5, y: 2}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeFalsy();
    });
});
