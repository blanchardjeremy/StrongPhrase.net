import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { timeToCrackAvg, convertTimeToReadableFormat } from './../passphraseUtils.js';
import { getPasscodeAndEntropy } from './passcodeUtils.js';
import PasscodeFAQ from './PasscodeFAQ.js'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HashRateSelector, { defaultHashRate } from './HashRateSelector.js';
import { FaRegCopy, FaCheck, FaSyncAlt, FaInfoCircle } from "react-icons/fa";
import SpinButton from '../components/SpinButton';

const PasscodeDisplay = () => {
  const [passcodes, setPasscodes] = useState({});
  const [copiedBits, setCopiedBits] = useState(null);
  const [hashRate, setHashRate] = useState(defaultHashRate);
  const [generationCount, setGenerationCount] = useState(0);

  const generatePasscodes = useCallback(() => {
    const passcodeData = {
      '6 digits': getPasscodeAndEntropy(6),
      '10 Digits': getPasscodeAndEntropy(10),
    };

    setCopiedBits();
    setPasscodes(passcodeData);
    setGenerationCount(c => c + 1);
  }, []);

  const crackTimes = useMemo(() => {
    return Object.entries(passcodes).map(([key, { entropy, passcode }]) => ({
      key: key,
      entropy: Math.round(entropy),
      label: key,
      time: convertTimeToReadableFormat(timeToCrackAvg(entropy, hashRate)),
    }));
  }, [passcodes, hashRate]);

  const copyToClipboard = useCallback((text, bits) => {
    navigator.clipboard.writeText(text);
    setCopiedBits(null);
    setTimeout(() => {
      setCopiedBits(bits);
    }, 10);
  }, []);

  useEffect(() => {
    generatePasscodes();
  }, [generatePasscodes]);

  return (
    <section className="content">
      <div className="">
        <div className="flex flex-col md:flex-row gap-3 items-end justify-start mb-6">
          <SpinButton onClick={generatePasscodes}>New passcodes!</SpinButton>

          <HashRateSelector setHashRate={setHashRate} hashRate={hashRate} />
        </div>

        {crackTimes.map(({ key, label, entropy, time }) => (
          <div key={key}
            className={`passphrase-block max-w-md ${copiedBits === key ? 'copied' : ''}`}
          >
            <label className="block mb-1 tracking-wide uppercase">
              <div className="flex items-center">
                <div className="label-container">
                  <span className={`font-bold text-md uppercase text-gray-500 inline-block ${label}`}>{label}</span>
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
                </div>
              </div>
            </label>
            <div className="relative passphrase-content mb-6" onClick={() => copyToClipboard(passcodes[key].passcode, key)}>
              <div className="relative">
                <TransitionGroup component={null}>
                  <CSSTransition
                    key={`${key}-${generationCount}`}
                    timeout={300}
                    classNames="username-text"
                  >
                    <div className="absolute inset-0">
                      {passcodes[key].passcode}
                    </div>
                  </CSSTransition>
                </TransitionGroup>
                <div className="invisible">
                  {passcodes[key].passcode}
                </div>
              </div>
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
