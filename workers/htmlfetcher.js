#!/Users/student/.nvm/versions/node/v6.9.5/bin/node
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
let fs = require('fs');
var _ = require('underscore');
let archive = require('../helpers/archive-helpers');


archive.readListOfUrls((urlArray)=> {
  console.log(urlArray);
  var counter = 0;
  var urlsToBeArchived = [];
  _.each(urlArray, (url, index, urlArray)=> {
    archive.isUrlArchived(url, (archived) => {
      if (!archived) {
        urlsToBeArchived.push(url);
      }
      counter++;
      if (counter === urlArray.length) {
        console.log(urlsToBeArchived);
        archive.downloadUrls(urlsToBeArchived);
      }
    });
  });
});


fs.appendFile('./workers/worker-logs.txt', "Cron Job added", function (err) {
  if (err) {
    console.log('we wrote to the wrong file');
  }
});
