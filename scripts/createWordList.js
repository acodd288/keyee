var fs = require('fs');

var filename = __dirname + '/aosp_en_wordlist.combined.txt';
var text = fs.readFileSync(filename,'utf8');
var lines = text.split('\n');
lines.shift();
var words = lines.map(function a(line) {
  return line.split(',').reduce(function b(acc,val) {
    var kv = val.split('=');
    if (kv.length === 2) {
      acc[kv[0]] = kv[1];
    }
    else {
      console.log(val)
    }
    return acc;
  },{});
});

fs.writeFileSync(__dirname +'/words.en.json', JSON.stringify(words));
