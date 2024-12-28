import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateUsername } from './username-generator';
import SpinButton from '../components/SpinButton';
import CopyableItem from '../components/CopyableItem';

const UsernameDisplay = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [usernames, setUsernames] = useState({});
  const [copiedBits, setCopiedBits] = useState(null);
  const [includeNumbers, setIncludeNumbers] = useState(searchParams.get('numbers') !== 'false');
  const [capitalize, setCapitalize] = useState(searchParams.get('capitalize') !== 'false');
  const [numOptions, setNumOptions] = useState(Number(searchParams.get('options')) || 4);
  const [generationCount, setGenerationCount] = useState(0);

  const updateUrlParams = useCallback((params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const generateUsernames = useCallback(() => {
    const entropyLevels = {
      'Simple': 24,
      'Standard': 28,
      'Whatever': 32,
      'Complex': 36,
    };

    const usernameData = {};
    const variations = Math.floor(numOptions / 4);
    
    Object.entries(entropyLevels).forEach(([type, entropy]) => {
      for (let i = 0; i < variations; i++) {
        const suffix = i === 0 ? '' : ` ${i + 1}`;
        usernameData[`${type}${suffix}`] = { ...generateUsername(entropy), entropy };
      }
    });

    setCopiedBits(null);
    setUsernames(usernameData);
    setGenerationCount(c => c + 1);
  }, [numOptions]);

  const copyToClipboard = useCallback((text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedBits(null);
    setTimeout(() => {
      setCopiedBits(type);
    }, 10);
  }, []);

  useEffect(() => {
    generateUsernames();
  }, [generateUsernames]);

  const wordColors = ['text-blue-600', 'text-red-600', 'text-purple-600'];
  const numberColor = 'text-green-700';

  const getDisplayComponents = useCallback((components) => {
    return includeNumbers ? components : components.slice(0, -1);
  }, [includeNumbers]);

  const formatComponent = useCallback((component, index, totalComponents) => {
    const isNumber = includeNumbers && index === totalComponents - 1;
    if (capitalize && !isNumber) {
      return component.charAt(0).toUpperCase() + component.slice(1);
    }
    return component;
  }, [capitalize, includeNumbers]);

  const getDisplayUsername = useCallback((components) => {
    return getDisplayComponents(components)
      .map((component, index, array) => formatComponent(component, index, array.length))
      .join('');
  }, [getDisplayComponents, formatComponent]);

  const getComponentColor = useCallback((component, index, totalComponents) => {
    if (includeNumbers && index === totalComponents - 1) {
      return numberColor;
    }
    return wordColors[index % wordColors.length];
  }, [includeNumbers]);

  const renderUsernameContent = useCallback((components) => {
    const displayComponents = getDisplayComponents(components);
    return displayComponents.map((component, index) => (
      <span key={index} className={`${getComponentColor(component, index, displayComponents.length)} font-medium`}>
        {formatComponent(component, index, displayComponents.length)}
      </span>
    ));
  }, [getDisplayComponents, getComponentColor, formatComponent]);

  const handleIncludeNumbersChange = (e) => {
    const value = e.target.checked;
    setIncludeNumbers(value);
    updateUrlParams({ numbers: value === true ? null : 'false' });
  };

  const handleCapitalizeChange = (e) => {
    const value = e.target.checked;
    setCapitalize(value);
    updateUrlParams({ capitalize: value === true ? null : 'false' });
  };

  const handleNumOptionsChange = (e) => {
    const value = Number(e.target.value);
    setNumOptions(value);
    updateUrlParams({ options: value === 4 ? null : value });
  };

  return (
    <section className="content h-full">
      <div className="sticky top-0 pt-3 bg-white z-10 pb-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-end justify-start">
          <div className="flex items-center gap-4">
            <SpinButton onClick={generateUsernames}>More</SpinButton>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={handleIncludeNumbersChange}
                  className="form-checkbox"
                />
                <span className="text-gray-700">Numbers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={capitalize}
                  onChange={handleCapitalizeChange}
                  className="form-checkbox"
                />
                <span className="text-gray-700">Capitalize</span>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-gray-700"></span>
                <select
                  value={numOptions}
                  onChange={handleNumOptionsChange}
                  className="form-select border rounded px-2 py-1"
                >
                  <option value={4}>4 options</option>
                  <option value={8}>8 options</option>
                  <option value={24}>24 options</option>
                  <option value={48}>48 options</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <div className={`grid ${numOptions > 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {Object.entries(usernames).map(([key, { components, entropy }]) => (
            <CopyableItem
              key={key}
              content={getDisplayUsername(components)}
              label={key}
              infoBits={entropy}
              copyToClipboard={copyToClipboard}
              copiedId={copiedBits}
              itemId={key}
              generationCount={generationCount}
              renderContentOnly={false}
              showLabel={false}
              noMarginBottom={true}
              hideTextBelowLg={true}
            >
              <div className="flex flex-wrap gap-1">
                {renderUsernameContent(components)}
              </div>
            </CopyableItem>
          ))}
        </div>
      </div>
    </section>
  );
};

const UsernamePage = () => (
  <div className="container p-4">
    <h2 className="page-title">Username Generator</h2>
    <UsernameDisplay />
  </div>
);

export default UsernamePage; 