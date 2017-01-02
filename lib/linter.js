const grammarModules = require('./modules');
const async = require('async');

exports.lint = function(text,options,done) {
  const linesOfText = text.split('\n');
  async.parallel(
    grammarModules.map(function(grammarMod) {
      return function(next) {
        if (options.skip.indexOf(grammarMod.name) < 0) {
          grammarMod.run(linesOfText,options,function(err,errors) {
            if (err) {
              next(err);
            } else {
              next(null,{
                'type': grammarMod.name,
                'errors': errors
              });
            }
          });
        } else {
          next();
        }
      }
    }),
    done
  );
}
