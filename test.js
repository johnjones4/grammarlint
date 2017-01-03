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
    });

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
    });

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
    });

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

  describe('Overuse',function() {
    before(function(done) {
      grammarModules.overuse.prepareForRun(defaultOptions,done);
    });

    it('Finds overuses of words.',function(done) {
      const text = [
        'The lights in my home are IoT enabled and controlled by both an app on my phone provided by the lights\' manufacturer and through my two Echo devices. It\'s great; I can tune the lights using my voice to just what I need, set them on timers, and set an "away mode" that overrides the settings if I am out of the apartment for an extended period. But that, save for a few other devices such as the Nest, is really about the best Alexa, Amazon\'s name for the voice assistant powering Echo, can do with smart home technology. There are hundreds of other electronic devices in my apartment - many that are or will eventually be IoT ready - but there\'s no way for Alexa to talk to them. My TV, stereo system, kitchen appliances, etc are all, while possibly independently sophisticated, islands of connectivity. I cannot ask Alexa to preheat my oven, change the channel on my Xfinity box, or put the tea kettle on because those manufacturers have not expressly built in support for Alexa.',
        'What is needed is an open standard that manufacturers can begin building into their product lines. This standard would describe the communications interface for IoT devices that all digital assistants such as Siri or Alexa can talk to. That interface would include definitions for basic "intents," actions to perform as indicated by a user\'s language, and some framework around device discoverability and management. While simple in description, this standard would be a rich catalog of every type of device and action in the IoT landscape plus some extra genericized intents for future expansion.',
        'In essence, I am asking for a common language that all digital assistants can use to communicate with IoT devices. Without it, all of these Internet ready devices are their own little walled gardens within each manufacturer\'s ecosystem. Such that GE appliances may only work with Google, Samsung TVs might only work with Samsung phones, etc. Let\'s not even begin to consider how alienated Apple\'s HomeKit seems to be becoming as a failed extension of the omnipresent Apple ecosystem.',
        'An open standard helps consumers because it removes the proprietary interface that individuals must use to work with IoT devices. For instance, my smart light bulbs wouldn\'t necessarily need to be controlled by just the app from the manufacturer and any devices they choose to make compatible with them. Instead,  any digital assistant could control a device as long as they both adhere to the standard. For instance, I could ask Alexa to turn the lights off, but if I forget to do that after I leave the house, I could also ask Siri on my phone. If I buy a new IoT enabled kitchen appliance, I just need to know it\'s compatible with the standard and not if it works with Alexa or not. It would be the same as the WiFi icon that started appearing on computers several years ago to show they adhered to that standard.',
        'This helps device manufacturers of both the IoT devices and the controlling digital assistants. For makers of digital assistants, this makes their device compatible with virtually any other IoT device. They can then focus their product development efforts on making their AI and skill suite as rich and smart as possible - which would be independent of the standard and therefore an area where a "secret sauce" could win them the industry. IoT enabled device manufactures will see an upside in the same way all manufactures have realized the benefits of embracing open source. A shared code base that is stable, useful, and - most importantly in the realm of IoT - secured by independent verification will solve most of manufacturers\' R&D efforts.'
      ];
      const expected = [
        { line: 0, index: 26, length: 3, detail: 'iot (Used 11 times)' },
        { line: 0, index: 622, length: 3, detail: 'iot (Used 11 times)' },
        { line: 1, index: 161, length: 3, detail: 'iot (Used 11 times)' },
        { line: 1, index: 526, length: 3, detail: 'iot (Used 11 times)' },
        { line: 2, index: 102, length: 3, detail: 'iot (Used 11 times)' },
        { line: 3, index: 117, length: 3, detail: 'iot (Used 11 times)' },
        { line: 3, index: 562, length: 3, detail: 'iot (Used 11 times)' },
        { line: 4, index: 44, length: 3, detail: 'iot (Used 11 times)' },
        { line: 4, index: 190, length: 3, detail: 'iot (Used 11 times)' },
        { line: 4, index: 440, length: 3, detail: 'iot (Used 11 times)' },
        { line: 4, index: 659, length: 3, detail: 'iot (Used 11 times)' }
      ];
      grammarModules.overuse.run(text,defaultOptions,function(err,errors) {
        if (err) {
          done(err);
        } else {
          assert.strictEqual(errors.length,11);
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
