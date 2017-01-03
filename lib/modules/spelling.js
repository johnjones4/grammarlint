const async = require('async');
const SpellChecker = require('spellchecker');
const utils = require('../utils');

var dict;

module.exports = {
  'name': 'Spelling',
  'prepareForRun': function(options,done) {
    if (typeof options.skipWords == 'string') {
      options.skipWords = utils.splitString(options.skipWords);
    }
    done();
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
                const noPunc = utils.normalizeWord(word);
                if (noPunc && noPunc.length > 0 && options.skipWords.indexOf(noPunc) < 0 && SpellChecker.isMisspelled(noPunc)) {
                  errors.push({
                    'line': i,
                    'index': words.slice(0,j).join(' ').length + 1,
                    'length': word.length,
                    'detail': noPunc + ' (Maybe: ' + SpellChecker.getCorrectionsForMisspelling(noPunc) + ')'
                  });
                  next1()
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
