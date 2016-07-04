'use strict';

describe('myApp.gameDots module', function() {

  beforeEach(module('myApp.gameDots'));

  describe('gameDots controller', function(){
    var scope, testCont;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      testCont = $controller('GameDotsCtrl', {$scope: scope});
    }));
    it('should ....', inject(function($controller) {
      //spec body
      expect(testCont).toBeDefined();
    }));
  });
});