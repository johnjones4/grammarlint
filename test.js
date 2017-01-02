const assert = require('assert');
const path = require('path');
const grammarModules = require('./lib/modules');

const defaultOptions = {
  'irregulars': path.join(__dirname,'defaults','irregulars.txt'),
  'weasels': path.join(__dirname,'defaults','weasels.txt')
}

describe('GrammarLint',function() {
  describe('Lexical Illusion',function() {
    it('Finds duplicate adjacent words.',function(done) {
      const text = [
        'Many readers are not  not aware that the',
        'the brain will automatically ignore',
        '',
        'ignore',
        'a second instance of of the word "the"',
        'when when it starts a new line.'
      ];
      const expected = [
        { line: 0, index: 17, length: 8, detail: 'not  not' },
        { line: 1, index: 37, length: 8, detail: 'the\\nthe' },
        { line: 3, index: 29, length: 14, detail: 'ignore\\nignore' },
        { line: 4, index: 18, length: 5, detail: 'of of' }
      ]
      grammarModules.lexicalIllusions.run(text,defaultOptions,function(err,errors) {
        if (err) {
          done(err);
        } else {
          assert.strictEqual(errors.length,4);
          errors.forEach(function(error,i) {
            assert.strictEqual(error.line,expected[i].line);
            assert.strictEqual(error.index,expected[i].index);
            assert.strictEqual(error.length,expected[i].length);
            assert.strictEqual(error.detail,expected[i].detail);
          });
          done();
        }
      });
    })
  });

  describe('Passive Voice',function() {
    before(function(done) {
      grammarModules.passiveVoice.prepareForRun(defaultOptions,done);
    })

    it('Finds usage of passive voice.',function(done) {
      const text = [
        'Termination is guaranteed on any input.',
        'Termination is guaranteed on any input by a finite state-space.',
        'A finite state-space guarantees termination on any input.'
      ];
      const expected = [
        { line: 0, index: 12, length: 13, detail: 'is guaranteed' },
        { line: 1, index: 12, length: 13, detail: 'is guaranteed' }
      ]
      grammarModules.passiveVoice.run(text,defaultOptions,function(err,errors) {
        if (err) {
          done(err);
        } else {
          assert.strictEqual(errors.length,2);
          errors.forEach(function(error,i) {
            assert.strictEqual(error.line,expected[i].line);
            assert.strictEqual(error.index,expected[i].index);
            assert.strictEqual(error.length,expected[i].length);
            assert.strictEqual(error.detail,expected[i].detail);
          });
          done();
        }
      });
    });
  });

  describe('Weasel Words',function() {
    before(function(done) {
      grammarModules.weaselWords.prepareForRun(defaultOptions,done);
    })

    it('Finds usage of weasel words.',function(done) {
      const text = [
        'False positives were surprisingly low.',
        'To our surprise, false positives were low.',
        'There is very close match between the two semantics.',
        'We offer a completely different formulation of CFA.'
      ];
      const expected = [
        { line: 0, index: 21, length: 12, detail: 'surprisingly' },
        { line: 2, index: 9, length: 4, detail: 'very' },
        { line: 3, index: 11, length: 10, detail: 'completely' }
      ]
      grammarModules.weaselWords.run(text,defaultOptions,function(err,errors) {
        if (err) {
          done(err);
        } else {
          assert.strictEqual(errors.length,3);
          errors.forEach(function(error,i) {
            assert.strictEqual(error.line,expected[i].line);
            assert.strictEqual(error.index,expected[i].index);
            assert.strictEqual(error.length,expected[i].length);
            assert.strictEqual(error.detail,expected[i].detail);
          });
          done();
        }
      });
    });
  });
});
