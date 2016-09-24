/*jslint node: true, maxlen: 80, indent: 2*/
"use strict";

var assert = require("assert"),
  RomanNumber;

RomanNumber = function (value) {

  if (!(this instanceof RomanNumber)) {
    return new RomanNumber(value);
  }

  if (value === null || value === undefined || value === "") {
    throw new Error("value required");
  }

  function fromInteger(value) {
    if (value < 1 || value > 3999) {
      throw new Error("invalid range");
    }
  }

  if (Number.isInteger(value)) {
    this.intValue = value;
    this.stringValue = fromInteger(value);
  }

};

// Tests

// Enforce new
assert(RomanNumber(10) instanceof RomanNumber);

// Check for null, undefined and empty string
[null, undefined, ""].forEach(function (emptyValue) {
  assert.throws(function () {
    new RomanNumber(emptyValue)
  }, /value required/);
});

// Check for out of range values
[0, 4000].forEach(function (outOfRangeValue) {
  assert.throws(function () {
    new RomanNumber(outOfRangeValue)
  }, /invalid range/);
});
