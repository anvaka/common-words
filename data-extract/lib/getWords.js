// This file takes saved JSON stream from bigquery and converts it into JSON object
// [{
//     word: 'this',
//     context: [['line of text', <NUMBER_OF_TIMES_SEEN_THIS_LINE>], ...]
//   }, ...
// ]
var fs = require('fs');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var recordsByWord = new Map();

module.exports = getWords;

function getWords(fileName) {
  return new Promise((resolve) => {
    forEachRecord(fileName, function(r) {
      var record = recordsByWord.get(r.rs_word);
      if (!record) {
        record = {
          word: r.rs_word,
          context: [],
          useCount: Number.parseInt(r.popular_num_words, 10)
        };
        recordsByWord.set(r.rs_word, record);
      }
      var lineCount = Number.parseInt(r.rs_num_lines, 10);

      record.context.push([
        r.rs_lines,
        lineCount
      ]);

    }, start);

    function start() {
      var words = Array.from(recordsByWord).map(x => x[1]);
      resolve(words);
    }
  });
}

function forEachRecord(fileName, cb, done) {
  if (!fs.existsSync(fileName)) {
    console.error('No data file: ' + fileName);
    process.exit(-1);
  }

  var jsonStreamParser = JSONStream.parse();
  fs.createReadStream(fileName)
    .pipe(jsonStreamParser)
    .pipe(es.mapSync(cb))
    .on('end', done);
}
