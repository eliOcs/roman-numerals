/*jslint node: true, maxlen: 80, indent: 2*/
"use strict";

var assert = require("assert"),
  RomanNumber;

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

function stringStartsWith(string, start) {
  return string.substring(0, start.length) === start;
}

function repeatString(string, times) {
  var i, result = "";
  for (i = 0; i < times; i += 1) {
    result += string;
  }
  return result;
}

RomanNumber = function (value) {

  if (!(this instanceof RomanNumber)) {
    return new RomanNumber(value);
  }

  if (value === null || value === undefined || value === "") {
    throw new Error("value required");
  }

  if (Number.isInteger(value)) {
    this.intValue = value;
    this.stringValue = RomanNumber.stringFromInteger(value);
  } else if (isString(value)) {
    this.intValue = RomanNumber.integerFromString(value);
    this.stringValue = value;
  } else {
    throw new Error("invalid value");
  }

};

RomanNumber.prototype.toInt = function () {
  return this.intValue;
};

RomanNumber.prototype.toString = function () {
  return this.stringValue;
};

RomanNumber.NUMERALS = [
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

RomanNumber.FORMAT = new RegExp("^" +
    "M{0,3}" + // thousands
    "(C{0,3}|CD|DC{0,3}|CM)" + // hundreds
    "(X{0,3}|XL|LX{0,3}|XC)" + // tens
    "(I{0,3}|IV|VI{0,3}|IX)" + // units
  "$");

RomanNumber.MIN = 1;

RomanNumber.MAX = 3999;

RomanNumber.stringFromInteger = function (intValue) {
  if (intValue < RomanNumber.MIN || intValue > RomanNumber.MAX) {
    throw new Error("invalid range");
  }

  var remainingIntValue = intValue, stringValue = "";

  RomanNumber.NUMERALS.forEach(function (numeral) {

    var quotient = Math.floor(remainingIntValue / numeral.value);

    if (quotient === 0) {
      return;
    }

    remainingIntValue %= numeral.value;
    stringValue += repeatString(numeral.symbol, quotient);

  });

  return stringValue;
};

RomanNumber.integerFromString = function (stringValue) {
  if (!RomanNumber.FORMAT.test(stringValue)) {
    throw new Error("invalid value");
  }

  var intValue = 0, remainingStringValue = stringValue, matchingNumeral;

  while (remainingStringValue.length > 0) {

    matchingNumeral = RomanNumber.NUMERALS.find(function (numeral) {
      return stringStartsWith(remainingStringValue, numeral.symbol);
    });

    intValue += matchingNumeral.value;
    remainingStringValue = remainingStringValue.
      substring(matchingNumeral.symbol.length);

  }

  return intValue;
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

// Check for invalid types
[1.3, false, [1, 2, 3], {}].forEach(function (invalidValue) {
  assert.throws(function () {
    new RomanNumber(invalidValue);
  }, /invalid value/);
});

// Check for out of range values
[-1, 0, 4000, 10000].forEach(function (outOfRangeValue) {
  assert.throws(function () {
    new RomanNumber(outOfRangeValue);
  }, /invalid range/);
});

// Check for invalid string formats
[
  // invalid characters
  "error",
  "iv",
  "CD1X",
  // invalid symbol order
  "XMI",
  "MCMVVL",
  "DCDC",
  "VIVIVI",
  // invalid number of symbol repetition
  "MMMMCIX",
  "MCMLLLLII"
].forEach(function (invalidValue) {
  assert.throws(function () {
    new RomanNumber(invalidValue);
  }, /invalid value/);
});

// Converting between integers and roman numerals
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

  assert.equal(
    new RomanNumber(valuePair.stringValue).toInt(),
    valuePair.intValue
  );
});
