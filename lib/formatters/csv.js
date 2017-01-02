const stringify = require('csv-stringify');

module.exports = function(resultSets,done) {
  const output = [];
  resultSets.forEach(function(results) {
    results.errors.forEach(function(error) {
      output.push({
        'Type': results.type,
        'Line': error.line,
        'Index': error.index,
        'Length': error.length,
        'Detail': error.detail
      });
    });
  });
  const opts = {
    'columns': ['Type','Line','Index','Length','Detail'],
    'header': true
  }
  stringify(output,opts,done);
}
