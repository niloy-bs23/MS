const fs = require('fs');

setInterval(() => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] - This is a sample log message.`;
  fs.appendFileSync('./app.log', `${message}\n`);
}, 1000); // Simulate log generation every second
