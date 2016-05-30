'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){
    var scope, testCont;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      testCont = $controller('View1Ctrl', {$scope: scope});
    }));
    it('should ....', inject(function($controller) {
      //spec body
      expect(testCont).toBeDefined();
    }));
    it('should create 3 rows and 3 columns',inject(function($controller){
      expect(scope.rows).toEqual([[0,0,0],[0,0,0],[0,0,0]]);
    }));
  });
})