import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { timeToCrackAvg, convertTimeToReadableFormat } from './../passphraseUtils.js';
import { getPasscodeAndEntropy } from './passcodeUtils.js';
import PasscodeFAQ from './PasscodeFAQ.js'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HashRateSelector, { defaultHashRate } from './HashRateSelector.js';
import SpinButton from '../components/SpinButton';
import CopyableItem from '../components/CopyableItem';

const PasscodeDisplay = () => {
  const [passcodes, setPasscodes] = useState({});
  const [copiedBits, setCopiedBits] = useState(null);
  const [hashRate, setHashRate] = useState(defaultHashRate);
  const [generationCount, setGenerationCount] = useState(0);

  const generatePasscodes = useCallback(() => {
    const passcodeData = {
      '6 digits': getPasscodeAndEntropy(6),
      '10 Digits (Recommended)': getPasscodeAndEntropy(10),
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
        <div className="flex flex-col md:flex-row gap-3 items-start justify-start mb-6">
          <SpinButton onClick={generatePasscodes}>New passcodes!</SpinButton>
          <HashRateSelector setHashRate={setHashRate} hashRate={hashRate} />
        </div>

        {crackTimes.map(({ key, label, entropy, time }) => (
          <CopyableItem
            key={key}
            content={passcodes[key].passcode}
            label={label}
            stats={[{ label: 'to crack (avg)', value: time }]}
            infoBits={entropy}
            copyToClipboard={copyToClipboard}
            copiedId={copiedBits}
            itemId={key}
            generationCount={generationCount}
            className={`max-w-md ${key === '10 Digits (Recommended)' ? 'recommended-passcode' : ''}`}
          />
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
