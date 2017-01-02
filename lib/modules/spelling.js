const fs = require('fs');
const async = require('async');
const nodehun = require('nodehun');
const utils = require('../utils');

var dict;

module.exports = {
  'name': 'Spelling',
  'prepareForRun': function(options,done) {
    if (typeof options.skipWords == 'string') {
      options.skipWords = utils.splitString(options.skipWords);
    }
    async.parallel({
      'aff': function(next) {
        fs.readFile(options.aff,next);
      },
      'dic': function(next) {
        fs.readFile(options.dic,next);
      }
    },function(err,files) {
      if (err) {
        done(err);
      } else {
        dict = new nodehun(files.aff,files.dic);
        done();
      }
    })
  },
  'run': function(linesOfText,options,done) {
    const errors = [];
    async.series(
      linesOfText.map(function(line,i) {
        return function(next) {
          const words = line.trim().split(' ');
          async.series(
            words.map(function(word,j) {
              return function(next1) {
                const noPunc = word.replace(/^[.,\/#!$%\^&\*;:{}=_`~()\-\"\?\']*/g,"").replace(/[.,\/#!$%\^&\*;:{}=_`~()\-\"\?\']*$/g,"").trim();
                if (noPunc && noPunc.length > 0 && options.skipWords.indexOf(noPunc) < 0) {
                  dict.spellSuggest(noPunc,function(err,correct,suggestion,origWord) {
                    if (err) {
                      next1(err);
                    } else if (!correct) {
                      errors.push({
                        'line': i,
                        'index': words.slice(0,j).join(' ').length + 1,
                        'length': word.length,
                        'detail': noPunc
                      });
                      next1();
                    } else {
                      next1();
                    }
                  });
                } else {
                  next1();
                }
              };
            }),
            next
          );
        };
      }),
      function(err) {
        done(err,errors);
      }
    );
  }
}
