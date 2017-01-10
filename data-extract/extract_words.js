#!/usr/bin/env node
var fs = require('fs');
var ignore = require('./ignore/index.js');
var spawn = require('child_process').spawn;
var getWords = require('./lib/getWords.js');

var extension = '"' + (process.argv[2] || 'go') + '"';
var fileName = encode(extension);
var bucketName = 'gs://gh_watch/' + fileName + '.json';
var tableName = 'yasivcom:github_watch.result_' + fileName;

var query = text('./sql/extract_words.sql')
  .replace(/\$\{IGNORE_SYMBOLS\}/g, ignore.symbols)
.replace(/\$\{IGNORE_WORDS\}/g, ignore.words)
.replace(/\$\{EXTENSION\}/g, extension);

extractCommonWords()
  .then(exportData)
  .then(downloadData)
  .then(convertToWords)
  .then(cleanUp)
  .catch((err) => {
  console.log('error', err.toString());
  throw err;
})

function extractCommonWords() {
  console.log('collecting common words for extension in (' + extension + ')');
  return promiseSpawn('bq', ['--project_id', 'yasivcom', '--format', 'json', 'query', '--destination_table', tableName, '--replace', '--nobatch', query], 'collect words');
}

function exportData() {
  console.log('Exporting words into bucket ' + bucketName);
  return promiseSpawn('bq', ['--project_id', 'yasivcom', 'extract', '--destination_format=NEWLINE_DELIMITED_JSON', tableName, bucketName], 'storage');
}

function downloadData() {
  console.log('Downloading data from ' + bucketName);
  return promiseSpawn('gsutil', ['cp', bucketName, './']);
}

function cleanUp(argument) {
  console.log('Cleaning up resources...');
  fs.unlinkSync(fileName + '.json');
  console.log('  removing temporary gs file...');
  return promiseSpawn('gsutil', ['rm', bucketName], 'remove gs ' + bucketName).then(() => {
    console.log('  removing temporary bq table...');
    return promiseSpawn('bq', ['--project_id', 'yasivcom', 'rm', '-f', tableName], 'remove ' + tableName);
  }).then(()=> {
    console.log('All is clean now');
  });
}

function convertToWords() {
  return getWords(fileName + '.json').then((words) => {
    fs.writeFileSync(fileName + '_words.json', JSON.stringify(words), 'utf8');
  })
}

function promiseSpawn(command, args, prefix) {
  if (!prefix) prefix = ''

  return new Promise((resolve, reject) => {
    const cmd = spawn(command, args);

    cmd.stdout.on('data', (data) => {
      console.log(`${prefix} stdout: ${data}`);
    });

    cmd.stderr.on('data', (data) => {
      console.log(`${prefix} stderr: ${data}`);
    });

    cmd.on('close', (code) => {
      console.log(`${prefix} completed`);
      if (code !== 0) {
        console.log('rejecting because code is not 0');
        reject('bq return code is not 0')
      } else {
        console.log('resolve positive');
        resolve(true);
        console.log('done');
      }
    });
  });
}

function text(fileName) {
  return fs.readFileSync(fileName, 'utf8')
}

function encode(str) {
  return str.replace(/['", ]/g, '_');
}
