'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {
  var firstNameInput = element(by.id('firstName'));
  var lastNameInput = element(by.id('lastName'));
  var usernameInput = element(by.id('username'));
  var passwordInput = element(by.id('password'));

  var loginButton = element(by.css("input[value='Login']"));
  var registerLink = element(by.css("a[href='#/register']"));
  var registerButton = element(by.css("input[value='Register']"));
  var now = new Date();
  var firstNameText1 = 'UAT1 First Name '+now;
  var lastNameText1 = 'UAT1 Last Name '+now;
  var usernameText1 = 'uat1_user'+now;
  var passwordText1 = 'uat1_password'+now;
  var firstNameText2 = 'UAT2 First Name '+now;
  var lastNameText2 = 'UAT2 Last Name '+now;
  var usernameText2 = 'uat2_user'+now;
  var passwordText2 = 'uat2_password'+now;
  function Person(browser){
    this.register = function(firstName, lastName, userName, password, suppressNavigate){
      if (!suppressNavigate)
      {
        browser.get('/register');
      }
      expect(registerButton.isEnabled()).toBe(false);
      firstNameInput.sendKeys(firstName);
      expect(registerButton.isEnabled()).toBe(false);
      lastNameInput.sendKeys(lastName);
      expect(registerButton.isEnabled()).toBe(false);
      usernameInput.sendKeys(username);
      expect(registerButton.isEnabled()).toBe(false);
      passwordInput.sendKeys(password);
      expect(registerButton.isEnabled()).toBe(true);
      registerButton.click();
      expect(browser.getLocationAbsUrl()).toMatch("/login");
    }
    this.login = function(userName, password, suppressNavigate){
      if (!suppressNavigate){
        browser.get('/login');
      }
      expect(loginButton.isEnabled()).toBe(false);
      usernameInput.sendKeys(userName);
      expect(loginButton.isEnabled()).toBe(false);
      passwordInput.sendKeys(password);
      expect(loginButton.isEnabled()).toBe(true);
      loginButton.click();
      expect(browser.getLocationAbsUrl()).toMatch("/gameTicTacToe");
    }
  }
  var player1, player2;
  it('should automatically redirect to /login when location hash/fragment is empty and not logged in, then we register and log in', function() {
    player1 = new Person(browser);
    player2 = new Person(browser.forkNewDriverInstance())
    player1.register(firstNameText1,lastNameText1, usernameText1, passwordText1);
    player1.login(usernameText1, passwordText1);
    player2.register(firstNameText2,lastNameText2, usernameText2, passwordText2);
    player2.login(usernameText2, passwordText2);
  });


  describe('gameTicTacToe', function() {

    beforeEach(function () {
      browser.get('#/gameTicTacToe');
    });
    function Game(browser) {
      var element = browser.element;
      function getCell(column, row) {
        return element(by.css('[ng-view] table')).all(by.tagName('tr')).get(row).all(by.tagName('td')).get(column);
      }

      function clickAndExpect(column, row, text) {
        var cell = getCell(column, row);
        cell.click();
        expect(cell.getText()).toBe(text);
      }

      function closeOpenedMessage(title, body) {
        var modal = element(by.css('.modal'));
        expect(modal.isDisplayed()).toBeTruthy();
        expect(modal.element(by.css('.modal-header')).element(by.css('.modal-title')).getText()).toBe(title);
        expect(modal.element(by.css('.modal-body')).getText()).toBe(body);
        modal.element(by.css('.btn')).click();
      }

      it('should render gameTicTacToe when user navigates to /gameTicTacToe', function () {
        expect(element.all(by.css('[ng-view] table tr')).count()).
            toEqual(3);
        expect(element.all(by.css('[ng-view] table tr td')).count()).
            toEqual(9);
      });
    }
    it('X winning', function () {
      clickAndExpect(0, 0, 'X');
      clickAndExpect(1, 0, 'O');
      clickAndExpect(1, 1, 'X');
      clickAndExpect(2, 0, 'O');
      clickAndExpect(2, 2, 'X');
      closeOpenedMessage('Modal Header', 'X is the winner!');
    });

    it('O winning', function () {
      clickAndExpect(0, 0, 'X');
      clickAndExpect(1, 0, 'O');
      clickAndExpect(0, 1, 'X');
      clickAndExpect(1, 1, 'O');
      clickAndExpect(2, 0, 'X');
      clickAndExpect(1, 2, 'O');
      closeOpenedMessage('Modal Header', 'O is the winner!');
    });

    it('X winning full', function () {
      clickAndExpect(0, 0, 'X');
      clickAndExpect(1, 0, 'O');
      clickAndExpect(0, 1, 'X');
      clickAndExpect(0, 2, 'O');
      clickAndExpect(1, 1, 'X');
      clickAndExpect(2, 1, 'O');
      clickAndExpect(1, 2, 'X');
      clickAndExpect(2, 0, 'O');
      clickAndExpect(2, 2, 'X');
      closeOpenedMessage('Modal Header', 'X is the winner!');
    });

    it('draw', function () {
      clickAndExpect(0, 0, 'X');
      clickAndExpect(1, 0, 'O');
      clickAndExpect(1, 1, 'X');
      clickAndExpect(2, 2, 'O');
      clickAndExpect(0, 1, 'X');
      clickAndExpect(2, 1, 'O');
      clickAndExpect(2, 0, 'X');
      clickAndExpect(0, 2, 'O');
      clickAndExpect(1, 2, 'X');
      closeOpenedMessage('Modal Header', 'Draw!');
    });
  });


  describe('gameDots', function() {

    beforeEach(function() {
      browser.get('#/gameDots');
    });


    it('should render gameDots when user navigates to /gameDots', function() {
      expect(element.all(by.css('[ng-view] canvas#myCanvas')).count()).
        toEqual(1);
    });

  });
});
