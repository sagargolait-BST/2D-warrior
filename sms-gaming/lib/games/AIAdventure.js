const superb = require('superb');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API with proper error handling
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
  // Fallback to a simpler game mode if API fails
  genAI = null;
}

// Simple response cache
const responseCache = new Map();

class AIAdventure {
  static name = 'AI Adventure';
  
  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.currentPrompt = "You find yourself at the entrance of a mysterious cave. Strange glowing symbols adorn the walls, and a cool breeze flows from within.";
    this.choices = ["Enter the cave", "Examine the symbols", "Look for another way"];
    this.history = [];
    this.lastAIResponse = null;
    
    // Add initial prompt to history
    this.history.push({
      type: 'system',
      content: this.currentPrompt
    });
  }

  // No async init needed anymore
  async init() {
    console.log("AI Adventure initialized with default scenario");
    return Promise.resolve();
  }

  // Cache key generator
  generateCacheKey(userChoice) {
    return `${userChoice.toLowerCase().trim()}`;
  }

  // Get cached response if available
  getCachedResponse(userChoice) {
    const cacheKey = this.generateCacheKey(userChoice);
    return responseCache.get(cacheKey);
  }

  // Cache a response
  cacheResponse(userChoice, response) {
    const cacheKey = this.generateCacheKey(userChoice);
    responseCache.set(cacheKey, response);
  }

  async generateResponse(userChoice) {
    // If Gemini API is not available, use predefined responses
    if (!genAI) {
      return {
        prompt: "The cave entrance beckons, filled with mystery and adventure.",
        fullText: "The cave entrance beckons, filled with mystery and adventure.",
        choices: ["Enter the cave", "Examine the symbols", "Look for another way"],
        isEnding: false
      };
    }

    // Check cache first
    const cachedResponse = this.getCachedResponse(userChoice);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          maxOutputTokens: 80,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      });
      
      const prompt = `Adventure game. Last choice: ${userChoice}. 
      Generate a short next scene (1 sentence) followed by 3 choices labeled A), B), C).`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      const choicesRegex = /A\)(.*?)(?:\n|$).*?B\)(.*?)(?:\n|$).*?C\)(.*?)(?:\n|$)/s;
      const choicesMatch = text.match(choicesRegex);
      
      let extractedChoices = ["Continue", "Explore", "Rest"];
      
      if (choicesMatch && choicesMatch.length >= 4) {
        extractedChoices = [
          choicesMatch[1].trim(),
          choicesMatch[2].trim(),
          choicesMatch[3].trim()
        ];
      }
      
      const response = {
        prompt: text.substring(0, text.indexOf('A)') > 0 ? text.indexOf('A)') : text.length).trim(),
        fullText: text,
        choices: extractedChoices,
        isEnding: Math.random() < 0.1
      };

      this.cacheResponse(userChoice, response);
      return response;
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        prompt: "Your choice leads to an unexpected twist! The path suddenly opens to a clearing with a mysterious chest.",
        fullText: "Your choice leads to an unexpected twist! The path suddenly opens to a clearing with a mysterious chest.",
        choices: ["Open the chest", "Ignore it and continue", "Examine it carefully first"],
        isEnding: false
      };
    }
  }

  get welcomeMessage() {
    const message = 
      '🌟 Welcome to AI Adventure! 🌟\n\n' +
      'Embark on a unique adventure where every choice matters and the story is created by AI just for you!\n\n' +
      `🤖 ${this.currentPrompt}\n\n` +
      'Your choices:\n' +
      this.choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n') + '\n\n' +
      'Reply with the number of your choice (1, 2, or 3)';

    return message;
  }

  handleUserResponse(userMessage) {
    // Check if user input is valid (1, 2, or 3)
    const choiceIndex = parseInt(userMessage) - 1;
    
    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= this.choices.length) {
      return `Please choose a valid option (1-${this.choices.length}).\n\n` +
        this.choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n');
    }
    
    const userChoice = this.choices[choiceIndex];
    
    // Add to history
    this.history.push({
      type: 'user',
      content: userChoice
    });
    
    // Show the last AI response if available
    let responseText = '';
    if (this.lastAIResponse && this.lastAIResponse.fullText) {
      const fullText = this.lastAIResponse.fullText;
      const choicesPart = fullText.indexOf('A)') > 0 ? fullText.substring(0, fullText.indexOf('A)')).trim() : fullText;
      responseText = `🤖 AI Response:\n${choicesPart}\n\n`;
    }
    
    // Generate a simple immediate response
    this.currentPrompt = `You chose: ${userChoice}\n\n${responseText}The adventure continues...`;
    
    // Add to history
    this.history.push({
      type: 'system',
      content: this.currentPrompt
    });
    
    // Set temporary choices
    this.choices = ["Wait for the story to continue...", "Consider your next move", "Prepare for what comes next"];
    
    // Trigger async update in the background
    this.updateAdventureAsync(userChoice);
    
    // Return the immediate response
    return `${this.currentPrompt}\n\nYour choices:\n` +
      this.choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n');
  }
  
  async updateAdventureAsync(userChoice) {
    try {
      // Add a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('AI response timeout')), 5000);
      });
      
      // Race between the AI response and the timeout
      const response = await Promise.race([
        this.generateResponse(userChoice),
        timeoutPromise
      ]);
      
      // Update current state
      this.currentPrompt = response.prompt;
      
      // Update history
      this.history.push({
        type: 'system',
        content: this.currentPrompt
      });
      
      // Store the full AI response
      this.lastAIResponse = response;
      
      // Check if this is an ending
      if (response.isEnding) {
        this.state = 'gameover';
      } else {
        // Update choices for next round
        this.choices = response.choices || ["Continue the adventure", "Take a different path", "Rest and think"];
      }
      
      console.log("Adventure updated asynchronously:", this.currentPrompt);
    } catch (error) {
      console.error("Error in updateAdventureAsync:", error);
      
      // Create a fallback response
      const fallbackResponse = {
        prompt: "The adventure continues as you make your choice...",
        fullText: "The adventure continues as you make your choice...",
        choices: ["Explore further", "Be cautious", "Try something new"]
      };
      
      // Update with fallback
      this.currentPrompt = fallbackResponse.prompt;
      this.lastAIResponse = fallbackResponse;
      this.choices = fallbackResponse.choices;
      
      // Update history
      this.history.push({
        type: 'system',
        content: this.currentPrompt
      });
    }
  }
}

module.exports = AIAdventure;
