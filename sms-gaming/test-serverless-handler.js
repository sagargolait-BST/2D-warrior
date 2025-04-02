console.log('Testing serverless handler...');

try {
  const handler = require('./api/serverless');
  console.log('Serverless handler loaded successfully!');
  
  // Test if the handler is a function
  console.log('Handler is a function:', typeof handler === 'function');
  
  console.log('Serverless handler works correctly!');
} catch (error) {
  console.error('Error testing serverless handler:', error);
}

console.log('Test completed!'); 