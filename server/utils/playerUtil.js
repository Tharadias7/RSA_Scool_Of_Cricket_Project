const fs = require('fs');
const path = require('path');

const counterFilePath = path.join(__dirname, 'playerCounter.txt');

// Function to read the current counter from file
const getCurrentCounter = () => {
  if (!fs.existsSync(counterFilePath)) {
    return 0;
  }
  const counter = fs.readFileSync(counterFilePath, 'utf-8');
  return parseInt(counter, 10) || 0;
};

// Function to write the current counter to file
const updateCounter = (counter) => {
  fs.writeFileSync(counterFilePath, counter.toString(), 'utf-8');
};

// Function to generate the next player ID
const generatePlayerId = () => {
  const counter = getCurrentCounter() + 1;
  updateCounter(counter);
  return `P${counter.toString().padStart(3, '0')}`;
};

module.exports = {
  generatePlayerId,
};
