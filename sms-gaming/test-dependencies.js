console.log('Testing dependencies...');

try {
  const superb = require('superb');
  console.log('superb module loaded successfully!');
  console.log('Random superb word:', superb.random());
} catch (error) {
  console.error('Error loading superb module:', error);
}

try {
  const randomWords = require('random-words');
  console.log('random-words module loaded successfully!');
  console.log('Random word:', randomWords());
} catch (error) {
  console.error('Error loading random-words module:', error);
}

console.log('Dependency test completed!'); 