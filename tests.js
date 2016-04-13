var chai, expect, selenium;

selenium = require('selenium-webdriver');

chai = require('chai');

chai.use(require('chai-as-promised'));

expect = chai.expect;

var By = selenium.By;
var until = selenium.until;
before(function() {
  this.timeout(20000);
  this.driver = new selenium.Builder().forBrowser('firefox').build();
  this.driver.manage().window().maximize();
  return this.driver.getWindowHandle();
});

after(function() {
  this.timeout(10000)
  return this.driver.quit();
});

describe('Login page', function() {
  this.timeout(30000);
  beforeEach(function() {
    this.driver.get('http://app.instream.io/login');
  });
  it('cookies info displays on the bottom of the page', function(){
    var cookie = this.driver.wait(until.elementLocated({className: 'cookie-info-container'}), 10000);
    return cookie ? true : false;
  });
  it('cookies info disappear after clicking accept', function(){
    var ele = this.driver.wait(until.elementLocated(By.linkText('Accept')));
    ele.click();
    var cookie = this.driver.wait(until.elementLocated({className: 'cookie-info-container'}), 5000);
    return cookie ? false : true;
  });
  it('has the page title InStream.io', function() {
    return expect(this.driver.getTitle()).to.eventually.contain('InStream.io');
  });
  it("has one input with placeholder 'Login' for login info", function(){
    var ele = this.driver.wait(until.elementLocated(By.name('username')));
    var type =  ele.getAttribute('placeholder');
    return expect(type).to.eventually.equal('Login');
  });
  it("has one input with placeholder 'Password' for password info", function(){
    var ele = this.driver.wait(until.elementLocated(By.name('password')));
    var type =  ele.getAttribute('placeholder');
    return expect(type).to.eventually.equal('Password');
  });
  it("has a Log in button", function(){
    var ele = this.driver.wait(until.elementLocated({tagName: 'button'}));
    var type =  ele.getAttribute('type');
    return expect(type).to.eventually.equal('submit');
  });
  it("has a link that redirects to sign up page", function(){
    var link = this.driver.wait(until.elementLocated(By.linkText('Sign up for free')));
    link.click();
    return expect(this.driver.getCurrentUrl()).to.eventually.equal('https://app.instream.io/register');
  });
  it("has a link for password reset", function(){
    var link = this.driver.wait(until.elementLocated(By.linkText('Forgot password?')));
    link.click();
    return expect(this.driver.getCurrentUrl()).to.eventually.equal('https://app.instream.io/reset-password');
  });
  it("has a link to change language to polish", function(){
    var link = this.driver.wait(until.elementLocated({linkText: 'PL'}));
    link.click();
    var text =  this.driver.wait(until.elementLocated({tagName: 'button'})).getText();
    setTimeout(function(){
      return expect(text).to.eventually.equal('Zaloguj się');
    }, 1000);
  });
  it("has a link to change language back to english", function(){
    var link_pl = this.driver.wait(until.elementLocated({linkText: 'PL'}));
    var link_eng = this.driver.wait(until.elementLocated({linkText: 'EN'}));
    link_pl.click();
    link_eng.click();
    var text =  this.driver.wait(until.elementLocated({tagName: 'button'})).getText();
    setTimeout(function(){
      return expect(text).to.eventually.equal('Log In');
    }, 1000);
  });
  it("has a link to privacy policy page that opens in new window",function(){
    var link = this.driver.wait(until.elementLocated(By.linkText('Privacy Policy')));
    link.click();
    var driver = this.driver;
    setTimeout(function(){
      var handles = driver.getAllWindowHandles();
      driver.switchTo(handles);
      return expect(driver.getCurrentUrl()).to.eventually.equal('http://instream.io/en/privacy/');
    }, 4000);
  });
  it("has a link to terms of services page that opens in new window",function(){
    var link = this.driver.wait(until.elementLocated(By.linkText('Terms of Service')));
    link.click();
    var driver = this.driver;
    setTimeout(function(){
      var handles = driver.getAllWindowHandles();
      driver.switchTo(handles);
      return expect(driver.getCurrentUrl()).to.eventually.equal('http://instream.io/en/terms/');
    }, 4000);
  });
  it("displays error message for incorrect credentials", function(){
    var user = this.driver.wait(until.elementLocated(By.name('username')));
    var pass = this.driver.wait(until.elementLocated(By.name('password')));
    var button = this.driver.wait(until.elementLocated({tagName: 'button'}));
    user.sendKeys('invalidUsername');
    pass.sendKeys('invalidPassword');
    button.click();
    var error = this.driver.wait(until.elementLocated({className: 'error-message'})).getText();
    return expect(error).to.eventually.equal('Invalid username and/or password');
  });
  it("remains on the same page for no login and password", function(){
    this.driver.wait(until.elementLocated({tagName: 'button'})).click();
    return expect(this.driver.getCurrentUrl()).to.eventually.equal('https://app.instream.io/login');
  });
  it("redirects to account page after logging with correct credentials", function(){
    var user = this.driver.wait(until.elementLocated(By.name('username')));
    var pass = this.driver.wait(until.elementLocated(By.name('password')));
    var button = this.driver.wait(until.elementLocated({tagName: 'button'}));
    user.sendKeys('adam.szczombrowski');
    pass.sendKeys('testtest1');
    button.click();
    setTimeout(function(){
      return expect(this.driver.getCurrentUrl()).to.eventually.equal('https://app.instream.io');
    }, 3000);
  });
  it("displays the intercom on click of a intercom button", function(){
    this.driver.wait(until.elementLocated({className: 'intercom-launcher-button'})).click();
    var header = this.driver.wait(until.elementLocated({className: 'intercom-sheet-header-generic-title'})).getText();
    return expect(header).to.eventually.equal('New Conversation');
  });
});
