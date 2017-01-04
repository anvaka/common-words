/**
 * Reads language files, and print words that appear in all files.
 */

var files = ['pl', 'js', 'cs', 'go', 'rb', 'java', 'cpp']
//var files = ['css', 'java']

var union = readWords(files[0]);

for (var i = 1; i < files.length; ++i) {
  readWordsAndFilter(files[i]);
}

union.forEach(function(value, key){
  console.log(key + ':');
  //console.log(JSON.stringify(value, null, 2));
})

function readWordsAndFilter(fileName) {
  var words = new Set();

  getWords(fileName).forEach(w => {
    var context = union.get(w.word);
    if (context) {
      // we only add words if we already seen them (it's a union)
      words.add(w.word);
      // also mutate shared context, so that we can see contexts by languages:
      context[fileName] = w.context;
    }
  });

  var wordsToDelete = new Set();
  union.forEach(function(_, w) {
    // remove those words that are not present in this file
    if (!words.has(w)) wordsToDelete.add(w);
  });
  wordsToDelete.forEach(x => union.delete(x));

  return words;
}

function readWords(fileName) {
  var words = new Map();

  getWords(fileName).forEach(w => {
    var context = {};
    context[fileName] = w.context;
    words.set(w.word, context);
  });

  return words;
}

function getWords(fileName) {
  return require('../web/static/data/' + fileName + '/context.json');
}
