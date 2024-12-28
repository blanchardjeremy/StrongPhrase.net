import React from 'react';

const hardwareOptions = {
  "Expected law enforcement rate": 25,
  "Speculative high-end rate": 250,
  // "Best consumer hardware": 2.6e6, // 2.6 million
};

export const defaultHashRate = Object.values(hardwareOptions)[0];

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

const HashRateSelector = ({ hashRate, setHashRate }) => {

  const handleChange = (e) => {
    const selectedValue = Number(e.target.value);
    setHashRate(selectedValue);
  };

  return (
    <div>
      <label className="label label-text">Select attacker computing power:</label>
      <select
        id="hashRateSelect"
        value={hashRate}
        onChange={handleChange}
        className="border rounded-lg select select-bordered select-sm max-w-[80vw] text-sm"
      >
        {Object.entries(hardwareOptions).map(([key, value]) => (
          <option key={value} value={value}>
            {key} [{formatGuessRate(value)}]
          </option>
        ))}
      </select>
    </div>
  );
};

export default HashRateSelector;
