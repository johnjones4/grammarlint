# GrammarLint

[![Build Status](https://travis-ci.org/johnjones4/grammarlint.svg?branch=master)](https://travis-ci.org/johnjones4/grammarlint)

[![NPM](https://nodei.co/npm/grammarlint.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/grammarlint/)

[![NPM](https://nodei.co/npm-dl/grammarlint.png)](https://nodei.co/npm/grammarlint/)

## Description

This is a Node.JS implementation of the grammar verification Bash scripts by [Matt Might](http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/). Taking his work a bit further, this implementation installs as a global binary, allows for future expansion of modules, and outputs the found errors in various ways that best suit the user.

## Checks

The linter checks for the following things:

* **Lexical illusions** - Repeated adjacent words such as "the the" even between lines.
* **Overuse** - Overuse of non-common words such as articles.
* **Passive Voice** - Use of passive rather than active voice.
* **Spelling** - Uses OS-native spellcheck functionality.
* **Weasel Words** - Use of lazy or "weasel" words such as very, fairly, many, etc.

## Installation

Install the command line tool globally using *npm's* `-g` option:

```
# sudo npm install grammarlint -g
```

## Usage

### General Usage

```
# grammarlint /path/to/text
```

### Options

* **--irregulars** Override the default list of verbs used when finding passive voice. It can be a path to a text file with each verb on a new line or a JSON array passed-in directly.
* **--weasels** Override the default list of weasels words. It can be a path to a text file with each word on a new line or a JSON array passed-in directly.
* **--skipWords** Specify words to skip during spellcheck.
* **--commons** Specify which words to treat as "common" during word overuse checking.
* **--overuseThreshold** Specify frequency of use to qualify as overused. (Defaults to 10)
* **--skip** Optionally skip some checks. Options are the names of each check. (i.e. "Passive Voice")
* **--formatter** Output the results using different formatters. Default is "table" but "csv" is also available.

## To Do

* Build subject verb agreement module
* Build capitalization detection module
* Build Checkstyle output formatter
* Integrate https://github.com/maxogden/common-english-errors
