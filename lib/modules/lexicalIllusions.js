module.exports = {
  'name': 'Lexical Illusion',
  'prepareForRun': function(options,done) {
    done();
  },
  'run': function(linesOfText,options,done) {
    var lastLine = null;
    var lastWordOfLastLine = null;
    const errors = [];
    linesOfText.forEach(function(line,i) {
      if (line && line.trim().length > 0) {
        const words = line.trim().split(' ');
        if (words.length > 0) {
          if (lastLine && lastWordOfLastLine && lastWordOfLastLine.toLowerCase() == words[0].toLowerCase()) {
            errors.push({
              'line': i,
              'index': linesOfText[lastLine].length - lastWordOfLastLine.length,
              'length': lastWordOfLastLine.length,
              'detail': lastWordOfLastLine + '\\n' + words[0]
            });
          }
          lastLine = i;
          lastWordOfLastLine = words[words.length - 1];

          var j = 1;
          var lastWord = null;
          var lastWordIndex = null;
          while(j < words.length) {
            if (words[j].trim().length > 0) {
              if (lastWordIndex && words[lastWordIndex].toLowerCase() == words[j].toLowerCase()) {
                errors.push({
                  'line': (i+1),
                  'index': words.slice(0,lastWordIndex).join(' ').length + 1,
                  'length': words.slice(lastWordIndex,j+1).join(' ').length,
                  'detail': words.slice(lastWordIndex,j+1).join(' ')
                });
              }
              lastWordIndex = j;
            }
            j++;
          }
        }
      }
    });
    done(null,errors);
  }
};
