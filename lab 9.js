var fs = require('fs');

module.exports.loadJson = function (file, callback) {
  fs.readFile('file.json', { encoding: 'utf8' }, function (err, data) {
    if (err) return callback(err); // file reading error
    try {
      // parse and return json to callback
      var json = JSON.parse(data);
      callback(null, json);
    } catch (ex) {
      // catch JSON parsing errors so your app doesn't crash
      callback(ex);
    }
  });
};


module.exports.writeJson = function (file, json, callback) {
  fs.writeFile(file, JSON.stringify(json), callback);
};


var express = require('express');
var http = require('http');
var app = express();

// if you're using Express 4.x, bodyParser is no longer built-in
var bodyParser = require('body-parser');

// here we import the file which has our loadJson and writeJson functions
var jsonUtil = require('./json-util.js');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.post('/additem/:id', function (req, res, next) {
  // turn ID into a file name, and be careful not to expose security holes
  var filename = idToFileName(req.params.id);
  jsonUtil.loadJson(filename, function (err, json) {

    // TODO: make sure you handle errors
    // if err is not null, you can either consider it an error, or
    // you could simply say json = [] and start a new file

    // should also do validation checks like if(json instanceof Array) and
    // verify that req.body exists and is properly formatted, etc

    json.push(req.body); // push the object from the request body into the array

    // re-save the file
    jsonUtil.writeJson(filename, json, function (err) {
      if (err) next(err);
      else res.send(200);
    });
  });
});

server = http.createServer(app);
server.listen('14000');


// POST /additem/1
// Content-Type: application/json

// { "name": "Alexandra Williamson", "age": 39, "height": 258, "weight": 123 }