import React, { useState, useEffect } from 'react';
import { getPassphrase, getAllGrammarLabels } from './passphraseUtils.js';
import MarkdownCustom from './MarkdownCustom.js';

const EntropyPerCharTable = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [escapedMarkdownContent, setEscapedMarkdownContent] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [showTable, setShowTable] = useState(false);

  const handleClick = () => {
    setShowTable(true);
  };

  useEffect(() => {
    if (!showTable) return;

    const calculateEntropyPerChar = (passphrase, totalEntropy) => {
      return totalEntropy / passphrase.length;
    };

    const generatePassphraseStats = () => {
      const grammarLabels = getAllGrammarLabels();
      let markdown = "| Total Bits | Average Entropy/Char | Min Entropy/Char | Max Entropy/Char | Sample Passphrase |\n";
      markdown += "|------------|---------------------|-------------------|-------------------|-------------------|\n";

      let totalAverageEntropy = 0;
      let totalMinEntropy = 0;
      let totalMaxEntropy = 0;
      let count = 0;

      const jsonDict = {};

      // eslint-disable-next-line no-restricted-syntax, no-unused-vars
      for (const [bits, label] of Object.entries(grammarLabels)) {
        const entropies = [];
        let samplePassphrase = '';
        for (let i = 0; i < 10000; i++) {
          const passphrase = getPassphrase(Number(bits));
          if (i === 0) samplePassphrase = passphrase;
          const entropyPerChar = calculateEntropyPerChar(passphrase, Number(bits));
          entropies.push(entropyPerChar);
        }

        const totalEntropyPerChar = entropies.reduce((sum, entropy) => sum + entropy, 0);
        const average = totalEntropyPerChar / entropies.length;
        const min = Math.min(...entropies);
        const max = Math.max(...entropies);

        markdown += `| ${bits} | **${average.toFixed(2)}** | ${min.toFixed(2)} | ${max.toFixed(2)} | \`${samplePassphrase}\` |\n`;

        jsonDict[bits] = {
          "avg": average.toFixed(2),
          "min": min.toFixed(2),
          "max": max.toFixed(2),
          "sample": samplePassphrase
        };

        totalAverageEntropy += average;
        totalMinEntropy += min;
        totalMaxEntropy += max;
        count++;
      }

      const averageEntropy = (totalAverageEntropy / count).toFixed(2);
      const averageMinEntropy = (totalMinEntropy / count).toFixed(2);
      const averageMaxEntropy = (totalMaxEntropy / count).toFixed(2);

      markdown += `| **Average** | **${averageEntropy}** | **${averageMinEntropy}** | **${averageMaxEntropy}** |  |\n`;

      jsonDict["Average"] = {
        "avg": averageEntropy,
        "min": averageMinEntropy,
        "max": averageMaxEntropy,
      };

      return { markdown, jsonDict };
    };

    const { markdown, jsonDict } = generatePassphraseStats();
    setMarkdownContent(markdown);

    const escapedContent = markdown.replace(/`/g, '\\`');
    setEscapedMarkdownContent(escapedContent);

    setJsonContent(JSON.stringify(jsonDict, null, 2));

  }, [showTable]);

  return (
    <div>
      {!showTable ? (
        <button onClick={handleClick} className="btn btn-primary">
          Show Entropy Per Character Table (loads very slow!)
        </button>
      ) : (
        <>
          <h1 className="text-2xl">Entropy Per Character</h1>
          <div className="passphrase-stats-markdown markdown-content">
            <MarkdownCustom className="faq-answer">{markdownContent}</MarkdownCustom>
          </div>
          <h2 className="text-xl">Copy paste into the code to update</h2>
          <div>
            <pre>{escapedMarkdownContent}</pre>
          </div>
          <h2 className="text-xl">JSON Output</h2>
          <div>
            <pre>{jsonContent}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default EntropyPerCharTable;
