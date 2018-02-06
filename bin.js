#! /usr/bin/env node

const path = require('path');
const async = require('async');
const minimist = require('minimist');
const grammarModules = require('./lib/modules');
const utils = require('./lib/utils');
const linter = require('./lib/linter');
const formatters = require('./lib/formatters');
const validUrl = require('valid-url');
const textract = require('textract');
const textSplitter = require('./lib/textSplitter');

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
      const source = argv._[0];
      const options = {preserveLineBreaks: true}
      if (validUrl.isWebUri(source)) {
        textract.fromUrl(source, options, next)
      } else {
        textract.fromFileWithPath(source, options, next)
      }
    },
    function(text,next) {
      const splitText = textSplitter(text, 100)
      linter.lint(splitText.join('\n'),argv,function(err, results) {
        next(err, results, splitText)
      });
    },
    function(results,splitText,next) {
      formatters[argv.formatter](results,splitText,next);
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
