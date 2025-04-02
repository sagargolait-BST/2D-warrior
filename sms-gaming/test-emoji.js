console.log('Testing EmojiTranslate.js...');

try {
  const EmojiTranslate = require('./lib/games/EmojiTranslate');
  console.log('EmojiTranslate module loaded successfully!');
  
  const game = new EmojiTranslate('test-game');
  console.log('Game created successfully!');
  console.log('Sentence:', game.sentence);
  console.log('Emoji sentence:', game.emojiSentence);
  console.log('Welcome message:', game.welcomeMessage);
  
  console.log('Testing game response...');
  const response = game.handleUserResponse(game.emojiSentence);
  console.log('Response:', response);
  
  console.log('EmojiTranslate module works correctly!');
} catch (error) {
  console.error('Error testing EmojiTranslate module:', error);
}

console.log('Test completed!'); 