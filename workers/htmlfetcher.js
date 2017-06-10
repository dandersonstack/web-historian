// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
let fs = require('fs');
fs.appendFile('worker-logs.txt', "Cron Job added", function (err) {
  if (err) {
    console.log('we wrote to the wrong file');
  }
});