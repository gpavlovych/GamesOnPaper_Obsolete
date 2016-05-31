/**
 * Created by pavlheo on 5/31/2016.
 */
var lineService = require('./lineService.js');

module.exports = {
    checkPolygonSelfIntersect: function (vertices) {
        var edges = [];
        for (var i = 0; i < vertices.length; i++) {
            edges.push([vertices[i], vertices[(i + 1) % vertices.length]])
        }
        for (var i = 0; i < edges.length - 1; i++)
            for (var j = i + 1; j < edges.length; j++) {
                if (lineService.intersect(edges[i], edges[j]) == 3) {
                    return true;
                }
            }
        return false;
    },
    checkPointInsidePoly: function (point, vertices) {
        var polyCorners = vertices.length;
        var i, j = polyCorners - 1;
        var oddNodes = false;
        for (i = 0; i < polyCorners; i++) {
            if (vertices[i].x == point.x && vertices[i].y == point.y) {
                return true;
            }
            if (lineService.pointBelongsToLine(point, [vertices[i], vertices[(i + 1) % vertices.length]])) {
                return true;
            }
            if (vertices[i].y < point.y && vertices[j].y >= point.y
                || vertices[j].y < point.y && vertices[i].y >= point.y) {
                if (vertices[i].x + (point.y - vertices[i].y) / (vertices[j].y - vertices[i].y) * (vertices[j].x - vertices[i].x) < point.x) {
                    oddNodes = !oddNodes;
                }
            }
            j = i;
        }
        return oddNodes;
    }
};
