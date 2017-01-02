const Table = require('cli-table');

module.exports = function(resultSets,done) {
  var str = '';
  resultSets.forEach(function(results) {
    var table = new Table({
      'head': ['Line','Index','Length','Detail']
    });
    results.errors.forEach(function(error) {
      table.push([
        error.line,
        error.index,
        error.length,
        error.detail
      ]);
    });
    str += results.type + '\n' + table.toString() + '\n\n';
  });
  done(null,str);
}
