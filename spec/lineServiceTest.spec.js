/**
 * Created by pavlheo on 5/31/2016.
 */
var lineService = require('./../lineService.js');

describe('line service', function(){
    it('intersect should return 3(intersecting) for (-10,-10);(10,10) and (-10,10);(10,-10)', function () {
        expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: -10, y: 10},{x:10, y:-10}])).toBe(3);
    });
    it('intersect should return 0(non-intersecting) for (-10,-10);(10,-10) and (-10,10);(10,10)', function() {
        expect( lineService.intersect([{x: -10, y: -10},{x:10, y:-10}], [{x: -10, y: 10},{x:10, y:10}])).toBe(0);
    });
    it('intersect should return 1(adjacent) for (-10,-10);(10,10) and (10,10);(10,-10)', function() {
        expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: 10, y: 10},{x:10, y:-10}])).toBe(1);
    });
    it('intersect should return 1(adjacent) for (10,10);(-10,-10) and (-10,10);(10,10)', function() {
        expect( lineService.intersect([{x: 10, y: 10},{x:-10, y:-10}], [{x: -10, y: 10},{x:10, y:10}])).toBe(1);
    });
    it('intersect should return 1(adjacent) for (10,10);(-10,-10) and (10,10);(10,-10)', function() {
        expect( lineService.intersect([{x: 10, y: 10},{x:-10, y:-10}], [{x: 10, y: 10},{x:10, y:-10}])).toBe(1);
    });
    it('intersect should return 1(adjacent) for (-10,10);(10,10) and (10,-10);(10,10)', function() {
        expect( lineService.intersect([{x: -10, y: 10},{x:10, y:10}], [{x: 10, y: -10},{x:10, y:10}])).toBe(1);
    });
    it('intersect should return 2(same) for (-10,-10);(10,10) and (-10,-10);(10,10)', function() {
        expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: -10, y: -10},{x:10, y:10}])).toBe(2);
    });
    it('intersect should return 2(same) for (-10,-10);(10,10) and (10,10);(-10,-10)', function() {
        expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: 10, y: 10},{x:-10, y:-10}])).toBe(2);
    });
    it('pointBelongsToLine should return true for point (-10,-10) and line (0,0);(10,10)', function() {
        expect( lineService.pointBelongsToLine({x: -10, y: -10}, [{x: 0, y: 0},{x:10, y:10}])).toBeFalsy();
    });
    it('pointBelongsToLine should return true for point (0,0) and line (0,0);(10,10)', function() {
        expect( lineService.pointBelongsToLine({x: 0, y: 0}, [{x: 0, y: 0},{x:10, y:10}])).toBeTruthy();
    });
    it('pointBelongsToLine should return true for point (5,5) and line (0,0);(10,10)', function() {
        expect( lineService.pointBelongsToLine({x: 5, y: 5}, [{x: 0, y: 0},{x:10, y:10}])).toBeTruthy();
    });
    it('pointBelongsToLine should return true for point (10,10) and line (0,0);(10,10)', function() {
        expect( lineService.pointBelongsToLine({x: 10, y: 10}, [{x: 0, y: 0},{x:10, y:10}])).toBeTruthy();
    });
});
