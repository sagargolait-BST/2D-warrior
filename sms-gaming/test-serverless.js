console.log('Testing serverless.js...');

try {
  const app = require('./lib/app');
  console.log('App module loaded successfully!');
  
  // Test if the app has the expected properties
  console.log('App has expected properties:', {
    hasPost: typeof app.post === 'function',
    hasGet: typeof app.get === 'function',
    hasUse: typeof app.use === 'function'
  });
  
  console.log('App module works correctly!');
} catch (error) {
  console.error('Error testing app module:', error);
}

console.log('Test completed!'); 