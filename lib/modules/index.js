['passiveVoice','weaselWords','lexicalIllusions','spelling'].forEach(function(mod) {
  module.exports[mod] = require('./' + mod);
})
