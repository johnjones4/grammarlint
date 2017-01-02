const assert = require('assert');
const path = require('path');
const grammarModules = require('./lib/modules');

var defaultOptions;

describe('GrammarLint',function() {
  before(function(done) {
    defaultOptions = require('./defaults');
    done();
  });

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
      ];
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

  describe('Spell Check',function() {
    before(function(done) {
      grammarModules.spelling.prepareForRun(defaultOptions,done);
    })

    it('Finds spelling errors.',function(done) {
      const text = [
        'The big holiday giift of the season seems to have been the Amazon Echo Dot. The smalle voice-controlled gadget was the perfectt combination of low-cost and high-tech for gadget lovers and techies everywhere. Amazon\'s line of \"Echo\" produc2ts represents the first big hit seller in voice-controlled digital assistants following on the mediocre performance and reviewgs of such similar offerings by Apple first with Siri and then Microsoft and Google with their own voice-controlled assistants integrated into their core suite of products. With the market for digital assistants now established and Amazon solidified as a front runner, I turn my attention to the ecosystem of peripheral Internet of Things (IoT) enabled devices around it.'
      ];
      grammarModules.spelling.run(text,defaultOptions,function(err,errors) {
        if (err) {
          done(err);
        } else {
          assert(errors.length > 0);
          done();
        }
      });
    });
  });
});
