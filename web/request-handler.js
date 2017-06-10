var path = require('path');
var archive = require('../helpers/archive-helpers');
const fs = require('fs');
const url = require('url');
const httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log(req);
  var urlPath = url.parse(req.url).pathname;
  console.log('Serving request type ' + req.method + ' for url ' + urlPath);


  if (req.method === 'GET') {
    httpHelpers.defaultPaths(req, res);
  } else if (req.method === 'POST') {
    //helper.onPOSTRequest(request, response);
  } else {
    //helper.onOTHERRequest(request, response);
  }


  // if (urlPath = '/') {
  //   httpHelpers.serveAssets(res);
  // }
  
  //res.end(archive.paths.list);
};
