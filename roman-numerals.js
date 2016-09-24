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

  if (Number.isInteger(value)) {
    this.intValue = value;
    this.stringValue = RomanNumber.fromInteger(value);
  }

};

RomanNumber.numerals = [
  { symbol: "M", value: 1000 },
  { symbol: "CM", value: 900 },
  { symbol: "D", value: 500 },
  { symbol: "CD", value: 400 },
  { symbol: "C", value: 100 },
  { symbol: "XC", value: 90 },
  { symbol: "L", value: 50 },
  { symbol: "XL", value: 40 },
  { symbol: "X", value: 10 },
  { symbol: "IX", value: 9 },
  { symbol: "V", value: 5 },
  { symbol: "IV", value: 4 },
  { symbol: "I", value: 1 }
];

RomanNumber.fromInteger = function (value) {
  if (value < 1 || value > 3999) {
    throw new Error("invalid range");
  }

  function repeatSymbol(symbol, times) {
    var i, result = "";
    for (i = 0; i < times; i += 1) {
      result += symbol;
    }
    return result;
  }

  return RomanNumber.numerals.reduce(function (result, numeral) {
    var quotient, remainder;

    quotient = Math.floor(value / numeral.value);
    remainder = value % numeral.value;

    if (quotient === 0) {
      return result;
    }

    value = remainder;
    return result + repeatSymbol(numeral.symbol, quotient);
  }, "");
};

RomanNumber.prototype.toInt = function () {
  return this.intValue;
};

RomanNumber.prototype.toString = function () {
  return this.stringValue;
};


// Tests

// Enforce new
assert(RomanNumber(10) instanceof RomanNumber);

// Check for null, undefined and empty string
[null, undefined, ""].forEach(function (emptyValue) {
  assert.throws(function () {
    new RomanNumber(emptyValue);
  }, /value required/);
});

// Check for out of range values
[-1, 0, 4000, 10000].forEach(function (outOfRangeValue) {
  assert.throws(function () {
    new RomanNumber(outOfRangeValue);
  }, /invalid range/);
});

// Converting integers into roman numerals
[
  { intValue: 1, stringValue: "I" },
  { intValue: 3, stringValue: "III" },
  { intValue: 4, stringValue: "IV" },
  { intValue: 5, stringValue: "V" },
  { intValue: 9, stringValue: "IX" },
  { intValue: 69, stringValue: "LXIX" },
  { intValue: 1968, stringValue: "MCMLXVIII" },
  { intValue: 1473, stringValue: "MCDLXXIII" },
  { intValue: 2522, stringValue: "MMDXXII" },
  { intValue: 2999, stringValue: "MMCMXCIX" },
  { intValue: 3000, stringValue: "MMM" }
].forEach(function (valuePair) {
  assert.equal(
    new RomanNumber(valuePair.intValue).toString(),
    valuePair.stringValue
  );
});
