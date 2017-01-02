module.exports = [];

['passiveVoice','weaselWords','lexicalIllusions'].forEach(function(mod) {
  module.exports.push(require('./' + mod));
})
