var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var http = require('http');
var https = require('https');
var urlModule = require('url');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, (err, data) => {
    if (err) {
      console.log('This is an error');
    } else {
      let dataArr = data.toString().split('\n');
      
      callback(_.reject(dataArr, (url) => {
        return (url === '' || url === '/');
      }));
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((dataArr) => {
    callback(_.contains(dataArr, url));
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, (exists) => {
    if (!exists) {
      fs.appendFile(exports.paths.list, url + '\n', function (err) {
        callback();
      });
    } else {
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  let urlPath = exports.paths.archivedSites + '/' + url;
  if (url === '' || url === '/') {
    callback(false);
  } else {
    fs.stat(urlPath, (err, fileInfo) => {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }
};

var requestHelper = function(url) {
  request(url, function (error, response, body) {
    if (error) {
      console.log('error:', error); // Print the error if one occurred 
    } else { 
      var directoryPath = exports.paths.archivedSites + '/' + urlModule.parse(url).host;        
      fs.writeFile(directoryPath, body, (err)=>{
        if (err) {
          console.log(directoryPath, ': Issue writing the file');
        }
      });
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url)=> {
    requestHelper('https://' + url);
  });
};

// var responseHelper = function(res) {
//   res.setEncoding('utf8');
//   data = [];
//   if (res.statusCode >= 300 && res.statusCode < 400 /*&& res.headers.location.substring(0,)*/) {
//     console.log(res.statusCode);
//     console.log(res.headers.location);
//     requestHelper(res.headers.location);
//   } else {
//     res.on('data', (chunk) => {
//       data += chunk;
//     });
//     res.on('end', () => {
//       console.log(res.headers.location);
//       var directoryPath = exports.paths.archivedSites + '/' + url;        
//       fs.writeFile(directoryPath, data, (err)=>{
//         if (err) {
//           console.log(directoryPath, ': Issue writing the file');
//         }
//       });
//     });
//   }
// };

// var requestHelper = function(url) {
//   //logic to check if http or https in url
//   const req = https.get(url, (res) => {
//     responseHelper(res);
//   });
// };

















