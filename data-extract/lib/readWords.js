var readContextFile = require('./readContextFile.js');

module.exports = function readWords(fileName) {
  var words = new Map();

  readContextFile(fileName).forEach(w => {
    var context = {};
    context[fileName] = w.context;
    words.set(w.word, context);
  });

  return words;
}
