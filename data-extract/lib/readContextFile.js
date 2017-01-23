module.exports = function readContextFile(fileName) {
  return require(__dirname + '/../../web/static/data/' + fileName + '/context.json');
}
