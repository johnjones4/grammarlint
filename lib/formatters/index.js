['csv','table'].forEach(function(mod) {
  module.exports[mod] = require('./' + mod);
})
