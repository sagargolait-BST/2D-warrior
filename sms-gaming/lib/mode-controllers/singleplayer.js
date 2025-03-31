const { invalidInputMsg } = require('../messages');
const commands = require('../commands').singlePlayerCommands;

const GameFactory = require('../games/GameFactory');
const SPGamesManager = require('../core/SPGamesManager');

module.exports = async (req, res) => {
  try {
    const { Body: userMsg } = req.body;
    console.log('Received message:', userMsg);
    console.log('Current user session:', req.user);

    // Handle game selection first
    const gameNum = Number(userMsg) - 1;
    const availableGames = GameFactory.getGames();
    console.log('Available games:', availableGames.map(game => game.name));
    console.log('Selected game number:', gameNum);
    
    const isGameNumValid = gameNum >= 0 && gameNum < availableGames.length;
    console.log('Is game number valid:', isGameNumValid);

    if (isGameNumValid) {
      try {
        console.log('Creating game with number:', gameNum);
        const game = GameFactory.createGame(gameNum);
        console.log('Game created:', game.constructor.name);
        
        if (game.init) {
          console.log('Initializing game...');
          await game.init();
        }
        
        console.log('Creating game session...');
        await SPGamesManager.createGame(game, req);
        console.log('Game session created successfully');
        
        console.log('Sending welcome message:', game.welcomeMessage);
        const response = await res.sendMessage(game.welcomeMessage);
        console.log('Welcome message sent successfully');
        return response;
      } catch (error) {
        console.error('Error creating game:', error);
        const errorResponse = await res.sendMessage('Sorry, there was an error starting the game. Please try again.');
        console.log('Error message sent');
        return errorResponse;
      }
    }

    // Handle existing game session
    if (req.user && req.user.gameSessId) {
      console.log('Found existing game session:', req.user.gameSessId);
      const gameId = req.user.gameSessId;
      const game = SPGamesManager.findGame(gameId);
      
      if (!game) {
        console.error('Game not found for ID:', gameId);
        const errorResponse = await res.sendMessage('Sorry, there was an error finding your game. Please start a new game.');
        console.log('Error message sent');
        return errorResponse;
      }

      console.log('Found game:', game.constructor.name);

      // Handle AI Adventure game
      if (game.constructor.name === 'AIAdventure') {
        try {
          console.log('Processing AI Adventure choice...');
          // Send immediate response
          await res.sendMessage('🤔 Processing your choice... Please wait while I craft your adventure!');
          
          // Process the response
          const responseMsg = await game.handleUserResponse(userMsg);
          console.log('AI Adventure response generated:', responseMsg);
          
          SPGamesManager.updateGame(game, gameId);
          
          if (game.state === 'gameover') {
            SPGamesManager.destroyGame(gameId, req);
          }
          
          // Send the actual response
          const response = await res.sendMessage(responseMsg);
          console.log('AI Adventure response sent');
          return response;
        } catch (error) {
          console.error('Error processing AI Adventure:', error);
          const errorResponse = await res.sendMessage('Sorry, there was an error processing your choice. Please try again.');
          console.log('Error message sent');
          return errorResponse;
        }
      }
      
      // Handle other games
      try {
        console.log('Processing game response...');
        const responseMsg = game.handleUserResponse(userMsg);
        console.log('Game response generated:', responseMsg);
        
        SPGamesManager.updateGame(game, gameId);

        if (game.state === 'gameover') {
          SPGamesManager.destroyGame(gameId, req);
        }

        const response = await res.sendMessage(responseMsg);
        console.log('Game response sent');
        return response;
      } catch (error) {
        console.error('Error processing game response:', error);
        const errorResponse = await res.sendMessage('Sorry, there was an error processing your choice. Please try again.');
        console.log('Error message sent');
        return errorResponse;
      }
    }

    // Handle commands
    const command = commands.find(c => c.code === userMsg);
    if (command) {
      try {
        console.log('Processing command:', command.code);
        let responseMsg = command.message;
        if (typeof command.message === 'function') {
          responseMsg = await command.message(req);
        }
        const response = await res.sendMessage(responseMsg);
        console.log('Command response sent');
        return response;
      } catch (error) {
        console.error('Error processing command:', error);
        const errorResponse = await res.sendMessage('Sorry, there was an error processing your command. Please try again.');
        console.log('Error message sent');
        return errorResponse;
      }
    }

    console.log('No valid input found, sending invalid input message');
    const response = await res.sendMessage(invalidInputMsg);
    console.log('Invalid input message sent');
    return response;
  } catch (error) {
    console.error('Unexpected error in single player handler:', error);
    const errorResponse = await res.sendMessage('Sorry, there was an unexpected error. Please try again.');
    console.log('Unexpected error message sent');
    return errorResponse;
  }
};

