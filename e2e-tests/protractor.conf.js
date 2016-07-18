exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'firefox'
  },

  baseUrl: 'http://localhost:8080/',

  framework: 'jasmine',
  rootElement: '.my-app',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
