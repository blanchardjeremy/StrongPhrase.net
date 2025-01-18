import React from 'react';

export const hardwareOptions = {
  passcode: {
    "Expected law enforcement rate": 25,
    "Speculative high-end rate": 250
  },
  passphrase: {
    "Standard consumer hardware": 184000, // 184,000
    "Best consumer hardware": 2.6e6, // 2.6 million
    "Nation state (NSA, etc.)": 1.9e12, // 1.9 trillion
    "Far future nation state": 1e15 // 2 quadrillion
  },
  get all() {
    const prefixedPasscode = Object.entries(this.passcode).reduce((acc, [key, value]) => {
      acc[`Phone only: ${key}`] = value;
      return acc;
    }, {});
    return {
      ...prefixedPasscode,
      ...this.passphrase
    };
  }
};

export const defaultHashRates = {
  passcode: Object.values(hardwareOptions.passcode)[0],
  passphrase: Object.values(hardwareOptions.passphrase)[1],
  all: Object.values(hardwareOptions.passphrase)[1], // Assume passphrase is our main focus
};

const formatGuessRate = (value) => {
  if (value >= 1e15) {
    return `${(value / 1e15).toFixed(0)} quadrillion guesses/sec`;
  } else if (value >= 1e12) {
    return `${(value / 1e12).toFixed(0)} trillion guesses/sec`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(0)} million guesses/sec`;
  }
  return `${value.toLocaleString()} guesses/sec`;
};

// Mode can be 'passphrase' or 'passcode' or 'all'
const HashRateSelector = ({ hashRate, setHashRate, mode = 'passphrase' }) => {
  const handleChange = (e) => {
    const selectedValue = Number(e.target.value);
    setHashRate(selectedValue);
  };

  const options = hardwareOptions[mode];

  return (
    <div>
      <label className="label label-text">Select attacker computing power:</label>
      <select
        id="hashRateSelect"
        value={hashRate}
        onChange={handleChange}
        className="border rounded-lg select select-bordered select-sm max-w-full w-auto"
      >
        {Object.entries(options).map(([key, value]) => (
          <option key={value} value={value}>
            {key} [{formatGuessRate(value)}]
          </option>
        ))}
      </select>
    </div>
  );
};

export default HashRateSelector;
