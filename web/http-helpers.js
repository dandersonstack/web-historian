var path = require('path');
var fs = require('fs');
const url = require('url');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.defaultPaths = function(req, res) {
  let urlPath = url.parse(req.url).pathname;
  if (urlPath === '/') {
    urlPath += 'index.html';
  }
  urlPath = archive.paths.siteAssets + urlPath;  
  fs.exists(urlPath, function(doesExist) {
    if (!doesExist) {
      res.statusCode = 404;
      res.end(`Resource not found "${urlPath}"`);
    } else {
      fs.readFile(urlPath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Server error: "${err}"`);
        } else {
          res.end(data);
        }
      });
    }
  });
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  // defaultPaths(res);
  asset = archive.paths.archivedSites + '/' + asset;
  console.log("the url path is:", asset);  
  fs.exists(asset, function(doesExist) {
    if (!doesExist) {
      res.statusCode = 404;
      res.end(`Resource not found "${asset}"`);
    } else {
      fs.readFile(asset, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Server error: "${err}"`);
        } else {
          res.end(data);
        }
      });
    }
  });

};

exports.redirects = function(res, url) {
  res.writeHead(302, {
    'Location': url,
  });
  res.end();
};



// As you progress, keep thinking about what helper functions you can put here!
