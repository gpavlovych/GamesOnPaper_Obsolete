/**
 * Created by pavlheo on 5/28/2016.
 */
describe('myApp.geometry module', function() {

    beforeEach(module('myApp.geometry'));

    describe('line service', function(){
        it('intersect should return 3(intersecting) for (-10,-10);(10,10) and (-10,10);(10,-10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: -10, y: 10},{x:10, y:-10}])).toBe(3);
        }));
        it('intersect should return 0(non-intersecting) for (-10,-10);(10,-10) and (-10,10);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: -10, y: -10},{x:10, y:-10}], [{x: -10, y: 10},{x:10, y:10}])).toBe(0);
        }));
        it('intersect should return 1(adjacent) for (-10,-10);(10,10) and (10,10);(10,-10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: 10, y: 10},{x:10, y:-10}])).toBe(1);
        }));
        it('intersect should return 1(adjacent) for (10,10);(-10,-10) and (-10,10);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: 10, y: 10},{x:-10, y:-10}], [{x: -10, y: 10},{x:10, y:10}])).toBe(1);
        }));
        it('intersect should return 1(adjacent) for (10,10);(-10,-10) and (10,10);(10,-10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: 10, y: 10},{x:-10, y:-10}], [{x: 10, y: 10},{x:10, y:-10}])).toBe(1);
        }));
        it('intersect should return 1(adjacent) for (-10,10);(10,10) and (10,-10);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: -10, y: 10},{x:10, y:10}], [{x: 10, y: -10},{x:10, y:10}])).toBe(1);
        }));
        it('intersect should return 2(same) for (-10,-10);(10,10) and (-10,-10);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: -10, y: -10},{x:10, y:10}])).toBe(2);
        }));
        it('intersect should return 2(same) for (-10,-10);(10,10) and (10,10);(-10,-10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.intersect([{x: -10, y: -10},{x:10, y:10}], [{x: 10, y: 10},{x:-10, y:-10}])).toBe(2);
        }));
        it('pointBelongsToLine should return true for point (-10,-10) and line (0,0);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.pointBelongsToLine({x: -10, y: -10}, [{x: 0, y: 0},{x:10, y:10}])).toBeFalsy();
        }));
        it('pointBelongsToLine should return true for point (0,0) and line (0,0);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.pointBelongsToLine({x: 0, y: 0}, [{x: 0, y: 0},{x:10, y:10}])).toBeTruthy();
        }));
        it('pointBelongsToLine should return true for point (5,5) and line (0,0);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.pointBelongsToLine({x: 5, y: 5}, [{x: 0, y: 0},{x:10, y:10}])).toBeTruthy();
        }));
        it('pointBelongsToLine should return true for point (10,10) and line (0,0);(10,10)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var lineService = $injector.get( 'lineService' );
            expect( lineService.pointBelongsToLine({x: 10, y: 10}, [{x: 0, y: 0},{x:10, y:10}])).toBeTruthy();
        }));
    });
    describe('poly service', function(){
        it('checkPolygonSelfIntersect should return false for square', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPolygonSelfIntersect([{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeFalsy();
        }));
        it('checkPolygonSelfIntersect should return true for 8-like shape', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPolygonSelfIntersect([{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeTruthy();
        }));
        it('checkPointInsidePoly should return false for square(0,0->10,10) and point (5,15)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:5, y: 15}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeFalsy();
        }));
        it('checkPointInsidePoly should return true for square(0,0->10,10) and point (5,5)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:5, y: 5}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeTruthy();
        }));
        it('checkPointInsidePoly should return true for square(0,0->10,10) and point (5,0)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:5, y: 0}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeTruthy();
        }));
        it('checkPointInsidePoly should return true for square(0,0->10,10) and point (0,0)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:0, y: 0}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x:10, y:0}])).toBeTruthy();
        }));
        it('checkPointInsidePoly should return false for 8-like shape(0,0->10,10) and point (5,15)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:5, y: 15}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeFalsy();
        }));
        it('checkPointInsidePoly should return true for  8-like shape(0,0->10,10) and point (5,5)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:5, y: 5}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeTruthy();
        }));
        it('checkPointInsidePoly should return true for  8-like shape(0,0->10,10) and point (2,5)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:2, y: 5}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeTruthy();
        }));
        it('checkPointInsidePoly should return true for  8-like shape(0,0->10,10) and point (5,2)', inject(function() {
            var $injector = angular.injector([ 'myApp.geometry' ]);
            var polygonService = $injector.get( 'polygonService' );
            expect(polygonService.checkPointInsidePoly({x:5, y: 2}, [{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 0}, {x:10, y:10}])).toBeFalsy();
        }));
    });
});