'use strict';

describe('myApp.gameDots module', function() {

  beforeEach(module('myApp.gameDots'));

  describe('gameDots controller', function(){
    var scope, testCont, gameSocketFactory;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      gameSocketFactory = {forward: function (){}};
      testCont = $controller('GameDotsCtrl', {$scope: scope, gameSocketFactory: gameSocketFactory});
    }));
    it('should ....', inject(function() {
      //spec body
      expect(testCont).toBeDefined();
    }));
  });
});