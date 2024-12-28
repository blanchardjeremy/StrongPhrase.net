import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { timeToCrackAvg, convertTimeToReadableFormat } from './../passphraseUtils.js';
import { getPasscodeAndEntropy } from './passcodeUtils.js';
import PasscodeFAQ from './PasscodeFAQ.js'

import HashRateSelector, { defaultHashRate } from './HashRateSelector.js';
import { FaRegCopy, FaCheck, FaSyncAlt, FaInfoCircle } from "react-icons/fa";




const PasscodeDisplay = () => {
  const [passcodes, setPasscodes] = useState({});
  const [copiedBits, setCopiedBits] = useState(null);
  const [hashRate, setHashRate] = useState(defaultHashRate);

  const generatePasscodes = useCallback(() => {

    const passcodeData = {
      '6 digits': getPasscodeAndEntropy(6),
      '10 Digits': getPasscodeAndEntropy(10),
      // '11 Digits': getPasscodeAndEntropy(11),
      // '12 Digits': getPasscodeAndEntropy(12),
      // '3 Words': { passcode: 'Cardinal Gainfully Scabby', entropy: 36 }
    };

    setCopiedBits();

    setPasscodes(passcodeData);
  }, []);

  
  const crackTimes = useMemo(() => {
    // Generate crack times based on the current passcodes object
    return Object.entries(passcodes).map(([key, { entropy, passcode }]) => ({
      key: key,
      entropy: Math.round(entropy),
      label: key,
      time: convertTimeToReadableFormat(timeToCrackAvg(entropy, hashRate)),
      // cost: formatDollarToScale(avgCostToCrack(entropy))
    }));
  }, [passcodes, hashRate]);

  const copyToClipboard = useCallback((text, bits) => {
    navigator.clipboard.writeText(text);
    setCopiedBits(null); // Reset first to ensure transition can trigger
    setTimeout(() => {
      setCopiedBits(bits); // Then set the new copied bits after a very short delay
    }, 10); // A very short delay
  }, []);

  useEffect(() => {
    generatePasscodes();

  }, [generatePasscodes]);



  return (
    <section className="content">
      <div className="max-w-2xl mx-0">
        <div className="flex flex-col md:flex-row gap-3 items-end justify-start mb-6">
          <button
            onClick={generatePasscodes}
            className="btn btn-primary text-base md:text-xl text-white mb-2 md:mb-0"
          >
            <FaSyncAlt /> New passcodes!
          </button>

          <HashRateSelector setHashRate={setHashRate} hashRate={hashRate} />
        </div>

        {crackTimes.map(({ key, label, entropy, time, cost }) => (
          <div key={key}
            className={`passphrase-block max-w-md ${copiedBits === key ? 'copied' : ''}`}
          >
            <label className="block mb-1 tracking-wide uppercase">
              <div className="flex items-center">
                <div className="label-container">
                  <span className={`font-header font-extrabold text-xl inline-block ${label}`}>{label}</span>
                  <span className={`ml-2 group`}>
                    <div className="tooltip mt-1" data-tip={`${entropy} bits of entropy`}>
                      <FaInfoCircle className="text-gray-500 cursor-pointer text-base" />
                    </div>
                  </span>
                </div>
                <div className="crack-time-info">
                  <div className="crack-stats-container">
                    <span className="crack-time ml-2">Avg time to crack: <em>{time}</em></span>
                  </div>
                  {/* <div className="crack-stats-container">
                    <span className="crack-time ml-2">Avg cost to crack: <em>{cost}</em></span>
                  </div> */}
                </div>
              </div>
            </label>
            <div className="relative passphrase-content mb-6" onClick={() => copyToClipboard(passcodes[key].passcode, key)}>
              {passcodes[key].passcode}
              <span className="copy-button">
                {copiedBits === key ? <FaCheck /> : <FaRegCopy />} {copiedBits === key ? 'Copied!' : 'Copy'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div> 
        <PasscodeFAQ hashRate={hashRate} />
      </div>
      
    </section>
  );
};


const PasscodePage = () => (
  <div className="container mx-auto p-4">
    <h2 className="page-title">Phone Passcode Generator</h2>

    <PasscodeDisplay />
    
  </div>
);

export default PasscodePage;
