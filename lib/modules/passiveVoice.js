const utils = require('../utils');

module.exports = {
  'name': 'Passive Voice',
  'prepareForRun': function(options,done) {
    utils.optionSetup(options,'irregulars',done);
  },
  'run': function(linesOfText,options,done) {
    const regex = new RegExp('\\b(am|are|were|being|is|been|was|be)\\b[ ]*(\w+ed|(' + options.irregulars.join('|') + '))\\b','g');
    done(null,utils.regexMatcher(regex,linesOfText));
  }
};
