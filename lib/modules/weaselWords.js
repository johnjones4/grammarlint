const utils = require('../utils');

module.exports = {
  'name': 'Weasel Words',
  'prepareForRun': function(options,done) {
    utils.jsonOptionSetup(options,'weasels',done);
  },
  'run': function(linesOfText,options,done) {
    const regex = new RegExp('\\b(' + options.weasels.join('|') + ')\\b','g');
    done(null,utils.regexMatcher(regex,linesOfText));
  }
};
