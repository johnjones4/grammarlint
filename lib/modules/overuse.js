const utils = require('../utils');

var dict;

module.exports = {
  'name': 'Word Overuse',
  'prepareForRun': function(options,done) {
    utils.optionSetup(options,'commons',done);
  },
  'run': function(linesOfText,options,done) {
    const wordMap = {};
    linesOfText.forEach(function(line,i) {
      const words = line.trim().split(' ');
      words.forEach(function(word,j) {
        var wordNormalized = utils.normalizeWord(word).toLowerCase();
        if (wordNormalized && wordNormalized.trim().length > 0 && options.commons.indexOf(wordNormalized) < 0) {
          if (!wordMap[wordNormalized]) {
            wordMap[wordNormalized] = [];
          }
          wordMap[wordNormalized].push({
            'line': i,
            'index': words.slice(0,j).join(' ').length + 1,
            'length': word.length,
            'detail': ''
          });
        }
      })
    });
    const errors = [];
    for(var word in wordMap) {
      if (wordMap[word].length > options.overuseThreshold) {
        wordMap[word].forEach(function(error) {
          error.detail = word + ' (Used ' + wordMap[word].length + ' times)';
          errors.push(error);
        });
      }
    }
    errors.sort(function(errorA,errorB) {
      if (errorA.line == errorB.line) {
        return errorA.index - errorB.index;
      } else {
        return errorA.line - errorB.line;
      }
    });
    done(null,errors);
  }
}
