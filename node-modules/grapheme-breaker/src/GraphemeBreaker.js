// Generated by CoffeeScript 1.8.0
(function() {
  var CR, Control, Extend, L, LF, LV, LVT, Regional_Indicator, SpacingMark, T, UnicodeTrie, V, classTrie, codePointAt, fs, shouldBreak, _ref;

  _ref = require('./classes.json'), CR = _ref.CR, LF = _ref.LF, Control = _ref.Control, Extend = _ref.Extend, Regional_Indicator = _ref.Regional_Indicator, SpacingMark = _ref.SpacingMark, L = _ref.L, V = _ref.V, T = _ref.T, LV = _ref.LV, LVT = _ref.LVT;

  UnicodeTrie = require('unicode-trie');

  fs = require('fs');

  classTrie = new UnicodeTrie(fs.readFileSync(__dirname + '/classes.trie'));

  codePointAt = function(str, idx) {
    var code, hi, low;
    idx = idx || 0;
    code = str.charCodeAt(idx);
    if ((0xD800 <= code && code <= 0xDBFF)) {
      hi = code;
      low = str.charCodeAt(idx + 1);
      if ((0xDC00 <= low && low <= 0xDFFF)) {
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      }
      return hi;
    }
    if ((0xDC00 <= code && code <= 0xDFFF)) {
      hi = str.charCodeAt(idx - 1);
      low = code;
      if ((0xD800 <= hi && hi <= 0xDBFF)) {
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      }
      return low;
    }
    return code;
  };

  shouldBreak = function(previous, current) {
    if (previous === CR && current === LF) {
      return false;
    } else if (previous === Control || previous === CR || previous === LF) {
      return true;
    } else if (current === Control || current === CR || current === LF) {
      return true;
    } else if (previous === L && (current === L || current === V || current === LV || current === LVT)) {
      return false;
    } else if ((previous === LV || previous === V) && (current === V || current === T)) {
      return false;
    } else if ((previous === LVT || previous === T) && current === T) {
      return false;
    } else if (previous === Regional_Indicator && current === Regional_Indicator) {
      return false;
    } else if (current === Extend) {
      return false;
    } else if (current === SpacingMark) {
      return false;
    }
    return true;
  };

  exports.nextBreak = function(string, index) {
    var i, next, prev, _i, _ref1, _ref2, _ref3, _ref4;
    if (index == null) {
      index = 0;
    }
    if (index < 0) {
      return 0;
    }
    if (index >= string.length - 1) {
      return string.length;
    }
    prev = classTrie.get(codePointAt(string, index));
    for (i = _i = _ref1 = index + 1, _ref2 = string.length; _i < _ref2; i = _i += 1) {
      if ((0xd800 <= (_ref3 = string.charCodeAt(i - 1)) && _ref3 <= 0xdbff) && (0xdc00 <= (_ref4 = string.charCodeAt(i)) && _ref4 <= 0xdfff)) {
        continue;
      }
      next = classTrie.get(codePointAt(string, i));
      if (shouldBreak(prev, next)) {
        return i;
      }
      prev = next;
    }
    return string.length;
  };

  exports.previousBreak = function(string, index) {
    var i, next, prev, _i, _ref1, _ref2, _ref3;
    if (index == null) {
      index = string.length;
    }
    if (index > string.length) {
      return string.length;
    }
    if (index <= 1) {
      return 0;
    }
    index--;
    next = classTrie.get(codePointAt(string, index));
    for (i = _i = _ref1 = index - 1; _i >= 0; i = _i += -1) {
      if ((0xd800 <= (_ref2 = string.charCodeAt(i)) && _ref2 <= 0xdbff) && (0xdc00 <= (_ref3 = string.charCodeAt(i + 1)) && _ref3 <= 0xdfff)) {
        continue;
      }
      prev = classTrie.get(codePointAt(string, i));
      if (shouldBreak(prev, next)) {
        return i + 1;
      }
      next = prev;
    }
    return 0;
  };

  exports["break"] = function(str) {
    var brk, index, res;
    res = [];
    index = 0;
    while ((brk = exports.nextBreak(str, index)) < str.length) {
      res.push(str.slice(index, brk));
      index = brk;
    }
    if (index < str.length) {
      res.push(str.slice(index));
    }
    return res;
  };

  exports.countBreaks = function(str) {
    var brk, count, index;
    count = 0;
    index = 0;
    while ((brk = exports.nextBreak(str, index)) < str.length) {
      index = brk;
      count++;
    }
    if (index < str.length) {
      count++;
    }
    return count;
  };

}).call(this);
