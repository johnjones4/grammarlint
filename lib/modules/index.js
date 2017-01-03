['passiveVoice','weaselWords','lexicalIllusions','spelling','overuse'].forEach(function(mod) {
  module.exports[mod] = require('./' + mod);
})
