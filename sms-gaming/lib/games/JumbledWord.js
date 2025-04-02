const { shuffleArray } = require('./utils');

const positiveFeedback = [
  "Excellent!",
  "Great job!",
  "Well done!",
  "Perfect!",
  "Amazing!",
  "Brilliant!",
  "Fantastic!",
  "Outstanding!",
  "Superb!",
  "Terrific!"
];

const wordList = [
  "apple", "banana", "orange", "grape", "melon",
  "house", "table", "chair", "phone", "laptop",
  "music", "dance", "happy", "smile", "laugh",
  "water", "earth", "light", "sound", "color",
  "pizza", "bread", "cheese", "salad", "soup",
  "tiger", "lion", "bear", "wolf", "eagle"
];

class JumbledWord {
  static name = 'Jumbled Word';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.originalWord = wordList[Math.floor(Math.random() * wordList.length)];
    this.shuffledWord = this.shuffleOriginalWord();
  }

  get welcomeMessage() {
    const message =
      "In this game, I've taken a random 🇬🇧 word and shuffled it :)\n" +
      'Can you guess the original word❓\n' +
      'You have only 1️⃣ chance!\n\nWORD: ' +
      this.shuffledWord;

    return message;
  }

  shuffleOriginalWord() {
    return shuffleArray([...this.originalWord]).join('');
  }

  handleUserResponse(word) {
    this.state = 'gameover';

    if (word.toLowerCase() === this.originalWord) {
      const randomFeedback = positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)];
      return `✔️ ${randomFeedback}`;
    } else {
      return `❌ The correct word is ${this.originalWord}.`;
    }
  }
}

module.exports = JumbledWord;
