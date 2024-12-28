import React, { useState, useCallback, useEffect } from 'react';
import { FaRegCopy, FaCheck, FaSyncAlt } from "react-icons/fa";
import { generateUsername } from './username-generator';

const UsernameDisplay = () => {
  const [usernames, setUsernames] = useState({});
  const [copiedBits, setCopiedBits] = useState(null);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [capitalize, setCapitalize] = useState(false);

  const generateUsernames = useCallback(() => {
    const usernameData = {
      'Simple': { ...generateUsername(24), entropy: 24 },
      'Standard': { ...generateUsername(28), entropy: 28 },
      'Whatever': { ...generateUsername(32), entropy: 32 },
      'Complex': { ...generateUsername(36), entropy: 36 },
    };

    setCopiedBits(null);
    setUsernames(usernameData);
  }, []);

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
    <section className="content">
      <div className="flex flex-col md:flex-row gap-3 items-end justify-start mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={generateUsernames}
            className="btn btn-primary text-base md:text-xl text-white"
          >
            <FaSyncAlt /> New usernames!
          </button>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="form-checkbox"
              />
              <span className="text-gray-700">Include numbers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={capitalize}
                onChange={(e) => setCapitalize(e.target.checked)}
                className="form-checkbox"
              />
              <span className="text-gray-700">Capitalize words</span>
            </label>
          </div>
        </div>
      </div>

      {Object.entries(usernames).map(([key, { username, components, entropy }]) => {
        const displayComponents = getDisplayComponents(components);
        return (
          <div key={key}
            className={`passphrase-block ${copiedBits === key ? 'copied' : ''}`}
          >
            <div 
              className="relative passphrase-content mb-6 cursor-pointer" 
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
                {copiedBits === key ? <FaCheck /> : <FaRegCopy />} {copiedBits === key ? 'Copied!' : 'Copy'}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

const UsernamePage = () => (
  <div className="container max-w-xl mx-0 p-4">
    <h2 className="page-title">Username Generator</h2>
    <UsernameDisplay />
  </div>
);

export default UsernamePage; 