import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const selectedValue = Number(e.target.value);
    setHashRate(selectedValue);
    setIsModalOpen(false);
  };

  const selectedLabel = Object.entries(hardwareOptions).find(([_, value]) => value === hashRate)?.[0];

  const mobileSelector = (
    <div className="md:hidden">
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-sm rounded-lg px-3 py-1.5 bg-white"
      >
        <FaBars className="text-xl" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90vw] max-w-sm">
            <h3 className="font-medium mb-3">Select attacker computing power</h3>
            <select
              value={hashRate}
              onChange={handleChange}
              className="w-full border rounded-lg select select-bordered select-sm text-sm mb-3"
            >
              {Object.entries(hardwareOptions).map(([key, value]) => (
                <option key={value} value={value}>
                  {key} [{formatGuessRate(value)}]
                </option>
              ))}
            </select>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full border rounded-lg py-2 mt-2 bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const desktopSelector = (
    <div className="hidden md:block">
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

  return (
    <div>
      {mobileSelector}
      {desktopSelector}
    </div>
  );
};

export default HashRateSelector;
