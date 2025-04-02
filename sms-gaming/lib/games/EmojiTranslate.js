// Simple superb words for game completion
const superbWords = [
  'amazing', 'awesome', 'brilliant', 'excellent', 'fantastic', 'great', 
  'incredible', 'outstanding', 'perfect', 'wonderful'
];

// Simple sentence generator
function generateSentence() {
  const subjects = ['The cat', 'The dog', 'The bird', 'The fish', 'The rabbit', 'The fox', 'The bear', 'The lion', 'The tiger', 'The elephant'];
  const verbs = ['jumps', 'runs', 'flies', 'swims', 'hops', 'walks', 'crawls', 'climbs', 'dances', 'sings'];
  const objects = ['over the fence', 'through the forest', 'across the river', 'up the tree', 'down the hill', 'around the corner', 'into the cave', 'out of the box', 'under the bridge', 'along the path'];
  
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const object = objects[Math.floor(Math.random() * objects.length)];
  
  return `${subject} ${verb} ${object}.`;
}

// Simple emoji translator
function translateToEmoji(text) {
  const emojiMap = {
    'cat': '🐱',
    'dog': '🐕',
    'bird': '🐦',
    'fish': '🐟',
    'rabbit': '🐰',
    'fox': '🦊',
    'bear': '🐻',
    'lion': '🦁',
    'tiger': '🐯',
    'elephant': '🐘',
    'jumps': '🦘',
    'runs': '🏃',
    'flies': '✈️',
    'swims': '🏊',
    'hops': '🦘',
    'walks': '🚶',
    'crawls': '🐌',
    'climbs': '🧗',
    'dances': '💃',
    'sings': '🎤',
    'over': '⬆️',
    'through': '➡️',
    'across': '↔️',
    'up': '⬆️',
    'down': '⬇️',
    'around': '🔄',
    'into': '➡️',
    'out': '⬅️',
    'under': '⬇️',
    'along': '➡️',
    'the': '',
    'fence': '🧱',
    'forest': '🌲',
    'river': '🌊',
    'tree': '🌳',
    'hill': '⛰️',
    'corner': '↩️',
    'cave': '🕳️',
    'box': '📦',
    'bridge': '🌉',
    'path': '🛣️'
  };
  
  let result = text;
  for (const [word, emoji] of Object.entries(emojiMap)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, emoji);
  }
  
  return result;
}

class EmojiTranslate {
  static name = 'Emoji Translate';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.sentence = generateSentence();
    this.emojiSentence = this.generateEmojiSentence();
  }

  generateEmojiSentence() {
    console.log('EMOJISEN', translateToEmoji(this.sentence).trim());
    return translateToEmoji(this.sentence).trim();
  }

  get welcomeMessage() {
    const message =
      'Are you truly Emoji Master❓ Do you have what it takes ' +
      ' to translate the whole sentence to emojis❓' +
      `Let's find out 😎\n\n ${this.sentence}`;

    return message;
  }

  handleUserResponse(userMessage) {
    this.state = 'gameover';

    if (userMessage === this.emojiSentence) {
      return `👑 ${superbWords[Math.floor(Math.random() * superbWords.length)]}! You are truly Emoji Master!`;
    } else {
      return `☹️ I've expected more from you!\n The answer is:\n*${this.emojiSentence}*`;
    }
  }
}

module.exports = EmojiTranslate;
