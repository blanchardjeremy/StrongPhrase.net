import { words, grammars as grammers_int } from "./words.js";


/**
 *   Sample of the data structure
const words = {
  "noun-animate": ["DJ", "ox"],
  "noun-concrete": ["CD", "PC"],
  "noun-concrete-plural": ["CDs", "PCs"],
  "verb": ["have", "get", "see"],
  "verb-s": ["has", "gets", "sees"],
  "verb-ed": ["had", "got", "seen"],
  "adj": ["new", "old", "big"],
  "adj-animate": ["dead", "evil"],
  "number": ["2", "3", "4", "5"],
  "place": ["LA", "NYC", "Ohio"]
}
 * 
 */

export const getPrimaryGrammarLabels = () => {
  return {
    44: "Strong", 
    58: "Stronger", 
    66: "Strongest"
  };
};

// Re-export so I don't have to change it everywhere after refactoring
export const grammars = grammers_int;

export const DEFAULT_GRAMMARS = grammars;

// We use $0.56 per 2^32 guesses currently
export const avgCostToCrack = (bits, costPerGuess32=0.56) => {
  const guesses = 2**bits;
  const costPerGuess = (costPerGuess32 / 2**32);
  const maxCost = guesses * costPerGuess;
  const avgCost = maxCost / 2;
  return avgCost;
}

export function formatDollarToScale(amount, significantDigits=2, addScaleLabel=true) {
  // Ensure amount is not less than zero
  if (amount < 1) {
    amount = 0;
  }

  // Handle amounts less than a million
  if (amount < 1e6) {
    return `$${new Intl.NumberFormat().format(Number(amount.toPrecision(significantDigits)))}`;
  }
  

  const scales = [
    { value: 1e6, label: "million" },
    { value: 1e9, label: "billion" },
    { value: 1e12, label: "trillion" },
    { value: 1e15, label: "quadrillion" }
  ];

  if(!addScaleLabel) {
    return `$${new Intl.NumberFormat().format(Number(amount.toPrecision(significantDigits)))}`;
  }

  const scale = scales.find(scale => amount >= scale.value && amount < scale.value * 1000) || scales[scales.length - 1];
  const scaledAmount = amount / scale.value;

  // Get the rounded number with significant digits
  const rounded = Number(scaledAmount.toPrecision(significantDigits));

  // Format the rounded number with commas
  const formattedNumber = new Intl.NumberFormat().format(rounded);

  return `$${formattedNumber} ${scale.label}`;
}


export const getWordStats = () => {
  // Return a dict of counts for each of the word lists
  const countDict = {};
  for (const key in words) {
    countDict[key] = words[key].length;
  }
  return countDict;
}

export const getSampleWords = (listType, quantity=5) => {
  // Return the first X words from that entry
  const sampleWords = [];
  // Loop quantity number of times
  for (let i = 0; i < quantity; i++) {
    // It's possible to exceed the end of the list but thats fine. Doesn't need to be error proof.

    sampleWords.push(words[listType][i*50+20]);
  }
  return sampleWords;
}


export const getAllGrammarLabels = () => {
  return Object.keys(grammars).reduce((acc, bits) => {
    acc[bits] = `${bits} Bits of Entropy`;
    return acc;
  }, {});
};


let getBitLength = function(bits) {
  let bitLength = parseInt(bits);
  if(!(bitLength >= 1)) {
      bitLength = 50;
  }
  if(bitLength > 110) {
      bitLength = 110;
  }
  return bitLength;
}

export const getPassphrase = (bits, grammars = DEFAULT_GRAMMARS) => {        
  if(!cryptoAvailable()) {
      return "Error: Your browser cannot generate secure passphrases";
  }
  bits = getBitLength(bits);
  const grammar = grammars[bits];
  if (!grammar) return "Invalid bit length";
  const numRandomWords = grammar.split(":").length - 1;
  let randomNumbers = new Uint16Array(numRandomWords);
  (window.crypto || window.msCrypto).getRandomValues(randomNumbers);
  let randomNumberIndex = 0;
  let phrase = [];
  const components = grammar.split("|");
  let errorInGrammar = false;
  let actualBits = 0;
  components.forEach(function(component) {
      let parts = component.split(':');
      let wordType = parts[0];
      let wordBits = parts[1] || -1;
      wordBits = parseInt(wordBits);
      if(wordBits >= 2 && wordBits <= 16) {
          if(!words.hasOwnProperty(wordType) || words[wordType].length < (1 << wordBits)) {
              console.log("Error in grammar! Word type: "+ wordType+" // Word Bits: "+words[wordType].length + " // Expected length: " + (1 << wordBits));
              errorInGrammar = true;
              return;
          }
          actualBits = actualBits + wordBits;
          let bitMask = (1 << wordBits) - 1;
          let randomNumber = randomNumbers[randomNumberIndex] & bitMask; // get a random number that is X random bits long
          randomNumberIndex++;
          phrase.push(words[wordType][randomNumber])
      }
      else {
          phrase.push(component);
      }
  });
  if(errorInGrammar) {
      // TO DO: Better error handling
      return  "Error: error in grammar";
  }
  return phrase.join("");
};


const cryptoAvailable = function() {
  var crypto   = window.crypto || window.msCrypto;
  var typedArr = Uint16Array;
  return (typedArr && crypto && typeof crypto.getRandomValues == "function");
}

export const avgTimeToCrackFormatted = (bits, hashesPerSecond) => {
  return convertTimeToReadableFormat(timeToCrackAvg(bits, hashesPerSecond));
}

export const timeToCrackAvg = (bits, hashesPerSecond) => {
  const totalCombinations = Math.pow(2, bits);
  return totalCombinations / (2 * hashesPerSecond);
};

export const convertTimeToReadableFormat = (seconds) => {
  const units = [
    { value: 60 * 60 * 24 * 365 * 1000000000000, singular: "trillion year", plural: "trillion years" },
    { value: 60 * 60 * 24 * 365 * 1000000000, singular: "billion year", plural: "billion years" },
    { value: 60 * 60 * 24 * 365 * 1000000, singular: "million year", plural: "million years" },
    { value: 60 * 60 * 24 * 365, singular: "year", plural: "years" },
    { value: 60 * 60 * 24, singular: "day", plural: "days" },
    { value: 60 * 60, singular: "hour", plural: "hours" },
    { value: 60, singular: "minute", plural: "minutes" },
    { value: 1, singular: "second", plural: "seconds" }
  ];

  const roundToSigFig = (num, sigFig) => {
    if (num === 0) return 0;
    const multiplier = Math.pow(10, sigFig - Math.ceil(Math.log10(num < 0 ? -num : num)));
    return Math.round(num * multiplier) / multiplier;
  };

  for (const { value, singular, plural } of units) {
    if (seconds >= value) {
      const amount = roundToSigFig(seconds / value, 1);
      const label = amount === 1 ? singular : plural;
      return `${amount.toLocaleString()} ${label}`;
    }
  }

  return "less than a second";
};




