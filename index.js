const async = require('async');
const grammarModules = require('./lib/modules');
const path = require('path');

exports.defaults = {
  'irregulars': path.join(__dirname,'defaults','irregulars.txt'),
  'weasels': path.join(__dirname,'defaults','weasels.txt'),
  'skip': [],
  'formatter': 'table'
}

exports.init = function(options,done) {
  if (typeof options == 'function') {
    done = options;
    options = null;
  }
  if (!options) {
    options = exports.defaults;
  }
  const grammarModulesArray = [];
  for(var key in grammarModules) {
    grammarModulesArray.push(grammarModules[key]);
  }
  async.parallel(
    grammarModulesArray.map(function(grammarMod) {
      return function(next) {
        grammarMod.prepareForRun(argv,next);
      }
    }),
    function(err) {
      done(err);
    }
  );
}

exports.linters = grammarModules;

exports.lint = require('./lib/linter').lint;
