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

};

// Tests

// Enforce new
assert(RomanNumber(10) instanceof RomanNumber);

// Check for null, undefined and empty string
[null, undefined, ""].forEach(function (emptyValue) {
  assert.throws(function () {
    new RomanNumber(emptyValue)
  }, /value required/);
})
