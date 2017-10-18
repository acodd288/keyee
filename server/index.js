const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs')
const atob = require('atob')
const _ = require('underscore')

app.use(bodyParser.json());

app.get('/api/readfile/:filepath', function (req, res) {
  var path = atob(req.params.filepath)
  fs.readFile(path,(err, data) => {
    if (err) {
      res.send(err);
    }
    else {
      res.set('Content-Type', 'text/html');
      res.send(data);
    }
  });
})

app.post('/api/writefile/:filepath', function (req, res) {
  var path = atob(req.params.filepath)
  var data = req.body.data;
  console.log(req.body);
  fs.writeFile(path,data,(err) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.send('File written');
    }
  });
})

app.post('/api/trackswipe', function (req, res) {
  var path = '/home/acodd/swipeTracks.txt'
  var data = req.body.data;
  console.log(req.body);
  JSON.parse(JSON.stringify(data));
  fs.appendFile(path,JSON.stringify(data)+'\n',(err) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.send('File written');
    }
  });
})


function readDirectoryRecursive(path) {
  try {
    let children = fs.readdirSync(path);
    return {
      path,
      children: children.map((e) => readDirectoryRecursive(path + '/' + e))
    }
  }
  catch (e) {
    return {path, children:null};
  }
}

app.get('/api/readdirectory/:filepath', function (req, res) {
  var path = atob(req.params.filepath)
  let files = readDirectoryRecursive(path);
  let words = getWordsForProject(path);
  res.set('Content-Type', 'application/json');
  res.send({files, words});
})

function getWordsForFile(path) {
  var data = fs.readFileSync(path, 'utf8');
  var words = data.match(/[A-Za-z]([A-Za-z0-9])*/g);
  console.log(path + ' ' + words.length);
  return words;
}

function getFiles(path) {
  try {
    let children = fs.readdirSync(path);
    return children.map((e) => getFiles(path + '/' + e))
  }
  catch (e) {
    return [path];
  }
}

function getWordsForProject(path) {
  let files = getFiles(path + '/src');
  files = _.flatten(files);
  let contents = _.flatten(files.map(getWordsForFile));
  console.log("done with files " + contents.length);
  contents.sort();
  let words = _.uniq(contents, true);
  console.log(words);
  return words;
}

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})
