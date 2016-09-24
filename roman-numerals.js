/*jslint node: true, maxlen: 80, indent: 2*/
"use strict";

var assert = require("assert"),
  RomanNumber;

RomanNumber = function (value) {

  if (!(this instanceof RomanNumber)) {
    return new RomanNumber(value);
  }

};

// Tests

// Enforce new
assert(RomanNumber() instanceof RomanNumber);
