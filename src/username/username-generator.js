import { getPassphrase } from '../passphraseUtils';

const usernameGrammars = {
  // 2 concrete words + number
  24: "adj:8| |noun-concrete:8| |number:8",
  // 2 animate words + number
  28: "adj-animate:9| |noun-animate:9| |number:8",
  // 3 concrete words + number
  32: "adj:8| |noun-concrete:8| |verb-s:8| |number:8",
  // 3 animate words + number
  36: "adj-animate:9| |noun-animate:9| |verb-s:9| |number:8"
};

export const generateUsername = (bits = 24) => {
  // Ensure we use a valid bit length
  const validBits = Object.keys(usernameGrammars).map(Number);
  const closestBits = validBits.reduce((prev, curr) => 
    Math.abs(curr - bits) < Math.abs(prev - bits) ? curr : prev
  );
  
  const rawPassphrase = getPassphrase(closestBits, usernameGrammars);
  const components = rawPassphrase
    .toLowerCase()
    .split(' ')
    .map(word => word.replace(/[^a-z0-9]/g, ''));
  
  return {
    username: components.join(''),
    components
  };
};

export const generateUsernames = (count = 5, bits = 28) => {
  return Array(count).fill().map(() => generateUsername(bits));
};
