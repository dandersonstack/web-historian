var path = require('path');
var archive = require('../helpers/archive-helpers');
const fs = require('fs');
const url = require('url');
const httpHelpers = require('./http-helpers');
const queryString = require('querystring');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log(req);
  var urlPath = url.parse(req.url).pathname.substring(1);
  console.log('Serving request type ' + req.method + ' for url ' + urlPath);
  if (req.method === 'GET') {
    archive.isUrlArchived(urlPath, (success)=> {
      if (success) {
        console.log("About to retrieve the archived site:", urlPath);
        httpHelpers.serveAssets(res, urlPath, ()=>{
          console.log('Put some callback here');
        }); 
      } else {
        console.log('It should be sending you down the default path');
        httpHelpers.defaultPaths(req, res);
      }
    });
  } else if (req.method === 'POST') {
    //if the site exists, 
    //data
    var formData = '';
    req.on('data', function (chunk) {
      formData = (queryString.parse(chunk.toString())).url;
    });
    req.on('end', ()=> {
      archive.addUrlToList(formData, () => {
        archive.isUrlArchived(formData, (archived) => {
          if (archived) {
            httpHelpers.redirects(res, formData);
          } else {
            console.log('redirecting to loading page...');
            httpHelpers.redirects(res, '/loading.html');
          }
        });
      });
    });
  }
};

