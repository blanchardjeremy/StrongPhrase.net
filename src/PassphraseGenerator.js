import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { timeToCrackAvg, convertTimeToReadableFormat, getPassphrase, getPrimaryGrammarLabels, getAllGrammarLabels, formatDollarToScale, avgCostToCrack } from './passphraseUtils.js';
import HashRateSelector, { defaultHashRates } from './HashRateSelector';
import { FaKey } from "react-icons/fa";
import CopyableItem from './components/CopyableItem';
import PageToolbar from './components/PageToolbar';

import './PassphraseGenerator.css';

export const PhraseGeneratorParent = ({ 
  type='passphrase', 
  base_grammar_labels=null, 
}) => {
  const [passphrases, setPassphrases] = useState({});
  const [practiceInput, setPracticeInput] = useState('');
  const [copiedBits, setCopiedBits] = useState(null);
  const [hashRate, setHashRate] = useState(defaultHashRates.passphrase);
  const [showHidden, setShowHidden] = useState(true);
  const [showAllGrammars, setShowAllGrammars] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  const numTotalGrammars = Object.keys(getAllGrammarLabels()).length;

  const generatePassphrases = useCallback(() => {
    const newPassphrases = {};
    const grammar_labels = showAllGrammars ? getAllGrammarLabels() : base_grammar_labels;
    const grammar_keys = Object.keys(grammar_labels).map(Number);
    grammar_keys.forEach(bits => {
      newPassphrases[bits] = getPassphrase(bits);
    });
    setPassphrases(newPassphrases);
    setCopiedBits(null);
    setShowHidden(true);
    setPracticeInput('');
    setGenerationCount(c => c + 1);
  }, [showAllGrammars, base_grammar_labels]);

  
  const crackTimes = useMemo(() => {
    const grammar_labels = showAllGrammars ? getAllGrammarLabels() : base_grammar_labels;
    const grammar_keys = Object.keys(grammar_labels).map(Number);
    return grammar_keys.map(bits => ({
      bits,
      label: grammar_labels[bits],
      time: convertTimeToReadableFormat(timeToCrackAvg(bits, hashRate)),
      cost: formatDollarToScale(avgCostToCrack(bits))
    }));
  }, [hashRate, showAllGrammars, base_grammar_labels]);

  const copyToClipboard = useCallback((text, bits) => {
    navigator.clipboard.writeText(text);
    setCopiedBits(null); // Reset first to ensure transition can trigger
    setTimeout(() => {
      setCopiedBits(bits); // Then set the new copied bits after a very short delay
    }, 10); // A very short delay
    setShowHidden(false);
  }, []);

  // Use the useEffect hook to generate the passphrases when the component is first loaded
  useEffect(() => {
    generatePassphrases();
  }, [generatePassphrases]);

  return (
    <section className="content">
      <PageToolbar
        onGenerate={generatePassphrases}
        generateButtonText={`New ${type}s!`}
        className="mb-10"
        isSticky={true}
      >
        <HashRateSelector setHashRate={setHashRate} hashRate={hashRate} mode="passphrase" />

        <button 
          onClick={() => setShowAllGrammars(!showAllGrammars)} 
          className="btn btn-sm"
        >
          {showAllGrammars ? 'Show main formats only' : `Show all ${numTotalGrammars} formats`}
        </button>

        <button 
          onClick={() => setShowHidden(true)} 
          className="btn btn-sm"
          style={{ display: showHidden ? 'none' : 'block' }}
        >
          Show hidden passphrases
        </button>
      </PageToolbar>

      {crackTimes.map(({ bits, label, time, cost }) => (
        <CopyableItem
          key={bits}
          content={passphrases[bits]}
          label={label}
          stats={[
            { label: 'to crack (avg)', value: time },
            { label: 'to crack (avg)', value: cost }
          ]}
          infoBits={bits}
          copyToClipboard={copyToClipboard}
          copiedId={copiedBits}
          itemId={bits}
          generationCount={generationCount}
          hideWhenOthersCopied={true}
          showHidden={showHidden}
          hideCopyTextBelowLg={true}
        />
      ))}

      <div className="card bg-blue-100 w-full shadow-xl mt-12">
        <div className="card-body form-control text-secondary">
          <span className="block font-header font-extrabold text-2xl mt-0 pt-0 label label-text text-secondary">Practice typing the phrase</span>
          <label className="input input-bordered flex items-center gap-2 p-2 border rounded font-mono text-xl input-secondary">
            <FaKey className="text-base" />
            <input
              type="text"
              value={practiceInput}
              onChange={(e) => setPracticeInput(e.target.value)}
              className="grow"
            />
          </label>
        </div>
      </div>
    </section>
  );
};

const PassphraseGenerator = () => {
  return (
    <PhraseGeneratorParent
      type="passphrase"
      base_grammar_labels={getPrimaryGrammarLabels()}
    />
  )
}

export default PassphraseGenerator;