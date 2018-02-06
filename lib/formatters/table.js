const Table = require('cli-table');

module.exports = function(resultSets,splitText,done) {
  var str = '';
  splitText.forEach((line, lineNumber) => {
    str += (padZeros(lineNumber,splitText.length) + '. ' + line) + '\n'
  });
  str += '\n'
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

const padZeros = (number, maxNumber) => {
  const maxStr = maxNumber + ''
  const curStr = number + ''
  const zeros = maxStr.length - curStr.length
  let str = ''
  for(let i = 0; i < zeros; i++) {
    str += '0'
  }
  str += number
  return str
}
