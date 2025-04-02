console.log('Testing Hangman.js...');

try {
  const Hangman = require('./lib/games/Hangman');
  console.log('Hangman module loaded successfully!');
  
  const game = new Hangman('test-game');
  console.log('Game created successfully!');
  console.log('Word:', game.word);
  console.log('Welcome message:', game.welcomeMessage);
  
  console.log('Testing game response...');
  const response = game.handleUserResponse('A');
  console.log('Response:', response);
  
  console.log('Hangman module works correctly!');
} catch (error) {
  console.error('Error testing Hangman module:', error);
}

console.log('Test completed!'); 