const fs = require('fs');

exports.splitString = function(string) {
  return string.split(',').map(function(word) {
    return word.trim()
  }).filter(function(word) {
    return word && word.length > 0;
  });
}

exports.regexMatcher = function(regex,linesOfText) {
  const errors = [];
  linesOfText.forEach(function(line,i) {
    var match;
    while (match = regex.exec(line)) {
      errors.push({
        'line': i,
        'index': match.index,
        'length': match[0].length,
        'detail': match[0]
      });
    }
  });
  return errors;
}

exports.optionSetup = function(options,optionName,done) {
  if (options[optionName] && typeof options[optionName] == 'string') {
    try {
      options[optionName] = JSON.parse(options[optionName]);
    } catch(e) {
      fs.readFile(options[optionName],'utf-8',function(err,data) {
        if (err) {
          done(err);
        } else {
          try {
            options[optionName] = data.split('\n').filter(function(item) {
              return item && item.trim().length > 0;
            });
            done();
          } catch (e) {
            done(e);
          }
        }
      });
    }
  } else {
    options[optionName] = options[optionName] || [];
    done();
  }
}
