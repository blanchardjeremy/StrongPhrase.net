import React, { useState } from "react";
import { convertTimeToReadableFormat, timeToCrackAvg, avgCostToCrack, formatDollarToScale } from "./passphraseUtils.js";
import HashRateSelector, { defaultHashRates } from './HashRateSelector';
import { Link } from "react-router-dom";
import PageToolbar from './components/PageToolbar';

const costOptions = {
  "$0.001": 0.001,
  "$0.01": 0.01,
  "$0.25 (Best-case cloud scenario bcrypt)": 0.25,
  "$0.50 (Default)": 0.50,
  "$1.00": 1,
  "$6.00 (1Password scenario)": 6,
};
const defaultCostToCrack = 0.50;

const formatNumber = (number) => {
  let rounded = Number(number.toPrecision(3));
  return rounded.toLocaleString();
};

const EntropyCrackTimeTable = () => {
  const [hashRate, setHashRate] = useState(defaultHashRates.passphrase);
  const [costPerGuess32, setCostPerGuess32] = useState(defaultCostToCrack);
  const [showAllSteps, setShowAllSteps] = useState(false);

  const handleCostChange = (event) => {
    setCostPerGuess32(Number(event.target.value));
  };

  const toggleSteps = () => {
    setShowAllSteps(!showAllSteps);
  };

  const generateTableData = () => {
    let data = [];
    let step = showAllSteps ? 1 : 5;
    for (let bits = 5; bits <= 100; bits += step) {
      const numberOfGuesses = 2 ** bits;
      const avgCost = avgCostToCrack(bits, costPerGuess32);
      const roundedCost = formatDollarToScale(avgCost, 2, false);
      const avgTime = timeToCrackAvg(bits, hashRate);
      const maxTime = avgTime * 2;
      data.push({
        bits,
        guesses: formatNumber(numberOfGuesses),
        avgtime: convertTimeToReadableFormat(avgTime),
        maxtime: convertTimeToReadableFormat(maxTime),
        cost: roundedCost.toLocaleString()
      });
    }
    return data;
  };

  const tableData = generateTableData();

  return (
    <div className="container mx-auto p-4">
      <h2 className="page-title">Time and Cost to Crack</h2>


      <div className="card card-body p-6 bg-gray-100 mt-4 flex flex-grow max-w-3xl text-sm">
        <p className="mt-0">
          See the <Link to="/" className="link link-hover">FAQ on the main page</Link> for more information on time to crack and cost to crack calculations.
        </p>
      </div>

      <div className="card card-body p-6 bg-green-100 mt-4 flex flex-grow max-w-3xl text-sm">
        <p className="mt-0">
          <strong>Takeaway:</strong> <u>45 bits</u> should be your minimum and most people don't need more than <u>65 bits</u>.
        </p>
      </div>


      <PageToolbar generateButtonText="" isSticky={true} hideButton={true}>
        <HashRateSelector setHashRate={setHashRate} hashRate={hashRate} />

        <div>
          <label className="label label-text">$ Cost per 2^32 guesses:</label>
          <select 
            value={costPerGuess32} 
            onChange={handleCostChange} 
            className="select select-bordered w-auto max-w-xs select-sm"
          >
            {Object.entries(costOptions).map(([label, value]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <button 
            onClick={toggleSteps} 
            className="btn btn-sm justify-end"
          >
            {showAllSteps ? 'Show every 5 steps' : 'Show all entropy steps'}
          </button>
        </div>
      </PageToolbar>

      <div className="overflow-x-auto mt-2">
        <table className="table table-zebra w-auto">
          <thead>
            <tr>
              <th>Bits of Entropy</th>
              <th>Pool of possible guesses</th>
              <th>Max Crack Time (double)</th>
              <th>Avg. Crack Time</th>
              <th>Avg cost to crack</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.bits}>
                <td className="font-bold">{row.bits} bits</td>
                <td>{row.guesses}</td>
                <td><em>{row.maxtime}</em></td>
                <td><strong>{row.avgtime}</strong></td>
                <td><strong>{row.cost}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntropyCrackTimeTable;
