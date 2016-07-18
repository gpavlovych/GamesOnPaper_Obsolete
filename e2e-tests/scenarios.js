'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  var firstNameInput = element(by.id('firstName'));
  var lastNameInput = element(by.id('lastName'));
  var usernameInput = element(by.id('username'));
  var passwordInput = element(by.id('password'));

  var loginButton = element(by.buttonText("Login"));
  var registerLink = element(by.css("a[href='#/register']"));
  var registerButton = element(by.css("input[value='Register']"));
  var now = new Date();
  var firstNameText = 'UAT First Name '+now;
  var lastNameText = 'UAT Last Name '+now;
  var usernameText = 'uat_user'+now;
  var passwordText = 'uat_password'+now;

  it('should automatically redirect to /login when location hash/fragment is empty and not logged in, then we register and log in', function() {
    browser.get('');
    expect(browser.getLocationAbsUrl()).toMatch("/login");
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

    beforeEach(function() {
      browser.get('#/gameTicTacToe');
    });


    it('should render gameTicTacToe when user navigates to /gameTicTacToe', function() {
      expect(element.all(by.css('[ng-view] table tr')).count()).
        toEqual(3);
      expect(element.all(by.css('[ng-view] table tr td')).count()).
          toEqual(9);
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
