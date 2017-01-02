#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const async = require('async');
const minimist = require('minimist');
const grammarModules = require('./lib/modules');
const utils = require('./lib/utils');
const linter = require('./lib/linter');
const formatters = require('./lib/formatters');

const argv = minimist(process.argv.slice(2),{
  'default': require('./defaults')
});

if (argv.skip && typeof argv.skip == 'string') {
  argv.skip = utils.splitString(argv.skip);
}

if (argv._.length >= 1) {
  async.waterfall([
    function(next) {
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
          next(err);
        }
      );
    },
    function(next) {
      fs.readFile(argv._[0],'utf-8',next);
    },
    function(text,next) {
      linter.lint(text,argv,next);
    },
    function(results,next) {
      formatters[argv.formatter](results,next);
    }
  ],function(err,results) {
    if (err) {
      console.error(err);
      process.exit(-1);
    } else {
      console.log(results);
      process.exit(0);
    }
  })
} else {
  console.error('Please provide the name of a file to process.');
}
