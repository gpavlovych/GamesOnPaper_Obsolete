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
  var firstNameText = 'UAT First Name '+now;
  var lastNameText = 'UAT Last Name '+now;
  var usernameText = 'uat_user'+now;
  var passwordText = 'uat_password'+now;

  it('should automatically redirect to /login when location hash/fragment is empty and not logged in, then we register and log in', function() {
    browser.get('');
    registerLink.click();
    expect(browser.getLocationAbsUrl()).toMatch("/register");
    expect(registerButton.isEnabled()).toBe(false);
    firstNameInput.sendKeys(firstNameText);
    expect(registerButton.isEnabled()).toBe(false);
    lastNameInput.sendKeys(lastNameText);
    expect(registerButton.isEnabled()).toBe(false);
    usernameInput.sendKeys(usernameText);
    expect(registerButton.isEnabled()).toBe(false);
    passwordInput.sendKeys(passwordText);
    expect(registerButton.isEnabled()).toBe(true);
    registerButton.click();
    expect(browser.getLocationAbsUrl()).toMatch("/login");
    expect(loginButton.isEnabled()).toBe(false);
    usernameInput.sendKeys(usernameText);
    expect(loginButton.isEnabled()).toBe(false);
    passwordInput.sendKeys(passwordText);
    expect(loginButton.isEnabled()).toBe(true);
    loginButton.click();
    expect(browser.getLocationAbsUrl()).toMatch("/gameTicTacToe");
  });


  describe('gameTicTacToe', function() {

    beforeEach(function () {
      browser.get('#/gameTicTacToe');
    });

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
      expect(modal.isDisplayed()).toBeFalsy();
    }

    it('should render gameTicTacToe when user navigates to /gameTicTacToe', function () {
      expect(element.all(by.css('[ng-view] table tr')).count()).
          toEqual(3);
      expect(element.all(by.css('[ng-view] table tr td')).count()).
          toEqual(9);
    });

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
