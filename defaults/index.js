const path = require('path');

module.exports = {
  'irregulars': path.join(__dirname,'irregulars.txt'),
  'weasels': path.join(__dirname,'weasels.txt'),
  'skipWords': [],
  'commons': path.join(__dirname,'commons.txt'),
  'overuseThreshold': 10,
  'skip': [],
  'formatter': 'table'
}
