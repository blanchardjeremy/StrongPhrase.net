import React, { useState, useCallback, useEffect } from 'react';
import { FaRegCopy, FaCheck, FaSyncAlt } from "react-icons/fa";
import { generateUsername } from './username-generator';

const UsernameDisplay = () => {
  const [usernames, setUsernames] = useState({});
  const [copiedBits, setCopiedBits] = useState(null);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [capitalize, setCapitalize] = useState(true);
  const [numOptions, setNumOptions] = useState(4);
  const [isSpinning, setIsSpinning] = useState(false);

  const generateUsernames = useCallback(() => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);
    
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

  return (
    <section className="content h-full">
      <div className="sticky top-0 pt-3 bg-white z-10 pb-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-end justify-start">
          <div className="flex items-center gap-4">
            <button
              onClick={generateUsernames}
              className="btn btn-primary text-base md:text-xl text-white"
            >
              <FaSyncAlt className={`inline-block transition-transform ${isSpinning ? 'animate-spin' : ''}`} /> More
            </button>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-gray-700">Numbers</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={capitalize}
                  onChange={(e) => setCapitalize(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-gray-700">Capitalize</span>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-gray-700"></span>
                <select
                  value={numOptions}
                  onChange={(e) => setNumOptions(Number(e.target.value))}
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
          {Object.entries(usernames).map(([key, { username, components, entropy }]) => {
            const displayComponents = getDisplayComponents(components);
            return (
              <div key={key}
                className={`passphrase-block ${copiedBits === key ? 'copied' : ''}`}
              >
                <div 
                  className="relative passphrase-content h-full cursor-pointer" 
                  onClick={() => copyToClipboard(getDisplayUsername(components), key)}
                >
                  <div className="flex flex-wrap gap-1">
                    {displayComponents.map((component, index) => (
                      <span key={index} className={`${getComponentColor(component, index, displayComponents.length)} font-medium`}>
                        {formatComponent(component, index, displayComponents.length)}
                      </span>
                    ))}
                  </div>
                  <span className="copy-button">
                    {copiedBits === key ? <FaCheck /> : <FaRegCopy />} <span className="hidden lg:inline">{copiedBits === key ? 'Copied!' : 'Copy'}</span>
                  </span>
                </div>
              </div>
            );
          })}
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