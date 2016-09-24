/*jslint node: true, maxlen: 80, indent: 2*/
"use strict";

var assert = require("assert"),
  RomanNumber;

function isString(value) {
  return typeof value === "string" || value instanceof String;
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

RomanNumber.stringFromInteger = function (intValue) {
  if (intValue < 1 || intValue > 3999) {
    throw new Error("invalid range");
  }

  return RomanNumber.numerals.reduce(function (result, numeral) {
    var quotient;

    quotient = Math.floor(result.remainingValue / numeral.value);

    if (quotient === 0) {
      return result;
    }

    result.remainingValue %= numeral.value;
    result.stringValue += repeatString(numeral.symbol, quotient);

    return result;
  }, {
    remainingValue: intValue,
    stringValue: ""
  }).stringValue;
};

RomanNumber.integerFromString = function (stringValue) {
  if (!/^[MDCLXVI]+$/.test(stringValue)) {
    throw new Error("invalid value");
  }

  var intValue = 0, remainingStringValue = stringValue;

  while (remainingStringValue.length > 0) {

    RomanNumber.numerals.forEach(function (numeral) {
      var head, tail;

      head = remainingStringValue.substring(0, numeral.symbol.length)
      tail = remainingStringValue.substring(numeral.symbol.length)

      if (numeral.symbol === head) {
        intValue += numeral.value;
        remainingStringValue = tail;
      }
    });

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
["error", "iv", "CD1X"].forEach(function (invalidValue) {
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
