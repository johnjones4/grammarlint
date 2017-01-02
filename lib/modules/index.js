['passiveVoice','weaselWords','lexicalIllusions'].forEach(function(mod) {
  module.exports[mod] = require('./' + mod);
})
