'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /gameTicTacToe when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/gameTicTacToe");
  });


  describe('gameTicTacToe', function() {

    beforeEach(function() {
      browser.get('index.html#/gameTicTacToe');
    });


    it('should render gameTicTacToe when user navigates to /gameTicTacToe', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for gameTicTacToe/);
    });

  });


  describe('gameDots', function() {

    beforeEach(function() {
      browser.get('index.html#/gameDots');
    });


    it('should render gameDots when user navigates to /gameDots', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for gameDots/);
    });

  });
});
