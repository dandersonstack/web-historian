var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

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
      callback(dataArr);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((dataArr) => {
    callback(_.contains(dataArr, url));
  });
  //callback(exports.readListOfUrls());
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, (exists) => {
    if (!exists) {
      fs.appendFile(exports.paths.list, url, function (err) {
        if (err) { 
          throw err; 
        }
        callback();
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  let urlPath = exports.paths.archivedSites + '/' + url;
  fs.stat(urlPath, (err, fileInfo) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url)=> {
    const req = http.get('http://' + urls[0], (res) => {
      res.setEncoding('utf8');
      data = [];
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        //write data to a new file
        var directoryPath = exports.paths.archivedSites + '/' + url;
        fs.mkdir(directoryPath, (err)=> {
          if (err) {
            console.log('Issue writing the new directory: ', directoryPath);
          } else {
            fs.writeFile(directoryPath + '/index.html', data, (err)=>{
              if (err) {
                console.log(directoryPath, ': Issue writing the index.html file');
              } else {
                console.log(directoryPath + '/index.html');
                console.log('Recursively go through the file and grab all the assets');
              }
            });
          }
                    
        });

        //save that file in achieved sites
      });
    });
  });

};















