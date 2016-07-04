'use strict';

describe('myApp.gameTicTacToe module', function() {

  beforeEach(module('myApp.gameTicTacToe'));

  describe('gameTicTacToe controller', function(){
  var scope, testCont;
  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    testCont = $controller('GameTicTacToeCtrl', {$scope: scope});
  }));
  it('should ....', inject(function($controller) {
    //spec body
    expect(testCont).toBeDefined();
  }));
  it('should create 3 rows and 3 columns',inject(function($controller){
    expect(scope.rows).toEqual([[0,0,0],[0,0,0],[0,0,0]]);
  }));
  });
});