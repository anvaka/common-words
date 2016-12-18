// This file takes saved JSON stream from bigquery and converts it into JSON object
// [{
//     word: 'this',
//     context: [['line of text', <NUMBER_OF_TIMES_SEEN_THIS_LINE>], ...]
//   }, ...
// ]
var fs = require('fs');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var fileName = process.argv[2];
var recordsByWord = new Map();
forEachRecord(fileName, function(r) {
  var record = recordsByWord.get(r.rs_word);
  if (!record) {
    record = {
      word: r.rs_word,
      context: []
    };
    recordsByWord.set(r.rs_word, record);
  }
  var count = Number.parseInt(r.rs_num_lines, 10);

  record.context.push([
    r.rs_lines,
    count
  ]);

}, start);

function start() {
  console.log(JSON.stringify(Array.from(recordsByWord).map(x => x[1])));
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
