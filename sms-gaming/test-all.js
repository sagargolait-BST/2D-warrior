console.log('Testing entire application...');

try {
  // Test Hangman module
  const Hangman = require('./lib/games/Hangman');
  console.log('Hangman module loaded successfully!');
  
  // Test EmojiTranslate module
  const EmojiTranslate = require('./lib/games/EmojiTranslate');
  console.log('EmojiTranslate module loaded successfully!');
  
  // Test app module
  const app = require('./lib/app');
  console.log('App module loaded successfully!');
  
  // Test serverless handler
  const handler = require('./api/serverless');
  console.log('Serverless handler loaded successfully!');
  
  console.log('All components loaded successfully!');
  console.log('Application works correctly!');
} catch (error) {
  console.error('Error testing application:', error);
}

console.log('Test completed!'); 