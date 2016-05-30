/**
 * Created by pavlheo on 5/28/2016.
 */
angular.module('myApp.geometry', [])

.service('lineService', function() {
        this.pointBelongsToLine = function(point, line){
            var a = (line[1].y - line[0].y) / (line[1].x - line[0].x);
            var b = line[0].y - a * line[0].x;
            if (point.y == (a*point.x+b) && ((line[1].x-point.x)*(point.x-line[0].x)>=0))
            {
                return true;
            }

            return false;
        };
    this.intersect = function (line1, line2) {
        function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
            // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
            var denominator, a, b, numerator1, numerator2, result = {
                x: null,
                y: null,
                onLine1: false,
                onLine2: false
            };
            denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
            if (denominator == 0) {
                return result;
            }
            a = line1StartY - line2StartY;
            b = line1StartX - line2StartX;
            numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
            numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
            a = numerator1 / denominator;
            b = numerator2 / denominator;

            // if we cast these lines infinitely in both directions, they intersect here:
            result.x = line1StartX + (a * (line1EndX - line1StartX));
            result.y = line1StartY + (a * (line1EndY - line1StartY));
            /*
             // it is worth noting that this should be the same as:
             x = line2StartX + (b * (line2EndX - line2StartX));
             y = line2StartX + (b * (line2EndY - line2StartY));
             */
            // if line1 is a segment and line2 is infinite, they intersect if:
            if (a > 0 && a < 1) {
                result.onLine1 = true;
            }
            // if line2 is a segment and line1 is infinite, they intersect if:
            if (b > 0 && b < 1) {
                result.onLine2 = true;
            }
            // if line1 and line2 are segments, they intersect if both of the above are true
            return result;
        };
        var samePointsAmount = 0;
        if (line1[0].x==line2[0].x && line1[0].y==line2[0].y)
            samePointsAmount++;
        if (line1[0].x==line2[1].x && line1[0].y==line2[1].y)
            samePointsAmount++;
        if (line1[1].x==line2[0].x && line1[1].y==line2[0].y)
            samePointsAmount++;
        if (line1[1].x==line2[1].x && line1[1].y==line2[1].y)
            samePointsAmount++;
        if (samePointsAmount>0)
        return samePointsAmount;
        var result = checkLineIntersection(line1[0].x, line1[0].y, line1[1].x, line1[1].y, line2[0].x, line2[0].y, line2[1].x, line2[1].y);
        if (result.onLine1 && result.onLine2) return 3;
        return 0;
    };
})

.service('polygonService', ['lineService', function(lineService){
   this.checkPolygonSelfIntersect = function(vertices) {
       var edges = [];
       for (var i = 0; i < vertices.length; i++){
           edges.push([vertices[i], vertices[(i+1)%vertices.length]])
       }
       for (var i = 0; i < edges.length-1; i++)
       for (var j = i+1; j < edges.length; j++)
       {
           if (lineService.intersect(edges[i], edges[j])==3)
           {   return true;
           }
       }
       return false;
   };
     this.checkPointInsidePoly = function(point, vertices){
         var polyCorners = vertices.length;
         var   i, j=polyCorners-1 ;
         var  oddNodes=false;

         for (i=0; i<polyCorners; i++) {
             if (vertices[i].x==point.x && vertices[i].y==point.y){
                 return true;
             }
             if (lineService.pointBelongsToLine(point, [vertices[i],vertices[(i+1)%vertices.length]])){
                 return true;
             }
             if (vertices[i].y<point.y && vertices[j].y>=point.y
                 ||  vertices[j].y<point.y && vertices[i].y>=point.y) {
                 if (vertices[i].x+(point.y-vertices[i].y)/(vertices[j].y-vertices[i].y)*(vertices[j].x-vertices[i].x)<point.x) {
                     oddNodes=!oddNodes; }}
             j=i; }

         return oddNodes;
     }
}]);