'use strict';

describe('myApp.view3 module', function() {

  beforeEach(module('myApp.view3'));

  describe('view3 controller', function(){
    var scope, testCont;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      testCont = $controller('View3Ctrl', {$scope: scope});
    }));
    it('should ....', inject(function($controller) {
      //spec body
      expect(testCont).toBeDefined();
    }));
  });
});