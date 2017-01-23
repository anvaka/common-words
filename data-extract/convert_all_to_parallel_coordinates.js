
var files = [
  'pl', 'js', 'cs', 'go', 'rb', 'java', 'cpp',
  'sql',
]
var names = {
  'pl': 'Perl',
  'js': 'JavaScript',
  'cs': 'C#',
  'go': 'Go',
  'rb': 'Ruby',
  'java': 'Java',
  'cpp': 'C++',
  'sql': 'SQL'
}

var readContextFile = require('./lib/readContextFile.js');

var wordsByLanguage = new Map();
var allWords = new Set();

for (var i = 0; i < files.length; ++i) {
  readFile(files[i]);
}

var records = [];
allWords.forEach(w => {
  records.push(getWordCounts(w));
});
console.log(JSON.stringify(records));

function readFile(fileName) {
  var words = new Map();
  readContextFile(fileName).forEach(w => {
    words.set(w.word, w.useCount);
    allWords.add(w.word);
  });

  wordsByLanguage.set(fileName, words);
}

function getWordCounts(word) {
  var record = {
    word: word
  };

  files.forEach(language => {
    var languageWords = wordsByLanguage.get(language);
    record[names[language]] = languageWords.get(word) || 0
  });

  return record;
}
