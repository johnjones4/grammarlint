const path = require('path');

module.exports = {
  'irregulars': path.join(__dirname,'irregulars.txt'),
  'weasels': path.join(__dirname,'weasels.txt'),
  'aff': path.join(__dirname,'en_US.aff'),
  'dic': path.join(__dirname,'en_US.dic'),
  'skipWords': [],
  'skip': [],
  'formatter': 'table'
}
