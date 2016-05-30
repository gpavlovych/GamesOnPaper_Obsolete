'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
    .filter('displayCrossZero',function(){return function(input){
      switch (input){
        case 0:
              return "";
        case 1:
              return "X";
        case 2:
              return "O";
      }
    };})
    .directive("modalShow", function ($parse) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {

                //Hide or show the modal
                scope.showModal = function (visible, elem) {
                    if (!elem)
                        elem = element;

                    if (visible)
                        $(elem).modal("show");
                    else
                        $(elem).modal("hide");
                }

                //Watch for changes to the modal-visible attribute
                scope.$watch(attrs.modalShow, function (newValue, oldValue) {
                    scope.showModal(newValue, attrs.$$element);
                });

                //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
                $(element).bind("hide.bs.modal", function () {
                    var assignFunc = $parse(attrs.modalShow).assign;
                    if (assignFunc === "function"){
                        assignFunc(scope, false);
                    }
                    if (!scope.$$phase && !scope.$root.$$phase)
                        scope.$apply();
                });
            }

        };
    })
.controller('View1Ctrl', ['$scope', function($scope) {
      $scope.rows=[[0,0,0],[0,0,0],[0,0,0]];//0-empty. 1 - X, 2 - O
      $scope.result=[[0,0,0],[0,0,0],[0,0,0]]; // 0 - nothing , 1 - win
      $scope.current = 0;
      function sameValue(rowIndex, columnIndex, value){
        if (rowIndex<0 || columnIndex<0||rowIndex>=3 || columnIndex >= 3){
          return true;
        }
        return $scope.rows[rowIndex][columnIndex] == value;
      }

      function checkWinner(rowIndex, columnIndex) {
        var currentValue = $scope.rows[rowIndex][columnIndex];
        var result = false;
        //horizontal won
        if ($scope.rows[0][columnIndex] == currentValue &&
        $scope.rows[1][columnIndex] == currentValue &&
        $scope.rows[2][columnIndex] == currentValue) {
          $scope.result[0][columnIndex] = 1;
          $scope.result[1][columnIndex] = 1;
          $scope.result[2][columnIndex] = 1;
          result = true;
        }
        if ($scope.rows[rowIndex][0] == currentValue &&
            $scope.rows[rowIndex][1] == currentValue &&
            $scope.rows[rowIndex][2] == currentValue) {
          $scope.result[rowIndex][0] = 1;
          $scope.result[rowIndex][1] = 1;
          $scope.result[rowIndex][2] = 1;
          result = true;
        }
        if ((rowIndex == columnIndex)||(2-rowIndex == columnIndex))
        {
          if ($scope.rows[0][0] == currentValue &&
              $scope.rows[1][1] == currentValue &&
              $scope.rows[2][2] == currentValue) {
            $scope.result[0][0] = 1;
            $scope.result[1][1] = 1;
            $scope.result[2][2] = 1;
            result = true;
          }
          if ($scope.rows[2][0] == currentValue &&
              $scope.rows[1][1] == currentValue &&
              $scope.rows[0][2] == currentValue) {
            $scope.result[2][0] = 1;
            $scope.result[1][1] = 1;
            $scope.result[0][2] = 1;
            result = true;
          }
        }
        return result;
      };
      $scope.moves = 9;
      $scope.winner = null;
      $scope.checkCell = function(rowIndex, columnIndex){
        if ($scope.moves == 0 || $scope.winner != null || $scope.rows[rowIndex][columnIndex] != 0){
          return;
        }

        $scope.rows[rowIndex][columnIndex] = $scope.current + 1;
        $scope.moves--;
        if (checkWinner(rowIndex, columnIndex))
        {
          $scope.winner = $scope.current + 1;
        }

        $scope.current = ($scope.current+1)%2;
      };
}]);