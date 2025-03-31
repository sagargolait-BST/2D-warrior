const GameFactory = require('./games/GameFactory');

const listOfGames = (() => {
  let message = '';
  const games = GameFactory.getGames();

  games.forEach((Game, i) => {
    message += `${i + 1} - ${Game.name}\n`;
  });

  return message;
})();

const invalidInputMsg =
  '⚠️ Your message does not correspond to any command or game. ' +
  'Use */h* command to get additional help.';

const serverErrorMsg =
  '🚨 Uh, oh! We had some difficulties processing your message.' +
  'Could you please send it again?';

const singlePlayerWelcomeMsg = (() => {
  const games = GameFactory.getGames();
  let message = '🎮 Welcome to SMS Gaming! 🎮\n\n';
  message += 'Please select a game by sending its number:\n\n';
  
  games.forEach((Game, i) => {
    message += `${i + 1} - ${Game.name}\n`;
  });
  
  message += '\nOr use these commands:\n';
  message += '/h - Show this help message\n';
  message += '/m - Switch to multiplayer mode\n';
  
  return message;
})();

const multiPlayerWelcomeMsg =
  'Welcome to SMS Gaming Multiplayer mode! 🎮\n' +
  'Create a game session with */c* command. 👨‍🚀\n' +
  'View available games to join with */g* command. 🔥\n' +
  "Once you've choosen a game, join it with */j* command. 🚀\n" +
  'Quit the game with */q* command. 🎈\n' +
  'Return back to single player mode with */s* command. ⭐\n' +
  'You can bring this guide again with */h* command. 🆘';

module.exports = {
  listOfGames,
  invalidInputMsg,
  serverErrorMsg,
  singlePlayerWelcomeMsg,
  multiPlayerWelcomeMsg
};
