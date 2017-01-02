const fs = require('fs');

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

exports.jsonOptionSetup = function(options,optionName,done) {
  if (options[optionName] && typeof options[optionName] == 'string') {
    try {
      options[optionName] = JSON.parse(options[optionName]);
    } catch(e) {
      fs.readFile(options[optionName],'utf-8',function(err,data) {
        if (err) {
          done(err);
        } else {
          try {
            options[optionName] = JSON.parse(data);
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
